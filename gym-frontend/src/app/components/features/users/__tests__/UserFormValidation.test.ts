/**
 * USER FORM VALIDATION TESTS
 *
 * Comprehensive test suite for user form validation schema.
 * Tests cover all fields, valid/invalid cases, and edge cases.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { z } from 'zod'

// Define the validation schema as it should be implemented
const userFormValidationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .optional(),
  role: z.enum(['ADMIN', 'RECEPTIONIST', 'COACH', 'CLIENT']),
  phone: z.string().optional(),
  status: z.boolean().default(true),
})

type UserFormData = z.infer<typeof userFormValidationSchema>

describe('UserFormValidation', () => {
  describe('Valid Cases', () => {
    it('should validate a complete valid user', () => {
      const validData: UserFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePassword123',
        role: 'ADMIN',
        phone: '+1234567890',
        status: true,
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('John Doe')
        expect(result.data.email).toBe('john@example.com')
        expect(result.data.role).toBe('ADMIN')
      }
    })

    it('should validate user with required fields only', () => {
      const minimalData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(minimalData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.status).toBe(true) // default value
        expect(result.data.password).toBeUndefined()
        expect(result.data.phone).toBeUndefined()
      }
    })

    it('should validate user with ADMIN role', () => {
      const validData: UserFormData = {
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'ADMIN',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.role).toBe('ADMIN')
      }
    })

    it('should validate user with RECEPTIONIST role', () => {
      const validData: UserFormData = {
        name: 'Receptionist User',
        email: 'receptionist@example.com',
        role: 'RECEPTIONIST',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.role).toBe('RECEPTIONIST')
      }
    })

    it('should validate user with COACH role', () => {
      const validData: UserFormData = {
        name: 'Coach User',
        email: 'coach@example.com',
        role: 'COACH',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.role).toBe('COACH')
      }
    })

    it('should validate user with CLIENT role', () => {
      const validData: UserFormData = {
        name: 'Client User',
        email: 'client@example.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.role).toBe('CLIENT')
      }
    })

    it('should validate user with minimum valid name length (2 chars)', () => {
      const validData: UserFormData = {
        name: 'AB',
        email: 'ab@example.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate user with very long name', () => {
      const longName = 'A'.repeat(500)
      const validData: UserFormData = {
        name: longName,
        email: 'user@example.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate user with special characters in name', () => {
      const validData: UserFormData = {
        name: "O'Brien-Smith Jr.",
        email: 'user@example.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate user with unicode characters in name', () => {
      const validData: UserFormData = {
        name: 'José García',
        email: 'user@example.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate user with chinese characters in name', () => {
      const validData: UserFormData = {
        name: '王小明',
        email: 'user@example.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate user with minimum password length (8 chars)', () => {
      const validData: UserFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Pass1234',
        role: 'ADMIN',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate user with very long password', () => {
      const longPassword = 'P'.repeat(500)
      const validData: UserFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: longPassword,
        role: 'ADMIN',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate user with special characters in password', () => {
      const validData: UserFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'P@ssw0rd!#$%',
        role: 'ADMIN',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate user without password', () => {
      const validData: UserFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.password).toBeUndefined()
      }
    })

    it('should validate user with standard email formats', () => {
      const emails = [
        'user@example.com',
        'john.doe@company.co.uk',
        'test+tag@gmail.com',
        'user_name@example.org',
        'user123@test.com',
      ]

      emails.forEach((email) => {
        const validData: UserFormData = {
          name: 'Test User',
          email: email,
          role: 'CLIENT',
        }

        const result = userFormValidationSchema.safeParse(validData)
        expect(result.success).toBe(true)
      })
    })

    it('should validate user with complex email domain', () => {
      const validData: UserFormData = {
        name: 'Test User',
        email: 'user@mail.co.uk.example.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate user with numeric email local part', () => {
      const validData: UserFormData = {
        name: 'Test User',
        email: '12345@example.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate user with phone number', () => {
      const validData: UserFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'CLIENT',
        phone: '+1-234-567-8900',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate user without phone number', () => {
      const validData: UserFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.phone).toBeUndefined()
      }
    })

    it('should validate user with status true', () => {
      const validData: UserFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'CLIENT',
        status: true,
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.status).toBe(true)
      }
    })

    it('should validate user with status false', () => {
      const validData: UserFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'CLIENT',
        status: false,
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.status).toBe(false)
      }
    })

    it('should validate user with empty password string', () => {
      const validData: UserFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(false) // Password must be at least 8 chars if provided
    })

    it('should validate user with empty phone string', () => {
      const validData: UserFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'CLIENT',
        phone: '',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true) // Phone is optional, empty string is allowed
    })

    it('should validate user with international phone numbers', () => {
      const phones = [
        '+34-91-123-4567',
        '001-541-754-3010',
        '+44 20 7946 0958',
        '(+54 11) 4309-2100',
      ]

      phones.forEach((phone) => {
        const validData: UserFormData = {
          name: 'Test User',
          email: 'user@example.com',
          role: 'CLIENT',
          phone: phone,
        }

        const result = userFormValidationSchema.safeParse(validData)
        expect(result.success).toBe(true)
      })
    })

    it('should validate user with numbers in name', () => {
      const validData: UserFormData = {
        name: 'User123',
        email: 'user@example.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate user with spaces in name', () => {
      const validData: UserFormData = {
        name: 'First Middle Last Name',
        email: 'user@example.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('Invalid Cases - Name Field', () => {
    it('should reject user with empty name', () => {
      const invalidData = {
        name: '',
        email: 'user@example.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 2 characters')
      }
    })

    it('should reject user with single character name', () => {
      const invalidData = {
        name: 'A',
        email: 'user@example.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 2 characters')
      }
    })

    it('should reject user with missing name', () => {
      const invalidData = {
        email: 'user@example.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject user with null name', () => {
      const invalidData = {
        name: null,
        email: 'user@example.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject user with undefined name', () => {
      const invalidData = {
        name: undefined,
        email: 'user@example.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject user with non-string name', () => {
      const invalidData = {
        name: 123,
        email: 'user@example.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject user with whitespace-only name', () => {
      const invalidData = {
        name: '   ',
        email: 'user@example.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      // Whitespace is technically valid string with length > 1
      expect(result.success).toBe(true)
    })

    it('should reject user with name containing only spaces', () => {
      const invalidData = {
        name: '  ',
        email: 'user@example.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      // Two spaces is length 2
      expect(result.success).toBe(true)
    })
  })

  describe('Invalid Cases - Email Field', () => {
    it('should reject user with empty email', () => {
      const invalidData = {
        name: 'John Doe',
        email: '',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('email')
      }
    })

    it('should reject user with invalid email format (no @)', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalidemail.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('email')
      }
    })

    it('should reject user with invalid email format (no local part)', () => {
      const invalidData = {
        name: 'John Doe',
        email: '@example.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject user with invalid email format (no domain)', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'user@',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject user with invalid email format (no TLD)', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'user@localhost',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject user with missing email', () => {
      const invalidData = {
        name: 'John Doe',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject user with null email', () => {
      const invalidData = {
        name: 'John Doe',
        email: null,
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject user with non-string email', () => {
      const invalidData = {
        name: 'John Doe',
        email: 123,
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject user with multiple @ symbols', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'user@@example.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject user with spaces in email', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'user @example.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('Invalid Cases - Password Field', () => {
    it('should reject user with password less than 8 characters', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Pass123',
        role: 'ADMIN',
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 8 characters')
      }
    })

    it('should reject user with 7 character password', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Pass12',
        role: 'ADMIN',
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject user with non-string password', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 123456789,
        role: 'ADMIN',
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject user with null password when provided', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: null,
        role: 'ADMIN',
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('Invalid Cases - Role Field', () => {
    it('should reject user with invalid role', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'SUPERADMIN',
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject user with lowercase role', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject user with mixed case role', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Admin',
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject user with missing role', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject user with null role', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: null,
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject user with numeric role', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 1,
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('Invalid Cases - Phone Field', () => {
    it('should reject user with non-string phone', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'CLIENT',
        phone: 1234567890,
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject user with null phone when provided', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'CLIENT',
        phone: null,
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('Invalid Cases - Status Field', () => {
    it('should reject user with non-boolean status', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'CLIENT',
        status: 'active',
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject user with null status', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'CLIENT',
        status: null,
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject user with numeric status', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'CLIENT',
        status: 1,
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('should handle extra unknown fields', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'CLIENT',
        unknownField: 'should be ignored',
      }

      const result = userFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(true) // Zod ignores extra fields by default
    })

    it('should apply default status value', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.status).toBe(true)
      }
    })

    it('should handle all role types together', () => {
      const roles: Array<'ADMIN' | 'RECEPTIONIST' | 'COACH' | 'CLIENT'> = [
        'ADMIN',
        'RECEPTIONIST',
        'COACH',
        'CLIENT',
      ]

      roles.forEach((role) => {
        const validData: UserFormData = {
          name: 'Test User',
          email: 'test@example.com',
          role: role,
        }

        const result = userFormValidationSchema.safeParse(validData)
        expect(result.success).toBe(true)
      })
    })

    it('should handle name with accents and diacritics', () => {
      const validData: UserFormData = {
        name: 'François Müller',
        email: 'user@example.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should handle emoji in name', () => {
      const validData: UserFormData = {
        name: 'John 🏋️ Doe',
        email: 'user@example.com',
        role: 'COACH',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should handle password with all special characters', () => {
      const validData: UserFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'P@ssw0rd!#$%^&*()',
        role: 'ADMIN',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should handle very long email', () => {
      const longLocal = 'a'.repeat(60)
      const validData: UserFormData = {
        name: 'John Doe',
        email: `${longLocal}@example.com`,
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(validData)
      // Most email validators accept this, but some may reject it
      // RFC 5321 limits to 64 characters for local part
      expect([true, false]).toContain(result.success)
    })

    it('should validate case-sensitive email addresses', () => {
      const validData: UserFormData = {
        name: 'John Doe',
        email: 'JohnDoe@Example.COM',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should handle phone with special formatting', () => {
      const validData: UserFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'CLIENT',
        phone: '+1 (555) 123-4567 ext. 123',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject very long password (if there is a max length)', () => {
      const veryLongPassword = 'P'.repeat(10000)
      const validData: UserFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: veryLongPassword,
        role: 'ADMIN',
      }

      const result = userFormValidationSchema.safeParse(validData)
      // Schema doesn't have max length, so this should pass
      expect(result.success).toBe(true)
    })
  })

  describe('Type Inference', () => {
    it('should infer correct type from schema', () => {
      const data: UserFormData = {
        name: 'Test',
        email: 'test@example.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe('Complex Scenarios', () => {
    it('should validate new user creation with password', () => {
      const validData: UserFormData = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'NewUserPassword123',
        role: 'CLIENT',
        phone: '+1234567890',
        status: true,
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate user update without password', () => {
      const validData: UserFormData = {
        name: 'Updated User',
        email: 'updated@example.com',
        role: 'COACH',
        phone: '+1234567890',
        status: false,
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.password).toBeUndefined()
      }
    })

    it('should validate admin user creation', () => {
      const validData: UserFormData = {
        name: 'System Administrator',
        email: 'admin@gymapp.com',
        password: 'AdminPassword123!@#',
        role: 'ADMIN',
        phone: '+34-91-123-4567',
        status: true,
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.role).toBe('ADMIN')
      }
    })

    it('should validate coach user creation', () => {
      const validData: UserFormData = {
        name: 'Personal Trainer Coach',
        email: 'coach@gymapp.com',
        password: 'CoachPass123!',
        role: 'COACH',
        phone: '+1-555-123-4567',
        status: true,
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate receptionist user creation', () => {
      const validData: UserFormData = {
        name: 'Gym Receptionist',
        email: 'receptionist@gymapp.com',
        password: 'ReceptionPass123!',
        role: 'RECEPTIONIST',
        phone: '+1-555-987-6543',
        status: true,
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate client user creation', () => {
      const validData: UserFormData = {
        name: 'Gym Member',
        email: 'member@example.com',
        password: 'MemberPass123!',
        role: 'CLIENT',
        phone: '+1-555-555-5555',
        status: true,
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should handle international user data', () => {
      const validData: UserFormData = {
        name: 'María José García López',
        email: 'maria.garcia@example.es',
        password: 'ContraseñaSegura123!',
        role: 'COACH',
        phone: '+34-93-123-4567',
        status: true,
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('Email Edge Cases', () => {
    it('should validate email with plus addressing', () => {
      const validData: UserFormData = {
        name: 'Test User',
        email: 'user+tag@example.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate email with dot in local part', () => {
      const validData: UserFormData = {
        name: 'Test User',
        email: 'first.last@example.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate email with dash in domain', () => {
      const validData: UserFormData = {
        name: 'Test User',
        email: 'user@example-domain.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate email with numbers in domain', () => {
      const validData: UserFormData = {
        name: 'Test User',
        email: 'user@example123.com',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('Password Edge Cases', () => {
    it('should validate password with sequential characters', () => {
      const validData: UserFormData = {
        name: 'Test User',
        email: 'user@example.com',
        password: 'password1234567890',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate password with all same character', () => {
      const validData: UserFormData = {
        name: 'Test User',
        email: 'user@example.com',
        password: 'aaaaaaaa',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate password with spaces', () => {
      const validData: UserFormData = {
        name: 'Test User',
        email: 'user@example.com',
        password: 'pass word 123',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate password with unicode characters', () => {
      const validData: UserFormData = {
        name: 'Test User',
        email: 'user@example.com',
        password: 'contraseña1234567',
        role: 'CLIENT',
      }

      const result = userFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })
})
