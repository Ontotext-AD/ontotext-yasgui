import {EventService} from './event-service';

/** Any service class: the key of {@link ServiceFactory}'s instances. */
type ServiceClass = new (...args: never[]) => unknown;

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

  /**
   * Service instances keyed by their class. The class itself is the key, not its `name`: minifiers (e.g. the Angular
   * build optimizer) can give different classes the same name, and a name-keyed map would then return the wrong service.
   */
  private instances: Map<ServiceClass, unknown> = new Map<ServiceClass, unknown>();

  get<T>(type: { new(serviceFactory: ServiceFactory): T; }): T {
    if (!this.instances.has(type)) {
      this.instances.set(type, new type(this));
    }
    return this.instances.get(type) as T;
  }

  getEventService(): EventService {
    if (!this.instances.has(EventService)) {
      const instance = new EventService();
      instance.hostElement = this.hostElement;
      this.instances.set(EventService, instance);
    }
    return this.instances.get(EventService) as EventService;
  }
}
