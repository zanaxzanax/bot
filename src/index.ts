import {App} from './app';

const app: IApp = new App();
app.start().then(() => {
    //
});
(global as any).app = app;
