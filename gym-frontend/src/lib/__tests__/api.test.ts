/**
 * API INSTANCE TESTS
 *
 * Tests para la configuración de Axios y sus interceptores
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import axiosInstance from '../api'
import { useAuthStore } from '@/app/_store/auth/auth.store'

// Mock del store
vi.mock('@/app/_store/auth/auth.store')

describe('API Instance', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Configuration', () => {
    it('should have correct base URL from env or default', () => {
      expect(axiosInstance.defaults.baseURL).toBe(
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
      )
    })

    it('should have correct timeout', () => {
      expect(axiosInstance.defaults.timeout).toBe(30000)
    })

    it('should have correct default headers', () => {
      expect(axiosInstance.defaults.headers['Content-Type']).toBe(
        'application/json'
      )
    })
  })

  describe('Request Interceptor', () => {
    it('should add Authorization header when token exists', async () => {
      const mockToken = 'test-jwt-token'
      ;(useAuthStore.getState as any).mockReturnValue({
        token: mockToken,
      })

      const config = { headers: {} }
      const requestInterceptor = axiosInstance.interceptors.request.handlers[0]

      const result = await requestInterceptor.fulfilled(config)

      expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`)
    })

    it('should not add Authorization header when token is null', async () => {
      ;(useAuthStore.getState as any).mockReturnValue({
        token: null,
      })

      const config = { headers: {} }
      const requestInterceptor = axiosInstance.interceptors.request.handlers[0]

      const result = await requestInterceptor.fulfilled(config)

      expect(result.headers.Authorization).toBeUndefined()
    })

    it('should handle request errors', async () => {
      const error = new Error('Request failed')
      const requestInterceptor = axiosInstance.interceptors.request.handlers[0]

      try {
        await requestInterceptor.rejected(error)
      } catch (e) {
        expect(e).toBe(error)
      }
    })
  })

  describe('Response Interceptor', () => {
    it('should return response on success', async () => {
      const mockResponse = { status: 200, data: { message: 'success' } }
      const responseInterceptor = axiosInstance.interceptors.response.handlers[0]

      const result = await responseInterceptor.fulfilled(mockResponse)

      expect(result).toBe(mockResponse)
    })

    it('should logout on 401 error', async () => {
      const mockLogout = vi.fn()
      ;(useAuthStore.getState as any).mockReturnValue({
        logout: mockLogout,
      })

      const error = {
        response: { status: 401 },
      }
      const responseInterceptor = axiosInstance.interceptors.response.handlers[0]

      try {
        await responseInterceptor.rejected(error)
      } catch (e) {
        expect(mockLogout).toHaveBeenCalled()
      }
    })

    it('should reject error when status is not 401', async () => {
      const error = {
        response: { status: 500, data: { message: 'Server error' } },
      }
      const responseInterceptor = axiosInstance.interceptors.response.handlers[0]

      try {
        await responseInterceptor.rejected(error)
      } catch (e) {
        expect(e).toBe(error)
      }
    })

    it('should reject error without response', async () => {
      const error = new Error('Network error')
      const responseInterceptor = axiosInstance.interceptors.response.handlers[0]

      try {
        await responseInterceptor.rejected(error)
      } catch (e) {
        expect(e).toBe(error)
      }
    })
  })
})
