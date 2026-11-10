import {ServiceFactory} from './service-factory';

describe('ServiceFactory', () => {
  it('should keep one instance per class even when classes share the same name', () => {
    // Given two different service classes whose names are the same, as after minification
    class FirstService {
    }

    class SecondService {
    }

    Object.defineProperty(FirstService, 'name', {value: 'e'});
    Object.defineProperty(SecondService, 'name', {value: 'e'});
    const serviceFactory = new ServiceFactory(document.createElement('div'));

    // When both are requested from the factory
    const first = serviceFactory.get(FirstService);
    const second = serviceFactory.get(SecondService);

    // Then each request returns an instance of its own class
    expect(first).toBeInstanceOf(FirstService);
    expect(second).toBeInstanceOf(SecondService);
    // And a second request for the same class returns the same instance
    expect(serviceFactory.get(FirstService)).toBe(first);
    expect(serviceFactory.get(SecondService)).toBe(second);
  });
});
