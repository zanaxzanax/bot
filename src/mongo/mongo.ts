import * as mongoose from 'mongoose';
import {Connection, ConnectionOptions} from 'mongoose';

export class Mongo implements IMongo {

    private _connection: Connection = mongoose.connection;
    private _options: ConnectionOptions = {
        keepAlive: 120,
        promiseLibrary: global.Promise
    };

    constructor(private app: IApp) {
        //
    }

    getConnection(): Connection {
        return this._connection;
    }

    start(): Promise<any> {
        this._subscribe(true);
        return this._connect();
    }

    stop(): Promise<any> {
        return this.getConnection().close().then(() => this._subscribe(false));
    }

    private _connect(): Promise<boolean> {

        /**
         * Connection ready state
         * 0 = disconnected
         * 1 = connected
         * 2 = connecting
         * 3 = disconnecting
         * Each state change emits its associated event name.
         */

        switch (this.getConnection().readyState) {
            case 0: // disconnected
                return mongoose.connect(this.app.getConfig().MONGO_URL, this._options).then(() => true);
            default:
                return Promise.resolve(false);
        }
    }

    private _subscribe(bool: boolean): void {
        if (bool) {
            this._subscribe(false);
            this._connection.on('error', () => this.app.emit('error'));
            this._connection.on('connected', () => this.app.emit('connected'));
            this._connection.on('open', () => this.app.emit('open'));
            this._connection.on('close', () => this.app.emit('close'));
            this._connection.on('reconnected', () => this.app.emit('reconnected'));
            this._connection.on('disconnected', () => this.app.emit('disconnected'));
        } else {
            this._connection.removeAllListeners('error');
            this._connection.removeAllListeners('connected');
            this._connection.removeAllListeners('open');
            this._connection.removeAllListeners('close');
            this._connection.removeAllListeners('reconnected');
            this._connection.removeAllListeners('disconnected');
        }
    }
}
