/**
 * AUTHENTICATION REACT QUERY HOOKS
 *
 * Hooks de React Query para autenticación y gestión de usuarios.
 * Usa el Authentication Service del patrón Service.
 *
 * Hooks disponibles:
 * - useUsers: Obtener todos los usuarios
 * - useUser: Obtener un usuario por ID
 * - useRegister: Registrar nuevo usuario
 * - useLogin: Iniciar sesión (para NextAuth)
 * - useUpdateUser: Actualizar usuario
 * - useDeleteUser: Eliminar usuario
 */

'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import authenticationService from '@/app/services/auth/authentication.service'
import type { RegisterDto, LoginDto, UpdateUserDto } from '@/app/interfaces/auth.interface'

// ==================== QUERY KEYS ====================

export const authQueryKeys = {
  all: ['auth'] as const,
  users: () => [...authQueryKeys.all, 'users'] as const,
  user: (id: string) => [...authQueryKeys.all, 'user', id] as const,
}

// ==================== QUERIES ====================

/**
 * Hook para obtener todos los usuarios
 * Solo disponible para admin
 *
 * @example
 * const { data: users, isLoading, error } = useUsers()
 */
export function useUsers() {
  return useQuery({
    queryKey: authQueryKeys.users(),
    queryFn: () => authenticationService.getAllUsers(),
  })
}

/**
 * Hook para obtener un usuario específico por ID
 * Solo disponible para admin
 *
 * @param userId - UUID del usuario
 * @example
 * const { data: user, isLoading } = useUser(userId)
 */
export function useUser(userId: string | undefined) {
  return useQuery({
    queryKey: userId ? authQueryKeys.user(userId) : ['auth', 'user', 'undefined'],
    queryFn: () => authenticationService.getUserById(userId!),
    enabled: !!userId, // Solo ejecutar si userId existe
  })
}

// ==================== MUTATIONS ====================

/**
 * Hook para registrar un nuevo usuario
 *
 * @example
 * const registerMutation = useRegister()
 *
 * const handleSubmit = async (data: RegisterDto) => {
 *   try {
 *     const result = await registerMutation.mutateAsync(data)
 *     console.log('Usuario registrado:', result.user)
 *     console.log('Token:', result.token)
 *   } catch (error) {
 *     console.error('Error al registrar:', error)
 *   }
 * }
 */
export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: RegisterDto) => authenticationService.register(dto),
    onSuccess: () => {
      // Invalidar la lista de usuarios para que se actualice
      queryClient.invalidateQueries({ queryKey: authQueryKeys.users() })
    },
  })
}

/**
 * Hook para login (principalmente para usar con NextAuth)
 *
 * @example
 * const loginMutation = useLogin()
 *
 * const handleLogin = async (credentials: LoginDto) => {
 *   try {
 *     const result = await loginMutation.mutateAsync(credentials)
 *     // Guardar token o usar NextAuth signIn
 *     console.log('Login exitoso:', result.user)
 *   } catch (error) {
 *     console.error('Error al iniciar sesión:', error)
 *   }
 * }
 */
export function useLogin() {
  return useMutation({
    mutationFn: (dto: LoginDto) => authenticationService.login(dto),
  })
}

/**
 * Hook para actualizar un usuario
 *
 * @example
 * const updateMutation = useUpdateUser()
 *
 * const handleUpdate = async (userId: string, data: UpdateUserDto) => {
 *   try {
 *     const updated = await updateMutation.mutateAsync({ userId, data })
 *     console.log('Usuario actualizado:', updated)
 *   } catch (error) {
 *     console.error('Error al actualizar:', error)
 *   }
 * }
 */
export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserDto }) =>
      authenticationService.updateUser(userId, data),
    onSuccess: (updatedUser) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: authQueryKeys.users() })
      queryClient.invalidateQueries({ queryKey: authQueryKeys.user(updatedUser.id) })
    },
  })
}

/**
 * Hook para eliminar un usuario
 * Solo disponible para admin
 *
 * @example
 * const deleteMutation = useDeleteUser()
 *
 * const handleDelete = async (userId: string) => {
 *   if (confirm('¿Estás seguro de eliminar este usuario?')) {
 *     try {
 *       await deleteMutation.mutateAsync(userId)
 *       console.log('Usuario eliminado')
 *     } catch (error) {
 *       console.error('Error al eliminar:', error)
 *     }
 *   }
 * }
 */
export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => authenticationService.deleteUser(userId),
    onSuccess: () => {
      // Invalidar la lista de usuarios
      queryClient.invalidateQueries({ queryKey: authQueryKeys.users() })
    },
  })
}
