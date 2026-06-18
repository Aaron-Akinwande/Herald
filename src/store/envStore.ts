import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface EnvVariable {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

interface EnvStore {
  variables: EnvVariable[];
  addVariable: () => void;
  updateVariable: (
    id: string,
    field: keyof EnvVariable,
    value: string | boolean,
  ) => void;
  removeVariable: (id: string) => void;
  clearVariables: () => void;
  resolveUrl: (url: string) => string;
}

export const useEnvStore = create<EnvStore>()(
  persist(
    (set, get) => ({
      variables: [],

      addVariable: () =>
        set((state) => ({
          variables: [
            ...state.variables,
            { id: crypto.randomUUID(), key: "", value: "", enabled: true },
          ],
        })),

      updateVariable: (id, field, value) =>
        set((state) => ({
          variables: state.variables.map((v) =>
            v.id === id ? { ...v, [field]: value } : v,
          ),
        })),

      removeVariable: (id) =>
        set((state) => ({
          variables: state.variables.filter((v) => v.id !== id),
        })),

      clearVariables: () => set({ variables: [] }),

      resolveUrl: (url) => {
        const { variables } = get();
        return variables
          .filter((v) => v.enabled && v.key.trim())
          .reduce(
            (resolved, v) => resolved.replaceAll(`{{${v.key}}}`, v.value),
            url,
          );
      },
    }),
    { name: "api-tester-env" },
  ),
);
