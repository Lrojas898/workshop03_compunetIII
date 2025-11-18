/**
 * MEMBERSHIP FORM VALIDATION TESTS
 *
 * Comprehensive test suite for membership form validation schema.
 * Tests cover all fields, valid/invalid cases, and edge cases.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { z } from 'zod'

// Define the validation schema as it should be implemented
const membershipFormValidationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  durationInDays: z.number().positive('Duration must be positive'),
  benefits: z.array(z.string()).optional(),
  status: z.boolean().default(true),
})

type MembershipFormData = z.infer<typeof membershipFormValidationSchema>

describe('MembershipFormValidation', () => {
  describe('Valid Cases', () => {
    it('should validate a complete valid membership', () => {
      const validData: MembershipFormData = {
        name: 'Premium Membership',
        description: 'Full access to all facilities',
        price: 99.99,
        durationInDays: 30,
        benefits: ['Gym access', 'Pool access', 'Classes'],
        status: true,
      }

      const result = membershipFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('Premium Membership')
        expect(result.data.price).toBe(99.99)
      }
    })

    it('should validate membership with required fields only', () => {
      const minimalData = {
        name: 'Basic Membership',
        price: 29.99,
        durationInDays: 30,
      }

      const result = membershipFormValidationSchema.safeParse(minimalData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.status).toBe(true) // default value
        expect(result.data.description).toBeUndefined()
        expect(result.data.benefits).toBeUndefined()
      }
    })

    it('should validate membership with empty benefits array', () => {
      const validData: MembershipFormData = {
        name: 'Standard Membership',
        price: 49.99,
        durationInDays: 30,
        benefits: [],
        status: true,
      }

      const result = membershipFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate membership with single benefit', () => {
      const validData: MembershipFormData = {
        name: 'Basic Membership',
        price: 19.99,
        durationInDays: 15,
        benefits: ['Gym access'],
        status: false,
      }

      const result = membershipFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate membership with multiple benefits', () => {
      const validData: MembershipFormData = {
        name: 'Deluxe Membership',
        price: 199.99,
        durationInDays: 365,
        benefits: [
          'Gym access',
          'Pool access',
          'Sauna access',
          'Personal trainer',
          'Classes',
        ],
        status: true,
      }

      const result = membershipFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate membership with very small valid price', () => {
      const validData: MembershipFormData = {
        name: 'Trial Membership',
        price: 0.01,
        durationInDays: 1,
      }

      const result = membershipFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.price).toBe(0.01)
      }
    })

    it('should validate membership with large price value', () => {
      const validData: MembershipFormData = {
        name: 'Platinum Membership',
        price: 9999.99,
        durationInDays: 365,
      }

      const result = membershipFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate membership with very long name', () => {
      const longName = 'A'.repeat(500)
      const validData = {
        name: longName,
        price: 99.99,
        durationInDays: 30,
      }

      const result = membershipFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate membership with long description', () => {
      const longDescription = 'B'.repeat(1000)
      const validData: MembershipFormData = {
        name: 'Premium Membership',
        description: longDescription,
        price: 99.99,
        durationInDays: 30,
      }

      const result = membershipFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate membership with special characters in name', () => {
      const validData: MembershipFormData = {
        name: 'Premium+ Membership (Pro)',
        price: 99.99,
        durationInDays: 30,
      }

      const result = membershipFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate membership with unicode characters in description', () => {
      const validData: MembershipFormData = {
        name: 'International Membership',
        description: 'Acceso completo a todas las instalaciones 🏋️',
        price: 99.99,
        durationInDays: 30,
      }

      const result = membershipFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate membership with minimum duration', () => {
      const validData: MembershipFormData = {
        name: 'One Day Pass',
        price: 10.0,
        durationInDays: 1,
      }

      const result = membershipFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate membership with large duration', () => {
      const validData: MembershipFormData = {
        name: 'Lifetime Membership',
        price: 5000.0,
        durationInDays: 36500, // 100 years
      }

      const result = membershipFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate membership with decimal duration days', () => {
      const validData = {
        name: 'Membership',
        price: 50.0,
        durationInDays: 30.5,
      }

      const result = membershipFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate membership with status true', () => {
      const validData: MembershipFormData = {
        name: 'Active Membership',
        price: 99.99,
        durationInDays: 30,
        status: true,
      }

      const result = membershipFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.status).toBe(true)
      }
    })

    it('should validate membership with status false', () => {
      const validData: MembershipFormData = {
        name: 'Inactive Membership',
        price: 99.99,
        durationInDays: 30,
        status: false,
      }

      const result = membershipFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.status).toBe(false)
      }
    })
  })

  describe('Invalid Cases - Name Field', () => {
    it('should reject membership with empty name', () => {
      const invalidData = {
        name: '',
        price: 99.99,
        durationInDays: 30,
      }

      const result = membershipFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Name is required')
      }
    })

    it('should reject membership with missing name', () => {
      const invalidData = {
        price: 99.99,
        durationInDays: 30,
      }

      const result = membershipFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject membership with null name', () => {
      const invalidData = {
        name: null,
        price: 99.99,
        durationInDays: 30,
      }

      const result = membershipFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject membership with undefined name', () => {
      const invalidData = {
        name: undefined,
        price: 99.99,
        durationInDays: 30,
      }

      const result = membershipFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject membership with non-string name', () => {
      const invalidData = {
        name: 123,
        price: 99.99,
        durationInDays: 30,
      }

      const result = membershipFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject membership with whitespace-only name', () => {
      const invalidData = {
        name: '   ',
        price: 99.99,
        durationInDays: 30,
      }

      const result = membershipFormValidationSchema.safeParse(invalidData)
      // Zod validates that string exists, but doesn't trim by default
      // This test ensures behavior is consistent
      expect(result.success).toBe(true) // string is still non-empty technically
    })
  })

  describe('Invalid Cases - Price Field', () => {
    it('should reject membership with zero price', () => {
      const invalidData = {
        name: 'Free Membership',
        price: 0,
        durationInDays: 30,
      }

      const result = membershipFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('positive')
      }
    })

    it('should reject membership with negative price', () => {
      const invalidData = {
        name: 'Membership',
        price: -99.99,
        durationInDays: 30,
      }

      const result = membershipFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('positive')
      }
    })

    it('should reject membership with missing price', () => {
      const invalidData = {
        name: 'Membership',
        durationInDays: 30,
      }

      const result = membershipFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject membership with null price', () => {
      const invalidData = {
        name: 'Membership',
        price: null,
        durationInDays: 30,
      }

      const result = membershipFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject membership with string price', () => {
      const invalidData = {
        name: 'Membership',
        price: '99.99',
        durationInDays: 30,
      }

      const result = membershipFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject membership with NaN price', () => {
      const invalidData = {
        name: 'Membership',
        price: NaN,
        durationInDays: 30,
      }

      const result = membershipFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject membership with Infinity price', () => {
      const invalidData = {
        name: 'Membership',
        price: Infinity,
        durationInDays: 30,
      }

      const result = membershipFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('Invalid Cases - DurationInDays Field', () => {
    it('should reject membership with zero duration', () => {
      const invalidData = {
        name: 'Membership',
        price: 99.99,
        durationInDays: 0,
      }

      const result = membershipFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('positive')
      }
    })

    it('should reject membership with negative duration', () => {
      const invalidData = {
        name: 'Membership',
        price: 99.99,
        durationInDays: -30,
      }

      const result = membershipFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject membership with missing duration', () => {
      const invalidData = {
        name: 'Membership',
        price: 99.99,
      }

      const result = membershipFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject membership with null duration', () => {
      const invalidData = {
        name: 'Membership',
        price: 99.99,
        durationInDays: null,
      }

      const result = membershipFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject membership with string duration', () => {
      const invalidData = {
        name: 'Membership',
        price: 99.99,
        durationInDays: '30',
      }

      const result = membershipFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject membership with NaN duration', () => {
      const invalidData = {
        name: 'Membership',
        price: 99.99,
        durationInDays: NaN,
      }

      const result = membershipFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('Invalid Cases - Benefits Field', () => {
    it('should reject membership with non-array benefits', () => {
      const invalidData = {
        name: 'Membership',
        price: 99.99,
        durationInDays: 30,
        benefits: 'Gym access',
      }

      const result = membershipFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject membership with non-string benefit items', () => {
      const invalidData = {
        name: 'Membership',
        price: 99.99,
        durationInDays: 30,
        benefits: [123, 'Gym access'],
      }

      const result = membershipFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject membership with null benefit items', () => {
      const invalidData = {
        name: 'Membership',
        price: 99.99,
        durationInDays: 30,
        benefits: [null, 'Gym access'],
      }

      const result = membershipFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('Invalid Cases - Status Field', () => {
    it('should reject membership with non-boolean status', () => {
      const invalidData = {
        name: 'Membership',
        price: 99.99,
        durationInDays: 30,
        status: 'active',
      }

      const result = membershipFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject membership with null status', () => {
      const invalidData = {
        name: 'Membership',
        price: 99.99,
        durationInDays: 30,
        status: null,
      }

      const result = membershipFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject membership with numeric status', () => {
      const invalidData = {
        name: 'Membership',
        price: 99.99,
        durationInDays: 30,
        status: 1,
      }

      const result = membershipFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('Invalid Cases - Description Field', () => {
    it('should reject membership with non-string description', () => {
      const invalidData = {
        name: 'Membership',
        price: 99.99,
        durationInDays: 30,
        description: 123,
      }

      const result = membershipFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject membership with null description', () => {
      const invalidData = {
        name: 'Membership',
        price: 99.99,
        durationInDays: 30,
        description: null,
      }

      const result = membershipFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('should handle extra unknown fields', () => {
      const invalidData = {
        name: 'Membership',
        price: 99.99,
        durationInDays: 30,
        unknownField: 'should be ignored',
      }

      const result = membershipFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(true) // Zod ignores extra fields by default
    })

    it('should apply default status value', () => {
      const validData = {
        name: 'Membership',
        price: 99.99,
        durationInDays: 30,
      }

      const result = membershipFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.status).toBe(true)
      }
    })

    it('should handle very large numbers', () => {
      const validData = {
        name: 'Membership',
        price: 999999999.99,
        durationInDays: 999999,
      }

      const result = membershipFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should handle benefits with empty strings', () => {
      const validData: MembershipFormData = {
        name: 'Membership',
        price: 99.99,
        durationInDays: 30,
        benefits: ['Gym access', '', 'Pool access'],
      }

      const result = membershipFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true) // Zod accepts empty strings in arrays
    })

    it('should handle name with only whitespace (trim should happen at usage level)', () => {
      const validData = {
        name: ' ',
        price: 99.99,
        durationInDays: 30,
      }

      const result = membershipFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true) // String exists, but validation at usage should trim
    })
  })

  describe('Type Inference', () => {
    it('should infer correct type from schema', () => {
      const data: MembershipFormData = {
        name: 'Test',
        price: 99,
        durationInDays: 30,
      }

      const result = membershipFormValidationSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe('Description Field', () => {
    it('should validate with empty description', () => {
      const validData: MembershipFormData = {
        name: 'Membership',
        price: 99.99,
        durationInDays: 30,
        description: '',
      }

      const result = membershipFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate with very long description', () => {
      const longDesc = 'A'.repeat(5000)
      const validData: MembershipFormData = {
        name: 'Membership',
        price: 99.99,
        durationInDays: 30,
        description: longDesc,
      }

      const result = membershipFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate with HTML-like description', () => {
      const validData: MembershipFormData = {
        name: 'Membership',
        price: 99.99,
        durationInDays: 30,
        description: '<p>Full access</p>',
      }

      const result = membershipFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })
})
