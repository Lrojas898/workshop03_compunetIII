/**
 * CLASSES SERVICE - Temple Gym API
 *
 * Servicio para gestión de clases del gimnasio.
 *
 * Endpoints:
 * - GET /classes - Obtener todas las clases
 * - GET /classes/active - Obtener clases activas
 * - GET /classes/:id - Obtener clase por ID
 * - POST /classes - Crear nueva clase (coach, admin)
 * - PATCH /classes/:id - Actualizar clase (coach, admin)
 * - PATCH /classes/:id/toggle-active - Activar/desactivar (admin)
 * - DELETE /classes/:id - Eliminar clase (admin)
 */

import type {
  Class,
  CreateClassDto,
  UpdateClassDto,
} from '@/app/interfaces/classes.interface';
import apiService from '../api.service';
import { API_CONFIG } from '@/lib/configuration/api-endpoints';

const classesService = {
  /**
   * GET /classes
   * Obtiene todas las clases
   */
  getAll: async () => {
    const classes = await apiService.get<Class[]>(
      API_CONFIG.ENDPOINTS.CLASSES
    );
    return classes;
  },

  /**
   * GET /classes/active
   * Obtiene solo las clases activas
   */
  getActive: async () => {
    const classes = await apiService.get<Class[]>(
      API_CONFIG.ENDPOINTS.ACTIVE_CLASSES
    );
    return classes;
  },

  /**
   * GET /classes/:id
   * Obtiene una clase por ID
   */
  getById: async (id: string) => {
    const classData = await apiService.get<Class>(
      API_CONFIG.ENDPOINTS.CLASS_BY_ID(id)
    );
    return classData;
  },

  /**
   * POST /classes
   * Crea una nueva clase
   */
  create: async (dto: CreateClassDto) => {
    const response = await apiService.post<Class>(
      API_CONFIG.ENDPOINTS.CLASSES,
      dto
    );
    return response.data;
  },

  /**
   * PATCH /classes/:id
   * Actualiza una clase existente
   */
  update: async (id: string, dto: UpdateClassDto) => {
    const response = await apiService.patch<Class>(
      API_CONFIG.ENDPOINTS.CLASS_BY_ID(id),
      dto
    );
    return response.data;
  },

  /**
   * PATCH /classes/:id/toggle-active
   * Activa o desactiva una clase
   */
  toggleActive: async (id: string) => {
    const response = await apiService.patch<Class>(
      API_CONFIG.ENDPOINTS.TOGGLE_CLASS_STATUS(id)
    );
    return response.data;
  },

  /**
   * DELETE /classes/:id
   * Elimina una clase (solo si no tiene asistencias)
   */
  delete: async (id: string) => {
    await apiService.delete(
      API_CONFIG.ENDPOINTS.CLASS_BY_ID(id)
    );
  },
};

export default classesService;
