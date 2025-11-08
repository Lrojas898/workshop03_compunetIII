/**
 * APPLICATION CONSTANTS
 *
 * Constantes globales de la aplicación.
 *
 * Incluye:
 * - Roles de usuario
 * - Estados de entidades
 * - Valores por defecto
 * - Configuración de UI
 */

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  RECEPTIONIST: 'RECEPTIONIST',
  COACH: 'COACH',
  CLIENT: 'CLIENT',
} as const

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
} as const

export const ATTENDANCE_STATUS = {
  CHECKED_IN: 'CHECKED_IN',
  CHECKED_OUT: 'CHECKED_OUT',
} as const

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const

export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  DATETIME: 'MMM dd, yyyy HH:mm',
} as const

export const APP_NAME = 'Gym Management System'
export const APP_VERSION = '1.0.0'
