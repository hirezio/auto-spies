const contextRequest = (require as any).context('./src/', true, /\.spec\.ts/);
contextRequest.keys().map(contextRequest);
