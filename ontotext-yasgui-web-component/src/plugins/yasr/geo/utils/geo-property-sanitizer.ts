import DOMPurify from 'dompurify';
import {GeoSparqlVariableType} from '../models/geo-sparql-variable';
import {Sanitizer} from '../models/sanitizer';

const GEO_VARIABLE_SANITIZERS: {[K in keyof GeoSparqlVariableType]: Sanitizer<K>;} = {
  geo_popup: (v?: string) => GeoPropertySanitizer.sanitizeHtml(v),
  geo_tooltip: (v?: string) => GeoPropertySanitizer.sanitizeHtml(v),
  geo_weight: (v?: string) => GeoPropertySanitizer.sanitizeNumber(v),
  geo_opacity: (v?: string) => GeoPropertySanitizer.sanitizeOpacity(v),
  geo_fillOpacity: (v?: string) => GeoPropertySanitizer.sanitizeOpacity(v),
  geo_color: (v?: string) => GeoPropertySanitizer.sanitizeColor(v),
  geo_fillColor: (v?: string) => GeoPropertySanitizer.sanitizeColor(v),
  geo_markerClass: (v?: string) => GeoPropertySanitizer.sanitizeCssClass(v),
  geo_markerUrl: (v?: string) => GeoPropertySanitizer.sanitizeMarkerUrl(v),
};

/**
 * GeoPropertySanitizer provides a set of strict sanitization utilities for GeoSPARQL-derived feature properties
 * before they are used in rendering.
 *
 * It ensures that all values used in the map visualization layer are:
 * - type-safe (number vs string validation)
 * - range-safe (e.g., opacity clamping)
 * - injection-safe (HTML, CSS class, URL sanitization)
 */
export class GeoPropertySanitizer {
  /**
   * Attempts to parse a numeric value from a string or number input.
   *
   * Only finite numeric values are accepted. Invalid numbers return `undefined`.
   *
   * @param input - Raw input value to parse.
   * @returns A finite number or `undefined` if invalid.
   */
  static parseNumber(input?: string | number): number | undefined {
    if (typeof input === 'number' && isFinite(input)){
      return input;
    }

    if (typeof input === 'string') {
      const inputAsNumber = Number(input);
      if (isFinite(inputAsNumber)) {
        return inputAsNumber;
      }
    }

    return;
  }

  /**
   * Sanitizes an opacity value and clamps it to the valid range [0, 1].
   *
   * Invalid or non-numeric inputs return `undefined`.
   *
   * @param input - Raw opacity value.
   * @returns A normalized opacity value between 0 and 1.
   */
  static sanitizeOpacity(input?: string): number | undefined {
    const n = this.parseNumber(input);
    if (n === undefined) {
      return;
    }
    return Math.min(1, Math.max(0, n));
  }

  /**
   * Sanitizes a numeric value.
   *
   * Returns `undefined` if the input cannot be parsed as a finite number.
   *
   * @param input - Raw numeric input.
   * @returns A valid number or `undefined`.
   */
  static sanitizeNumber(input?: string): number | undefined {
    return this.parseNumber(input);
  }

  /**
   * Normalizes and validates a CSS color string.
   *
   * Supports:
   * - Hex colors (#fff, #ffffff)
   * - rgb()/rgba()
   * - hsl()/hsla()
   * - Named CSS colors (e.g., "red", "blue")
   *
   * Returns a normalized color string if valid, otherwise `undefined`.
   *
   * @param input - The color value to sanitize.
   */
  static sanitizeColor(input?: string): string | undefined {
    if (typeof input !== 'string') {
      return undefined;
    }

    const color = input.trim();
    if (!color) {
      return undefined;
    }

    // Use browser CSS parsing for validation
    const el = document.createElement('div');
    el.style.color = color;

    // If invalid, browser resets it to empty string
    return el.style.color ? color : undefined;
  }

  /**
   * Sanitizes a space-separated CSS class string.
   *
   * Only alphanumeric characters, underscores, and hyphens are allowed per class.
   * Invalid class names are removed. If no valid class remains, `undefined` is returned.
   *
   * @param input - Raw CSS class string.
   * @returns Sanitized class list or `undefined`.
   */
  static sanitizeCssClass(input?: string): string | undefined {
    if (typeof input !== 'string') {
      return;
    }

    return input
      .split(/\s+/)
      .filter(c => /^[a-zA-Z0-9_-]+$/.test(c))
      .join(' ') || undefined;
  }

  /**
   * Validates and sanitizes a marker image URL.
   *
   * The URL must:
   * - Use HTTP or HTTPS protocol
   * - Match allowed image extensions: .png, .jpg, .jpeg, .webp
   *
   * Relative URLs are resolved against `window.location.origin`.
   *
   * Invalid or unsafe URLs return `undefined`.
   *
   * @param input - Raw URL string.
   * @returns A validated absolute URL or `undefined`.
   */
  static sanitizeMarkerUrl(input?: string): string | undefined {
    if (typeof input !== 'string' || !input.trim()) {
      return;
    }
    try {
      const url = new URL(input, window.location.origin);
      if (!['http:', 'https:'].includes(url.protocol)) {
        return;
      }
      const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
      const path = url.pathname.toLowerCase();
      if (!allowedExtensions.some(ext => path.endsWith(ext))) {
        return;
      }
      return url.href;
    } catch {
      return;
    }
  }

  /**
   * Sanitizes HTML content to prevent XSS attacks.
   *
   * All unsafe tags, attributes, and scripts are removed while preserving allowed markup.
   *
   * @param html - Raw HTML string.
   * @returns Sanitized safe HTML string.
   */
  static sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html);
  }

  /**
   * Dispatches sanitization based on GeoSPARQL variable key.
   *
   * This method selects the appropriate sanitizer for the given key and applies it to the provided value.
   *
   * Ensures all GeoSPARQL-derived values are safely transformed before being used in rendering logic.
   *
   * @template K - A key of GeoSparqlVariableType
   *
   * @param key - GeoSPARQL variable identifier.
   * @param value - Raw value to sanitize.
   * @returns The sanitized value for the given key.
   */
  static sanitize<K extends keyof GeoSparqlVariableType>(key: K, value?: string): GeoSparqlVariableType[K] {
    const fn = GEO_VARIABLE_SANITIZERS[key] as Sanitizer<K>;
    return fn(value);
  }
}
