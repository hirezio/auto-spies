import { stringify } from 'javascript-stringify';

export class ArgsMap {
  private map: { [key: string]: any } = {};

  set(key: unknown, value: unknown): void {
    const keyAsString = stringify(key);
    if (keyAsString) {
      this.map[keyAsString] = value;
    }
  }

  get(key: unknown): any {
    const keyAsString = stringify(key);
    if (!keyAsString) {
      return;
    }
    return this.map[keyAsString];
  }
}
