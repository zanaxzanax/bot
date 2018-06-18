import {ContextError} from '../errors';

export class ErrorService {

    constructor(private app: IApp) {

    }

    process(err: Error, extra?: any): any {
        const context: Context = this as any;
        switch (err.name) {
            case 'ContextError':
                return context.reply(err.message, extra);
            default:
                return context.reply('Error');
        }
    }
}
