/**
 * ATTENDANCE INTERFACES
 *
 * Tipos e interfaces para asistencias del gimnasio
 */

import type { User } from './auth.interface'
import type { Class } from './classes.interface'

export enum AttendanceType {
  GYM = 'gym',
  CLASS = 'class'
}

export interface Attendance {
  id: string
  entranceDatetime: string
  exitDatetime?: string
  type: AttendanceType
  dateKey: string
  isActive: boolean
  user: User
  created_at: string
  updated_at: string
}

export interface CreateAttendanceDto {
  userId: string
  entranceDatetime: string
  exitDatetime?: string
  type: AttendanceType
  dateKey: string
}

export interface CheckOutDto {
  userId: string
}

export interface AvailableAttendances {
  gym: number
  classes: number
}

export interface CurrentAttendanceInfo {
  id: string
  entranceDatetime: Date
  type: AttendanceType
}

export interface AttendanceStatus {
  isInside: boolean
  currentAttendance?: CurrentAttendanceInfo
  availableAttendances: AvailableAttendances
}

export interface MonthlyStat {
  month: string
  gymCount: number
  classCount: number
}

export interface AttendanceStatsResponse {
  totalGymAttendances: number
  totalClassAttendances: number
  monthlyStats: MonthlyStat[]
}

export interface ClassAttendance extends Attendance {
  class: Class
  notes?: string
  coach: User
}

export interface RegisterClassAttendanceDto {
  userId: string
  classId: string
  notes?: string
}
