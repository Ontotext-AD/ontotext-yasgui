/**
 * This interface must be implemented by all Yasr plugins, and it is initialized with a YASR instance as a constructor argument.
 */
export interface YasrPlugin {
  /**
   * When Yasr begins rendering a response, it first checks if the currently selected plugin can handle the response (by calling 'canHandleResults').
   * If the selected plugin cannot handle the result, other plugins are sorted by their 'priority.'
   * The plugin with the highest priority will be used for rendering the response.
   */
  priority: number;

  /**
   * A unique string of plugin. It will be used for translation of plugin name.
   * For instance: if name is "test-plugin" then the translation label key will be "yasr.plugin_control.plugin.name.test-plugin";
   */
  label: string;

  /**
   * Checks if the plugin can render the response.
   */
  canHandleResults(): boolean;

  /**
   * It is called during the initialization of the plugin.
   */
  initialize?(): Promise<void>;

  download?(filename?: string): DownloadInfo | undefined;

  /**
   * It is called during the destruction of the plugin.
   */
  destroy?(): void;

  /**
   * Called when plugin have to render the response.
   * @param persistentConfig
   * @param runtimeConfig
   */
  draw(persistentConfig: any, runtimeConfig?: any): Promise<void> | void;

  getIcon(): Element | undefined;
}

export interface DownloadInfo {
  contentType: string;
  /**
   * File contents as a string or a data url
   */
  getData: () => string;
  filename: string;
  title: string;
}
