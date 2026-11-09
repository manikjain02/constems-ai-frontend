import { useEffect, useState } from "react";
import axios from "axios";
import { jsonApiService } from "@/services/jsonApiService";
import type { ICsvResponse, ICsvColumn } from "@/types";
import CsvFilterBuilder from "./CsvFilterBuilder";
import CsvDataGrid from "./CsvDataGrid";
import type { IAppliedFilter } from "@/types";
import { PAGE_SIZE } from "@/utils/constant";

export default function CsvDataTable() {
  const [data, setData] = useState<ICsvResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState<IAppliedFilter[]>([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("");
  const [dir, setDir] = useState<"asc" | "desc">("asc");

  const columns = data?.dataset.columns ?? [];
  const totalPages = Math.ceil((data?.total ?? 0) / PAGE_SIZE);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCsvData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await jsonApiService.fetchResource({
          resource: "csv-data",
          params: {
            page,
            limit: PAGE_SIZE,
            ...(sort ? { sort, dir } : {}),
            ...(filters.length
              ? {
                  filters: JSON.stringify(
                    filters.map(({ column, operator, value }) => ({
                      column,
                      op: operator,
                      value,
                    })),
                  ),
                }
              : {}),
          },
          signal: controller.signal,
        });

        setData(response as ICsvResponse);
      } catch (err) {
        if (axios.isCancel(err)) return;

        setError(
          axios.isAxiosError(err)
            ? err.response?.data?.message || err.message
            : "Unable to fetch CSV data.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchCsvData();

    return () => controller.abort();
  }, [page, sort, dir, filters]);

  const handleAddFilter = (filter: IAppliedFilter) => {
    setFilters((previous) => [...previous, filter]);
    setPage(1);
  };

  const handleRemoveFilter = (index: number) => {
    setFilters((previous) =>
      previous.filter((_, filterIndex) => filterIndex !== index),
    );
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters([]);
    setPage(1);
  };

  const handleSort = (column: ICsvColumn) => {
    if (sort === column.name) {
      setDir((previous) => (previous === "asc" ? "desc" : "asc"));
    } else {
      setSort(column.name);
      setDir("asc");
    }

    setPage(1);
  };

  return (
    <div className="space-y-5">
      <CsvFilterBuilder
        columns={columns}
        filters={filters}
        onAdd={handleAddFilter}
        onRemove={handleRemoveFilter}
        onClear={handleClearFilters}
      />

      <CsvDataGrid
        columns={columns}
        rows={data?.rows ?? []}
        total={data?.total ?? 0}
        page={page}
        totalPages={totalPages}
        loading={loading}
        error={error}
        sort={sort}
        dir={dir}
        onSort={handleSort}
        onPageChange={setPage}
      />
    </div>
  );
}
