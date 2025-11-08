/**
 * API ENDPOINT URLS
 *
 * Definición centralizada de todas las URLs de los endpoints del backend.
 * Facilita el mantenimiento y evita strings hardcodeados.
 *
 * Estructura:
 * - auth: /auth/*
 * - users: /users/*
 * - memberships: /memberships/*
 * - subscriptions: /subscriptions/*
 * - attendances: /attendances/*
 */

export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
    refreshToken: '/auth/refresh',
  },

  // Users
  users: {
    base: '/users',
    byId: (id: string) => `/users/${id}`,
    create: '/users',
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
  },

  // Memberships
  memberships: {
    base: '/memberships',
    byId: (id: string) => `/memberships/${id}`,
    create: '/memberships',
    update: (id: string) => `/memberships/${id}`,
    delete: (id: string) => `/memberships/${id}`,
  },

  // Subscriptions
  subscriptions: {
    base: '/subscriptions',
    byId: (id: string) => `/subscriptions/${id}`,
    byUserId: (userId: string) => `/subscriptions/user/${userId}`,
    create: '/subscriptions',
    update: (id: string) => `/subscriptions/${id}`,
    cancel: (id: string) => `/subscriptions/${id}/cancel`,
    addMembership: (id: string) => `/subscriptions/${id}/memberships`,
  },

  // Attendances
  attendances: {
    base: '/attendances',
    byId: (id: string) => `/attendances/${id}`,
    byUserId: (userId: string) => `/attendances/user/${userId}`,
    checkIn: '/attendances/check-in',
    checkOut: (id: string) => `/attendances/${id}/check-out`,
    active: '/attendances/active',
  },
} as const
