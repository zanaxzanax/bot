import * as intel from 'intel';
import {Formatter} from 'intel';
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
fileHandler.setFormatter(new Formatter(`[%(date)s] %(name)s.%(levelname)s: %(message)s`));

log.addHandler(fileHandler);

