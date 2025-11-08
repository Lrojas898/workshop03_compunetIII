/**
 * TABLE FILTERS STORE
 *
 * Store de Zustand para mantener estado de filtros de tablas.
 * Útil para persistir filtros entre navegación.
 */

// TODO: Implementar store de filtros con Zustand
// import { create } from 'zustand'

// interface FiltersState {
//   filters: Record<string, any>
//   setFilter: (table: string, filters: any) => void
//   clearFilter: (table: string) => void
//   clearAllFilters: () => void
// }

// export const useFiltersStore = create<FiltersState>((set) => ({
//   filters: {},
//   setFilter: (table, filters) =>
//     set((state) => ({
//       filters: { ...state.filters, [table]: filters },
//     })),
//   clearFilter: (table) =>
//     set((state) => {
//       const newFilters = { ...state.filters }
//       delete newFilters[table]
//       return { filters: newFilters }
//     }),
//   clearAllFilters: () => set({ filters: {} }),
// }))

export const useFiltersStore = () => ({
  filters: {},
  setFilter: (table: string, filters: any) => {},
  clearFilter: (table: string) => {},
  clearAllFilters: () => {},
})
