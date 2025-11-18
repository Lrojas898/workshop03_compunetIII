/**
 * API ENDPOINTS CONFIGURATION TESTS
 *
 * Tests para la configuración de endpoints y enums
 */

import { describe, it, expect } from 'vitest'
import { API_CONFIG, ValidRoles, AttendanceType } from '../api-endpoints'

describe('API Configuration', () => {
  describe('API_CONFIG', () => {
    it('should have BASE_URL configured', () => {
      expect(API_CONFIG.BASE_URL).toBeDefined()
      expect(typeof API_CONFIG.BASE_URL).toBe('string')
    })

    it('should have correct timeout', () => {
      expect(API_CONFIG.TIMEOUT).toBe(30000)
    })

    it('should have ENDPOINTS object', () => {
      expect(API_CONFIG.ENDPOINTS).toBeDefined()
      expect(typeof API_CONFIG.ENDPOINTS).toBe('object')
    })
  })

  describe('Auth Endpoints', () => {
    it('should have AUTH endpoint', () => {
      expect(API_CONFIG.ENDPOINTS.AUTH).toBe('/auth')
    })

    it('should have LOGIN endpoint', () => {
      expect(API_CONFIG.ENDPOINTS.LOGIN).toBe('/auth/login')
    })

    it('should have REGISTER endpoint', () => {
      expect(API_CONFIG.ENDPOINTS.REGISTER).toBe('/auth/register')
    })
  })

  describe('Memberships Endpoints', () => {
    it('should have MEMBERSHIPS endpoint', () => {
      expect(API_CONFIG.ENDPOINTS.MEMBERSHIPS).toBe('/memberships')
    })

    it('should generate MEMBERSHIP_BY_ID endpoint', () => {
      const id = '123'
      expect(API_CONFIG.ENDPOINTS.MEMBERSHIP_BY_ID(id)).toBe('/memberships/123')
    })

    it('should generate TOGGLE_MEMBERSHIP_STATUS endpoint', () => {
      const id = '456'
      expect(API_CONFIG.ENDPOINTS.TOGGLE_MEMBERSHIP_STATUS(id)).toBe(
        '/memberships/456/toggle-status'
      )
    })
  })

  describe('Subscriptions Endpoints', () => {
    it('should have SUBSCRIPTIONS endpoint', () => {
      expect(API_CONFIG.ENDPOINTS.SUBSCRIPTIONS).toBe('/subscriptions')
    })

    it('should generate SUBSCRIPTION_BY_ID endpoint', () => {
      const id = 'sub-123'
      expect(API_CONFIG.ENDPOINTS.SUBSCRIPTION_BY_ID(id)).toBe(
        '/subscriptions/sub-123'
      )
    })

    it('should generate SUBSCRIPTION_BY_USER endpoint', () => {
      const userId = 'user-456'
      expect(API_CONFIG.ENDPOINTS.SUBSCRIPTION_BY_USER(userId)).toBe(
        '/subscriptions/user/user-456'
      )
    })

    it('should generate SUBSCRIPTION_MEMBERSHIPS endpoint', () => {
      const id = 'sub-789'
      expect(API_CONFIG.ENDPOINTS.SUBSCRIPTION_MEMBERSHIPS(id)).toBe(
        '/subscriptions/sub-789/memberships'
      )
    })

    it('should generate SUBSCRIPTION_ACTIVATE endpoint', () => {
      const id = 'sub-activate'
      expect(API_CONFIG.ENDPOINTS.SUBSCRIPTION_ACTIVATE(id)).toBe(
        '/subscriptions/sub-activate/activate'
      )
    })

    it('should generate SUBSCRIPTION_DEACTIVATE endpoint', () => {
      const id = 'sub-deactivate'
      expect(API_CONFIG.ENDPOINTS.SUBSCRIPTION_DEACTIVATE(id)).toBe(
        '/subscriptions/sub-deactivate/deactivate'
      )
    })
  })

  describe('Attendances Endpoints', () => {
    it('should have ATTENDANCES endpoint', () => {
      expect(API_CONFIG.ENDPOINTS.ATTENDANCES).toBe('/attendances')
    })

    it('should have CHECK_IN endpoint', () => {
      expect(API_CONFIG.ENDPOINTS.CHECK_IN).toBe('/attendances/check-in')
    })

    it('should have CHECK_OUT endpoint', () => {
      expect(API_CONFIG.ENDPOINTS.CHECK_OUT).toBe('/attendances/check-out')
    })

    it('should generate ATTENDANCE_STATUS endpoint', () => {
      const userId = 'user-123'
      expect(API_CONFIG.ENDPOINTS.ATTENDANCE_STATUS(userId)).toBe(
        '/attendances/status/user-123'
      )
    })

    it('should generate ATTENDANCE_HISTORY endpoint', () => {
      const userId = 'user-456'
      expect(API_CONFIG.ENDPOINTS.ATTENDANCE_HISTORY(userId)).toBe(
        '/attendances/history/user-456'
      )
    })

    it('should generate ATTENDANCE_STATS endpoint', () => {
      const userId = 'user-789'
      expect(API_CONFIG.ENDPOINTS.ATTENDANCE_STATS(userId)).toBe(
        '/attendances/stats/user-789'
      )
    })

    it('should have ACTIVE_ATTENDANCES endpoint', () => {
      expect(API_CONFIG.ENDPOINTS.ACTIVE_ATTENDANCES).toBe('/attendances/active')
    })

    it('should have REGISTER_CLASS endpoint', () => {
      expect(API_CONFIG.ENDPOINTS.REGISTER_CLASS).toBe(
        '/attendances/class/register'
      )
    })

    it('should have MY_CLASSES endpoint', () => {
      expect(API_CONFIG.ENDPOINTS.MY_CLASSES).toBe('/attendances/class/my-classes')
    })

    it('should have TODAY_CLASSES endpoint', () => {
      expect(API_CONFIG.ENDPOINTS.TODAY_CLASSES).toBe('/attendances/class/today')
    })
  })

  describe('Classes Endpoints', () => {
    it('should have CLASSES endpoint', () => {
      expect(API_CONFIG.ENDPOINTS.CLASSES).toBe('/classes')
    })

    it('should generate CLASS_BY_ID endpoint', () => {
      const id = 'class-123'
      expect(API_CONFIG.ENDPOINTS.CLASS_BY_ID(id)).toBe('/classes/class-123')
    })

    it('should have ACTIVE_CLASSES endpoint', () => {
      expect(API_CONFIG.ENDPOINTS.ACTIVE_CLASSES).toBe('/classes/active')
    })

    it('should generate TOGGLE_CLASS_STATUS endpoint', () => {
      const id = 'class-456'
      expect(API_CONFIG.ENDPOINTS.TOGGLE_CLASS_STATUS(id)).toBe(
        '/classes/class-456/toggle-active'
      )
    })
  })

  describe('Seed Endpoint', () => {
    it('should have SEED endpoint for development', () => {
      expect(API_CONFIG.ENDPOINTS.SEED).toBe('/seed')
    })
  })
})

describe('ValidRoles Enum', () => {
  it('should have ADMIN role', () => {
    expect(ValidRoles.ADMIN).toBe('admin')
  })

  it('should have COACH role', () => {
    expect(ValidRoles.COACH).toBe('coach')
  })

  it('should have CLIENT role', () => {
    expect(ValidRoles.CLIENT).toBe('client')
  })

  it('should have RECEPTIONIST role', () => {
    expect(ValidRoles.RECEPTIONIST).toBe('receptionist')
  })

  it('should have 4 total roles', () => {
    const roles = Object.values(ValidRoles)
    expect(roles).toHaveLength(4)
  })
})

describe('AttendanceType Enum', () => {
  it('should have GYM type', () => {
    expect(AttendanceType.GYM).toBe('gym')
  })

  it('should have CLASS type', () => {
    expect(AttendanceType.CLASS).toBe('class')
  })

  it('should have 2 total types', () => {
    const types = Object.values(AttendanceType)
    expect(types).toHaveLength(2)
  })
})
