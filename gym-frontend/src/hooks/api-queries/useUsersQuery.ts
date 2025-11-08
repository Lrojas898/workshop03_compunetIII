/**
 * USERS HOOKS
 *
 * React Query hooks para gestión de usuarios.
 *
 * Hooks:
 * - useUsers: Obtener lista de usuarios (con paginación y filtros)
 * - useUser: Obtener un usuario por ID
 * - useCreateUser: Crear nuevo usuario
 * - useUpdateUser: Actualizar usuario existente
 * - useDeleteUser: Eliminar usuario
 */

'use client'

// TODO: Implementar hooks de usuarios con React Query
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import { apiClient } from '@/lib/api-client/axios-instance'
// import { API_ENDPOINTS } from '@/lib/api-client/endpoint-urls'
// import { User, PaginationParams, FilterParams } from '@/lib/typescript-types'

// export function useUsers(params?: PaginationParams & FilterParams) {
//   return useQuery({
//     queryKey: ['users', params],
//     queryFn: async () => {
//       const response = await apiClient.get(API_ENDPOINTS.users.base, { params })
//       return response.data
//     },
//   })
// }

// export function useUser(id: string) {
//   return useQuery({
//     queryKey: ['user', id],
//     queryFn: async () => {
//       const response = await apiClient.get(API_ENDPOINTS.users.byId(id))
//       return response.data
//     },
//     enabled: !!id,
//   })
// }

// export function useCreateUser() {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: async (userData: Partial<User>) => {
//       const response = await apiClient.post(API_ENDPOINTS.users.create, userData)
//       return response.data
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['users'] })
//     },
//   })
// }

export const useUsers = () => ({})
export const useUser = (id: string) => ({})
export const useCreateUser = () => ({})
export const useUpdateUser = () => ({})
export const useDeleteUser = () => ({})
