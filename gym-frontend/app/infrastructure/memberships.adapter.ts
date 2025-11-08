/**
 * MEMBERSHIPS ADAPTER
 *
 * Adapter para operaciones CRUD de membresías (planes).
 *
 * Endpoints (EJEMPLO - reemplazar con los reales):
 * - GET /api/memberships - Listar todas las membresías
 * - GET /api/memberships/:id - Obtener membresía por ID
 * - POST /api/memberships - Crear nueva membresía
 * - PUT /api/memberships/:id - Actualizar membresía
 * - DELETE /api/memberships/:id - Eliminar membresía
 */

import { IHttpClient } from '../domain/IHttpClient'

// ==================== TYPES ====================

export interface Membership {
  id: string
  name: string
  description?: string
  price: number
  durationInDays: number
  benefits?: string[]
  status: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateMembershipDTO {
  name: string
  description?: string
  price: number
  durationInDays: number
  benefits?: string[]
  status?: boolean
}

export interface UpdateMembershipDTO {
  name?: string
  description?: string
  price?: number
  durationInDays?: number
  benefits?: string[]
  status?: boolean
}

export interface PaginatedMembershipsResponse {
  data: Membership[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
}

export interface MembershipsQueryParams {
  page?: number
  limit?: number
  search?: string
  status?: 'active' | 'inactive'
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// ==================== ADAPTER ====================

export class MembershipsAdapter {
  constructor(private readonly httpClient: IHttpClient) {}

  /**
   * Obtener lista de membresías con paginación y filtros
   * @param params - Parámetros de consulta
   * @returns Lista paginada de membresías
   */
  async getAllMemberships(params?: MembershipsQueryParams): Promise<PaginatedMembershipsResponse> {
    try {
      // TODO: Reemplazar con tu endpoint real
      const response = await this.httpClient.get<PaginatedMembershipsResponse>(
        '/api/memberships',
        { params }
      )

      return response.data
    } catch (error) {
      throw new Error('Error al obtener la lista de membresías.')
    }
  }

  /**
   * Obtener una membresía por ID
   * @param membershipId - ID de la membresía
   * @returns Datos de la membresía
   */
  async getMembershipById(membershipId: string): Promise<Membership> {
    try {
      // TODO: Reemplazar con tu endpoint real
      const response = await this.httpClient.get<Membership>(
        `/api/memberships/${membershipId}`
      )

      return response.data
    } catch (error) {
      throw new Error(`Error al obtener la membresía con ID ${membershipId}.`)
    }
  }

  /**
   * Crear una nueva membresía
   * @param membershipData - Datos de la membresía a crear
   * @returns Membresía creada
   */
  async createMembership(membershipData: CreateMembershipDTO): Promise<Membership> {
    try {
      // TODO: Reemplazar con tu endpoint real
      const response = await this.httpClient.post<Membership>(
        '/api/memberships',
        membershipData
      )

      return response.data
    } catch (error) {
      throw new Error('Error al crear la membresía.')
    }
  }

  /**
   * Actualizar una membresía existente
   * @param membershipId - ID de la membresía a actualizar
   * @param membershipData - Datos a actualizar
   * @returns Membresía actualizada
   */
  async updateMembership(
    membershipId: string,
    membershipData: UpdateMembershipDTO
  ): Promise<Membership> {
    try {
      // TODO: Reemplazar con tu endpoint real
      const response = await this.httpClient.put<Membership>(
        `/api/memberships/${membershipId}`,
        membershipData
      )

      return response.data
    } catch (error) {
      throw new Error(`Error al actualizar la membresía con ID ${membershipId}.`)
    }
  }

  /**
   * Eliminar una membresía
   * @param membershipId - ID de la membresía a eliminar
   * @returns Confirmación de eliminación
   */
  async deleteMembership(membershipId: string): Promise<{ message: string }> {
    try {
      // TODO: Reemplazar con tu endpoint real
      const response = await this.httpClient.delete<{ message: string }>(
        `/api/memberships/${membershipId}`
      )

      return response.data
    } catch (error) {
      throw new Error(`Error al eliminar la membresía con ID ${membershipId}.`)
    }
  }

  /**
   * Activar o desactivar una membresía
   * @param membershipId - ID de la membresía
   * @param status - true para activar, false para desactivar
   * @returns Membresía actualizada
   */
  async toggleMembershipStatus(membershipId: string, status: boolean): Promise<Membership> {
    try {
      // TODO: Reemplazar con tu endpoint real
      const response = await this.httpClient.patch<Membership>(
        `/api/memberships/${membershipId}/status`,
        { status }
      )

      return response.data
    } catch (error) {
      throw new Error(`Error al cambiar el estado de la membresía con ID ${membershipId}.`)
    }
  }

  /**
   * Obtener solo membresías activas
   * @returns Lista de membresías activas
   */
  async getActiveMemberships(): Promise<Membership[]> {
    try {
      // TODO: Reemplazar con tu endpoint real
      const response = await this.httpClient.get<Membership[]>('/api/memberships', {
        params: { status: 'active' },
      })

      return response.data
    } catch (error) {
      throw new Error('Error al obtener membresías activas.')
    }
  }
}
