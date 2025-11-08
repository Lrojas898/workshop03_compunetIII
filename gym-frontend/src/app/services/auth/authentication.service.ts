/**
 * AUTHENTICATION SERVICE - Temple Gym API
 *
 * Servicio para operaciones de autenticación y gestión de usuarios.
 *
 * Endpoints:
 * - POST /auth/register
 * - POST /auth/login
 * - GET /auth (solo admin)
 * - GET /auth/:id (solo admin)
 * - PATCH /auth/:id
 * - DELETE /auth/:id (solo admin)
 */

import type {
  User,
  AuthResponse,
  RegisterDto,
  LoginDto,
  UpdateUserDto,
} from '@/app/interfaces/auth.interface';
import apiService from '../api.service';
import { API_CONFIG, ValidRoles } from '@/lib/configuration/api-endpoints';

const authenticationService = {
  /**
   * POST /auth/register
   * Registra un nuevo usuario en el sistema
   */
  register: async (dto: RegisterDto) => {
    const response = await apiService.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.REGISTER,
      dto
    );
    return response.data;
  },

  /**
   * POST /auth/login
   * Inicia sesión en el sistema
   */
  login: async (dto: LoginDto) => {
    const response = await apiService.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.LOGIN,
      dto
    );
    return response.data;
  },

  /**
   * GET /auth
   * Obtiene todos los usuarios del sistema (solo admin)
   */
  getAllUsers: async () => {
    const users = await apiService.get<User[]>(API_CONFIG.ENDPOINTS.AUTH);
    return users;
  },

  /**
   * GET /auth/:id
   * Obtiene un usuario específico por ID (solo admin)
   */
  getUserById: async (userId: string) => {
    const user = await apiService.get<User>(`${API_CONFIG.ENDPOINTS.AUTH}/${userId}`);
    return user;
  },

  /**
   * PATCH /auth/:id
   * Actualiza un usuario existente
   */
  updateUser: async (userId: string, dto: UpdateUserDto) => {
    const response = await apiService.patch<User>(
      `${API_CONFIG.ENDPOINTS.AUTH}/${userId}`,
      dto
    );
    return response.data;
  },

  /**
   * DELETE /auth/:id
   * Elimina un usuario del sistema (solo admin)
   */
  deleteUser: async (userId: string) => {
    const response = await apiService.delete<User>(
      `${API_CONFIG.ENDPOINTS.AUTH}/${userId}`
    );
    return response.data;
  },

  // ==================== HELPER METHODS ====================

  /**
   * Verifica si un usuario tiene un rol específico
   */
  hasRole: (user: User, role: ValidRoles): boolean => {
    return user.roles.some((r) => r.name === role);
  },

  /**
   * Verifica si el usuario es admin
   */
  isAdmin: (user: User): boolean => {
    return authenticationService.hasRole(user, ValidRoles.ADMIN);
  },

  /**
   * Verifica si el usuario es recepcionista
   */
  isReceptionist: (user: User): boolean => {
    return authenticationService.hasRole(user, ValidRoles.RECEPTIONIST);
  },

  /**
   * Verifica si el usuario es coach
   */
  isCoach: (user: User): boolean => {
    return authenticationService.hasRole(user, ValidRoles.COACH);
  },

  /**
   * Verifica si el usuario es cliente
   */
  isClient: (user: User): boolean => {
    return authenticationService.hasRole(user, ValidRoles.CLIENT);
  },
};

export default authenticationService;
