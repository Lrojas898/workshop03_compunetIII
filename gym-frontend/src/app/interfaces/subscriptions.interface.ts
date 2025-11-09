/**
 * SUBSCRIPTIONS INTERFACES
 *
 * Tipos e interfaces para suscripciones de usuarios.
 */

import type { User } from './auth.interface'
import type { Membership } from './membership.interface'

// ==================== TYPES ====================

/**
 * Estados posibles de un SubscriptionItem
 */
export type SubscriptionItemStatus = 'active' | 'pending' | 'expired' | 'cancelled'

/**
 * SubscriptionItem - Representa una compra de membresía
 * Congela los valores de la membresía al momento de la compra
 */
export interface SubscriptionItem {
  id: string
  name: string
  cost: string
  max_classes_assistance: number
  max_gym_assistance: number
  duration_months: number
  purchase_date: string  // Fecha en que se compró
  start_date: string     // Fecha en que inicia/iniciará
  end_date: string       // Fecha en que termina/terminará
  status: SubscriptionItemStatus  // active, pending, expired, cancelled
  membership: Membership  // Referencia a la membresía original
  created_at: string
  updated_at: string
}

/**
 * Subscription - Contenedor de items de membresía
 */
export interface Subscription {
  id: string
  start_date: string  // Fecha de inicio de la suscripción
  isActive: boolean
  created_at: string
  updated_at: string
  deletedAt: string | null
  user: User
  items: SubscriptionItem[]  // Array de items de suscripción
}

// ==================== DTOs ====================

/**
 * DTO para crear suscripción (solo userId)
 * Coincide con CreateSubscriptionDto del backend
 */
export interface CreateSubscriptionDto {
  userId: string
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
