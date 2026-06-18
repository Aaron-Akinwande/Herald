import { create } from "zustand";
import { persist } from "zustand/middleware";
import { HttpMethod, Header } from "./requestStore";

export interface SavedRequest {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
  headers: Header[];
  body: string;
  createdAt: number;
  updatedAt: number;
}

export interface Collection {
  id: string;
  name: string;
  requests: SavedRequest[];
  createdAt: number;
}

interface CollectionStore {
  collections: Collection[];

  // Collection actions
  addCollection: (name: string) => void;
  renameCollection: (id: string, name: string) => void;
  removeCollection: (id: string) => void;

  // Request actions
  addRequest: (
    collectionId: string,
    request: Omit<SavedRequest, "id" | "createdAt" | "updatedAt">,
  ) => void;
  updateRequest: (
    collectionId: string,
    requestId: string,
    updates: Partial<SavedRequest>,
  ) => void;
  removeRequest: (collectionId: string, requestId: string) => void;
}

export const useCollectionStore = create<CollectionStore>()(
  persist(
    (set) => ({
      collections: [],

      addCollection: (name) =>
        set((state) => ({
          collections: [
            ...state.collections,
            {
              id: crypto.randomUUID(),
              name,
              requests: [],
              createdAt: Date.now(),
            },
          ],
        })),

      renameCollection: (id, name) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === id ? { ...c, name } : c,
          ),
        })),

      removeCollection: (id) =>
        set((state) => ({
          collections: state.collections.filter((c) => c.id !== id),
        })),

      addRequest: (collectionId, request) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === collectionId
              ? {
                  ...c,
                  requests: [
                    ...c.requests,
                    {
                      ...request,
                      id: crypto.randomUUID(),
                      createdAt: Date.now(),
                      updatedAt: Date.now(),
                    },
                  ],
                }
              : c,
          ),
        })),

      updateRequest: (collectionId, requestId, updates) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === collectionId
              ? {
                  ...c,
                  requests: c.requests.map((r) =>
                    r.id === requestId
                      ? { ...r, ...updates, updatedAt: Date.now() }
                      : r,
                  ),
                }
              : c,
          ),
        })),

      removeRequest: (collectionId, requestId) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === collectionId
              ? { ...c, requests: c.requests.filter((r) => r.id !== requestId) }
              : c,
          ),
        })),
    }),
    { name: "api-tester-collections" },
  ),
);
