import {
  BETWEEN,
  OPERATORS_WITHOUT_VALUE,
  getDefaultOperator,
} from "./filterOperators";

let nextFilterId = 1;

/** Creates a new, enabled filter for the given column. */
export function createFilter(column) {
  return {
    id: nextFilterId++,
    column: column.name,
    op: getDefaultOperator(column.type),
    value: "",
    value2: "",
    enabled: true,
  };
}

/** True when the user has filled in everything the filter needs. */
export function isFilterComplete({ column, op, value, value2 }) {
  if (!column || !op) return false;
  if (OPERATORS_WITHOUT_VALUE.includes(op)) return true;
  if (op === BETWEEN) return value !== "" && value2 !== "";
  return value !== "";
}

/** Keeps only enabled, complete filters and strips UI-only fields before sending to the API. */
export function toApiFilters(filters) {
  return filters
    .filter((filter) => filter.enabled && isFilterComplete(filter))
    .map(({ column, op, value, value2 }) => ({ column, op, value, value2 }));
}
