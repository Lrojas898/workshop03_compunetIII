/**
 * SUBSCRIPTIONS ADAPTER
 *
 * Adapter para operaciones de suscripciones de usuarios.
 *
 * Endpoints (EJEMPLO - reemplazar con los reales):
 * - GET /api/subscriptions - Listar todas las suscripciones
 * - GET /api/subscriptions/:id - Obtener suscripción por ID
 * - GET /api/subscriptions/user/:userId - Obtener suscripciones de un usuario
 * - POST /api/subscriptions - Crear nueva suscripción
 * - PUT /api/subscriptions/:id - Actualizar suscripción
 * - DELETE /api/subscriptions/:id - Cancelar suscripción
 * - POST /api/subscriptions/:id/memberships - Agregar membresía a suscripción
 */

import { IHttpClient } from '../domain/IHttpClient'
import { User } from './users.adapter'
import { Membership } from './memberships.adapter'

// ==================== TYPES ====================

export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED'

export interface Subscription {
  id: string
  userId: string
  user?: User
  memberships: Membership[]
  startDate: string
  endDate: string
  status: SubscriptionStatus
  paymentMethod?: string
  createdAt: string
  updatedAt: string
}

export interface CreateSubscriptionDTO {
  userId: string
  membershipIds: string[]
  startDate: string
  paymentMethod?: string
}

export interface UpdateSubscriptionDTO {
  membershipIds?: string[]
  endDate?: string
  status?: SubscriptionStatus
  paymentMethod?: string
}

export interface PaginatedSubscriptionsResponse {
  data: Subscription[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
}

export interface SubscriptionsQueryParams {
  page?: number
  limit?: number
  userId?: string
  status?: SubscriptionStatus
  startDate?: string
  endDate?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// ==================== ADAPTER ====================

export class SubscriptionsAdapter {
  constructor(private readonly httpClient: IHttpClient) {}

  /**
   * Obtener lista de suscripciones con paginación y filtros
   * @param params - Parámetros de consulta
   * @returns Lista paginada de suscripciones
   */
  async getAllSubscriptions(params?: SubscriptionsQueryParams): Promise<PaginatedSubscriptionsResponse> {
    try {
      // TODO: Reemplazar con tu endpoint real
      const response = await this.httpClient.get<PaginatedSubscriptionsResponse>(
        '/api/subscriptions',
        { params }
      )

      return response.data
    } catch (error) {
      throw new Error('Error al obtener la lista de suscripciones.')
    }
  }

  /**
   * Obtener una suscripción por ID
   * @param subscriptionId - ID de la suscripción
   * @returns Datos de la suscripción
   */
  async getSubscriptionById(subscriptionId: string): Promise<Subscription> {
    try {
      // TODO: Reemplazar con tu endpoint real
      const response = await this.httpClient.get<Subscription>(
        `/api/subscriptions/${subscriptionId}`
      )

      return response.data
    } catch (error) {
      throw new Error(`Error al obtener la suscripción con ID ${subscriptionId}.`)
    }
  }

  /**
   * Obtener suscripciones de un usuario específico
   * @param userId - ID del usuario
   * @returns Lista de suscripciones del usuario
   */
  async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    try {
      // TODO: Reemplazar con tu endpoint real
      const response = await this.httpClient.get<Subscription[]>(
        `/api/subscriptions/user/${userId}`
      )

      return response.data
    } catch (error) {
      throw new Error(`Error al obtener suscripciones del usuario con ID ${userId}.`)
    }
  }

  /**
   * Obtener suscripción activa de un usuario
   * @param userId - ID del usuario
   * @returns Suscripción activa o null
   */
  async getActiveUserSubscription(userId: string): Promise<Subscription | null> {
    try {
      // TODO: Reemplazar con tu endpoint real
      const response = await this.httpClient.get<Subscription>(
        `/api/subscriptions/user/${userId}/active`
      )

      return response.data
    } catch (error) {
      // Si no hay suscripción activa, retornar null
      return null
    }
  }

  /**
   * Crear una nueva suscripción
   * @param subscriptionData - Datos de la suscripción
   * @returns Suscripción creada
   */
  async createSubscription(subscriptionData: CreateSubscriptionDTO): Promise<Subscription> {
    try {
      // TODO: Reemplazar con tu endpoint real
      const response = await this.httpClient.post<Subscription>(
        '/api/subscriptions',
        subscriptionData
      )

      return response.data
    } catch (error) {
      throw new Error('Error al crear la suscripción.')
    }
  }

  /**
   * Actualizar una suscripción existente
   * @param subscriptionId - ID de la suscripción
   * @param subscriptionData - Datos a actualizar
   * @returns Suscripción actualizada
   */
  async updateSubscription(
    subscriptionId: string,
    subscriptionData: UpdateSubscriptionDTO
  ): Promise<Subscription> {
    try {
      // TODO: Reemplazar con tu endpoint real
      const response = await this.httpClient.put<Subscription>(
        `/api/subscriptions/${subscriptionId}`,
        subscriptionData
      )

      return response.data
    } catch (error) {
      throw new Error(`Error al actualizar la suscripción con ID ${subscriptionId}.`)
    }
  }

  /**
   * Cancelar una suscripción
   * @param subscriptionId - ID de la suscripción
   * @returns Suscripción cancelada
   */
  async cancelSubscription(subscriptionId: string): Promise<Subscription> {
    try {
      // TODO: Reemplazar con tu endpoint real
      const response = await this.httpClient.patch<Subscription>(
        `/api/subscriptions/${subscriptionId}/cancel`,
        {}
      )

      return response.data
    } catch (error) {
      throw new Error(`Error al cancelar la suscripción con ID ${subscriptionId}.`)
    }
  }

  /**
   * Agregar una membresía a una suscripción existente
   * @param subscriptionId - ID de la suscripción
   * @param membershipId - ID de la membresía a agregar
   * @returns Suscripción actualizada
   */
  async addMembershipToSubscription(
    subscriptionId: string,
    membershipId: string
  ): Promise<Subscription> {
    try {
      // TODO: Reemplazar con tu endpoint real
      const response = await this.httpClient.post<Subscription>(
        `/api/subscriptions/${subscriptionId}/memberships`,
        { membershipId }
      )

      return response.data
    } catch (error) {
      throw new Error(`Error al agregar membresía a la suscripción con ID ${subscriptionId}.`)
    }
  }

  /**
   * Renovar una suscripción
   * @param subscriptionId - ID de la suscripción
   * @param durationInDays - Duración de la renovación en días
   * @returns Suscripción renovada
   */
  async renewSubscription(
    subscriptionId: string,
    durationInDays: number
  ): Promise<Subscription> {
    try {
      // TODO: Reemplazar con tu endpoint real
      const response = await this.httpClient.post<Subscription>(
        `/api/subscriptions/${subscriptionId}/renew`,
        { durationInDays }
      )

      return response.data
    } catch (error) {
      throw new Error(`Error al renovar la suscripción con ID ${subscriptionId}.`)
    }
  }

  /**
   * Obtener suscripciones próximas a vencer
   * @param daysThreshold - Días de anticipación (default: 7)
   * @returns Lista de suscripciones próximas a vencer
   */
  async getExpiringSubscriptions(daysThreshold: number = 7): Promise<Subscription[]> {
    try {
      // TODO: Reemplazar con tu endpoint real
      const response = await this.httpClient.get<Subscription[]>(
        '/api/subscriptions/expiring',
        { params: { days: daysThreshold } }
      )

      return response.data
    } catch (error) {
      throw new Error('Error al obtener suscripciones próximas a vencer.')
    }
  }
}
