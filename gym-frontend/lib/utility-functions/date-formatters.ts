/**
 * DATE UTILITIES
 *
 * Funciones utilitarias para manejo de fechas.
 *
 * Incluye:
 * - Formateo de fechas
 * - Cálculo de diferencias
 * - Validaciones
 * - Conversiones
 */

// TODO: Implementar utilidades de fecha con date-fns
// import { format, parseISO, differenceInDays, isAfter, isBefore } from 'date-fns'

/**
 * Formatea una fecha en formato legible
 */
export function formatDate(date: string | Date, formatStr: string = 'MMM dd, yyyy'): string {
  // TODO: Implementar con date-fns
  return new Date(date).toLocaleDateString()
}

/**
 * Calcula días restantes desde hoy hasta una fecha
 */
export function daysUntil(date: string | Date): number {
  // TODO: Implementar con date-fns
  const target = new Date(date)
  const today = new Date()
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

/**
 * Verifica si una fecha ya pasó
 */
export function isExpired(date: string | Date): boolean {
  return new Date(date) < new Date()
}

/**
 * Calcula duración entre dos fechas en formato legible
 */
export function formatDuration(startDate: string | Date, endDate: string | Date): string {
  // TODO: Implementar formato de duración
  return '2 hours 30 minutes'
}
