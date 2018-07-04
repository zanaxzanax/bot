import * as mongoose from 'mongoose';
import {SCHEMES} from '../schemes';

const Schema = mongoose.Schema;

const element = mongoose.model('element', new Schema(SCHEMES.ElementScheme as any));

export default element;
