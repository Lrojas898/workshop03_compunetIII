/**
 * AUTHENTICATION HOOKS
 *
 * React Query hooks para autenticación.
 *
 * Hooks:
 * - useLogin: Iniciar sesión
 * - useRegister: Registrar nuevo usuario
 * - useLogout: Cerrar sesión
 * - useCurrentUser: Obtener usuario actual
 */

'use client'

// TODO: Implementar hooks de autenticación con React Query
// import { useMutation, useQuery } from '@tanstack/react-query'
// import { apiClient } from '@/lib/api-client/axios-instance'
// import { API_ENDPOINTS } from '@/lib/api-client/endpoint-urls'

// export function useLogin() {
//   return useMutation({
//     mutationFn: async (credentials: LoginCredentials) => {
//       const response = await apiClient.post(API_ENDPOINTS.auth.login, credentials)
//       return response.data
//     },
//   })
// }

// export function useCurrentUser() {
//   return useQuery({
//     queryKey: ['currentUser'],
//     queryFn: async () => {
//       const response = await apiClient.get(API_ENDPOINTS.auth.me)
//       return response.data
//     },
//   })
// }

export function useLogin() {
  return {}
}

export function useRegister() {
  return {}
}

export function useLogout() {
  return {}
}

export function useCurrentUser() {
  return {}
}
