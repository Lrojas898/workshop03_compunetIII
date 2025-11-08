/**
 * USERS ADAPTER
 *
 * Adapter para operaciones CRUD de usuarios.
 *
 * Endpoints (EJEMPLO - reemplazar con los reales):
 * - GET /api/users - Listar todos los usuarios
 * - GET /api/users/:id - Obtener usuario por ID
 * - POST /api/users - Crear nuevo usuario
 * - PUT /api/users/:id - Actualizar usuario
 * - DELETE /api/users/:id - Eliminar usuario
 */

import { IHttpClient } from '../domain/IHttpClient'

// ==================== TYPES ====================

export interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'RECEPTIONIST' | 'COACH' | 'CLIENT'
  phone?: string
  status: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateUserDTO {
  name: string
  email: string
  password: string
  role: 'ADMIN' | 'RECEPTIONIST' | 'COACH' | 'CLIENT'
  phone?: string
  status?: boolean
}

export interface UpdateUserDTO {
  name?: string
  email?: string
  password?: string
  role?: 'ADMIN' | 'RECEPTIONIST' | 'COACH' | 'CLIENT'
  phone?: string
  status?: boolean
}

export interface PaginatedUsersResponse {
  data: User[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
}

export interface UsersQueryParams {
  page?: number
  limit?: number
  search?: string
  role?: string
  status?: 'active' | 'inactive'
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// ==================== ADAPTER ====================

export class UsersAdapter {
  constructor(private readonly httpClient: IHttpClient) {}

  /**
   * Obtener lista de usuarios con paginación y filtros
   * @param params - Parámetros de consulta (página, límite, filtros, etc.)
   * @returns Lista paginada de usuarios
   */
  async getAllUsers(params?: UsersQueryParams): Promise<PaginatedUsersResponse> {
    try {
      // TODO: Reemplazar con tu endpoint real
      const response = await this.httpClient.get<PaginatedUsersResponse>(
        '/api/users',
        { params }
      )

      return response.data
    } catch (error) {
      throw new Error('Error al obtener la lista de usuarios.')
    }
  }

  /**
   * Obtener un usuario por ID
   * @param userId - ID del usuario
   * @returns Datos del usuario
   */
  async getUserById(userId: string): Promise<User> {
    try {
      // TODO: Reemplazar con tu endpoint real
      const response = await this.httpClient.get<User>(`/api/users/${userId}`)

      return response.data
    } catch (error) {
      throw new Error(`Error al obtener el usuario con ID ${userId}.`)
    }
  }

  /**
   * Crear un nuevo usuario
   * @param userData - Datos del usuario a crear
   * @returns Usuario creado
   */
  async createUser(userData: CreateUserDTO): Promise<User> {
    try {
      // TODO: Reemplazar con tu endpoint real
      const response = await this.httpClient.post<User>('/api/users', userData)

      return response.data
    } catch (error) {
      throw new Error('Error al crear el usuario.')
    }
  }

  /**
   * Actualizar un usuario existente
   * @param userId - ID del usuario a actualizar
   * @param userData - Datos a actualizar (parciales)
   * @returns Usuario actualizado
   */
  async updateUser(userId: string, userData: UpdateUserDTO): Promise<User> {
    try {
      // TODO: Reemplazar con tu endpoint real
      const response = await this.httpClient.put<User>(
        `/api/users/${userId}`,
        userData
      )

      return response.data
    } catch (error) {
      throw new Error(`Error al actualizar el usuario con ID ${userId}.`)
    }
  }

  /**
   * Eliminar un usuario
   * @param userId - ID del usuario a eliminar
   * @returns Confirmación de eliminación
   */
  async deleteUser(userId: string): Promise<{ message: string }> {
    try {
      // TODO: Reemplazar con tu endpoint real
      const response = await this.httpClient.delete<{ message: string }>(
        `/api/users/${userId}`
      )

      return response.data
    } catch (error) {
      throw new Error(`Error al eliminar el usuario con ID ${userId}.`)
    }
  }

  /**
   * Activar o desactivar un usuario (soft delete)
   * @param userId - ID del usuario
   * @param status - true para activar, false para desactivar
   * @returns Usuario actualizado
   */
  async toggleUserStatus(userId: string, status: boolean): Promise<User> {
    try {
      // TODO: Reemplazar con tu endpoint real
      const response = await this.httpClient.patch<User>(
        `/api/users/${userId}/status`,
        { status }
      )

      return response.data
    } catch (error) {
      throw new Error(`Error al cambiar el estado del usuario con ID ${userId}.`)
    }
  }

  /**
   * Obtener usuarios por rol
   * @param role - Rol a filtrar
   * @returns Lista de usuarios con ese rol
   */
  async getUsersByRole(role: User['role']): Promise<User[]> {
    try {
      // TODO: Reemplazar con tu endpoint real
      const response = await this.httpClient.get<User[]>('/api/users', {
        params: { role },
      })

      return response.data
    } catch (error) {
      throw new Error(`Error al obtener usuarios con rol ${role}.`)
    }
  }
}
