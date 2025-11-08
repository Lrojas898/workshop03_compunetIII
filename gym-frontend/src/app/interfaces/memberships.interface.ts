/**
 * MEMBERSHIPS INTERFACES
 *
 * Tipos e interfaces para membresías (planes).
 */

// ==================== TYPES ====================

export interface Membership {
  id: string
  name: string
  cost: number
  status: boolean
  max_classes_assistance: number
  max_gym_assistance: number
  duration_months: 1 | 12
  created_at: string
  updated_at: string
}

// ==================== DTOs ====================

/**
 * DTO para crear membresía
 * Coincide con CreateMembershipDto del backend
 */
export interface CreateMembershipDto {
  name: string                   // @IsString() @IsNotEmpty()
  cost: number                   // @IsNumber() @Min(0)
  max_classes_assistance: number // @IsInt() @Min(0)
  max_gym_assistance: number     // @IsInt() @Min(0)
  duration_months: 1 | 12        // @IsInt() @IsIn([1, 12])
  status?: boolean               // @IsBoolean() @IsOptional() (default: true)
}

/**
 * DTO para actualizar membresía
 * Coincide con UpdateMembershipDto del backend (PartialType)
 */
export interface UpdateMembershipDto {
  name?: string
  cost?: number
  max_classes_assistance?: number
  max_gym_assistance?: number
  duration_months?: 1 | 12
  status?: boolean
}
