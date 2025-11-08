/**
 * USER FORM VALIDATION SCHEMA
 *
 * Schema de validación Zod para formularios de usuario.
 * Define las reglas de validación para crear/editar usuarios.
 *
 * Campos:
 * - name: string (requerido, min 2 chars)
 * - email: string (requerido, formato email válido)
 * - password: string (requerido al crear, min 8 chars)
 * - role: enum (ADMIN, RECEPTIONIST, COACH, CLIENT)
 * - phone: string (opcional)
 * - status: boolean (activo/inactivo)
 */

// TODO: Implementar schema de validación con Zod
// import { z } from 'zod'

// export const userFormValidationSchema = z.object({
//   name: z.string().min(2, 'Name must be at least 2 characters'),
//   email: z.string().email('Invalid email format'),
//   password: z.string().min(8, 'Password must be at least 8 characters').optional(),
//   role: z.enum(['ADMIN', 'RECEPTIONIST', 'COACH', 'CLIENT']),
//   phone: z.string().optional(),
//   status: z.boolean().default(true),
// })

export const userFormValidationSchema = {}
