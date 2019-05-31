import 'core-js/es6/promise';

const contextRequest = (require as any).context('./src/', true, /\.spec\.ts/);
contextRequest.keys().map(contextRequest);
