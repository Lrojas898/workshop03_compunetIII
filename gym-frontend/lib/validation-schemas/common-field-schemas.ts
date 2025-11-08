/**
 * COMMON FIELD SCHEMAS
 *
 * Schemas de validación Zod reutilizables para campos comunes.
 * Evita duplicación de validaciones.
 *
 * Incluye:
 * - Email
 * - Password
 * - Phone
 * - URL
 * - Dates
 * - IDs
 */

// TODO: Implementar schemas comunes con Zod
// import { z } from 'zod'

// export const emailSchema = z
//   .string()
//   .email('Invalid email format')
//   .min(1, 'Email is required')

// export const passwordSchema = z
//   .string()
//   .min(8, 'Password must be at least 8 characters')
//   .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
//   .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
//   .regex(/[0-9]/, 'Password must contain at least one number')

// export const phoneSchema = z
//   .string()
//   .regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number')
//   .optional()

// export const positiveNumberSchema = z
//   .number()
//   .positive('Must be a positive number')

// export const idSchema = z.string().uuid('Invalid ID format')

export const commonSchemas = {}
