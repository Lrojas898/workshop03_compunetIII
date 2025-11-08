/**
 * ATTENDANCES INTERFACES
 *
 * Tipos e interfaces para asistencias (check-in/check-out).
 */

import { AttendanceType } from '@/lib/configuration/api-endpoints'
import type { User } from './auth.interface'

// ==================== TYPES ====================

export interface Attendance {
  id: string
  type: AttendanceType
  entranceDatetime: string
  exitDatetime: string | null
  isActive: boolean
  dateKey: string
  created_at: string
  updated_at: string
  user: User
}

export interface AttendanceStatus {
  isInside: boolean
  currentAttendance: {
    id: string
    entranceDatetime: string
    type: AttendanceType
  } | null
  availableAttendances: {
    gym: number
    classes: number
  }
}

export interface AttendanceStats {
  totalGymAttendances: number
  totalClassAttendances: number
  monthlyStats: Array<{
    month: string
    gymCount: number
    classCount: number
  }>
}

// ==================== DTOs ====================

/**
 * DTO para check-in
 * Coincide con CreateAttendanceDto del backend
 */
export interface CreateAttendanceDto {
  userId: string              // @IsUUID()
  entranceDatetime: string    // @IsDateString() - ISO 8601
  type: AttendanceType        // @IsEnum(AttendanceType)
  dateKey: string             // @IsString() @MaxLength(50) - Format: YYYY-MM-DD
}

/**
 * DTO para check-out
 * Coincide con CheckOutDto del backend
 */
export interface CheckOutDto {
  userId: string  // @IsUUID()
}

/**
 * Parámetros para historial de asistencias
 * Coincide con GetHistoryDto del backend
 */
export interface GetHistoryParams {
  userId: string
  from?: string         // ISO 8601 date
  to?: string           // ISO 8601 date
  type?: AttendanceType
}
