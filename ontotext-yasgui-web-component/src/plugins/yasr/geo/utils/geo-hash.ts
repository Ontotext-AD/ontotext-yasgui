/**
 * Represents the result of decoding a Geohash string.
 */
export interface GeoHashDecodeResult {
  latitude: number;
  longitude: number;
  error: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Utility class for decoding Geohash-encoded strings into geographic coordinates.
 *
 * Geohash is a public domain geocoding system that encodes a geographic location
 * into a short string of letters and digits. This implementation decodes such strings
 * back into latitude/longitude coordinates and their associated error margins.
 *
 * @see {@link https://en.wikipedia.org/wiki/Geohash}
 */
export class GeoHash {
  /** Minimum latitude value in degrees. */
  static readonly MIN_LAT = -90;
  /** Maximum latitude value in degrees. */
  static readonly MAX_LAT = 90;
  /** Minimum longitude value in degrees. */
  static readonly MIN_LON = -180;
  /** Maximum longitude value in degrees. */
  static readonly MAX_LON = 180;

  /**
   * Lookup dictionary mapping each Base32 character to its numeric index.
   * Populated during static initialization from the Base32 alphabet used by Geohash.
   */
  static readonly BASE32_CODES_DICT: Record<string, number> = {};
  static {
    const BASE32_CODES = '0123456789bcdefghjkmnpqrstuvwxyz';
    for (let i = 0; i < BASE32_CODES.length; i++) {
      GeoHash.BASE32_CODES_DICT[BASE32_CODES.charAt(i)] = i;
    }
  }

  /**
   * Lookup dictionary mapping each Geohash-36 character to its numeric index (0–35).
   * The alphabet `23456789bBCdDFgGhHjJKlLMnNPqQrRtTVWX` is case-sensitive and arranged
   * as a 6×6 grid where `index % 6` gives the longitude column and `Math.floor(index / 6)`
   * gives the latitude row.
   */
  static readonly BASE36_CODES_DICT: Record<string, number> = {};
  static {
    const BASE36_CODES = '23456789bBCdDFgGhHjJKlLMnNPqQrRtTVWX';
    for (let i = 0; i < BASE36_CODES.length; i++) {
      GeoHash.BASE36_CODES_DICT[BASE36_CODES.charAt(i)] = i;
    }
  }

  /**
   * Decodes a Geohash string into a geographic coordinate with error margins.
   *
   * @param hashString - A Geohash-encoded string.
   * @returns An object containing the decoded `latitude`, `longitude`,
   *          and an `error` object with `latitude` and `longitude` error margins.
   */
  static decode(hashString: string): GeoHashDecodeResult {
    const bbox = GeoHash.decodeBbox(hashString);
    const lat = (bbox[0] + bbox[2]) / 2;
    const lon = (bbox[1] + bbox[3]) / 2;
    const latErr = bbox[2] - lat;
    const lonErr = bbox[3] - lon;
    return {
      latitude: lat,
      longitude: lon,
      error: {latitude: latErr, longitude: lonErr}
    };
  }

  /**
   * Decodes a Geohash-36-encoded string into a geographic coordinate with error margins.
   *
   * Geohash-36 uses a case-sensitive 36-character alphabet arranged in a 6×6 grid.
   * Each character simultaneously refines both latitude and longitude by selecting a cell
   * in the grid, unlike standard Geohash which alternates bits between the two axes.
   *
   * @see {@link https://en.wikipedia.org/wiki/Geohash-36}
   * @param hashString - A Geohash-36-encoded string (case-sensitive).
   * @returns An object containing the decoded `latitude`, `longitude`,
   *          and an `error` object with `latitude` and `longitude` error margins.
   */
  static decodeBase36(hashString: string): GeoHashDecodeResult {
    const bbox = GeoHash.decodeBboxBase36(hashString);
    const lat = (bbox[0] + bbox[2]) / 2;
    const lon = (bbox[1] + bbox[3]) / 2;
    const latErr = bbox[2] - lat;
    const lonErr = bbox[3] - lon;
    return {
      latitude: lat,
      longitude: lon,
      error: {latitude: latErr, longitude: lonErr}
    };
  }

  /**
   * Decodes a Geohash-36 string into a bounding box represented as
   * `[minLat, minLon, maxLat, maxLon]`.
   *
   * Geohash-36 encodes both latitude and longitude simultaneously per character by
   * subdividing the bounding box into a 6×6 grid (36 cells). The character index
   * determines the column (longitude, `index % 6`) and row (latitude, `5 - Math.floor(index / 6)`).
   * Row 0 in the alphabet is the northernmost row, so the index is inverted for latitude mapping.
   * The alphabet is case-sensitive.
   *
   * @param hashString - A Geohash-36-encoded string.
   * @returns A tuple of `[minLat, minLon, maxLat, maxLon]` in degrees.
   */
  private static decodeBboxBase36(hashString: string): [number, number, number, number] {
    let maxLat = GeoHash.MAX_LAT;
    let minLat = GeoHash.MIN_LAT;
    let maxLon = GeoHash.MAX_LON;
    let minLon = GeoHash.MIN_LON;

    for (let i = 0, l = hashString.length; i < l; i++) {
      const char = hashString[i];
      if (!(char in GeoHash.BASE36_CODES_DICT)) {
        throw new Error(`Invalid Geohash-36 character: '${char}'`);
      }
      const hashValue = GeoHash.BASE36_CODES_DICT[char];
      const col = hashValue % 6;
      // Row 0 is the northernmost (top of grid), so invert to map correctly to latitude.
      const row = 5 - Math.floor(hashValue / 6);

      const latStep = (maxLat - minLat) / 6;
      const lonStep = (maxLon - minLon) / 6;

      minLon = minLon + col * lonStep;
      maxLon = minLon + lonStep;
      minLat = minLat + row * latStep;
      maxLat = minLat + latStep;
    }
    return [minLat, minLon, maxLat, maxLon];
  }

  /**
   * Decodes a Geohash string into a bounding box represented as
   * `[minLat, minLon, maxLat, maxLon]`.
   *
   * @param hashString - A Geohash-encoded string.
   * @returns A tuple of `[minLat, minLon, maxLat, maxLon]` in degrees.
   */
  private static decodeBbox(hashString: string): [number, number, number, number] {
    let isLon = true;
    let maxLat = GeoHash.MAX_LAT;
    let minLat = GeoHash.MIN_LAT;
    let maxLon = GeoHash.MAX_LON;
    let minLon = GeoHash.MIN_LON;

    for (let i = 0, l = hashString.length; i < l; i++) {
      const char = hashString[i].toLowerCase();
      if (!(char in GeoHash.BASE32_CODES_DICT)) {
        throw new Error(`Invalid Geohash character: '${hashString[i]}'`);
      }
      const hashValue = GeoHash.BASE32_CODES_DICT[char];

      for (let bits = 4; bits >= 0; bits--) {
        const bit = (hashValue >> bits) & 1;
        if (isLon) {
          [minLon, maxLon] = GeoHash.bisect(bit, minLon, maxLon);
        } else {
          [minLat, maxLat] = GeoHash.bisect(bit, minLat, maxLat);
        }
        isLon = !isLon;
      }
    }
    return [minLat, minLon, maxLat, maxLon];
  }

  /**
   * Bisects a range `[min, max]` based on a single bit.
   *
   * If `bit` is `1`, the lower half becomes the new minimum (move right/up).
   * If `bit` is `0`, the upper half becomes the new maximum (move left/down).
   *
   * @param bit - A single bit value (`0` or `1`).
   * @param min - The current minimum bound.
   * @param max - The current maximum bound.
   * @returns The updated `[min, max]` range after bisection.
   */
  private static bisect(bit: number, min: number, max: number): [number, number] {
    const mid = (min + max) / 2;
    return bit === 1 ? [mid, max] : [min, mid];
  }
}
