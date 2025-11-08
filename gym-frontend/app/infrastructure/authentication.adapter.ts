/**
 * AUTHENTICATION ADAPTER - Temple Gym API
 *
 * Adapter para operaciones de autenticación y gestión de usuarios.
 * Endpoints reales del backend Temple Gym.
 *
 * Endpoints:
 * - POST /auth/register
 * - POST /auth/login
 * - GET /auth (solo admin)
 * - GET /auth/:id (solo admin)
 * - PATCH /auth/:id
 * - DELETE /auth/:id (solo admin)
 */

import { getHttpClient } from './axios-http-client'
import { API_CONFIG, ValidRoles } from '@/lib/configuration/api-endpoints'

// ==================== TYPES ====================

export interface Role {
  id: string
  name: ValidRoles
}

export interface User {
  id: string
  email: string
  fullName: string
  age: number
  isActive: boolean
  roles: Role[]
}

export interface AuthResponse {
  user: User
  token: string
}

// ==================== DTOs ====================

/**
 * DTO para registro de nuevo usuario
 * Coincide con CreateUserDto del backend
 */
export interface RegisterDto {
  email: string        // @IsEmail() @IsNotEmpty()
  fullName: string     // @IsString() @IsNotEmpty()
  age: number          // @IsInt() @Min(1) @Max(120)
  password: string     // @IsString() @MinLength(6) @MaxLength(50)
}

/**
 * DTO para login
 * Coincide con LoginDto del backend
 */
export interface LoginDto {
  email: string        // @IsString() @IsEmail()
  password: string     // @IsString() @MinLength(6) @MaxLength(50)
}

/**
 * DTO para actualizar usuario
 * Coincide con UpdateUserDto del backend (PartialType de CreateUserDto)
 */
export interface UpdateUserDto {
  email?: string       // @IsEmail() (opcional)
  fullName?: string    // @IsString() (opcional)
  age?: number         // @IsInt() @Min(1) @Max(120) (opcional)
  password?: string    // @IsString() @MinLength(6) @MaxLength(50) (opcional)
  isActive?: boolean   // @IsBoolean() @IsOptional()
}

// ==================== ADAPTER ====================

export class AuthenticationAdapter {
  private httpClient = getHttpClient()

  /**
   * POST /auth/register
   * Registra un nuevo usuario en el sistema
   *
   * @param dto - Datos del usuario (email, fullName, age, password)
   * @returns Usuario creado y token JWT
   * @throws Error si el email ya existe o los datos son inválidos
   *
   * @example
   * const result = await authAdapter.register({
   *   email: "john@example.com",
   *   fullName: "John Doe",
   *   age: 25,
   *   password: "Password123"
   * })
   */
  async register(dto: RegisterDto): Promise<AuthResponse> {
    const response = await this.httpClient.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.REGISTER,
      dto
    )
    return response.data
  }

  /**
   * POST /auth/login
   * Inicia sesión en el sistema
   *
   * @param dto - Credenciales (email, password)
   * @returns Usuario y token JWT
   * @throws Error si las credenciales son incorrectas
   *
   * @example
   * const result = await authAdapter.login({
   *   email: "john@example.com",
   *   password: "Password123"
   * })
   */
  async login(dto: LoginDto): Promise<AuthResponse> {
    const response = await this.httpClient.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.LOGIN,
      dto
    )
    return response.data
  }

  /**
   * GET /auth
   * Obtiene todos los usuarios del sistema
   *
   * @returns Array de usuarios
   * @throws Error si no tiene permisos (solo admin)
   *
   * @example
   * const users = await authAdapter.getAllUsers()
   */
  async getAllUsers(): Promise<User[]> {
    const response = await this.httpClient.get<User[]>(API_CONFIG.ENDPOINTS.AUTH)
    return response.data
  }

  /**
   * GET /auth/:id
   * Obtiene un usuario específico por ID
   *
   * @param userId - UUID del usuario
   * @returns Usuario encontrado
   * @throws Error si no existe o no tiene permisos (solo admin)
   *
   * @example
   * const user = await authAdapter.getUserById("550e8400-e29b-41d4-a716-446655440000")
   */
  async getUserById(userId: string): Promise<User> {
    const response = await this.httpClient.get<User>(
      `${API_CONFIG.ENDPOINTS.AUTH}/${userId}`
    )
    return response.data
  }

  /**
   * PATCH /auth/:id
   * Actualiza un usuario existente
   *
   * @param userId - UUID del usuario a actualizar
   * @param dto - Datos a actualizar (parciales)
   * @returns Usuario actualizado
   * @throws Error si no tiene permisos o datos inválidos
   *
   * @example
   * const updated = await authAdapter.updateUser("user-id", {
   *   fullName: "John Updated",
   *   age: 26
   * })
   */
  async updateUser(userId: string, dto: UpdateUserDto): Promise<User> {
    const response = await this.httpClient.patch<User>(
      `${API_CONFIG.ENDPOINTS.AUTH}/${userId}`,
      dto
    )
    return response.data
  }

  /**
   * DELETE /auth/:id
   * Elimina un usuario del sistema
   *
   * @param userId - UUID del usuario a eliminar
   * @returns Usuario eliminado
   * @throws Error si no tiene permisos (solo admin)
   *
   * @example
   * const deleted = await authAdapter.deleteUser("user-id")
   */
  async deleteUser(userId: string): Promise<User> {
    const response = await this.httpClient.delete<User>(
      `${API_CONFIG.ENDPOINTS.AUTH}/${userId}`
    )
    return response.data
  }

  // ==================== HELPER METHODS ====================

  /**
   * Verifica si un usuario tiene un rol específico
   */
  static hasRole(user: User, role: ValidRoles): boolean {
    return user.roles.some(r => r.name === role)
  }

  /**
   * Verifica si el usuario es admin
   */
  static isAdmin(user: User): boolean {
    return this.hasRole(user, ValidRoles.ADMIN)
  }

  /**
   * Verifica si el usuario es recepcionista
   */
  static isReceptionist(user: User): boolean {
    return this.hasRole(user, ValidRoles.RECEPTIONIST)
  }

  /**
   * Verifica si el usuario es coach
   */
  static isCoach(user: User): boolean {
    return this.hasRole(user, ValidRoles.COACH)
  }

  /**
   * Verifica si el usuario es cliente
   */
  static isClient(user: User): boolean {
    return this.hasRole(user, ValidRoles.CLIENT)
  }
}

// Exportar instancia singleton (opcional)
export const authAdapter = new AuthenticationAdapter()
