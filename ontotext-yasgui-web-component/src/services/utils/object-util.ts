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

  /**
   * Checks whether a given value is one of the values defined in the provided enum.
   *
   * @param value - The value to check.
   * @param enumType - The enum containing allowed values.
   * @returns `true` if the value exists in the enum, otherwise `false`.
   */
  static isEnumValue<T extends Record<string, string>>(
    value: string,
    enumType: T
  ): boolean {
    return Object.values(enumType).includes(value);
  }

  /**
   * Executes a function and safely catches any runtime errors.
   *
   * This utility is useful when parsing or transforming data that may throw
   * (e.g. JSON parsing, geometry parsing, external library conversions).
   *
   * @template T
   * @param fn - Function that performs a potentially unsafe operation.
   * @returns The function result if successful, otherwise `null` if an error occurs.
   */
  static safeParse<T>(fn: () => T): T | null {
    try {
      return fn();
    } catch (error) {
      console.warn('safeParse failed:', error);
      return null;
    }
  }
}
