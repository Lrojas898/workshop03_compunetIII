/**
 * API SERVICE TESTS
 *
 * Tests para el servicio HTTP genérico que envuelve axios
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import apiService from '../api.service'
import axiosInstance from '@/lib/api'

// Mock de axios instance
vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET method', () => {
    it('should call axios.get and return response.data', async () => {
      const mockData = { id: 1, name: 'Test' }
      const mockResponse = { data: mockData }

      ;(axiosInstance.get as any).mockResolvedValue(mockResponse)

      const result = await apiService.get('/test')

      expect(axiosInstance.get).toHaveBeenCalledWith('/test', undefined)
      expect(result).toEqual(mockData)
    })

    it('should pass config parameter to axios.get', async () => {
      const mockData = { id: 1 }
      const mockResponse = { data: mockData }
      const config = { headers: { 'X-Custom': 'header' } }

      ;(axiosInstance.get as any).mockResolvedValue(mockResponse)

      await apiService.get('/test', config)

      expect(axiosInstance.get).toHaveBeenCalledWith('/test', config)
    })

    it('should handle GET errors', async () => {
      const error = new Error('Get failed')

      ;(axiosInstance.get as any).mockRejectedValue(error)

      await expect(apiService.get('/test')).rejects.toThrow('Get failed')
    })
  })

  describe('POST method', () => {
    it('should call axios.post with data and return full response', async () => {
      const mockData = { id: 2, created: true }
      const mockResponse = { data: mockData, status: 201 }

      ;(axiosInstance.post as any).mockResolvedValue(mockResponse)

      const result = await apiService.post('/test', mockData)

      expect(axiosInstance.post).toHaveBeenCalledWith('/test', mockData, undefined)
      expect(result).toEqual(mockResponse)
    })

    it('should pass config parameter to axios.post', async () => {
      const mockData = { name: 'Test' }
      const mockResponse = { data: mockData, status: 201 }
      const config = { headers: { 'Content-Type': 'application/json' } }

      ;(axiosInstance.post as any).mockResolvedValue(mockResponse)

      await apiService.post('/test', mockData, config)

      expect(axiosInstance.post).toHaveBeenCalledWith('/test', mockData, config)
    })

    it('should handle POST without data', async () => {
      const mockResponse = { data: null, status: 201 }

      ;(axiosInstance.post as any).mockResolvedValue(mockResponse)

      const result = await apiService.post('/test')

      expect(axiosInstance.post).toHaveBeenCalledWith('/test', undefined, undefined)
      expect(result).toEqual(mockResponse)
    })

    it('should handle POST errors', async () => {
      const error = new Error('Post failed')

      ;(axiosInstance.post as any).mockRejectedValue(error)

      await expect(apiService.post('/test', { data: 'test' })).rejects.toThrow(
        'Post failed'
      )
    })
  })

  describe('PUT method', () => {
    it('should call axios.put with data and return full response', async () => {
      const mockData = { id: 3, updated: true }
      const mockResponse = { data: mockData, status: 200 }

      ;(axiosInstance.put as any).mockResolvedValue(mockResponse)

      const result = await apiService.put('/test/3', mockData)

      expect(axiosInstance.put).toHaveBeenCalledWith('/test/3', mockData, undefined)
      expect(result).toEqual(mockResponse)
    })

    it('should pass config parameter to axios.put', async () => {
      const mockData = { name: 'Updated' }
      const mockResponse = { data: mockData, status: 200 }
      const config = { headers: { 'X-Update': 'true' } }

      ;(axiosInstance.put as any).mockResolvedValue(mockResponse)

      await apiService.put('/test/3', mockData, config)

      expect(axiosInstance.put).toHaveBeenCalledWith('/test/3', mockData, config)
    })

    it('should handle PUT errors', async () => {
      const error = new Error('Put failed')

      ;(axiosInstance.put as any).mockRejectedValue(error)

      await expect(apiService.put('/test/3', { data: 'test' })).rejects.toThrow(
        'Put failed'
      )
    })
  })

  describe('PATCH method', () => {
    it('should call axios.patch with data and return full response', async () => {
      const mockData = { id: 4, patched: true }
      const mockResponse = { data: mockData, status: 200 }

      ;(axiosInstance.patch as any).mockResolvedValue(mockResponse)

      const result = await apiService.patch('/test/4', mockData)

      expect(axiosInstance.patch).toHaveBeenCalledWith('/test/4', mockData, undefined)
      expect(result).toEqual(mockResponse)
    })

    it('should pass config parameter to axios.patch', async () => {
      const mockData = { status: 'active' }
      const mockResponse = { data: mockData, status: 200 }
      const config = { headers: { 'X-Patch': 'true' } }

      ;(axiosInstance.patch as any).mockResolvedValue(mockResponse)

      await apiService.patch('/test/4', mockData, config)

      expect(axiosInstance.patch).toHaveBeenCalledWith('/test/4', mockData, config)
    })

    it('should handle PATCH errors', async () => {
      const error = new Error('Patch failed')

      ;(axiosInstance.patch as any).mockRejectedValue(error)

      await expect(apiService.patch('/test/4', { data: 'test' })).rejects.toThrow(
        'Patch failed'
      )
    })
  })

  describe('DELETE method', () => {
    it('should call axios.delete and return full response', async () => {
      const mockData = { id: 5, deleted: true }
      const mockResponse = { data: mockData, status: 200 }

      ;(axiosInstance.delete as any).mockResolvedValue(mockResponse)

      const result = await apiService.delete('/test/5')

      expect(axiosInstance.delete).toHaveBeenCalledWith('/test/5', undefined)
      expect(result).toEqual(mockResponse)
    })

    it('should pass config parameter to axios.delete', async () => {
      const mockResponse = { data: null, status: 204 }
      const config = { headers: { 'X-Delete': 'true' } }

      ;(axiosInstance.delete as any).mockResolvedValue(mockResponse)

      await apiService.delete('/test/5', config)

      expect(axiosInstance.delete).toHaveBeenCalledWith('/test/5', config)
    })

    it('should handle DELETE errors', async () => {
      const error = new Error('Delete failed')

      ;(axiosInstance.delete as any).mockRejectedValue(error)

      await expect(apiService.delete('/test/5')).rejects.toThrow('Delete failed')
    })
  })

  describe('Generic type support', () => {
    it('should support generic types for GET', async () => {
      interface User {
        id: string
        email: string
        name: string
      }

      const mockUser: User = { id: '1', email: 'test@example.com', name: 'Test' }
      const mockResponse = { data: mockUser }

      ;(axiosInstance.get as any).mockResolvedValue(mockResponse)

      const result = await apiService.get<User>('/users/1')

      expect(result).toEqual(mockUser)
      expect(result.email).toBe('test@example.com')
    })

    it('should support generic types for POST', async () => {
      interface CreateUserDto {
        email: string
        name: string
      }

      interface CreateUserResponse {
        id: string
        email: string
        name: string
        createdAt: string
      }

      const dto: CreateUserDto = { email: 'new@example.com', name: 'New User' }
      const mockResponse = {
        data: {
          id: '123',
          email: 'new@example.com',
          name: 'New User',
          createdAt: '2024-01-01',
        } as CreateUserResponse,
        status: 201,
      }

      ;(axiosInstance.post as any).mockResolvedValue(mockResponse)

      const result = await apiService.post<CreateUserResponse>('/users', dto)

      expect(result.data.id).toBe('123')
      expect(result.status).toBe(201)
    })
  })
})
