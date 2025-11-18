/**
 * MEMBERSHIPS SERVICE UNIT TESTS
 *
 * Comprehensive test suite for the memberships service.
 * Tests all CRUD operations and verifies correct API endpoints and parameters.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type {
  Membership,
  CreateMembershipDto,
  UpdateMembershipDto,
} from '@/app/interfaces/membership.interface';
import membershipsService from '../memberships.service';
import apiService from '../../api.service';
import { API_CONFIG } from '@/lib/configuration/api-endpoints';

// Mock the apiService module
vi.mock('../../api.service', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock sample data
const mockMembership: Membership = {
  id: '1',
  name: 'Basic Plan',
  cost: 29.99,
  status: true,
  max_classes_assistance: 8,
  max_gym_assistance: 30,
  duration_months: 1,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const mockMemberships: Membership[] = [
  mockMembership,
  {
    id: '2',
    name: 'Premium Plan',
    cost: 59.99,
    status: true,
    max_classes_assistance: 16,
    max_gym_assistance: 30,
    duration_months: 12,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'Elite Plan',
    cost: 99.99,
    status: false,
    max_classes_assistance: 32,
    max_gym_assistance: 30,
    duration_months: 12,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
  },
];

const mockCreateDto: CreateMembershipDto = {
  name: 'New Plan',
  cost: 49.99,
  max_classes_assistance: 12,
  max_gym_assistance: 30,
  duration_months: 1,
  status: true,
};

const mockUpdateDto: UpdateMembershipDto = {
  name: 'Updated Plan',
  cost: 39.99,
  max_classes_assistance: 10,
};

describe('membershipsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all memberships successfully', async () => {
      // Arrange
      vi.mocked(apiService.get).mockResolvedValue(mockMemberships);

      // Act
      const result = await membershipsService.getAll();

      // Assert
      expect(result).toEqual(mockMemberships);
      expect(apiService.get).toHaveBeenCalledTimes(1);
      expect(apiService.get).toHaveBeenCalledWith(
        API_CONFIG.ENDPOINTS.MEMBERSHIPS
      );
    });

    it('should handle empty array response', async () => {
      // Arrange
      vi.mocked(apiService.get).mockResolvedValue([]);

      // Act
      const result = await membershipsService.getAll();

      // Assert
      expect(result).toEqual([]);
      expect(apiService.get).toHaveBeenCalledWith(
        API_CONFIG.ENDPOINTS.MEMBERSHIPS
      );
    });

    it('should throw error when API call fails', async () => {
      // Arrange
      const error = new Error('Network error');
      vi.mocked(apiService.get).mockRejectedValue(error);

      // Act & Assert
      await expect(membershipsService.getAll()).rejects.toThrow('Network error');
      expect(apiService.get).toHaveBeenCalledWith(
        API_CONFIG.ENDPOINTS.MEMBERSHIPS
      );
    });
  });

  describe('getById', () => {
    it('should fetch a membership by ID successfully', async () => {
      // Arrange
      const membershipId = '1';
      vi.mocked(apiService.get).mockResolvedValue(mockMembership);

      // Act
      const result = await membershipsService.getById(membershipId);

      // Assert
      expect(result).toEqual(mockMembership);
      expect(apiService.get).toHaveBeenCalledTimes(1);
      expect(apiService.get).toHaveBeenCalledWith(
        `${API_CONFIG.ENDPOINTS.MEMBERSHIPS}/${membershipId}`
      );
    });

    it('should construct correct endpoint with different IDs', async () => {
      // Arrange
      const membershipId = 'abc-123-def';
      vi.mocked(apiService.get).mockResolvedValue(mockMembership);

      // Act
      await membershipsService.getById(membershipId);

      // Assert
      expect(apiService.get).toHaveBeenCalledWith(
        `/memberships/${membershipId}`
      );
    });

    it('should handle not found error', async () => {
      // Arrange
      const membershipId = 'non-existent';
      const error = new Error('Not found');
      vi.mocked(apiService.get).mockRejectedValue(error);

      // Act & Assert
      await expect(membershipsService.getById(membershipId)).rejects.toThrow(
        'Not found'
      );
    });
  });

  describe('create', () => {
    it('should create a new membership successfully', async () => {
      // Arrange
      const mockResponse = {
        data: mockMembership,
        status: 201,
        statusText: 'Created',
      };
      vi.mocked(apiService.post).mockResolvedValue(mockResponse);

      // Act
      const result = await membershipsService.create(mockCreateDto);

      // Assert
      expect(result).toEqual(mockMembership);
      expect(apiService.post).toHaveBeenCalledTimes(1);
      expect(apiService.post).toHaveBeenCalledWith(
        API_CONFIG.ENDPOINTS.MEMBERSHIPS,
        mockCreateDto
      );
    });

    it('should pass correct DTO with all required fields', async () => {
      // Arrange
      const mockResponse = { data: mockMembership };
      vi.mocked(apiService.post).mockResolvedValue(mockResponse);

      // Act
      await membershipsService.create(mockCreateDto);

      // Assert
      expect(apiService.post).toHaveBeenCalledWith(
        API_CONFIG.ENDPOINTS.MEMBERSHIPS,
        expect.objectContaining({
          name: mockCreateDto.name,
          cost: mockCreateDto.cost,
          max_classes_assistance: mockCreateDto.max_classes_assistance,
          max_gym_assistance: mockCreateDto.max_gym_assistance,
          duration_months: mockCreateDto.duration_months,
          status: mockCreateDto.status,
        })
      );
    });

    it('should handle validation errors', async () => {
      // Arrange
      const error = new Error('Validation failed');
      vi.mocked(apiService.post).mockRejectedValue(error);

      // Act & Assert
      await expect(membershipsService.create(mockCreateDto)).rejects.toThrow(
        'Validation failed'
      );
    });

    it('should create membership without optional status field', async () => {
      // Arrange
      const dtoWithoutStatus: CreateMembershipDto = {
        name: 'Plan without status',
        cost: 29.99,
        max_classes_assistance: 8,
        max_gym_assistance: 30,
        duration_months: 1,
      };
      const mockResponse = { data: mockMembership };
      vi.mocked(apiService.post).mockResolvedValue(mockResponse);

      // Act
      await membershipsService.create(dtoWithoutStatus);

      // Assert
      expect(apiService.post).toHaveBeenCalledWith(
        API_CONFIG.ENDPOINTS.MEMBERSHIPS,
        dtoWithoutStatus
      );
    });
  });

  describe('update', () => {
    it('should update a membership successfully', async () => {
      // Arrange
      const membershipId = '1';
      const updatedMembership: Membership = {
        ...mockMembership,
        ...mockUpdateDto,
      };
      const mockResponse = {
        data: updatedMembership,
        status: 200,
      };
      vi.mocked(apiService.put).mockResolvedValue(mockResponse);

      // Act
      const result = await membershipsService.update(
        membershipId,
        mockUpdateDto
      );

      // Assert
      expect(result).toEqual(updatedMembership);
      expect(apiService.put).toHaveBeenCalledTimes(1);
      expect(apiService.put).toHaveBeenCalledWith(
        `${API_CONFIG.ENDPOINTS.MEMBERSHIPS}/${membershipId}`,
        mockUpdateDto
      );
    });

    it('should construct correct endpoint for update', async () => {
      // Arrange
      const membershipId = 'test-id-123';
      const mockResponse = { data: mockMembership };
      vi.mocked(apiService.put).mockResolvedValue(mockResponse);

      // Act
      await membershipsService.update(membershipId, mockUpdateDto);

      // Assert
      expect(apiService.put).toHaveBeenCalledWith(
        `/memberships/${membershipId}`,
        mockUpdateDto
      );
    });

    it('should handle partial update with only some fields', async () => {
      // Arrange
      const membershipId = '1';
      const partialUpdateDto: UpdateMembershipDto = {
        name: 'Only name updated',
      };
      const mockResponse = { data: mockMembership };
      vi.mocked(apiService.put).mockResolvedValue(mockResponse);

      // Act
      await membershipsService.update(membershipId, partialUpdateDto);

      // Assert
      expect(apiService.put).toHaveBeenCalledWith(
        `${API_CONFIG.ENDPOINTS.MEMBERSHIPS}/${membershipId}`,
        partialUpdateDto
      );
    });

    it('should handle update errors', async () => {
      // Arrange
      const membershipId = '1';
      const error = new Error('Update failed');
      vi.mocked(apiService.put).mockRejectedValue(error);

      // Act & Assert
      await expect(
        membershipsService.update(membershipId, mockUpdateDto)
      ).rejects.toThrow('Update failed');
    });

    it('should update status field', async () => {
      // Arrange
      const membershipId = '1';
      const statusUpdateDto: UpdateMembershipDto = { status: false };
      const mockResponse = { data: mockMembership };
      vi.mocked(apiService.put).mockResolvedValue(mockResponse);

      // Act
      await membershipsService.update(membershipId, statusUpdateDto);

      // Assert
      expect(apiService.put).toHaveBeenCalledWith(
        `${API_CONFIG.ENDPOINTS.MEMBERSHIPS}/${membershipId}`,
        statusUpdateDto
      );
    });
  });

  describe('toggleStatus', () => {
    it('should toggle membership status successfully', async () => {
      // Arrange
      const membershipId = '1';
      const toggledMembership: Membership = {
        ...mockMembership,
        status: !mockMembership.status,
      };
      const mockResponse = {
        data: toggledMembership,
        status: 200,
      };
      vi.mocked(apiService.patch).mockResolvedValue(mockResponse);

      // Act
      const result = await membershipsService.toggleStatus(membershipId);

      // Assert
      expect(result).toEqual(toggledMembership);
      expect(apiService.patch).toHaveBeenCalledTimes(1);
      expect(apiService.patch).toHaveBeenCalledWith(
        `${API_CONFIG.ENDPOINTS.MEMBERSHIPS}/${membershipId}/toggle-status`
      );
    });

    it('should construct correct toggle endpoint with different IDs', async () => {
      // Arrange
      const membershipId = 'uuid-12345';
      const mockResponse = { data: mockMembership };
      vi.mocked(apiService.patch).mockResolvedValue(mockResponse);

      // Act
      await membershipsService.toggleStatus(membershipId);

      // Assert
      expect(apiService.patch).toHaveBeenCalledWith(
        `/memberships/${membershipId}/toggle-status`
      );
    });

    it('should not pass any data in the request body', async () => {
      // Arrange
      const membershipId = '1';
      const mockResponse = { data: mockMembership };
      vi.mocked(apiService.patch).mockResolvedValue(mockResponse);

      // Act
      await membershipsService.toggleStatus(membershipId);

      // Assert
      expect(apiService.patch).toHaveBeenCalledWith(
        expect.any(String)
      );
      // Verify that patch was called with exactly one argument (the URL)
      expect(apiService.patch).toHaveBeenCalledWith(
        `/memberships/${membershipId}/toggle-status`
      );
    });

    it('should handle toggle errors', async () => {
      // Arrange
      const membershipId = '1';
      const error = new Error('Toggle failed');
      vi.mocked(apiService.patch).mockRejectedValue(error);

      // Act & Assert
      await expect(
        membershipsService.toggleStatus(membershipId)
      ).rejects.toThrow('Toggle failed');
    });

    it('should toggle from true to false', async () => {
      // Arrange
      const membershipId = '1';
      const trueMembership: Membership = { ...mockMembership, status: true };
      const falseMembership: Membership = { ...mockMembership, status: false };
      const mockResponse = { data: falseMembership };
      vi.mocked(apiService.patch).mockResolvedValue(mockResponse);

      // Act
      const result = await membershipsService.toggleStatus(membershipId);

      // Assert
      expect(result.status).toBe(false);
    });

    it('should toggle from false to true', async () => {
      // Arrange
      const membershipId = '3';
      const falseMembership: Membership = mockMemberships[2];
      const trueMembership: Membership = { ...falseMembership, status: true };
      const mockResponse = { data: trueMembership };
      vi.mocked(apiService.patch).mockResolvedValue(mockResponse);

      // Act
      const result = await membershipsService.toggleStatus(membershipId);

      // Assert
      expect(result.status).toBe(true);
    });
  });

  describe('delete', () => {
    it('should delete a membership successfully', async () => {
      // Arrange
      const membershipId = '1';
      const mockResponse = {
        data: { message: 'Membership deleted successfully' },
        status: 200,
      };
      vi.mocked(apiService.delete).mockResolvedValue(mockResponse);

      // Act
      const result = await membershipsService.delete(membershipId);

      // Assert
      expect(result).toEqual({ message: 'Membership deleted successfully' });
      expect(apiService.delete).toHaveBeenCalledTimes(1);
      expect(apiService.delete).toHaveBeenCalledWith(
        `${API_CONFIG.ENDPOINTS.MEMBERSHIPS}/${membershipId}`
      );
    });

    it('should construct correct delete endpoint', async () => {
      // Arrange
      const membershipId = 'delete-test-id';
      const mockResponse = {
        data: { message: 'Deleted' },
      };
      vi.mocked(apiService.delete).mockResolvedValue(mockResponse);

      // Act
      await membershipsService.delete(membershipId);

      // Assert
      expect(apiService.delete).toHaveBeenCalledWith(
        `/memberships/${membershipId}`
      );
    });

    it('should return success message on delete', async () => {
      // Arrange
      const membershipId = '1';
      const successMessage = 'Membership deleted successfully';
      const mockResponse = {
        data: { message: successMessage },
      };
      vi.mocked(apiService.delete).mockResolvedValue(mockResponse);

      // Act
      const result = await membershipsService.delete(membershipId);

      // Assert
      expect(result.message).toBe(successMessage);
    });

    it('should handle delete errors', async () => {
      // Arrange
      const membershipId = '1';
      const error = new Error('Delete failed');
      vi.mocked(apiService.delete).mockRejectedValue(error);

      // Act & Assert
      await expect(membershipsService.delete(membershipId)).rejects.toThrow(
        'Delete failed'
      );
    });

    it('should handle not found on delete', async () => {
      // Arrange
      const membershipId = 'non-existent';
      const error = new Error('Membership not found');
      vi.mocked(apiService.delete).mockRejectedValue(error);

      // Act & Assert
      await expect(membershipsService.delete(membershipId)).rejects.toThrow(
        'Membership not found'
      );
    });
  });

  describe('Integration tests - Multiple operations', () => {
    it('should handle sequence: getAll -> getById -> update', async () => {
      // Arrange
      const membershipId = '1';
      const updatedMembership: Membership = {
        ...mockMembership,
        name: 'Updated Name',
      };

      vi.mocked(apiService.get)
        .mockResolvedValueOnce(mockMemberships)
        .mockResolvedValueOnce(mockMembership);
      vi.mocked(apiService.put).mockResolvedValue({
        data: updatedMembership,
      });

      // Act
      const allMemberships = await membershipsService.getAll();
      const singleMembership = await membershipsService.getById(membershipId);
      const updatedResult = await membershipsService.update(membershipId, {
        name: 'Updated Name',
      });

      // Assert
      expect(allMemberships).toEqual(mockMemberships);
      expect(singleMembership).toEqual(mockMembership);
      expect(updatedResult).toEqual(updatedMembership);
      expect(apiService.get).toHaveBeenCalledTimes(2);
      expect(apiService.put).toHaveBeenCalledTimes(1);
    });

    it('should handle sequence: create -> toggleStatus -> delete', async () => {
      // Arrange
      const newMembership: Membership = mockMembership;
      const toggledMembership: Membership = {
        ...newMembership,
        status: !newMembership.status,
      };

      vi.mocked(apiService.post).mockResolvedValue({ data: newMembership });
      vi.mocked(apiService.patch).mockResolvedValue({ data: toggledMembership });
      vi.mocked(apiService.delete).mockResolvedValue({
        data: { message: 'Deleted' },
      });

      // Act
      const created = await membershipsService.create(mockCreateDto);
      const toggled = await membershipsService.toggleStatus(created.id);
      const deleted = await membershipsService.delete(created.id);

      // Assert
      expect(created).toEqual(newMembership);
      expect(toggled).toEqual(toggledMembership);
      expect(deleted.message).toBe('Deleted');
      expect(apiService.post).toHaveBeenCalledTimes(1);
      expect(apiService.patch).toHaveBeenCalledTimes(1);
      expect(apiService.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge cases', () => {
    it('should handle membership with special characters in name', async () => {
      // Arrange
      const specialDto: CreateMembershipDto = {
        ...mockCreateDto,
        name: "Premium+ @Special's Plan",
      };
      const mockResponse = { data: mockMembership };
      vi.mocked(apiService.post).mockResolvedValue(mockResponse);

      // Act
      await membershipsService.create(specialDto);

      // Assert
      expect(apiService.post).toHaveBeenCalledWith(
        API_CONFIG.ENDPOINTS.MEMBERSHIPS,
        specialDto
      );
    });

    it('should handle very large cost values', async () => {
      // Arrange
      const expensiveDto: CreateMembershipDto = {
        ...mockCreateDto,
        cost: 999999.99,
      };
      const mockResponse = { data: mockMembership };
      vi.mocked(apiService.post).mockResolvedValue(mockResponse);

      // Act
      await membershipsService.create(expensiveDto);

      // Assert
      expect(apiService.post).toHaveBeenCalledWith(
        API_CONFIG.ENDPOINTS.MEMBERSHIPS,
        expensiveDto
      );
    });

    it('should handle maximum class assistance values', async () => {
      // Arrange
      const maxClassesDto: CreateMembershipDto = {
        ...mockCreateDto,
        max_classes_assistance: 999,
      };
      const mockResponse = { data: mockMembership };
      vi.mocked(apiService.post).mockResolvedValue(mockResponse);

      // Act
      await membershipsService.create(maxClassesDto);

      // Assert
      expect(apiService.post).toHaveBeenCalledWith(
        API_CONFIG.ENDPOINTS.MEMBERSHIPS,
        maxClassesDto
      );
    });

    it('should handle 12-month duration', async () => {
      // Arrange
      const annualDto: CreateMembershipDto = {
        ...mockCreateDto,
        duration_months: 12,
      };
      const mockResponse = { data: mockMembership };
      vi.mocked(apiService.post).mockResolvedValue(mockResponse);

      // Act
      await membershipsService.create(annualDto);

      // Assert
      expect(apiService.post).toHaveBeenCalledWith(
        API_CONFIG.ENDPOINTS.MEMBERSHIPS,
        annualDto
      );
    });

    it('should handle empty update DTO', async () => {
      // Arrange
      const membershipId = '1';
      const emptyUpdateDto: UpdateMembershipDto = {};
      const mockResponse = { data: mockMembership };
      vi.mocked(apiService.put).mockResolvedValue(mockResponse);

      // Act
      await membershipsService.update(membershipId, emptyUpdateDto);

      // Assert
      expect(apiService.put).toHaveBeenCalledWith(
        `${API_CONFIG.ENDPOINTS.MEMBERSHIPS}/${membershipId}`,
        emptyUpdateDto
      );
    });
  });
});
