/**
 * ENTITY TYPES
 *
 * Definiciones de tipos TypeScript para todas las entidades del dominio.
 * Deben coincidir con las entidades del backend.
 */

export type UserRole = 'ADMIN' | 'RECEPTIONIST' | 'COACH' | 'CLIENT'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  phone?: string
  status: boolean
  createdAt: string
  updatedAt: string
}

export interface Membership {
  id: string
  name: string
  description?: string
  price: number
  durationInDays: number
  benefits?: string[]
  status: boolean
  createdAt: string
  updatedAt: string
}

export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED'

export interface Subscription {
  id: string
  userId: string
  user?: User
  memberships: Membership[]
  startDate: string
  endDate: string
  status: SubscriptionStatus
  paymentMethod?: string
  createdAt: string
  updatedAt: string
}

export type AttendanceStatus = 'CHECKED_IN' | 'CHECKED_OUT'

export interface Attendance {
  id: string
  userId: string
  user?: User
  checkInTime: string
  checkOutTime?: string
  status: AttendanceStatus
  createdAt: string
  updatedAt: string
}

// Utility types
export type EntityWithTimestamps = {
  createdAt: string
  updatedAt: string
}
