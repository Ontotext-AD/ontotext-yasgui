import {EventService} from './event-service';

/**
 * The purpose of this @{see ServiceFactory} is to manage all other services used into the "ontotext-yasgui-web-component" components.
 * It takes care for:
 * <ul>
 *   <li>building of service</li>
 *   <li>every service to have only one instance (Singleton)</li>
 */
export class ServiceFactory {

  private readonly hostElement: HTMLElement;

  constructor(hostElement: HTMLElement) {
    this.hostElement = hostElement;
  }

  private instances: Map<string, any> = new Map<string, any>();

  get<T>(type: { new(serviceFactory: ServiceFactory): T; }): T {
    if (!this.instances.has(type.name)) {
      this.instances.set(type.name, new type(this));
    }
    return this.instances.get(type.name);
  }

  getEventService(): EventService {
    if (!this.instances.has(EventService.name)) {
      const instance = new EventService();
      instance.hostElement = this.hostElement;
      this.instances.set(EventService.name, instance);
    }
    return this.instances.get(EventService.name);
  }
}
