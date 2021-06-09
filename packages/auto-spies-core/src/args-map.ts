// eslint-disable-next-line @typescript-eslint/no-var-requires
const stringify = require('serialize-javascript');

export class ArgsMap {
  private map: { [key: string]: any } = {};

  set(key: unknown, value: unknown): void {
    const keyAsString = stringify(key);
    this.map[keyAsString] = value;
  }

  get(key: unknown): any {
    const keyAsString = stringify(key);
    return this.map[keyAsString];
  }
}
