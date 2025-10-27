/**
 * Deep merge utility function that recursively merges objects
 * Similar to lodash.merge but implemented natively
 */

/**
 * Checks if a value is a plain object (not array, null, or other types)
 */
function isPlainObject(value: any): value is Record<string, any> {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.prototype.toString.call(value) === '[object Object]'
  );
}

/**
 * Deep merge multiple objects into the first one
 * @param target - The target object to merge into
 * @param sources - Source objects to merge from
 * @returns The merged object
 */
export function merge<T extends Record<string, any>>(
  target: T,
  ...sources: any[]
): T {
  if (!isPlainObject(target)) {
    return target;
  }

  const result = { ...target } as any;

  for (const source of sources) {
    if (!isPlainObject(source)) {
      continue;
    }

    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const sourceValue = source[key];
        const targetValue = result[key];

        if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
          result[key] = merge(targetValue, sourceValue);
        } else if (sourceValue !== undefined) {
          result[key] = sourceValue;
        }
      }
    }
  }

  return result as T;
}

/**
 * Deep merge that creates a new object without mutating the original
 * @param target - The target object
 * @param sources - Source objects to merge from
 * @returns A new merged object
 */
export function mergeDeep<T extends Record<string, any>>(
  target: T,
  ...sources: any[]
): T {
  return merge({} as T, target, ...sources);
}