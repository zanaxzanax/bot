import * as mongoose from 'mongoose';
import {SCHEMES} from '../schemes';

const Schema = mongoose.Schema;

const user = mongoose.model('user', new Schema(SCHEMES.UserScheme as any));

export default user;
