/**
 * USER VALIDATION SCHEMAS
 *
 * Schemas de validación Zod para entidad User.
 * Usado en formularios de creación/edición de usuarios.
 */

// TODO: Implementar schemas de usuario
// import { z } from 'zod'
// import { emailSchema, passwordSchema, phoneSchema } from './common-field-schemas'

// export const userCreateSchema = z.object({
//   name: z.string().min(2, 'Name must be at least 2 characters'),
//   email: emailSchema,
//   password: passwordSchema,
//   role: z.enum(['ADMIN', 'RECEPTIONIST', 'COACH', 'CLIENT']),
//   phone: phoneSchema,
//   status: z.boolean().default(true),
// })

// export const userUpdateSchema = userCreateSchema.partial({
//   password: true,
// })

export const userSchemas = {}
