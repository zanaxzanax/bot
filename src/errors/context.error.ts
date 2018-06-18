export class ContextError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ContextError';
        Error.captureStackTrace(this, this.constructor);
    }
}
