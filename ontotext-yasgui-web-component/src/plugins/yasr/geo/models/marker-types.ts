/**
 * Configuration options for creating a class-based (font) marker icon.
 * Typically used with icon font libraries (e.g., Remix Icon, Font Awesome).
 */
export interface ClassIconOptions {
  /**
   * CSS class name(s) applied to the icon element.
   * Example: "ri-flashlight-line"
   */
  className: string;

  /**
   * CSS color value applied to the icon.
   * Accepts any valid CSS color (e.g., "red", "#ff0000", "rgb(255,0,0)", "var(--my-color)").
   */
  color?: string;

  /**
   * Opacity of the icon.
   * Value should be between 0 (fully transparent) and 1 (fully opaque).
   */
  opacity?: number;
}
