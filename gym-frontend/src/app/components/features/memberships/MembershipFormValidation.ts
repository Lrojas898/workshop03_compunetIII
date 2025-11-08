/**
 * MEMBERSHIP FORM VALIDATION SCHEMA
 *
 * Schema de validación Zod para formularios de membresía.
 *
 * Campos:
 * - name: string (requerido)
 * - description: string (opcional)
 * - price: number (requerido, positivo)
 * - durationInDays: number (requerido, positivo)
 * - benefits: string[] (array de beneficios)
 * - status: boolean (activo/inactivo)
 */

// TODO: Implementar schema de validación con Zod
// import { z } from 'zod'

// export const membershipFormValidationSchema = z.object({
//   name: z.string().min(1, 'Name is required'),
//   description: z.string().optional(),
//   price: z.number().positive('Price must be positive'),
//   durationInDays: z.number().positive('Duration must be positive'),
//   benefits: z.array(z.string()).optional(),
//   status: z.boolean().default(true),
// })

export const membershipFormValidationSchema = {}
