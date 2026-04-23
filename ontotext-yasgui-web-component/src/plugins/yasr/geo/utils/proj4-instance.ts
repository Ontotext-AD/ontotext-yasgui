import proj4 from 'proj4';
import {SridProjDefinitions} from './srid-proj-definitions';

/**
 * Manages a shared, pre-configured proj4 instance with all known SRID/EPSG definitions registered.
 *
 * The instance is created once (lazy singleton) and reused across the application to avoid
 * re-registering definitions and to prevent circular module dependencies between
 * {@link GeoSPARQLService} and {@link Parsers}.
 */
export class Proj4Instance {
  private static _instance: typeof proj4 | null = null;

  /**
   * Returns the shared proj4 instance, initialising it on first access.
   *
   * On first call all known SRID/EPSG definitions from {@link SridProjDefinitions} are
   * registered on the instance so that subsequent coordinate transformations can reference
   * any of those systems by their `EPSG:<code>` identifier.
   */
  static getInstance(): typeof proj4 {
    if (!Proj4Instance._instance) {
      Proj4Instance._instance = proj4;
      for (const [srid, definition] of Object.entries(SridProjDefinitions.getKnownSRIDProjDefinitions())) {
        Proj4Instance._instance.defs(`EPSG:${srid}`, definition);
      }
    }
    return Proj4Instance._instance;
  }
}



