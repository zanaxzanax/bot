import * as crypto from 'crypto';
import * as randomNumber from 'random-number-csprng';
import {App} from '../app';

const HASH_LENGTH: number = 30;
const CRYPT_ALGORITHM: string = 'aes-256-ctr';
const password: string = process.env.CRYPT_PASSWORD || '12345678901234567890123456789012'; // 32
//

export class RandomService implements IRandomService {

    constructor(private app: App) {

    }

    encrypt(text: string): string {
        let buffer: Buffer = new Buffer(text, 'utf8');
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(CRYPT_ALGORITHM, password, iv);
        buffer = Buffer.concat([cipher.update(buffer), cipher.final()]);
        return iv.toString('hex') + ':' + buffer.toString('hex');
    }

    decrypt(text: string): string {
        const textParts: string[] = text.split(':');
        const iv: Buffer = new Buffer(textParts.shift(), 'hex');
        const encryptedText = new Buffer(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv(CRYPT_ALGORITHM, password, iv);
        return Buffer.concat([decipher.update(encryptedText), decipher.final()]).toString('utf-8');
    }

    getLinkHash(chance: number): Promise<string> {
        return Promise.resolve()
            .then(() => Promise.all([randomNumber(0, ((100 / chance) - 1 || 1)), randomNumber(0, HASH_LENGTH)]))
            .then((result: number[]) => new Promise((resolve: any, reject: any) => {
                crypto.randomBytes(HASH_LENGTH, (err, buf) => {
                    if (err) {
                        reject(err);
                    } else {
                        let hex: string = buf.toString('hex');
                        hex = hex.slice(0, result[1]) + `[${result[0]}]` + hex.slice(result[1]);
                        resolve(hex);
                    }
                });
            }) as Promise<string>);
    }

    getMD5(str: string): string {
        return crypto.createHash('md5').update(str).digest('hex');
    }

}
