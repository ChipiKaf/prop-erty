export const getUniqueValues = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};
