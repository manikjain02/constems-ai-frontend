import type { ICsvColumn, ICsvRow } from "@/types";
import { formatHeader, formatValue } from "@/utils/csv";

interface ICsvDataGridProps {
  columns: ICsvColumn[];
  rows: ICsvRow[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string;
  sort: string;
  dir: "asc" | "desc";
  onSort: (column: ICsvColumn) => void;
  onPageChange: (page: number) => void;
}

export default function CsvDataGrid({
  columns,
  rows,
  total,
  page,
  totalPages,
  loading,
  error,
  sort,
  dir,
  onSort,
  onPageChange,
}: ICsvDataGridProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {loading ? (
        <div className="p-8 text-center">Loading CSV data...</div>
      ) : error ? (
        <div className="p-8 text-center text-red-600">{error}</div>
      ) : !rows.length ? (
        <div className="p-8 text-center text-gray-500">No records found.</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.name}
                      onClick={() => onSort(column)}
                      className="cursor-pointer whitespace-nowrap border-b px-4 py-3 font-semibold"
                    >
                      {formatHeader(column.name)}

                      {sort === column.name && (
                        <span className="ml-2">
                          {dir === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr key={row._id} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td
                        key={column.name}
                        className="whitespace-nowrap border-b px-4 py-3"
                      >
                        {formatValue(row[column.name])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between p-4">
            <p className="text-sm text-gray-500">
              Showing {rows.length} of {total} records
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                className="rounded-lg border px-3 py-2 disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-sm">
                Page {page} of {totalPages || 1}
              </span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className="rounded-lg border px-3 py-2 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
