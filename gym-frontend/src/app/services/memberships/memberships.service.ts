/**
 * MEMBERSHIPS SERVICE - Temple Gym API
 *
 * Servicio para operaciones CRUD de membresías (planes).
 *
 * Endpoints:
 * - GET /memberships - Obtiene todas las membresías (admin, receptionist)
 * - GET /memberships/:id - Obtiene membresía por ID (admin, receptionist, coach)
 * - POST /memberships - Crea nueva membresía (solo admin)
 * - PUT /memberships/:id - Actualiza membresía (solo admin)
 * - PATCH /memberships/:id/toggle-status - Activa/desactiva membresía (solo admin)
 * - DELETE /memberships/:id - Elimina membresía (solo admin)
 */

import type {
  Membership,
  CreateMembershipDto,
  UpdateMembershipDto,
} from '@/app/interfaces/membership.interface';
import apiService from '../api.service';
import { API_CONFIG } from '@/lib/configuration/api-endpoints';

const membershipsService = {
  /**
   * GET /memberships
   * Obtiene todas las membresías
   */
  getAll: async () => {
    const memberships = await apiService.get<Membership[]>(
      API_CONFIG.ENDPOINTS.MEMBERSHIPS
    );
    return memberships;
  },

  /**
   * GET /memberships/:id
   * Obtiene una membresía por ID
   */
  getById: async (id: string) => {
    const membership = await apiService.get<Membership>(
      `${API_CONFIG.ENDPOINTS.MEMBERSHIPS}/${id}`
    );
    return membership;
  },

  /**
   * POST /memberships
   * Crea una nueva membresía
   */
  create: async (dto: CreateMembershipDto) => {
    const response = await apiService.post<Membership>(
      API_CONFIG.ENDPOINTS.MEMBERSHIPS,
      dto
    );
    return response.data;
  },

  /**
   * PUT /memberships/:id
   * Actualiza una membresía existente
   */
  update: async (id: string, dto: UpdateMembershipDto) => {
    const response = await apiService.put<Membership>(
      `${API_CONFIG.ENDPOINTS.MEMBERSHIPS}/${id}`,
      dto
    );
    return response.data;
  },

  /**
   * PATCH /memberships/:id/toggle-status
   * Activa o desactiva una membresía
   */
  toggleStatus: async (id: string) => {
    const response = await apiService.patch<Membership>(
      `${API_CONFIG.ENDPOINTS.MEMBERSHIPS}/${id}/toggle-status`
    );
    return response.data;
  },

  /**
   * DELETE /memberships/:id
   * Elimina una membresía
   */
  delete: async (id: string) => {
    const response = await apiService.delete<{ message: string }>(
      `${API_CONFIG.ENDPOINTS.MEMBERSHIPS}/${id}`
    );
    return response.data;
  },
};

export default membershipsService;
