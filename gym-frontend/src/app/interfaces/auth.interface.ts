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
  createdAt?: string
  updatedAt?: string
}

export interface AuthResponse extends User {
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

/**
 * DTO para asignar roles
 * Reemplaza TODOS los roles del usuario
 */
export interface AssignRolesDto {
  roles: ValidRoles[]  // Array con mínimo 1 rol
}

/**
 * DTO para agregar roles
 * Agrega roles sin remover existentes
 */
export interface AddRolesDto {
  roles: ValidRoles[]  // Array con roles a agregar
}

/**
 * DTO para remover roles
 * Elimina roles (auto-asigna client si queda vacío)
 */
export interface RemoveRolesDto {
  roles: ValidRoles[]  // Array con roles a remover
}
