/**
 * AUTHENTICATION INTERFACES
 *
 * Tipos e interfaces para autenticación y gestión de usuarios.
 */

import { ValidRoles } from '@/lib/configuration/api-endpoints'

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
