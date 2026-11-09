import { AxiosRequestConfig } from "axios";

// Generic constraint: T must be an object
type Payload = Record<string, unknown>;

// Custom type for optional params
interface FetchResourceParams {
  resource: string;
  id?: string | number;
  params?: AxiosRequestConfig["params"];
  signal?: AbortSignal;
}

interface CreateResourceParams<T extends Payload = Payload> {
  resource: string;
  data: T;
  signal?: AbortSignal;
}

interface UpdateResourceParams<T extends Payload = Payload> {
  resource: string;
  id?: string | number | null;
  data: T;
  signal?: AbortSignal;
}

interface DeleteResourceParams {
  resource: string;
  id?: string | number | null;
  signal?: AbortSignal;
}

export type {
  CreateResourceParams,
  DeleteResourceParams,
  FetchResourceParams,
  UpdateResourceParams,
};
