/**
 * AUTH TYPES
 *
 * Tipos relacionados con autenticación y sesiones.
 */

import { User, UserRole } from './entity-types'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthUser extends Omit<User, 'createdAt' | 'updatedAt'> {
  // Usuario autenticado con información de sesión
}

export interface AuthSession {
  user: AuthUser
  tokens: AuthTokens
  expiresAt: string
}

export interface JWTPayload {
  userId: string
  email: string
  role: UserRole
  iat: number
  exp: number
}
