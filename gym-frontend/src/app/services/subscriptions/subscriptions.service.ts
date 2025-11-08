/**
 * SUBSCRIPTIONS SERVICE - Temple Gym API
 *
 * Servicio para operaciones de suscripciones de usuarios.
 *
 * Endpoints:
 * - POST /subscriptions - Crea suscripción vacía (admin, receptionist)
 * - POST /subscriptions/:id/memberships - Agrega membresía a suscripción (admin, receptionist)
 * - GET /subscriptions - Obtiene todas las suscripciones (solo admin)
 * - GET /subscriptions/:id - Obtiene suscripción por ID (admin, receptionist, client)
 * - GET /subscriptions/user/:userId - Obtiene suscripción de usuario (admin, receptionist)
 * - PATCH /subscriptions/:id - Actualiza suscripción (solo admin)
 * - PATCH /subscriptions/:id/activate - Activa suscripción (solo admin)
 * - PATCH /subscriptions/:id/deactivate - Desactiva suscripción (solo admin)
 * - DELETE /subscriptions/:id - Elimina suscripción soft delete (solo admin)
 */

import type {
  Subscription,
  CreateSubscriptionDto,
  AddMembershipDto,
  UpdateSubscriptionDto,
} from '@/app/interfaces/subscriptions.interface';
import apiService from '../api.service';
import { API_CONFIG } from '@/lib/configuration/api-endpoints';

const subscriptionsService = {
  /**
   * POST /subscriptions
   * Crea una suscripción vacía para un usuario
   */
  create: async (dto: CreateSubscriptionDto) => {
    const response = await apiService.post<Subscription>(
      API_CONFIG.ENDPOINTS.SUBSCRIPTIONS,
      dto
    );
    return response.data;
  },

  /**
   * POST /subscriptions/:id/memberships
   * Agrega una membresía a una suscripción existente
   */
  addMembership: async (subscriptionId: string, dto: AddMembershipDto) => {
    const response = await apiService.post<Subscription>(
      `${API_CONFIG.ENDPOINTS.SUBSCRIPTIONS}/${subscriptionId}/memberships`,
      dto
    );
    return response.data;
  },

  /**
   * GET /subscriptions
   * Obtiene todas las suscripciones del sistema
   */
  getAll: async () => {
    const subscriptions = await apiService.get<Subscription[]>(
      API_CONFIG.ENDPOINTS.SUBSCRIPTIONS
    );
    return subscriptions;
  },

  /**
   * GET /subscriptions/:id
   * Obtiene una suscripción por ID
   */
  getById: async (id: string) => {
    const subscription = await apiService.get<Subscription>(
      `${API_CONFIG.ENDPOINTS.SUBSCRIPTIONS}/${id}`
    );
    return subscription;
  },

  /**
   * GET /subscriptions/user/:userId
   * Obtiene la suscripción de un usuario específico
   */
  getByUserId: async (userId: string) => {
    const subscription = await apiService.get<Subscription>(
      `${API_CONFIG.ENDPOINTS.SUBSCRIPTIONS}/user/${userId}`
    );
    return subscription;
  },

  /**
   * PATCH /subscriptions/:id
   * Actualiza una suscripción
   */
  update: async (id: string, dto: UpdateSubscriptionDto) => {
    const response = await apiService.patch<Subscription>(
      `${API_CONFIG.ENDPOINTS.SUBSCRIPTIONS}/${id}`,
      dto
    );
    return response.data;
  },

  /**
   * PATCH /subscriptions/:id/activate
   * Activa una suscripción
   */
  activate: async (id: string) => {
    const response = await apiService.patch<Subscription>(
      `${API_CONFIG.ENDPOINTS.SUBSCRIPTIONS}/${id}/activate`
    );
    return response.data;
  },

  /**
   * PATCH /subscriptions/:id/deactivate
   * Desactiva una suscripción
   */
  deactivate: async (id: string) => {
    const response = await apiService.patch<Subscription>(
      `${API_CONFIG.ENDPOINTS.SUBSCRIPTIONS}/${id}/deactivate`
    );
    return response.data;
  },

  /**
   * DELETE /subscriptions/:id
   * Elimina una suscripción (soft delete)
   */
  delete: async (id: string) => {
    const response = await apiService.delete<Subscription>(
      `${API_CONFIG.ENDPOINTS.SUBSCRIPTIONS}/${id}`
    );
    return response.data;
  },
};

export default subscriptionsService;
