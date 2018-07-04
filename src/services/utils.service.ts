
export class UtilsService implements IUtilsService {

    constructor(private app: IApp) {

    }

    chunkArray(myArray, chunk_size): any[] {
        const results = [];
        while (myArray.length) {
            results.push(myArray.splice(0, chunk_size));
        }
        return results;
    }

   sanitize(text: string): string  {
        const split: string[] = text.split(/\s/);
        return split.find((str: string) => !!str) || '';
    }

   validate(pretend: string): string {
        const minLength: number = 3;
        const maxLength: number = 12;
        if (pretend.length < 3) {
            return `Минимум - ${minLength} символа`;
        } else if (pretend.length > maxLength) {
            return `Максимум - ${maxLength} символов`;
        }
        return '';
    }

}
