/**
 * ATTENDANCES SERVICE - Temple Gym API
 *
 * Servicio para operaciones de asistencias (check-in/check-out).
 *
 * Endpoints:
 * - POST /attendances/check-in - Registra entrada (solo receptionist)
 * - POST /attendances/check-out - Registra salida (solo receptionist)
 * - GET /attendances/status/:userId - Estado actual del usuario (solo admin)
 * - GET /attendances/history/:userId - Historial de asistencias (solo admin)
 * - GET /attendances/stats/:userId - Estadísticas (solo admin)
 * - GET /attendances/active - Usuarios actualmente dentro (solo admin)
 */

import type {
  Attendance,
  AttendanceStatus,
  AttendanceStats,
  CreateAttendanceDto,
  CheckOutDto,
  GetHistoryParams,
} from '@/app/interfaces/attendances.interface';
import apiService from '../api.service';
import { API_CONFIG } from '@/lib/configuration/api-endpoints';

const attendancesService = {
  /**
   * POST /attendances/check-in
   * Registra la entrada de un usuario
   */
  checkIn: async (dto: CreateAttendanceDto) => {
    const response = await apiService.post<Attendance>(
      `${API_CONFIG.ENDPOINTS.ATTENDANCES}/check-in`,
      dto
    );
    return response.data;
  },

  /**
   * POST /attendances/check-out
   * Registra la salida de un usuario
   */
  checkOut: async (dto: CheckOutDto) => {
    const response = await apiService.post<Attendance>(
      `${API_CONFIG.ENDPOINTS.ATTENDANCES}/check-out`,
      dto
    );
    return response.data;
  },

  /**
   * GET /attendances/status/:userId
   * Obtiene el estado actual de un usuario
   */
  getStatus: async (userId: string) => {
    const status = await apiService.get<AttendanceStatus>(
      `${API_CONFIG.ENDPOINTS.ATTENDANCES}/status/${userId}`
    );
    return status;
  },

  /**
   * GET /attendances/history/:userId
   * Obtiene el historial de asistencias de un usuario
   */
  getHistory: async (params: GetHistoryParams) => {
    const { userId, from, to, type } = params;
    const queryParams = new URLSearchParams();

    if (from) queryParams.append('from', from);
    if (to) queryParams.append('to', to);
    if (type) queryParams.append('type', type);

    const query = queryParams.toString();
    const url = `${API_CONFIG.ENDPOINTS.ATTENDANCES}/history/${userId}${
      query ? `?${query}` : ''
    }`;

    const history = await apiService.get<Attendance[]>(url);
    return history;
  },

  /**
   * GET /attendances/stats/:userId
   * Obtiene estadísticas de asistencia de un usuario
   */
  getStats: async (userId: string) => {
    const stats = await apiService.get<AttendanceStats>(
      `${API_CONFIG.ENDPOINTS.ATTENDANCES}/stats/${userId}`
    );
    return stats;
  },

  /**
   * GET /attendances/active
   * Obtiene todos los usuarios actualmente dentro del gimnasio
   */
  getActive: async () => {
    const activeUsers = await apiService.get<Attendance[]>(
      `${API_CONFIG.ENDPOINTS.ATTENDANCES}/active`
    );
    return activeUsers;
  },
};

export default attendancesService;
