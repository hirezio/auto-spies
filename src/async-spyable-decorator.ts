export function AsyncSpyable() {
  // tslint:disable-next-line:no-console
  console.warn(`The "AsyncSpyable" is depcracated,
  You don\'t need to use it anymore.

  IT WILL GET REMOVED IN THE NEXT MAJOR VERSION
  So please remove it from your code.`);
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {};
}
