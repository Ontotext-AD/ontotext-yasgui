/**
 * This is our internal Yasq type interface used only for typing convenience.
 * We can't use the exported types from the YASGUI because the library has it's own build than ours
 * and our component doesn't see their types.
 */
export interface Yasqe {
  getInfer: () => boolean;
  getSameAs: () => boolean;
}
