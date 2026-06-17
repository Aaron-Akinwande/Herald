import { create } from "zustand";
import axios, { AxiosError } from "axios";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface Header {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface ResponseData {
  status: number;
  statusText: string;
  body: unknown;
  headers: Record<string, string>;
  time: number;
  size: string;
}

export interface RequestError {
  message: string;
  status?: number;
  statusText?: string;
}

interface RequestStore {
  // Request state
  method: HttpMethod;
  url: string;
  headers: Header[];
  body: string;

  // Response state
  response: ResponseData | null;
  error: RequestError | null;
  isLoading: boolean;

  // Actions
  setMethod: (method: HttpMethod) => void;
  setUrl: (url: string) => void;
  setBody: (body: string) => void;
  addHeader: () => void;
  updateHeader: (
    id: string,
    field: keyof Header,
    value: string | boolean,
  ) => void;
  removeHeader: (id: string) => void;
  sendRequest: () => Promise<void>;
  clearResponse: () => void;
}

const buildHeaders = (headers: Header[]) =>
  headers
    .filter((h) => h.enabled && h.key.trim())
    .reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {});

const calcSize = (data: unknown) => {
  const bytes = new TextEncoder().encode(JSON.stringify(data)).length;
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
};

export const useRequestStore = create<RequestStore>((set, get) => ({
  method: "GET",
  url: "",
  headers: [],
  body: "",
  response: null,
  error: null,
  isLoading: false,

  setMethod: (method) => set({ method, response: null, error: null }),
  setUrl: (url) => set({ url, response: null, error: null }),
  setBody: (body) => set({ body }),
  clearResponse: () => set({ response: null, error: null }),

  addHeader: () =>
    set((state) => ({
      headers: [
        ...state.headers,
        { id: crypto.randomUUID(), key: "", value: "", enabled: true },
      ],
    })),

  updateHeader: (id, field, value) =>
    set((state) => ({
      headers: state.headers.map((h) =>
        h.id === id ? { ...h, [field]: value } : h,
      ),
    })),

  removeHeader: (id) =>
    set((state) => ({
      headers: state.headers.filter((h) => h.id !== id),
    })),

  sendRequest: async () => {
    const { method, url, headers, body } = get();

    if (!url.trim()) return;

    try {
      new URL(url);
    } catch {
      set({
        error: { message: "Invalid URL — make sure it starts with https://" },
        isLoading: false,
      });
      return;
    }

    set({ isLoading: true, response: null, error: null });

    const t0 = Date.now();

    try {
      const res = await axios({
        method,
        url,
        headers: buildHeaders(headers),
        data:
          method !== "GET" && method !== "DELETE" && body
            ? JSON.parse(body)
            : undefined,
        timeout: 15000,
      });

      set({
        isLoading: false,
        response: {
          status: res.status,
          statusText: res.statusText,
          body: res.data,
          headers: res.headers as Record<string, string>,
          time: Date.now() - t0,
          size: calcSize(res.data),
        },
      });
    } catch (err) {
      const axiosErr = err as AxiosError;
      set({
        isLoading: false,
        error: axiosErr.response
          ? {
              message: `Request failed`,
              status: axiosErr.response.status,
              statusText: axiosErr.response.statusText,
            }
          : {
              message:
                axiosErr.code === "ECONNABORTED"
                  ? "Request timed out after 15s"
                  : "Network error — check the URL or your connection",
            },
      });
    }
  },
}));
