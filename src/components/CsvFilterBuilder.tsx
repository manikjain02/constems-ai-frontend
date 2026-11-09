import { useState } from "react";
import { Filter, Plus, X } from "lucide-react";
import type { ICsvFilterBuilderProps, IAppliedFilter } from "@/types";
import { FILTER_OPERATORS } from "@/utils/constant";
import { formatHeader, formatOperator, formatValue } from "@/utils/csv";

export default function CsvFilterBuilder({
  columns,
  filters,
  onAdd,
  onRemove,
  onClear,
}: ICsvFilterBuilderProps) {
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedOperator, setSelectedOperator] = useState("equals");
  const [filterValue, setFilterValue] = useState("");

  const activeColumn = columns.find((column) => column.name === selectedColumn);

  const handleAddFilter = () => {
    if (!selectedColumn || filterValue.trim() === "") return;

    const column = columns.find((item) => item.name === selectedColumn);

    if (!column) return;

    let value: IAppliedFilter["value"] = filterValue;

    if (column.type === "number") {
      value = Number(filterValue);

      if (!Number.isFinite(value)) return;
    } else if (column.type === "boolean") {
      value = filterValue === "true";
    }

    onAdd({
      column: selectedColumn,
      operator: selectedOperator,
      value,
    });

    setFilterValue("");
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <Filter size={18} />
        <h3 className="font-semibold">Filter Data</h3>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-45 flex-1">
          <label className="mb-1 block text-sm font-medium">Column</label>

          <select
            value={selectedColumn}
            onChange={(event) => {
              setSelectedColumn(event.target.value);
              setFilterValue("");
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="">Select column</option>

            {columns.map((column) => (
              <option key={column.name} value={column.name}>
                {formatHeader(column.name)}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-45 flex-1">
          <label className="mb-1 block text-sm font-medium">Operator</label>

          <select
            value={selectedOperator}
            onChange={(event) => setSelectedOperator(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            {FILTER_OPERATORS.filter((operator) => {
              if (
                activeColumn?.type === "boolean" ||
                ["is_true", "is_false"].includes(operator.value)
              ) {
                return (
                  activeColumn?.type === "boolean" &&
                  ["equals", "not_equals", "is_true", "is_false"].includes(
                    operator.value,
                  )
                );
              }

              if (["is_empty", "not_empty"].includes(operator.value)) {
                return true;
              }

              if (activeColumn?.type === "number") {
                return !["contains", "starts_with"].includes(operator.value);
              }

              return !["gt", "gte", "lt", "lte", "between"].includes(
                operator.value,
              );
            }).map((operator) => (
              <option key={operator.value} value={operator.value}>
                {operator.label}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-45 flex-1">
          <label className="mb-1 block text-sm font-medium">Value</label>

          {["is_true", "is_false", "is_empty", "not_empty"].includes(
            selectedOperator,
          ) ? (
            <input
              disabled
              value={
                selectedOperator === "is_true"
                  ? "True"
                  : selectedOperator === "is_false"
                    ? "False"
                    : "Not required"
              }
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2"
            />
          ) : activeColumn?.type === "boolean" ? (
            <select
              value={filterValue}
              onChange={(event) => setFilterValue(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="">Select value</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          ) : activeColumn?.options?.length ? (
            <select
              value={filterValue}
              onChange={(event) => setFilterValue(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="">Select value</option>
              {activeColumn.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={
                activeColumn?.type === "number"
                  ? "number"
                  : activeColumn?.type === "date"
                    ? "date"
                    : "text"
              }
              value={filterValue}
              onChange={(event) => setFilterValue(event.target.value)}
              placeholder="Enter filter value"
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          )}
        </div>

        <button
          type="button"
          onClick={handleAddFilter}
          disabled={
            !selectedColumn ||
            (!["is_true", "is_false", "is_empty", "not_empty"].includes(
              selectedOperator,
            ) &&
              filterValue.trim() === "")
          }
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={16} />
          Add Filter
        </button>
      </div>

      {filters.length > 0 && (
        <div className="mt-5 border-t border-gray-200 pt-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium">
              Applied Filters ({filters.length})
            </p>

            <button
              type="button"
              onClick={onClear}
              className="text-sm font-medium text-red-600 hover:text-red-700"
            >
              Clear all
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter, index) => (
              <div
                key={`${filter.column}-${index}`}
                className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-sm"
              >
                <span className="font-medium">
                  {formatHeader(filter.column)}
                </span>

                <span className="text-gray-500">
                  {formatOperator(filter.operator)}
                </span>

                <span className="font-medium">
                  {formatValue(
                    ["is_true", "is_false", "is_empty", "not_empty"].includes(
                      filter.operator,
                    )
                      ? filter.operator === "is_true"
                        ? true
                        : filter.operator === "is_false"
                          ? false
                          : filter.operator === "is_empty"
                            ? "Empty"
                            : "Not empty"
                      : filter.value,
                  )}
                </span>

                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  aria-label={`Remove ${filter.column} filter`}
                  className="text-gray-500 hover:text-red-600"
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
