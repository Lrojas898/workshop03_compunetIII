/**
 * GENERIC CRUD HOOK
 *
 * Hook genérico reutilizable para operaciones CRUD en cualquier entidad.
 * Reduce duplicación de código en hooks específicos.
 *
 * Uso:
 * const userCRUD = useGenericCRUD<User>('users', '/api/users')
 * const { data, isLoading } = userCRUD.useList()
 * const createMutation = userCRUD.useCreate()
 */

'use client'

// TODO: Implementar hook genérico de CRUD
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import { apiClient } from '@/lib/api-client/axios-instance'

// export function useGenericCRUD<T>(
//   entityName: string,
//   baseEndpoint: string
// ) {
//   const queryClient = useQueryClient()

//   return {
//     useList: (params?: any) =>
//       useQuery({
//         queryKey: [entityName, params],
//         queryFn: async () => {
//           const response = await apiClient.get(baseEndpoint, { params })
//           return response.data
//         },
//       }),

//     useOne: (id: string) =>
//       useQuery({
//         queryKey: [entityName, id],
//         queryFn: async () => {
//           const response = await apiClient.get(`${baseEndpoint}/${id}`)
//           return response.data
//         },
//         enabled: !!id,
//       }),

//     useCreate: () =>
//       useMutation({
//         mutationFn: async (data: Partial<T>) => {
//           const response = await apiClient.post(baseEndpoint, data)
//           return response.data
//         },
//         onSuccess: () => {
//           queryClient.invalidateQueries({ queryKey: [entityName] })
//         },
//       }),

//     useUpdate: () =>
//       useMutation({
//         mutationFn: async ({ id, data }: { id: string; data: Partial<T> }) => {
//           const response = await apiClient.put(`${baseEndpoint}/${id}`, data)
//           return response.data
//         },
//         onSuccess: () => {
//           queryClient.invalidateQueries({ queryKey: [entityName] })
//         },
//       }),

//     useDelete: () =>
//       useMutation({
//         mutationFn: async (id: string) => {
//           const response = await apiClient.delete(`${baseEndpoint}/${id}`)
//           return response.data
//         },
//         onSuccess: () => {
//           queryClient.invalidateQueries({ queryKey: [entityName] })
//         },
//       }),
//   }
// }

export function useGenericCRUD<T>(entityName: string, baseEndpoint: string) {
  return {
    useList: () => ({}),
    useOne: (id: string) => ({}),
    useCreate: () => ({}),
    useUpdate: () => ({}),
    useDelete: () => ({}),
  }
}
