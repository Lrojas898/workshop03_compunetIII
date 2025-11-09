/**
 * MEMBERSHIP INTERFACES
 *
 * Tipos e interfaces para membresías del gimnasio
 */

export interface Membership {
  id: string
  name: string
  cost: string
  status: boolean
  max_classes_assistance: number
  max_gym_assistance: number
  duration_months: number
  created_at: string
  updated_at: string
}

export interface CreateMembershipDto {
  name: string
  cost: number
  max_classes_assistance: number
  max_gym_assistance: number
  duration_months: 1 | 12
  status?: boolean
}

export interface UpdateMembershipDto {
  name?: string
  cost?: number
  max_classes_assistance?: number
  max_gym_assistance?: number
  duration_months?: 1 | 12
  status?: boolean
}
