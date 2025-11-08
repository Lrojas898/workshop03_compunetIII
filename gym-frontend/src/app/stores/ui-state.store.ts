/**
 * UI STATE STORE
 *
 * Store de Zustand para estado global de UI.
 *
 * Estado:
 * - Sidebar collapsed/expanded
 * - Theme preference
 * - Loading states
 * - Modal states
 */

// TODO: Implementar store con Zustand
// import { create } from 'zustand'
// import { persist } from 'zustand/middleware'

// interface UIState {
//   isSidebarCollapsed: boolean
//   toggleSidebar: () => void
//   theme: 'light' | 'dark' | 'system'
//   setTheme: (theme: 'light' | 'dark' | 'system') => void
// }

// export const useUIStore = create<UIState>()(
//   persist(
//     (set) => ({
//       isSidebarCollapsed: false,
//       toggleSidebar: () =>
//         set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
//       theme: 'system',
//       setTheme: (theme) => set({ theme }),
//     }),
//     {
//       name: 'ui-state',
//     }
//   )
// )

export const useUIStore = () => ({
  isSidebarCollapsed: false,
  toggleSidebar: () => {},
  theme: 'light',
  setTheme: (theme: string) => {},
})
