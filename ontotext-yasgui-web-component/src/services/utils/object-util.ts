export class ObjectUtil {

  /**
   * Reorders an <code>object</code> based on the passed <code>compareFunction</code>.
   *
   * @param object - The object whose key-value pairs will be reordered.
   * @param compareFunction - A function that will be called with two keys from the object.
   * It should return a positive number if the first key should come before the second,
   * a negative number if the second key should come before the first, or 0 if both keys are equal.
   *
   */
  static orderObjectByKey(object: Record<string, any>, compareFunction: (key1: string, key2: string) => number) {
    const sortedAggregators = {};
    Object.keys(object).sort(compareFunction)
      .forEach((key) => {
        sortedAggregators[key] = object[key];
      });
    return sortedAggregators;
  }
}
