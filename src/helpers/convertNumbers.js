export const convertNumbers2English = string =>
  string.replace(/[٠١٢٣٤٥٦٧٨٩]/g, c => c.charCodeAt(0) - 1632);
