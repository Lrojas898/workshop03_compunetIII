/**
 * API ENDPOINTS CONFIGURATION
 *
 * Configuración centralizada de todos los endpoints del backend Temple Gym API.
 * Base URL: http://localhost:3000 (configurable via env)
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  TIMEOUT: 30000, // 30 segundos

  ENDPOINTS: {
    // ==================== AUTH ====================
    AUTH: '/auth',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',

    // ==================== MEMBERSHIPS ====================
    MEMBERSHIPS: '/memberships',
    MEMBERSHIP_BY_ID: (id: string) => `/memberships/${id}`,
    TOGGLE_MEMBERSHIP_STATUS: (id: string) => `/memberships/${id}/toggle-status`,

    // ==================== SUBSCRIPTIONS ====================
    SUBSCRIPTIONS: '/subscriptions',
    SUBSCRIPTION_BY_ID: (id: string) => `/subscriptions/${id}`,
    SUBSCRIPTION_BY_USER: (userId: string) => `/subscriptions/user/${userId}`,
    SUBSCRIPTION_MEMBERSHIPS: (id: string) => `/subscriptions/${id}/memberships`,
    SUBSCRIPTION_ACTIVATE: (id: string) => `/subscriptions/${id}/activate`,
    SUBSCRIPTION_DEACTIVATE: (id: string) => `/subscriptions/${id}/deactivate`,

    // ==================== ATTENDANCES ====================
    ATTENDANCES: '/attendances',
    CHECK_IN: '/attendances/check-in',
    CHECK_OUT: '/attendances/check-out',
    ATTENDANCE_STATUS: (userId: string) => `/attendances/status/${userId}`,
    ATTENDANCE_HISTORY: (userId: string) => `/attendances/history/${userId}`,
    ATTENDANCE_STATS: (userId: string) => `/attendances/stats/${userId}`,
    ACTIVE_ATTENDANCES: '/attendances/active',

    // ==================== SEED (Development) ====================
    SEED: '/seed',
  },
} as const

/**
 * Enums del sistema (deben coincidir con el backend)
 */
export enum ValidRoles {
  ADMIN = 'admin',
  COACH = 'coach',
  CLIENT = 'client',
  RECEPTIONIST = 'receptionist',
}

export enum AttendanceType {
  GYM = 'gym',
  CLASS = 'class',
}
