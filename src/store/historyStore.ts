import { create } from "zustand";
import { persist } from "zustand/middleware";
import { HttpMethod, Header } from "./requestStore";

export interface HistoryEntry {
  id: string;
  method: HttpMethod;
  url: string;
  headers: Header[];
  body: string;
  timestamp: number;
  status?: number;
  statusText?: string;
  time?: number;
}

interface HistoryStore {
  entries: HistoryEntry[];
  addEntry: (entry: Omit<HistoryEntry, "id" | "timestamp">) => void;
  removeEntry: (id: string) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set) => ({
      entries: [],

      addEntry: (entry) =>
        set((state) => ({
          entries: [
            {
              ...entry,
              id: crypto.randomUUID(),
              timestamp: Date.now(),
            },
            ...state.entries,
          ].slice(0, 50), // cap at 50 entries
        })),

      removeEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),

      clearHistory: () => set({ entries: [] }),
    }),
    {
      name: "api-tester-history", 
    },
  ),
);
