import {
  CreateResourceParams,
  DeleteResourceParams,
  FetchResourceParams,
  UpdateResourceParams,
} from "@/types";
import axios, { AxiosInstance } from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

class JsonApiService {
  private axiosInstance: AxiosInstance;
  private userToken: string | null = null;

  constructor() {
    // Initialize the Axios instance with the base URL and timeout
    this.axiosInstance = axios.create({
      baseURL: BASE_URL,
      // timeout: 10000,
    });

    // Request interceptor to add Authorization header if userToken is set
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.userToken) {
          config.headers["Authorization"] = `Bearer ${this.userToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor to handle errors globally
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        // Handle 401 unauthorized errors
        if (error?.response?.status === 401) {
          console.error("Unauthorized! Redirect to login...");
        }
        return Promise.reject(error);
      },
    );
  }

  // setting userToken after login
  setUserToken(token: string) {
    this.userToken = token;
  }

  // Fetch resource with optional id, params, and signal for cancellation
  async fetchResource({ resource, id, params, signal }: FetchResourceParams) {
    try {
      const url = `/${resource}${id ? `/${id}` : ""}`;
      const response = await this.axiosInstance.get(url, { params, signal });
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.error("Request canceled:", error.message);
      } else if (axios.isAxiosError(error)) {
        console.error("Axios error fetching resource:", error.response);
      } else {
        console.error("Error fetching resource:", error);
      }
      throw error;
    }
  }

  async fetchBinaryResource({
    resource,
    id,
    params,
    signal,
  }: FetchResourceParams) {
    try {
      const url = `/${resource}${id ? `/${id}` : ""}`;
      const response = await this.axiosInstance.get(url, {
        params,
        signal,
        responseType: "arraybuffer", // <-- key change
      });
      return response.data as ArrayBuffer;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.error("Request canceled:", error.message);
      } else if (axios.isAxiosError(error)) {
        console.error("Axios error fetching binary resource:", error.response);
      } else {
        console.error("Error fetching binary resource:", error);
      }
      throw error;
    }
  }

  // Create a new resource with data and optional signal for cancellation
  async createResource({ resource, data, signal }: CreateResourceParams) {
    try {
      const url = `/${resource}`;
      const response = await this.axiosInstance.post(url, data, { signal });
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.error("Request canceled:", error.message);
      } else if (axios.isAxiosError(error)) {
        console.error("Axios error creating resource:", error.response);
      } else {
        console.error("Error creating resource:", error);
      }
      throw error;
    }
  }

  // Create a new resource with file upload
  async createResourceWithFile({
    resource,
    data,
    signal,
  }: CreateResourceParams) {
    try {
      const url = `/${resource}`;
      const response = await this.axiosInstance.postForm(url, data, { signal });
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.error("Request canceled:", error.message);
      } else if (axios.isAxiosError(error)) {
        console.error("Axios error fetching resource:", error.response);
      } else {
        console.error("Error creating resource:", error);
      }
      throw error;
    }
  }

  // Replace an existing resource with optional id, data, and signal for cancellation
  async putResource({
    resource,
    id = null,
    data,
    signal,
  }: UpdateResourceParams) {
    try {
      const url = `/${resource}${id ? `/${id}` : ""}`;
      const response = await this.axiosInstance.put(url, data, { signal });
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.error("Request canceled:", error.message);
      } else if (axios.isAxiosError(error)) {
        console.error("Axios error fetching resource:", error.response);
      } else {
        console.error("Error replacing resource:", error);
      }
      throw error;
    }
  }

  // Update an existing resource with optional id, data, and signal for cancellation
  async updateResource({
    resource,
    id = null,
    data,
    signal,
  }: UpdateResourceParams) {
    try {
      const url = `/${resource}${id ? `/${id}` : ""}`;
      const response = await this.axiosInstance.patch(url, data, { signal });
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.error("Request canceled:", error.message);
      } else if (axios.isAxiosError(error)) {
        console.error("Axios error fetching resource:", error.response);
      } else {
        console.error("Error updating resource:", error);
      }
      throw error;
    }
  }

  // Delete a resource with optional id and signal for cancellation
  async deleteResource({ resource, id = null, signal }: DeleteResourceParams) {
    try {
      const url = `/${resource}${id ? `/${id}` : ""}`;
      const response = await this.axiosInstance.delete(url, { signal });
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.error("Request canceled:", error.message);
      } else if (axios.isAxiosError(error)) {
        console.error("Axios error fetching resource:", error.response);
      } else {
        console.error("Error deleting resource:", error);
      }
      throw error;
    }
  }
}

const jsonApiService = new JsonApiService();
export { jsonApiService };
