
export class UtilsService {

    constructor(private app: IApp) {

    }

    chunkArray(myArray, chunk_size): any[] {
        const results = [];
        while (myArray.length) {
            results.push(myArray.splice(0, chunk_size));
        }
        return results;
    }

}
