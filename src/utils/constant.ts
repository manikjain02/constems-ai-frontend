export const API_BASE_URL = "/api";

/** Wait this long after the last filter/sort change before calling the API. */
export const DEBOUNCE_MS = 250;

export const PAGE_SIZE_OPTIONS = [25, 50, 100, 200];
export const DEFAULT_PAGE_SIZE = 50;


export const PAGE_SIZE = 20;

export const FILTER_OPERATORS = [
  { label: "Is", value: "equals" },
  { label: "Is not", value: "not_equals" },
  { label: "Contains", value: "contains" },
  { label: "Starts with", value: "starts_with" },
  { label: "Greater than", value: "gt" },
  { label: "Greater than or equal", value: "gte" },
  { label: "Less than", value: "lt" },
  { label: "Less than or equal", value: "lte" },
  { label: "Between", value: "between" },
  { label: "Is true", value: "is_true" },
  { label: "Is false", value: "is_false" },
  { label: "Is empty", value: "is_empty" },
  { label: "Is not empty", value: "not_empty" },
];
