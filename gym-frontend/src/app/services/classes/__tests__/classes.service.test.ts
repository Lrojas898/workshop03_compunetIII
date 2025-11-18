/**
 * CLASSES SERVICE - Unit Tests
 *
 * Comprehensive unit tests for the classes service using vitest.
 * Tests all CRUD operations and API interactions.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import classesService from '../classes.service';
import apiService from '../../api.service';
import { API_CONFIG } from '@/lib/configuration/api-endpoints';
import type {
  Class,
  CreateClassDto,
  UpdateClassDto,
} from '@/app/interfaces/classes.interface';
import type { User } from '@/app/interfaces/auth.interface';

// Mock the apiService
vi.mock('../../api.service', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock API_CONFIG
vi.mock('@/lib/configuration/api-endpoints', () => ({
  API_CONFIG: {
    ENDPOINTS: {
      CLASSES: '/classes',
      ACTIVE_CLASSES: '/classes/active',
      CLASS_BY_ID: (id: string) => `/classes/${id}`,
      TOGGLE_CLASS_STATUS: (id: string) => `/classes/${id}/toggle-active`,
    },
  },
}));

// Sample data for testing
const mockUser: User = {
  id: 'user-1',
  email: 'coach@example.com',
  password: '',
  name: 'John Coach',
  roles: ['coach'],
  isActive: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const mockClass: Class = {
  id: 'class-1',
  name: 'Yoga',
  description: 'Relaxing yoga class',
  duration_minutes: 60,
  max_capacity: 20,
  isActive: true,
  createdBy: mockUser,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const mockClassList: Class[] = [
  mockClass,
  {
    id: 'class-2',
    name: 'Pilates',
    description: 'Core strengthening',
    duration_minutes: 45,
    max_capacity: 15,
    isActive: true,
    createdBy: mockUser,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
];

const mockCreateDto: CreateClassDto = {
  name: 'Boxing',
  description: 'High-intensity boxing',
  duration_minutes: 50,
  max_capacity: 12,
  isActive: true,
};

const mockUpdateDto: UpdateClassDto = {
  name: 'Advanced Yoga',
  description: 'Advanced yoga techniques',
  duration_minutes: 75,
};

describe('ClassesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all classes successfully', async () => {
      // Arrange
      vi.mocked(apiService.get).mockResolvedValueOnce(mockClassList);

      // Act
      const result = await classesService.getAll();

      // Assert
      expect(apiService.get).toHaveBeenCalledWith('/classes');
      expect(apiService.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockClassList);
      expect(result).toHaveLength(2);
    });

    it('should handle empty class list', async () => {
      // Arrange
      vi.mocked(apiService.get).mockResolvedValueOnce([]);

      // Act
      const result = await classesService.getAll();

      // Assert
      expect(apiService.get).toHaveBeenCalledWith('/classes');
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle API error when fetching all classes', async () => {
      // Arrange
      const error = new Error('Network error');
      vi.mocked(apiService.get).mockRejectedValueOnce(error);

      // Act & Assert
      await expect(classesService.getAll()).rejects.toThrow('Network error');
      expect(apiService.get).toHaveBeenCalledWith('/classes');
    });
  });

  describe('getActive', () => {
    it('should fetch only active classes successfully', async () => {
      // Arrange
      const activeClasses = mockClassList.filter((c) => c.isActive);
      vi.mocked(apiService.get).mockResolvedValueOnce(activeClasses);

      // Act
      const result = await classesService.getActive();

      // Assert
      expect(apiService.get).toHaveBeenCalledWith('/classes/active');
      expect(apiService.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(activeClasses);
      expect(result.every((c) => c.isActive)).toBe(true);
    });

    it('should return empty array when no active classes exist', async () => {
      // Arrange
      vi.mocked(apiService.get).mockResolvedValueOnce([]);

      // Act
      const result = await classesService.getActive();

      // Assert
      expect(apiService.get).toHaveBeenCalledWith('/classes/active');
      expect(result).toEqual([]);
    });

    it('should handle API error when fetching active classes', async () => {
      // Arrange
      const error = new Error('Server error');
      vi.mocked(apiService.get).mockRejectedValueOnce(error);

      // Act & Assert
      await expect(classesService.getActive()).rejects.toThrow('Server error');
      expect(apiService.get).toHaveBeenCalledWith('/classes/active');
    });
  });

  describe('getById', () => {
    it('should fetch a specific class by ID successfully', async () => {
      // Arrange
      const classId = 'class-1';
      vi.mocked(apiService.get).mockResolvedValueOnce(mockClass);

      // Act
      const result = await classesService.getById(classId);

      // Assert
      expect(apiService.get).toHaveBeenCalledWith('/classes/class-1');
      expect(apiService.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockClass);
      expect(result.id).toBe(classId);
    });

    it('should handle different class IDs correctly', async () => {
      // Arrange
      const classId = 'class-123-abc';
      const expectedClass = { ...mockClass, id: classId };
      vi.mocked(apiService.get).mockResolvedValueOnce(expectedClass);

      // Act
      const result = await classesService.getById(classId);

      // Assert
      expect(apiService.get).toHaveBeenCalledWith(`/classes/${classId}`);
      expect(result.id).toBe(classId);
    });

    it('should handle API error when fetching class by ID', async () => {
      // Arrange
      const error = new Error('Class not found');
      vi.mocked(apiService.get).mockRejectedValueOnce(error);

      // Act & Assert
      await expect(classesService.getById('class-1')).rejects.toThrow(
        'Class not found'
      );
      expect(apiService.get).toHaveBeenCalledWith('/classes/class-1');
    });

    it('should handle 404 error for non-existent class', async () => {
      // Arrange
      const error = new Error('Not found');
      vi.mocked(apiService.get).mockRejectedValueOnce(error);

      // Act & Assert
      await expect(classesService.getById('non-existent')).rejects.toThrow(
        'Not found'
      );
    });
  });

  describe('create', () => {
    it('should create a new class successfully', async () => {
      // Arrange
      const mockResponse = { data: mockClass };
      vi.mocked(apiService.post).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await classesService.create(mockCreateDto);

      // Assert
      expect(apiService.post).toHaveBeenCalledWith(
        '/classes',
        mockCreateDto
      );
      expect(apiService.post).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockClass);
      expect(result.id).toBeDefined();
    });

    it('should create a class with minimal required fields', async () => {
      // Arrange
      const minimalDto: CreateClassDto = {
        name: 'Minimal Class',
      };
      const createdClass = {
        ...mockClass,
        name: 'Minimal Class',
        description: undefined,
      };
      const mockResponse = { data: createdClass };
      vi.mocked(apiService.post).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await classesService.create(minimalDto);

      // Assert
      expect(apiService.post).toHaveBeenCalledWith('/classes', minimalDto);
      expect(result.name).toBe('Minimal Class');
    });

    it('should create a class with all optional fields', async () => {
      // Arrange
      const fullDto: CreateClassDto = {
        name: 'Full Class',
        description: 'Full description',
        duration_minutes: 90,
        max_capacity: 25,
        isActive: true,
      };
      const createdClass = { ...mockClass, ...fullDto };
      const mockResponse = { data: createdClass };
      vi.mocked(apiService.post).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await classesService.create(fullDto);

      // Assert
      expect(apiService.post).toHaveBeenCalledWith('/classes', fullDto);
      expect(result).toMatchObject(fullDto);
    });

    it('should handle API error when creating a class', async () => {
      // Arrange
      const error = new Error('Validation failed');
      vi.mocked(apiService.post).mockRejectedValueOnce(error);

      // Act & Assert
      await expect(classesService.create(mockCreateDto)).rejects.toThrow(
        'Validation failed'
      );
      expect(apiService.post).toHaveBeenCalledWith(
        '/classes',
        mockCreateDto
      );
    });

    it('should handle 400 error for invalid data', async () => {
      // Arrange
      const error = new Error('Bad request');
      vi.mocked(apiService.post).mockRejectedValueOnce(error);

      // Act & Assert
      await expect(classesService.create(mockCreateDto)).rejects.toThrow(
        'Bad request'
      );
    });
  });

  describe('update', () => {
    it('should update a class successfully', async () => {
      // Arrange
      const classId = 'class-1';
      const updatedClass = { ...mockClass, ...mockUpdateDto };
      const mockResponse = { data: updatedClass };
      vi.mocked(apiService.patch).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await classesService.update(classId, mockUpdateDto);

      // Assert
      expect(apiService.patch).toHaveBeenCalledWith(
        `/classes/${classId}`,
        mockUpdateDto
      );
      expect(apiService.patch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedClass);
      expect(result.name).toBe(mockUpdateDto.name);
    });

    it('should update only specified fields', async () => {
      // Arrange
      const classId = 'class-1';
      const partialDto: UpdateClassDto = { name: 'New Name' };
      const updatedClass = { ...mockClass, name: 'New Name' };
      const mockResponse = { data: updatedClass };
      vi.mocked(apiService.patch).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await classesService.update(classId, partialDto);

      // Assert
      expect(apiService.patch).toHaveBeenCalledWith(
        `/classes/${classId}`,
        partialDto
      );
      expect(result.name).toBe('New Name');
      expect(result.description).toBe(mockClass.description);
    });

    it('should handle different class IDs', async () => {
      // Arrange
      const classId = 'class-abc-123';
      const mockResponse = { data: mockClass };
      vi.mocked(apiService.patch).mockResolvedValueOnce(mockResponse);

      // Act
      await classesService.update(classId, mockUpdateDto);

      // Assert
      expect(apiService.patch).toHaveBeenCalledWith(
        `/classes/${classId}`,
        mockUpdateDto
      );
    });

    it('should handle API error when updating a class', async () => {
      // Arrange
      const error = new Error('Class not found');
      vi.mocked(apiService.patch).mockRejectedValueOnce(error);

      // Act & Assert
      await expect(
        classesService.update('class-1', mockUpdateDto)
      ).rejects.toThrow('Class not found');
      expect(apiService.patch).toHaveBeenCalledWith(
        '/classes/class-1',
        mockUpdateDto
      );
    });

    it('should handle 404 error for non-existent class', async () => {
      // Arrange
      const error = new Error('Not found');
      vi.mocked(apiService.patch).mockRejectedValueOnce(error);

      // Act & Assert
      await expect(
        classesService.update('non-existent', mockUpdateDto)
      ).rejects.toThrow('Not found');
    });
  });

  describe('toggleActive', () => {
    it('should toggle class active status successfully', async () => {
      // Arrange
      const classId = 'class-1';
      const toggledClass = { ...mockClass, isActive: false };
      const mockResponse = { data: toggledClass };
      vi.mocked(apiService.patch).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await classesService.toggleActive(classId);

      // Assert
      expect(apiService.patch).toHaveBeenCalledWith(
        `/classes/${classId}/toggle-active`
      );
      expect(apiService.patch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(toggledClass);
      expect(result.isActive).toBe(false);
    });

    it('should toggle active to inactive', async () => {
      // Arrange
      const classId = 'class-1';
      const inactiveClass = { ...mockClass, isActive: false };
      const mockResponse = { data: inactiveClass };
      vi.mocked(apiService.patch).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await classesService.toggleActive(classId);

      // Assert
      expect(result.isActive).toBe(false);
    });

    it('should toggle inactive to active', async () => {
      // Arrange
      const classId = 'class-1';
      const activeClass = { ...mockClass, isActive: true };
      const mockResponse = { data: activeClass };
      vi.mocked(apiService.patch).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await classesService.toggleActive(classId);

      // Assert
      expect(result.isActive).toBe(true);
    });

    it('should handle different class IDs', async () => {
      // Arrange
      const classId = 'class-xyz-789';
      const mockResponse = { data: mockClass };
      vi.mocked(apiService.patch).mockResolvedValueOnce(mockResponse);

      // Act
      await classesService.toggleActive(classId);

      // Assert
      expect(apiService.patch).toHaveBeenCalledWith(
        `/classes/${classId}/toggle-active`
      );
    });

    it('should handle API error when toggling status', async () => {
      // Arrange
      const error = new Error('Unable to toggle status');
      vi.mocked(apiService.patch).mockRejectedValueOnce(error);

      // Act & Assert
      await expect(classesService.toggleActive('class-1')).rejects.toThrow(
        'Unable to toggle status'
      );
      expect(apiService.patch).toHaveBeenCalledWith(
        '/classes/class-1/toggle-active'
      );
    });

    it('should handle 404 error for non-existent class', async () => {
      // Arrange
      const error = new Error('Not found');
      vi.mocked(apiService.patch).mockRejectedValueOnce(error);

      // Act & Assert
      await expect(classesService.toggleActive('non-existent')).rejects.toThrow(
        'Not found'
      );
    });
  });

  describe('delete', () => {
    it('should delete a class successfully', async () => {
      // Arrange
      const classId = 'class-1';
      const mockResponse = {};
      vi.mocked(apiService.delete).mockResolvedValueOnce(mockResponse);

      // Act
      await classesService.delete(classId);

      // Assert
      expect(apiService.delete).toHaveBeenCalledWith(`/classes/${classId}`);
      expect(apiService.delete).toHaveBeenCalledTimes(1);
    });

    it('should handle different class IDs', async () => {
      // Arrange
      const classId = 'class-delete-123';
      const mockResponse = {};
      vi.mocked(apiService.delete).mockResolvedValueOnce(mockResponse);

      // Act
      await classesService.delete(classId);

      // Assert
      expect(apiService.delete).toHaveBeenCalledWith(`/classes/${classId}`);
    });

    it('should handle API error when deleting a class', async () => {
      // Arrange
      const error = new Error('Cannot delete class with attendances');
      vi.mocked(apiService.delete).mockRejectedValueOnce(error);

      // Act & Assert
      await expect(classesService.delete('class-1')).rejects.toThrow(
        'Cannot delete class with attendances'
      );
      expect(apiService.delete).toHaveBeenCalledWith('/classes/class-1');
    });

    it('should handle 404 error for non-existent class', async () => {
      // Arrange
      const error = new Error('Not found');
      vi.mocked(apiService.delete).mockRejectedValueOnce(error);

      // Act & Assert
      await expect(classesService.delete('non-existent')).rejects.toThrow(
        'Not found'
      );
    });

    it('should handle 409 error when class has attendances', async () => {
      // Arrange
      const error = new Error('Conflict - class has attendances');
      vi.mocked(apiService.delete).mockRejectedValueOnce(error);

      // Act & Assert
      await expect(classesService.delete('class-1')).rejects.toThrow(
        'Conflict - class has attendances'
      );
    });
  });

  describe('API endpoint consistency', () => {
    it('should use correct endpoint for all operations', async () => {
      // Test getAll
      vi.mocked(apiService.get).mockResolvedValueOnce([]);
      await classesService.getAll();
      expect(apiService.get).toHaveBeenCalledWith('/classes');

      vi.clearAllMocks();

      // Test getActive
      vi.mocked(apiService.get).mockResolvedValueOnce([]);
      await classesService.getActive();
      expect(apiService.get).toHaveBeenCalledWith('/classes/active');

      vi.clearAllMocks();

      // Test getById
      vi.mocked(apiService.get).mockResolvedValueOnce(mockClass);
      await classesService.getById('class-1');
      expect(apiService.get).toHaveBeenCalledWith('/classes/class-1');

      vi.clearAllMocks();

      // Test create
      vi.mocked(apiService.post).mockResolvedValueOnce({ data: mockClass });
      await classesService.create(mockCreateDto);
      expect(apiService.post).toHaveBeenCalledWith('/classes', mockCreateDto);

      vi.clearAllMocks();

      // Test update
      vi.mocked(apiService.patch).mockResolvedValueOnce({ data: mockClass });
      await classesService.update('class-1', mockUpdateDto);
      expect(apiService.patch).toHaveBeenCalledWith(
        '/classes/class-1',
        mockUpdateDto
      );

      vi.clearAllMocks();

      // Test toggleActive
      vi.mocked(apiService.patch).mockResolvedValueOnce({ data: mockClass });
      await classesService.toggleActive('class-1');
      expect(apiService.patch).toHaveBeenCalledWith(
        '/classes/class-1/toggle-active'
      );

      vi.clearAllMocks();

      // Test delete
      vi.mocked(apiService.delete).mockResolvedValueOnce({});
      await classesService.delete('class-1');
      expect(apiService.delete).toHaveBeenCalledWith('/classes/class-1');
    });
  });
});
