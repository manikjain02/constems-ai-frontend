export interface ICsvColumn {
  name: string;
  type: "string" | "number" | "boolean" | "date";
  options: string[];
}

export interface ICsvDataset {
  id: string;
  name: string;
  rowCount: number;
  columns: ICsvColumn[];
}

export interface ICsvRow {
  _id: string;
  [key: string]: string | number | boolean | null;
}

export interface ICsvResponse {
  dataset: ICsvDataset;
  rows: ICsvRow[];
  total: number;
  page: number;
  limit: number;
}


export interface IAppliedFilter {
  column: string;
  operator: string;
  value: string | number | boolean;
}

export interface ICsvFilterBuilderProps {
  columns: ICsvColumn[];
  filters: IAppliedFilter[];
  onAdd: (filter: IAppliedFilter) => void;
  onRemove: (index: number) => void;
  onClear: () => void;
}
