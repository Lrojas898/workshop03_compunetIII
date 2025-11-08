/**
 * SUBSCRIPTIONS INTERFACES
 *
 * Tipos e interfaces para suscripciones de usuarios.
 */

import type { User } from './auth.interface'
import type { Membership } from './memberships.interface'

// ==================== TYPES ====================

export interface Subscription {
  id: string
  name: string
  cost: number
  max_classes_assistance: number
  max_gym_assistance: number
  duration_months: number
  purchase_date: string
  isActive: boolean
  created_at: string
  updated_at: string
  deletedAt: string | null
  user: User
  memberships: Membership[]
}

// ==================== DTOs ====================

/**
 * DTO para crear suscripción
 * El backend solo requiere el userId
 */
export interface CreateSubscriptionDto {
  userId: string  // @IsUUID()
}

/**
 * DTO para agregar membresía a suscripción
 * Coincide con AddMembershipDto del backend
 */
export interface AddMembershipDto {
  membershipId: string  // @IsUUID()
}

/**
 * DTO para actualizar suscripción
 * Coincide con UpdateSubscriptionDto del backend
 */
export interface UpdateSubscriptionDto {
  isActive?: boolean
  purchase_date?: string  // ISO 8601 date
}
