import { autoUnsubscribe } from '@hirez_io/observer-spy';

autoUnsubscribe();

const contextRequest = (require as any).context('./src/', true, /\.spec\.ts/);
contextRequest.keys().map(contextRequest);
