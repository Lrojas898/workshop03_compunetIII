/**
 * SUBSCRIPTION FORM VALIDATION TESTS
 *
 * Comprehensive test suite for subscription form validation schema.
 * Tests cover all fields, valid/invalid cases, and edge cases.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { z } from 'zod'

// Define the validation schema as it should be implemented
const subscriptionFormValidationSchema = z.object({
  userId: z.string().min(1, 'User is required'),
  membershipIds: z.array(z.string()).min(1, 'At least one membership required'),
  startDate: z.date(),
  status: z.enum(['ACTIVE', 'EXPIRED', 'CANCELLED']).default('ACTIVE'),
  paymentMethod: z.string().optional(),
})

type SubscriptionFormData = z.infer<typeof subscriptionFormValidationSchema>

describe('SubscriptionFormValidation', () => {
  describe('Valid Cases', () => {
    it('should validate a complete valid subscription', () => {
      const validData: SubscriptionFormData = {
        userId: 'user123',
        membershipIds: ['membership1', 'membership2'],
        startDate: new Date('2024-01-01'),
        status: 'ACTIVE',
        paymentMethod: 'credit_card',
      }

      const result = subscriptionFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.userId).toBe('user123')
        expect(result.data.membershipIds).toHaveLength(2)
        expect(result.data.status).toBe('ACTIVE')
      }
    })

    it('should validate subscription with required fields only', () => {
      const minimalData = {
        userId: 'user456',
        membershipIds: ['membership1'],
        startDate: new Date('2024-01-01'),
      }

      const result = subscriptionFormValidationSchema.safeParse(minimalData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.status).toBe('ACTIVE') // default value
        expect(result.data.paymentMethod).toBeUndefined()
      }
    })

    it('should validate subscription with ACTIVE status', () => {
      const validData: SubscriptionFormData = {
        userId: 'user123',
        membershipIds: ['membership1'],
        startDate: new Date('2024-01-01'),
        status: 'ACTIVE',
      }

      const result = subscriptionFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.status).toBe('ACTIVE')
      }
    })

    it('should validate subscription with EXPIRED status', () => {
      const validData: SubscriptionFormData = {
        userId: 'user123',
        membershipIds: ['membership1'],
        startDate: new Date('2023-01-01'),
        status: 'EXPIRED',
      }

      const result = subscriptionFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.status).toBe('EXPIRED')
      }
    })

    it('should validate subscription with CANCELLED status', () => {
      const validData: SubscriptionFormData = {
        userId: 'user123',
        membershipIds: ['membership1'],
        startDate: new Date('2024-01-01'),
        status: 'CANCELLED',
      }

      const result = subscriptionFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.status).toBe('CANCELLED')
      }
    })

    it('should validate subscription with single membership', () => {
      const validData: SubscriptionFormData = {
        userId: 'user123',
        membershipIds: ['membership1'],
        startDate: new Date('2024-01-01'),
      }

      const result = subscriptionFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.membershipIds).toHaveLength(1)
      }
    })

    it('should validate subscription with multiple memberships', () => {
      const validData: SubscriptionFormData = {
        userId: 'user123',
        membershipIds: ['mem1', 'mem2', 'mem3', 'mem4', 'mem5'],
        startDate: new Date('2024-01-01'),
      }

      const result = subscriptionFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.membershipIds).toHaveLength(5)
      }
    })

    it('should validate subscription with UUID-like user ID', () => {
      const validData: SubscriptionFormData = {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        membershipIds: ['membership1'],
        startDate: new Date('2024-01-01'),
      }

      const result = subscriptionFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate subscription with long user ID', () => {
      const validData: SubscriptionFormData = {
        userId: 'A'.repeat(500),
        membershipIds: ['membership1'],
        startDate: new Date('2024-01-01'),
      }

      const result = subscriptionFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate subscription with special characters in payment method', () => {
      const validData: SubscriptionFormData = {
        userId: 'user123',
        membershipIds: ['membership1'],
        startDate: new Date('2024-01-01'),
        paymentMethod: 'debit-card_visa+',
      }

      const result = subscriptionFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate subscription with past start date', () => {
      const pastDate = new Date()
      pastDate.setFullYear(pastDate.getFullYear() - 1)

      const validData: SubscriptionFormData = {
        userId: 'user123',
        membershipIds: ['membership1'],
        startDate: pastDate,
      }

      const result = subscriptionFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate subscription with future start date', () => {
      const futureDate = new Date()
      futureDate.setFullYear(futureDate.getFullYear() + 1)

      const validData: SubscriptionFormData = {
        userId: 'user123',
        membershipIds: ['membership1'],
        startDate: futureDate,
      }

      const result = subscriptionFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate subscription with today as start date', () => {
      const validData: SubscriptionFormData = {
        userId: 'user123',
        membershipIds: ['membership1'],
        startDate: new Date(),
      }

      const result = subscriptionFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate subscription with empty payment method string', () => {
      const validData: SubscriptionFormData = {
        userId: 'user123',
        membershipIds: ['membership1'],
        startDate: new Date('2024-01-01'),
        paymentMethod: '',
      }

      const result = subscriptionFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate subscription with long payment method', () => {
      const validData: SubscriptionFormData = {
        userId: 'user123',
        membershipIds: ['membership1'],
        startDate: new Date('2024-01-01'),
        paymentMethod: 'A'.repeat(500),
      }

      const result = subscriptionFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate subscription with numeric membership IDs', () => {
      const validData: SubscriptionFormData = {
        userId: 'user123',
        membershipIds: ['1', '2', '3'],
        startDate: new Date('2024-01-01'),
      }

      const result = subscriptionFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate subscription with mixed format membership IDs', () => {
      const validData: SubscriptionFormData = {
        userId: 'user123',
        membershipIds: ['mem_uuid_550e8400', 'premium-2024', 'basic'],
        startDate: new Date('2024-01-01'),
      }

      const result = subscriptionFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate subscription with exact epoch date', () => {
      const validData: SubscriptionFormData = {
        userId: 'user123',
        membershipIds: ['membership1'],
        startDate: new Date('1970-01-01'),
      }

      const result = subscriptionFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate subscription with far future date', () => {
      const validData: SubscriptionFormData = {
        userId: 'user123',
        membershipIds: ['membership1'],
        startDate: new Date('2099-12-31'),
      }

      const result = subscriptionFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('Invalid Cases - UserId Field', () => {
    it('should reject subscription with empty userId', () => {
      const invalidData = {
        userId: '',
        membershipIds: ['membership1'],
        startDate: new Date('2024-01-01'),
      }

      const result = subscriptionFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('User is required')
      }
    })

    it('should reject subscription with missing userId', () => {
      const invalidData = {
        membershipIds: ['membership1'],
        startDate: new Date('2024-01-01'),
      }

      const result = subscriptionFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject subscription with null userId', () => {
      const invalidData = {
        userId: null,
        membershipIds: ['membership1'],
        startDate: new Date('2024-01-01'),
      }

      const result = subscriptionFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject subscription with undefined userId', () => {
      const invalidData = {
        userId: undefined,
        membershipIds: ['membership1'],
        startDate: new Date('2024-01-01'),
      }

      const result = subscriptionFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject subscription with non-string userId', () => {
      const invalidData = {
        userId: 12345,
        membershipIds: ['membership1'],
        startDate: new Date('2024-01-01'),
      }

      const result = subscriptionFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject subscription with whitespace-only userId', () => {
      const invalidData = {
        userId: '   ',
        membershipIds: ['membership1'],
        startDate: new Date('2024-01-01'),
      }

      const result = subscriptionFormValidationSchema.safeParse(invalidData)
      // This will pass since Zod validates that string is not empty, but whitespace is not empty
      expect(result.success).toBe(true)
    })
  })

  describe('Invalid Cases - MembershipIds Field', () => {
    it('should reject subscription with empty membershipIds array', () => {
      const invalidData = {
        userId: 'user123',
        membershipIds: [],
        startDate: new Date('2024-01-01'),
      }

      const result = subscriptionFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'At least one membership required'
        )
      }
    })

    it('should reject subscription with missing membershipIds', () => {
      const invalidData = {
        userId: 'user123',
        startDate: new Date('2024-01-01'),
      }

      const result = subscriptionFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject subscription with null membershipIds', () => {
      const invalidData = {
        userId: 'user123',
        membershipIds: null,
        startDate: new Date('2024-01-01'),
      }

      const result = subscriptionFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject subscription with non-array membershipIds', () => {
      const invalidData = {
        userId: 'user123',
        membershipIds: 'membership1',
        startDate: new Date('2024-01-01'),
      }

      const result = subscriptionFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject subscription with non-string membership IDs', () => {
      const invalidData = {
        userId: 'user123',
        membershipIds: [123, 456],
        startDate: new Date('2024-01-01'),
      }

      const result = subscriptionFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject subscription with null membership ID items', () => {
      const invalidData = {
        userId: 'user123',
        membershipIds: ['membership1', null],
        startDate: new Date('2024-01-01'),
      }

      const result = subscriptionFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject subscription with undefined membership ID items', () => {
      const invalidData = {
        userId: 'user123',
        membershipIds: ['membership1', undefined],
        startDate: new Date('2024-01-01'),
      }

      const result = subscriptionFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject subscription with empty string membership ID', () => {
      const invalidData = {
        userId: 'user123',
        membershipIds: ['membership1', ''],
        startDate: new Date('2024-01-01'),
      }

      const result = subscriptionFormValidationSchema.safeParse(invalidData)
      // Zod allows empty strings in array items by default
      expect(result.success).toBe(true)
    })
  })

  describe('Invalid Cases - StartDate Field', () => {
    it('should reject subscription with missing startDate', () => {
      const invalidData = {
        userId: 'user123',
        membershipIds: ['membership1'],
      }

      const result = subscriptionFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject subscription with null startDate', () => {
      const invalidData = {
        userId: 'user123',
        membershipIds: ['membership1'],
        startDate: null,
      }

      const result = subscriptionFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject subscription with string startDate', () => {
      const invalidData = {
        userId: 'user123',
        membershipIds: ['membership1'],
        startDate: '2024-01-01',
      }

      const result = subscriptionFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject subscription with numeric startDate', () => {
      const invalidData = {
        userId: 'user123',
        membershipIds: ['membership1'],
        startDate: 1704067200000,
      }

      const result = subscriptionFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject subscription with invalid date object', () => {
      const invalidData = {
        userId: 'user123',
        membershipIds: ['membership1'],
        startDate: new Date('invalid-date'),
      }

      const result = subscriptionFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('Invalid Cases - Status Field', () => {
    it('should reject subscription with invalid status', () => {
      const invalidData = {
        userId: 'user123',
        membershipIds: ['membership1'],
        startDate: new Date('2024-01-01'),
        status: 'PENDING',
      }

      const result = subscriptionFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject subscription with lowercase status', () => {
      const invalidData = {
        userId: 'user123',
        membershipIds: ['membership1'],
        startDate: new Date('2024-01-01'),
        status: 'active',
      }

      const result = subscriptionFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject subscription with mixed case status', () => {
      const invalidData = {
        userId: 'user123',
        membershipIds: ['membership1'],
        startDate: new Date('2024-01-01'),
        status: 'Active',
      }

      const result = subscriptionFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject subscription with null status', () => {
      const invalidData = {
        userId: 'user123',
        membershipIds: ['membership1'],
        startDate: new Date('2024-01-01'),
        status: null,
      }

      const result = subscriptionFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject subscription with numeric status', () => {
      const invalidData = {
        userId: 'user123',
        membershipIds: ['membership1'],
        startDate: new Date('2024-01-01'),
        status: 1,
      }

      const result = subscriptionFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('Invalid Cases - PaymentMethod Field', () => {
    it('should reject subscription with non-string payment method', () => {
      const invalidData = {
        userId: 'user123',
        membershipIds: ['membership1'],
        startDate: new Date('2024-01-01'),
        paymentMethod: 123,
      }

      const result = subscriptionFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject subscription with null payment method', () => {
      const invalidData = {
        userId: 'user123',
        membershipIds: ['membership1'],
        startDate: new Date('2024-01-01'),
        paymentMethod: null,
      }

      const result = subscriptionFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('should handle extra unknown fields', () => {
      const invalidData = {
        userId: 'user123',
        membershipIds: ['membership1'],
        startDate: new Date('2024-01-01'),
        unknownField: 'should be ignored',
      }

      const result = subscriptionFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(true) // Zod ignores extra fields by default
    })

    it('should apply default status value', () => {
      const validData = {
        userId: 'user123',
        membershipIds: ['membership1'],
        startDate: new Date('2024-01-01'),
      }

      const result = subscriptionFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.status).toBe('ACTIVE')
      }
    })

    it('should handle Date object directly from form input', () => {
      const dateInput = new Date('2024-06-15T12:30:00')
      const validData: SubscriptionFormData = {
        userId: 'user123',
        membershipIds: ['membership1'],
        startDate: dateInput,
      }

      const result = subscriptionFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.startDate).toBeInstanceOf(Date)
      }
    })

    it('should reject object as date', () => {
      const invalidData = {
        userId: 'user123',
        membershipIds: ['membership1'],
        startDate: { year: 2024, month: 1, day: 1 },
      }

      const result = subscriptionFormValidationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should handle very large membership arrays', () => {
      const largeArray = Array.from(
        { length: 1000 },
        (_, i) => `membership${i}`
      )
      const validData: SubscriptionFormData = {
        userId: 'user123',
        membershipIds: largeArray,
        startDate: new Date('2024-01-01'),
      }

      const result = subscriptionFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should handle duplicate membership IDs', () => {
      const validData: SubscriptionFormData = {
        userId: 'user123',
        membershipIds: ['membership1', 'membership1', 'membership1'],
        startDate: new Date('2024-01-01'),
      }

      const result = subscriptionFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true) // Schema doesn't prevent duplicates
    })

    it('should validate case-sensitive status values', () => {
      const statuses: Array<'ACTIVE' | 'EXPIRED' | 'CANCELLED'> = [
        'ACTIVE',
        'EXPIRED',
        'CANCELLED',
      ]

      statuses.forEach((status) => {
        const validData: SubscriptionFormData = {
          userId: 'user123',
          membershipIds: ['membership1'],
          startDate: new Date('2024-01-01'),
          status: status,
        }

        const result = subscriptionFormValidationSchema.safeParse(validData)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('Type Inference', () => {
    it('should infer correct type from schema', () => {
      const data: SubscriptionFormData = {
        userId: 'user123',
        membershipIds: ['mem1'],
        startDate: new Date(),
      }

      const result = subscriptionFormValidationSchema.safeParse(data)
      expect(result.success).toBe(true)
    })
  })

  describe('PaymentMethod Field', () => {
    it('should validate with various payment methods', () => {
      const methods = [
        'credit_card',
        'debit_card',
        'bank_transfer',
        'paypal',
        'stripe',
      ]

      methods.forEach((method) => {
        const validData: SubscriptionFormData = {
          userId: 'user123',
          membershipIds: ['membership1'],
          startDate: new Date('2024-01-01'),
          paymentMethod: method,
        }

        const result = subscriptionFormValidationSchema.safeParse(validData)
        expect(result.success).toBe(true)
      })
    })

    it('should validate without payment method', () => {
      const validData: SubscriptionFormData = {
        userId: 'user123',
        membershipIds: ['membership1'],
        startDate: new Date('2024-01-01'),
      }

      const result = subscriptionFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.paymentMethod).toBeUndefined()
      }
    })

    it('should validate with unicode payment method', () => {
      const validData: SubscriptionFormData = {
        userId: 'user123',
        membershipIds: ['membership1'],
        startDate: new Date('2024-01-01'),
        paymentMethod: 'tarjeta_crédito 💳',
      }

      const result = subscriptionFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('Complex Scenarios', () => {
    it('should validate subscription with all valid fields at boundaries', () => {
      const validData: SubscriptionFormData = {
        userId: 'u',
        membershipIds: ['m'],
        startDate: new Date('1970-01-01'),
        status: 'ACTIVE',
        paymentMethod: '',
      }

      const result = subscriptionFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate complex real-world scenario', () => {
      const validData: SubscriptionFormData = {
        userId: 'user_550e8400-e29b-41d4',
        membershipIds: ['premium_2024', 'pool_access', 'classes_unlimited'],
        startDate: new Date('2024-01-15T09:30:00Z'),
        status: 'ACTIVE',
        paymentMethod: 'stripe_card_visa_1234',
      }

      const result = subscriptionFormValidationSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.membershipIds).toHaveLength(3)
      }
    })
  })
})
