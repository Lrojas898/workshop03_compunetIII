/**
 * DATA TABLE CONFIGURATIONS
 *
 * Configuraciones específicas para cada tabla de datos.
 * Define comportamiento por defecto de paginación, ordenamiento, filtros, etc.
 */

export interface TableConfig {
  defaultPageSize: number
  pageSizeOptions: number[]
  defaultSortBy?: string
  defaultSortOrder?: 'asc' | 'desc'
  searchPlaceholder: string
  enableSearch: boolean
  enableFilters: boolean
  enableExport: boolean
}

export const tableConfigs: Record<string, TableConfig> = {
  users: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 20, 50, 100],
    defaultSortBy: 'createdAt',
    defaultSortOrder: 'desc',
    searchPlaceholder: 'Search users by name or email...',
    enableSearch: true,
    enableFilters: true,
    enableExport: true,
  },

  memberships: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 20, 50],
    defaultSortBy: 'name',
    defaultSortOrder: 'asc',
    searchPlaceholder: 'Search memberships...',
    enableSearch: true,
    enableFilters: true,
    enableExport: false,
  },

  subscriptions: {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
    defaultSortBy: 'startDate',
    defaultSortOrder: 'desc',
    searchPlaceholder: 'Search subscriptions by user...',
    enableSearch: true,
    enableFilters: true,
    enableExport: true,
  },

  attendances: {
    defaultPageSize: 50,
    pageSizeOptions: [25, 50, 100],
    defaultSortBy: 'checkInTime',
    defaultSortOrder: 'desc',
    searchPlaceholder: 'Search attendance records...',
    enableSearch: true,
    enableFilters: true,
    enableExport: true,
  },
}

/**
 * Obtiene la configuración de tabla para una entidad
 */
export function getTableConfig(entityName: string): TableConfig {
  return (
    tableConfigs[entityName] || {
      defaultPageSize: 10,
      pageSizeOptions: [10, 20, 50],
      searchPlaceholder: 'Search...',
      enableSearch: true,
      enableFilters: false,
      enableExport: false,
    }
  )
}
