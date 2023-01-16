import {YasqeService} from './yasqe/yasqe-service';
import {EventService} from './event-service';

/**
 * The purpose of this @{see ServiceFactory} is to manage all other services used into the "ontotext-yasgui-web-component" components.
 * It takes care for:
 * <ul>
 *   <li>building of service</li>
 *   <li>every service to have only one instance (Singleton)</li>
 *
 * This factory have to be used everywhere a service is needed. Construction of an instance with "new" operator will brooke the Singleton of the service
 * and can produce unexpected behaviour of "ontotext-yasgui-web-component" components.
 */
export class ServiceFactory {

  private static _hostElement: HTMLElement;

  static init(hostElement: HTMLElement) {
    this._hostElement = hostElement;
  }
  private static readonly _instances: Map<string, any> = new Map<string, any>();

  static get<T>(type: { new(): T; }): T {
    if (!this._instances.has(type.name)) {
      const instance = new type();
      ServiceFactory.postConstruct(instance);
      this._instances.set(type.name, instance);
    }
    return this._instances.get(type.name);
  }

  private static postConstruct<T>(instance: T) {
    switch (instance.constructor.name) {
      case "YasqeService":
        (instance as YasqeService).init();
        break;
      case "EventService":
        (instance as EventService).hostElement = this._hostElement;
        break;
    }
  }
}
