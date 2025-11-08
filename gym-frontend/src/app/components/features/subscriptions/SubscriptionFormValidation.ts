/**
 * SUBSCRIPTION FORM VALIDATION SCHEMA
 *
 * Schema de validación Zod para formularios de suscripción.
 *
 * Campos:
 * - userId: string (requerido)
 * - membershipIds: string[] (array de IDs de membresías)
 * - startDate: date (requerido)
 * - endDate: date (calculado automáticamente)
 * - status: enum (ACTIVE, EXPIRED, CANCELLED)
 * - paymentMethod: string (opcional)
 */

// TODO: Implementar schema de validación con Zod
// import { z } from 'zod'

// export const subscriptionFormValidationSchema = z.object({
//   userId: z.string().min(1, 'User is required'),
//   membershipIds: z.array(z.string()).min(1, 'At least one membership required'),
//   startDate: z.date(),
//   status: z.enum(['ACTIVE', 'EXPIRED', 'CANCELLED']).default('ACTIVE'),
//   paymentMethod: z.string().optional(),
// })

export const subscriptionFormValidationSchema = {}
