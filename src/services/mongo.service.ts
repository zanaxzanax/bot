import {MODELS} from "../mongo/models";
import {Model} from 'mongoose';

export class MongoService implements IMongoService {

    lastIds: object = {};

    constructor(private  app: IApp) {

    }

    updateDoc(modelName: string, conditions: any, options: any): Promise<any[]> {
        return (MODELS[modelName] as Model<any>).findOneAndUpdate(conditions, options,
            {upsert: true, new: true, setDefaultsOnInsert: true}).exec();
    }

    updateDocs(modelName: string, conditions: any, options: any): Promise<any[]> {
        return (MODELS[modelName] as Model<any>).update(conditions, options).exec();
    }

    getDocs(modelName: string, options: any, limit?: number): Promise<any[]> {
        return (MODELS[modelName] as Model<any>).find(options).limit(limit).sort('created').exec();
    }

    getDoc(modelName: string, options: any, projection?: any): Promise<any[]> {
        return (MODELS[modelName] as Model<any>).findOne(options, projection).exec();
    }

    getNextId(modelName: string): Promise<number> {

        if (this.lastIds[modelName]) {
            return Promise.resolve(++this.lastIds[modelName]);
        }

        return MODELS[modelName].findOne().sort('-created').exec().then((lastDoc: any) => {
            let lastDocId: number = lastDoc ? (lastDoc.id || 0) : 0;
            this.lastIds[modelName] = ++lastDocId;
            return this.lastIds[modelName];
        });
    }

}
