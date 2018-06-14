import * as intel from 'intel';
import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment';

export const log = intel.getLogger('all');

const fileName: string = moment.utc().format('YYYY-MM-DDTHHmmss[Z]');

const dir: string = path.resolve(process.cwd(), `./logs`);

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

const fileHandler = new intel.handlers.File(path.resolve(process.cwd(), dir, `./${fileName}.log`));


log.addHandler();
