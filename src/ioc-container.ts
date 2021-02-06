import { Container, injectable, interfaces } from 'inversify';

export const defaultContainer = new Container();

export function Provide() {
  return (target) => {
    defaultContainer.bind(target).toSelf();
    return injectable()(target);
  };
}

export function ProvideInterface<T>(
  interfaceType: interfaces.ServiceIdentifier<T>
) {
  return (target) => {
    defaultContainer
      .bind(interfaceType)
      .toDynamicValue((c) => c.container.get(target));
    return target;
  };
}

export function Singleton() {
  return (target) => {
    defaultContainer.bind(target).toSelf().inSingletonScope();
    return injectable()(target);
  };
}
