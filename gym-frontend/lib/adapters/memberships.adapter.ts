/**
 * MEMBERSHIPS ADAPTER - Temple Gym API
 *
 * Adapter para operaciones CRUD de membresías (planes).
 *
 * Endpoints:
 * - GET /memberships - Obtiene todas las membresías (admin, receptionist)
 * - GET /memberships/:id - Obtiene membresía por ID (admin, receptionist, coach)
 * - POST /memberships - Crea nueva membresía (solo admin)
 * - PUT /memberships/:id - Actualiza membresía (solo admin)
 * - PATCH /memberships/:id/toggle-status - Activa/desactiva membresía (solo admin)
 * - DELETE /memberships/:id - Elimina membresía (solo admin)
 */

import { getHttpClient } from '@/app/infrastructure/axios-http-client'
import { API_CONFIG } from '@/lib/configuration/api-endpoints'

// ==================== TYPES ====================

export interface Membership {
  id: string
  name: string
  cost: number
  status: boolean
  max_classes_assistance: number
  max_gym_assistance: number
  duration_months: 1 | 12
  created_at: string
  updated_at: string
}

// ==================== DTOs ====================

/**
 * DTO para crear membresía
 * Coincide con CreateMembershipDto del backend
 */
export interface CreateMembershipDto {
  name: string                   // @IsString() @IsNotEmpty()
  cost: number                   // @IsNumber() @Min(0)
  max_classes_assistance: number // @IsInt() @Min(0)
  max_gym_assistance: number     // @IsInt() @Min(0)
  duration_months: 1 | 12        // @IsInt() @IsIn([1, 12])
  status?: boolean               // @IsBoolean() @IsOptional() (default: true)
}

/**
 * DTO para actualizar membresía
 * Coincide con UpdateMembershipDto del backend (PartialType)
 */
export interface UpdateMembershipDto {
  name?: string
  cost?: number
  max_classes_assistance?: number
  max_gym_assistance?: number
  duration_months?: 1 | 12
  status?: boolean
}

// ==================== ADAPTER ====================

export class MembershipsAdapter {
  private httpClient = getHttpClient()

  /**
   * GET /memberships
   * Obtiene todas las membresías
   *
   * @returns Array de membresías
   * @throws Error si no tiene permisos (admin, receptionist)
   *
   * @example
   * const memberships = await membershipsAdapter.getAll()
   */
  async getAll(): Promise<Membership[]> {
    const response = await this.httpClient.get<Membership[]>(
      API_CONFIG.ENDPOINTS.MEMBERSHIPS
    )
    return response.data
  }

  /**
   * GET /memberships/:id
   * Obtiene una membresía por ID
   *
   * @param id - UUID de la membresía
   * @returns Membresía encontrada
   * @throws Error si no existe o no tiene permisos
   *
   * @example
   * const membership = await membershipsAdapter.getById("membership-id")
   */
  async getById(id: string): Promise<Membership> {
    const response = await this.httpClient.get<Membership>(
      `${API_CONFIG.ENDPOINTS.MEMBERSHIPS}/${id}`
    )
    return response.data
  }

  /**
   * POST /memberships
   * Crea una nueva membresía
   *
   * @param dto - Datos de la membresía
   * @returns Membresía creada
   * @throws Error si datos inválidos o ya existe
   *
   * @example
   * const created = await membershipsAdapter.create({
   *   name: "Premium Monthly",
   *   cost: 80.00,
   *   max_classes_assistance: 20,
   *   max_gym_assistance: 30,
   *   duration_months: 1,
   *   status: true
   * })
   */
  async create(dto: CreateMembershipDto): Promise<Membership> {
    const response = await this.httpClient.post<Membership>(
      API_CONFIG.ENDPOINTS.MEMBERSHIPS,
      dto
    )
    return response.data
  }

  /**
   * PUT /memberships/:id
   * Actualiza una membresía existente
   *
   * @param id - UUID de la membresía
   * @param dto - Datos a actualizar
   * @returns Membresía actualizada
   * @throws Error si no existe o datos inválidos
   *
   * @example
   * const updated = await membershipsAdapter.update("membership-id", {
   *   cost: 90.00,
   *   max_classes_assistance: 25
   * })
   */
  async update(id: string, dto: UpdateMembershipDto): Promise<Membership> {
    const response = await this.httpClient.put<Membership>(
      `${API_CONFIG.ENDPOINTS.MEMBERSHIPS}/${id}`,
      dto
    )
    return response.data
  }

  /**
   * PATCH /memberships/:id/toggle-status
   * Activa o desactiva una membresía
   *
   * @param id - UUID de la membresía
   * @returns Membresía con estado actualizado
   * @throws Error si no existe
   *
   * @example
   * const toggled = await membershipsAdapter.toggleStatus("membership-id")
   */
  async toggleStatus(id: string): Promise<Membership> {
    const response = await this.httpClient.patch<Membership>(
      `${API_CONFIG.ENDPOINTS.MEMBERSHIPS}/${id}/toggle-status`
    )
    return response.data
  }

  /**
   * DELETE /memberships/:id
   * Elimina una membresía
   *
   * @param id - UUID de la membresía
   * @returns Mensaje de confirmación
   * @throws Error si no existe
   *
   * @example
   * const result = await membershipsAdapter.delete("membership-id")
   */
  async delete(id: string): Promise<{ message: string }> {
    const response = await this.httpClient.delete<{ message: string }>(
      `${API_CONFIG.ENDPOINTS.MEMBERSHIPS}/${id}`
    )
    return response.data
  }
}

// Exportar instancia singleton
export const membershipsAdapter = new MembershipsAdapter()
