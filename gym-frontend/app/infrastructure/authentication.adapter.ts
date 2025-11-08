/**
 * AUTHENTICATION ADAPTER
 *
 * Adapter para operaciones de autenticación.
 * Encapsula toda la lógica de comunicación con los endpoints de auth.
 *
 * Endpoints (EJEMPLO - reemplazar con los reales):
 * - POST /api/auth/login
 * - POST /api/auth/register
 * - POST /api/auth/logout
 * - GET /api/auth/me
 * - POST /api/auth/refresh-token
 */

import { IHttpClient } from '../domain/IHttpClient'

// ==================== TYPES ====================

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: string
    name: string
    email: string
    role: 'ADMIN' | 'RECEPTIONIST' | 'COACH' | 'CLIENT'
  }
  token: string
  refreshToken?: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  phone?: string
  createdAt: string
}

// ==================== ADAPTER ====================

export class AuthenticationAdapter {
  constructor(private readonly httpClient: IHttpClient) {}

  /**
   * Iniciar sesión
   * @param credentials - Email y contraseña del usuario
   * @returns Información del usuario y token de autenticación
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // TODO: Reemplazar con tu endpoint real
      const response = await this.httpClient.post<AuthResponse>(
        '/api/auth/login',
        credentials
      )

      return response.data
    } catch (error) {
      throw new Error('Error al iniciar sesión. Verifica tus credenciales.')
    }
  }

  /**
   * Registrar nuevo usuario
   * @param userData - Datos del nuevo usuario
   * @returns Usuario creado y token
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      // TODO: Reemplazar con tu endpoint real
      const response = await this.httpClient.post<AuthResponse>(
        '/api/auth/register',
        userData
      )

      return response.data
    } catch (error) {
      throw new Error('Error al registrar usuario. El email puede estar en uso.')
    }
  }

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    try {
      // TODO: Reemplazar con tu endpoint real
      await this.httpClient.post('/api/auth/logout')
    } catch (error) {
      throw new Error('Error al cerrar sesión.')
    }
  }

  /**
   * Obtener perfil del usuario actual
   * @returns Información del usuario autenticado
   */
  async getCurrentUser(): Promise<UserProfile> {
    try {
      // TODO: Reemplazar con tu endpoint real
      const response = await this.httpClient.get<UserProfile>('/api/auth/me')

      return response.data
    } catch (error) {
      throw new Error('Error al obtener información del usuario.')
    }
  }

  /**
   * Refrescar token de autenticación
   * @param refreshToken - Token de refresco
   * @returns Nuevo token de acceso
   */
  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    try {
      // TODO: Reemplazar con tu endpoint real
      const response = await this.httpClient.post<{ token: string }>(
        '/api/auth/refresh-token',
        { refreshToken }
      )

      return response.data
    } catch (error) {
      throw new Error('Error al refrescar token.')
    }
  }
}
