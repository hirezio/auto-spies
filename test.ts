import 'core-js/es6/promise';
import 'core-js/es7/reflect';

let contextRequest = (require as any).context('./src/', true, /\.spec\.ts/);
contextRequest.keys().map(contextRequest);