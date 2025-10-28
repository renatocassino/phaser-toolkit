/**
 * Deep merge utility function that recursively merges objects
 * Similar to lodash.merge but implemented natively
 */

/**
 * Type for plain objects (not arrays, null, or other types)
 */
type PlainObject = Record<string, unknown>;

/**
 * Checks if a value is a plain object (not array, null, or other types)
 */
const isPlainObject = (value: unknown): value is PlainObject => {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.prototype.toString.call(value) === '[object Object]'
  );
};

/**
 * Deep clone utility function that creates new references for all nested objects
 * @param obj - The object to clone
 * @returns A deep clone of the object with new references
 */
const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as T;
  }

  if (isPlainObject(obj)) {
    const cloned = {} as Record<string, unknown>;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned as T;
  }

  return obj;
};

/**
 * Deep merge multiple objects into the first one
 * @param target - The target object to merge into
 * @param sources - Source objects to merge from
 * @returns The merged object
 */
export const merge = <T extends PlainObject>(
  target: T,
  ...sources: PlainObject[]
): T => {
  if (!isPlainObject(target)) {
    return target;
  }

  // Start with a deep clone of the target
  let result = deepClone(target) as Record<string, unknown>;

  for (const source of sources) {
    if (!isPlainObject(source)) {
      continue;
    }

    // Deep clone the source to ensure we create new references
    const clonedSource = deepClone(source);
    
    for (const key in clonedSource) {
      if (Object.prototype.hasOwnProperty.call(clonedSource, key)) {
        const sourceValue = clonedSource[key];
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
};