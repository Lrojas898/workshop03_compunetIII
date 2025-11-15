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
  SubscriptionItem,
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
   * Body: { userId: string }
   */
  create: async (userId: string) => {
    const response = await apiService.post<Subscription>(
      API_CONFIG.ENDPOINTS.SUBSCRIPTIONS,
      { userId }
    );
    return response.data;
  },

  /**
   * POST /subscriptions/:id/memberships
   * Agrega una membresía a una suscripción existente
   * Retorna el SubscriptionItem creado
   */
  addMembership: async (subscriptionId: string, dto: AddMembershipDto) => {
    const response = await apiService.post<SubscriptionItem>(
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
        console.log('[Debug] Entrando en getByUserId con userId:', userId);
    console.log('[Debug] Inspeccionando API_CONFIG:', API_CONFIG);

       // Verifiquemos si el endpoint existe antes de usarlo
    if (!API_CONFIG || !API_CONFIG.ENDPOINTS || !API_CONFIG.ENDPOINTS.SUBSCRIPTIONS) {
        console.error('[Error Fatal] La configuración de endpoints para SUBSCRIPTIONS no está definida.');
        // Lanzamos un error claro para saber exactamente qué falló
        throw new Error('API endpoint configuration for SUBSCRIPTIONS is missing.');
    }
     const endpointUrl = `${API_CONFIG.ENDPOINTS.SUBSCRIPTIONS}/user/${userId}`;
    console.log('[Debug] URL construida:', endpointUrl);

    console.log(`[debug] ${API_CONFIG.ENDPOINTS.SUBSCRIPTIONS}/user/${userId}`)
    
    const subscription = await apiService.get<Subscription>(endpointUrl);

    console.log('se crea la sub?',subscription)
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

  // ==================== CLIENT HELPERS ====================

  /**
   * Helper para clientes: Agregar membresías a la suscripción existente del usuario
   * NOTA: Cada usuario YA TIENE una suscripción creada al registrarse
   * Flujo: 1) Obtener suscripción del usuario, 2) Agregar cada membresía
   */
  addMembershipsToUserSubscription: async (userId: string, membershipIds: string[]) => {
    // 1. Obtener la suscripción existente del usuario
    const subscription = await subscriptionsService.getByUserId(userId);

    // 2. Agregar cada membresía a la suscripción
    for (const membershipId of membershipIds) {
      await subscriptionsService.addMembership(subscription.id, { membershipId });
    }

    // 3. Retornar la suscripción actualizada
    return subscriptionsService.getByUserId(userId);
  },

  /**
   * Obtiene el item activo de una suscripción (solo puede haber uno)
   */
  getActiveItem: (subscription: Subscription) => {
    if (!subscription.items || subscription.items.length === 0) {
      return null;
    }
    return subscription.items.find(item => item.status === 'active') || null;
  },

  /**
   * Obtiene los items pendientes de una suscripción (en cola)
   */
  getPendingItems: (subscription: Subscription) => {
    if (!subscription.items || subscription.items.length === 0) {
      return [];
    }
    return subscription.items
      .filter(item => item.status === 'pending')
      .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
  },

  /**
   * Obtiene los items expirados de una suscripción (historial)
   */
  getExpiredItems: (subscription: Subscription) => {
    if (!subscription.items || subscription.items.length === 0) {
      return [];
    }
    return subscription.items
      .filter(item => item.status === 'expired')
      .sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime());
  },

  /**
   * Calcula los beneficios actuales basados solo en el item ACTIVO
   */
  getCurrentBenefits: (subscription: Subscription) => {
    const activeItem = subscriptionsService.getActiveItem(subscription);

    if (!activeItem) {
      return {
        cost: 0,
        classes: 0,
        gym: 0,
        duration: 0,
        validUntil: null,
        name: null
      };
    }

    return {
      cost: Number(activeItem.cost),
      classes: activeItem.max_classes_assistance,
      gym: activeItem.max_gym_assistance,
      duration: activeItem.duration_months,
      validUntil: activeItem.end_date,
      name: activeItem.name
    };
  },

  /**
   * Calcula los días restantes hasta que expire el item activo
   */
  calculateDaysRemaining: (subscription: Subscription) => {
    const activeItem = subscriptionsService.getActiveItem(subscription);

    if (!activeItem) {
      return 0;
    }

    const endDate = new Date(activeItem.end_date);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  },
};

export default subscriptionsService;
