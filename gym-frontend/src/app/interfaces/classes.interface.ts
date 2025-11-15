/**
 * CLASSES INTERFACES
 *
 * Tipos e interfaces para gestión de clases del gimnasio.
 */

import { User } from './auth.interface'

// ==================== TYPES ====================

export interface Class {
  id: string
  name: string
  description?: string
  duration_minutes?: number
  max_capacity: number
  isActive: boolean
  createdBy: User
  created_at: string
  updated_at: string
}

// ==================== DTOs ====================

/**
 * DTO para crear clase
 */
export interface CreateClassDto {
  name: string
  description?: string
  duration_minutes?: number
  max_capacity?: number
  isActive?: boolean
}

/**
 * DTO para actualizar clase
 */
export interface UpdateClassDto {
  name?: string
  description?: string
  duration_minutes?: number
  max_capacity?: number
  isActive?: boolean
}
