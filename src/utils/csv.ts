import { FILTER_OPERATORS } from "./constant";

export const formatValue = (value: unknown): string => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
};

export const formatHeader = (name: string): string =>
  name.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

export const formatOperator = (operator: string): string =>
  FILTER_OPERATORS.find((item) => item.value === operator)?.label ?? operator;
