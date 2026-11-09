/** Filter conditions available for each column type. `value` is what the API expects. */
export const OPERATORS_BY_TYPE = {
  string: [
    { value: "contains", label: "contains" },
    { value: "equals", label: "is" },
    { value: "not_equals", label: "is not" },
    { value: "starts_with", label: "starts with" },
    { value: "is_empty", label: "is empty" },
    { value: "not_empty", label: "is not empty" },
  ],
  number: [
    { value: "eq", label: "=" },
    { value: "neq", label: "≠" },
    { value: "gt", label: ">" },
    { value: "gte", label: "≥" },
    { value: "lt", label: "<" },
    { value: "lte", label: "≤" },
    { value: "between", label: "between" },
    { value: "is_empty", label: "is empty" },
  ],
  date: [
    { value: "eq", label: "on" },
    { value: "gt", label: "after" },
    { value: "lt", label: "before" },
    { value: "between", label: "between" },
    { value: "is_empty", label: "is empty" },
  ],
  boolean: [
    { value: "is_true", label: "is yes" },
    { value: "is_false", label: "is no" },
  ],
};

/** Operators that need no typed value. */
export const OPERATORS_WITHOUT_VALUE = [
  "is_empty",
  "not_empty",
  "is_true",
  "is_false",
];

/** Operators where a dropdown of the column's known values is shown instead of a text box. */
export const OPERATORS_WITH_OPTIONS = ["equals", "not_equals"];

export const BETWEEN = "between";

export const getDefaultOperator = (columnType) =>
  OPERATORS_BY_TYPE[columnType][0].value;
