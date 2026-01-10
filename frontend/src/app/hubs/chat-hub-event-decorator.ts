import 'reflect-metadata'

export function EventName(eventName: string) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata('eventName', eventName, target, propertyKey);
  };
}

export function findAnnotatedMethods(service: any): { event: string; handler: Function }[] {
  const proto = Object.getPrototypeOf(service);
  return Object.getOwnPropertyNames(proto)
    .filter(name => typeof service[name] === 'function')
    .map(name => {
      const event = Reflect.getMetadata('eventName', proto, name);
      return event ? { event, handler: service[name].bind(service) } : null;
    }).filter(Boolean) as { event: string; handler: Function }[];
}

