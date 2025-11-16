/**
 * SUBSCRIPTIONS SERVICE UNIT TESTS
 *
 * Comprehensive unit tests for the subscriptions service including:
 * - API method tests (create, addMembership, getAll, getById, getByUserId, update, activate, deactivate, delete)
 * - Helper method tests (getActiveItem, getPendingItems, getExpiredItems, getCurrentBenefits, calculateDaysRemaining)
 * - Complex flow tests (addMembershipsToUserSubscription)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import subscriptionsService from '../subscriptions.service';
import apiService from '../../api.service';
import { API_CONFIG } from '@/lib/configuration/api-endpoints';
import type {
  Subscription,
  SubscriptionItem,
  AddMembershipDto,
  UpdateSubscriptionDto,
} from '@/app/interfaces/subscriptions.interface';

// Mock the apiService module
vi.mock('../../api.service');

// Mock API_CONFIG
vi.mock('@/lib/configuration/api-endpoints', () => ({
  API_CONFIG: {
    ENDPOINTS: {
      SUBSCRIPTIONS: '/subscriptions',
    },
  },
}));

describe('subscriptionsService', () => {
  // Test data
  const mockUser = {
    id: 'user-1',
    email: 'user@example.com',
    name: 'Test User',
    roles: ['client'],
  };

  const mockSubscriptionItem: SubscriptionItem = {
    id: 'item-1',
    name: 'Premium Membership',
    cost: '99.99',
    max_classes_assistance: 20,
    max_gym_assistance: 30,
    duration_months: 3,
    purchase_date: '2024-01-01T00:00:00Z',
    start_date: '2024-01-01T00:00:00Z',
    end_date: '2024-04-01T00:00:00Z',
    status: 'active',
    membership: {
      id: 'membership-1',
      name: 'Premium Membership',
      cost: 99.99,
      max_classes_assistance: 20,
      max_gym_assistance: 30,
      duration_months: 3,
      isActive: true,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  const mockSubscription: Subscription = {
    id: 'subscription-1',
    start_date: '2024-01-01T00:00:00Z',
    isActive: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    deletedAt: null,
    user: mockUser,
    items: [mockSubscriptionItem],
  };

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  // ==================== CREATE TESTS ====================
  describe('create', () => {
    it('should create a new subscription with correct parameters', async () => {
      const mockResponse = { data: mockSubscription };
      (apiService.post as any).mockResolvedValueOnce(mockResponse);

      const result = await subscriptionsService.create('user-1');

      expect(apiService.post).toHaveBeenCalledWith(
        '/subscriptions',
        { userId: 'user-1' }
      );
      expect(result).toEqual(mockSubscription);
    });

    it('should handle errors when creating subscription', async () => {
      const error = new Error('Network error');
      (apiService.post as any).mockRejectedValueOnce(error);

      await expect(subscriptionsService.create('user-1')).rejects.toThrow('Network error');
      expect(apiService.post).toHaveBeenCalledWith(
        '/subscriptions',
        { userId: 'user-1' }
      );
    });

    it('should use correct endpoint for create', async () => {
      const mockResponse = { data: mockSubscription };
      (apiService.post as any).mockResolvedValueOnce(mockResponse);

      await subscriptionsService.create('user-123');

      expect(apiService.post).toHaveBeenCalledWith(
        '/subscriptions',
        { userId: 'user-123' }
      );
    });
  });

  // ==================== ADD MEMBERSHIP TESTS ====================
  describe('addMembership', () => {
    it('should add membership to subscription with correct parameters', async () => {
      const mockResponse = { data: mockSubscriptionItem };
      (apiService.post as any).mockResolvedValueOnce(mockResponse);

      const dto: AddMembershipDto = { membershipId: 'membership-1' };
      const result = await subscriptionsService.addMembership('subscription-1', dto);

      expect(apiService.post).toHaveBeenCalledWith(
        '/subscriptions/subscription-1/memberships',
        dto
      );
      expect(result).toEqual(mockSubscriptionItem);
    });

    it('should construct correct endpoint URL', async () => {
      const mockResponse = { data: mockSubscriptionItem };
      (apiService.post as any).mockResolvedValueOnce(mockResponse);

      const dto: AddMembershipDto = { membershipId: 'membership-2' };
      await subscriptionsService.addMembership('sub-xyz', dto);

      expect(apiService.post).toHaveBeenCalledWith(
        '/subscriptions/sub-xyz/memberships',
        dto
      );
    });

    it('should handle errors when adding membership', async () => {
      const error = new Error('Membership not found');
      (apiService.post as any).mockRejectedValueOnce(error);

      const dto: AddMembershipDto = { membershipId: 'invalid-id' };
      await expect(subscriptionsService.addMembership('subscription-1', dto)).rejects.toThrow(
        'Membership not found'
      );
    });
  });

  // ==================== GET ALL TESTS ====================
  describe('getAll', () => {
    it('should fetch all subscriptions', async () => {
      const mockResponse = [mockSubscription, mockSubscription];
      (apiService.get as any).mockResolvedValueOnce(mockResponse);

      const result = await subscriptionsService.getAll();

      expect(apiService.get).toHaveBeenCalledWith('/subscriptions');
      expect(result).toEqual(mockResponse);
    });

    it('should return empty array when no subscriptions exist', async () => {
      (apiService.get as any).mockResolvedValueOnce([]);

      const result = await subscriptionsService.getAll();

      expect(apiService.get).toHaveBeenCalledWith('/subscriptions');
      expect(result).toEqual([]);
    });

    it('should handle errors when fetching all subscriptions', async () => {
      const error = new Error('Server error');
      (apiService.get as any).mockRejectedValueOnce(error);

      await expect(subscriptionsService.getAll()).rejects.toThrow('Server error');
      expect(apiService.get).toHaveBeenCalledWith('/subscriptions');
    });

    it('should use correct endpoint for getAll', async () => {
      (apiService.get as any).mockResolvedValueOnce([]);

      await subscriptionsService.getAll();

      expect(apiService.get).toHaveBeenCalledTimes(1);
      expect(apiService.get).toHaveBeenCalledWith('/subscriptions');
    });
  });

  // ==================== GET BY ID TESTS ====================
  describe('getById', () => {
    it('should fetch subscription by ID', async () => {
      (apiService.get as any).mockResolvedValueOnce(mockSubscription);

      const result = await subscriptionsService.getById('subscription-1');

      expect(apiService.get).toHaveBeenCalledWith('/subscriptions/subscription-1');
      expect(result).toEqual(mockSubscription);
    });

    it('should construct correct endpoint URL', async () => {
      (apiService.get as any).mockResolvedValueOnce(mockSubscription);

      await subscriptionsService.getById('sub-abc-123');

      expect(apiService.get).toHaveBeenCalledWith('/subscriptions/sub-abc-123');
    });

    it('should handle errors when subscription not found', async () => {
      const error = new Error('Subscription not found');
      (apiService.get as any).mockRejectedValueOnce(error);

      await expect(subscriptionsService.getById('invalid-id')).rejects.toThrow(
        'Subscription not found'
      );
    });
  });

  // ==================== GET BY USER ID TESTS ====================
  describe('getByUserId', () => {
    it('should fetch subscription by user ID with correct endpoint', async () => {
      (apiService.get as any).mockResolvedValueOnce(mockSubscription);

      const result = await subscriptionsService.getByUserId('user-1');

      expect(apiService.get).toHaveBeenCalledWith('/subscriptions/user/user-1');
      expect(result).toEqual(mockSubscription);
    });

    it('should construct correct endpoint URL with user ID', async () => {
      (apiService.get as any).mockResolvedValueOnce(mockSubscription);

      await subscriptionsService.getByUserId('user-xyz-789');

      expect(apiService.get).toHaveBeenCalledWith('/subscriptions/user/user-xyz-789');
    });

    it('should handle errors when user subscription not found', async () => {
      const error = new Error('User subscription not found');
      (apiService.get as any).mockRejectedValueOnce(error);

      await expect(subscriptionsService.getByUserId('unknown-user')).rejects.toThrow(
        'User subscription not found'
      );
    });

    it('should work with different user IDs', async () => {
      (apiService.get as any).mockResolvedValue(mockSubscription);

      await subscriptionsService.getByUserId('user-1');
      await subscriptionsService.getByUserId('user-2');
      await subscriptionsService.getByUserId('user-3');

      expect(apiService.get).toHaveBeenCalledTimes(3);
      expect(apiService.get).toHaveBeenNthCalledWith(1, '/subscriptions/user/user-1');
      expect(apiService.get).toHaveBeenNthCalledWith(2, '/subscriptions/user/user-2');
      expect(apiService.get).toHaveBeenNthCalledWith(3, '/subscriptions/user/user-3');
    });
  });

  // ==================== UPDATE TESTS ====================
  describe('update', () => {
    it('should update subscription with correct parameters', async () => {
      const updatedSubscription = { ...mockSubscription, isActive: false };
      const mockResponse = { data: updatedSubscription };
      (apiService.patch as any).mockResolvedValueOnce(mockResponse);

      const dto: UpdateSubscriptionDto = { isActive: false };
      const result = await subscriptionsService.update('subscription-1', dto);

      expect(apiService.patch).toHaveBeenCalledWith(
        '/subscriptions/subscription-1',
        dto
      );
      expect(result).toEqual(updatedSubscription);
    });

    it('should construct correct endpoint URL', async () => {
      const mockResponse = { data: mockSubscription };
      (apiService.patch as any).mockResolvedValueOnce(mockResponse);

      const dto: UpdateSubscriptionDto = { isActive: true };
      await subscriptionsService.update('sub-test-123', dto);

      expect(apiService.patch).toHaveBeenCalledWith(
        '/subscriptions/sub-test-123',
        dto
      );
    });

    it('should handle update with purchase_date', async () => {
      const mockResponse = { data: mockSubscription };
      (apiService.patch as any).mockResolvedValueOnce(mockResponse);

      const dto: UpdateSubscriptionDto = { purchase_date: '2024-02-01T00:00:00Z' };
      await subscriptionsService.update('subscription-1', dto);

      expect(apiService.patch).toHaveBeenCalledWith(
        '/subscriptions/subscription-1',
        dto
      );
    });

    it('should handle errors when updating subscription', async () => {
      const error = new Error('Update failed');
      (apiService.patch as any).mockRejectedValueOnce(error);

      const dto: UpdateSubscriptionDto = { isActive: true };
      await expect(subscriptionsService.update('subscription-1', dto)).rejects.toThrow(
        'Update failed'
      );
    });
  });

  // ==================== ACTIVATE TESTS ====================
  describe('activate', () => {
    it('should activate subscription with correct endpoint', async () => {
      const activatedSubscription = { ...mockSubscription, isActive: true };
      const mockResponse = { data: activatedSubscription };
      (apiService.patch as any).mockResolvedValueOnce(mockResponse);

      const result = await subscriptionsService.activate('subscription-1');

      expect(apiService.patch).toHaveBeenCalledWith(
        '/subscriptions/subscription-1/activate'
      );
      expect(result).toEqual(activatedSubscription);
    });

    it('should construct correct endpoint URL for activation', async () => {
      const mockResponse = { data: mockSubscription };
      (apiService.patch as any).mockResolvedValueOnce(mockResponse);

      await subscriptionsService.activate('sub-to-activate');

      expect(apiService.patch).toHaveBeenCalledWith(
        '/subscriptions/sub-to-activate/activate'
      );
    });

    it('should handle errors when activating subscription', async () => {
      const error = new Error('Cannot activate subscription');
      (apiService.patch as any).mockRejectedValueOnce(error);

      await expect(subscriptionsService.activate('subscription-1')).rejects.toThrow(
        'Cannot activate subscription'
      );
    });

    it('should not pass any data body to patch request', async () => {
      const mockResponse = { data: mockSubscription };
      (apiService.patch as any).mockResolvedValueOnce(mockResponse);

      await subscriptionsService.activate('subscription-1');

      expect(apiService.patch).toHaveBeenCalledWith(
        '/subscriptions/subscription-1/activate'
      );
      expect(apiService.patch).toHaveBeenCalledTimes(1);
    });
  });

  // ==================== DEACTIVATE TESTS ====================
  describe('deactivate', () => {
    it('should deactivate subscription with correct endpoint', async () => {
      const deactivatedSubscription = { ...mockSubscription, isActive: false };
      const mockResponse = { data: deactivatedSubscription };
      (apiService.patch as any).mockResolvedValueOnce(mockResponse);

      const result = await subscriptionsService.deactivate('subscription-1');

      expect(apiService.patch).toHaveBeenCalledWith(
        '/subscriptions/subscription-1/deactivate'
      );
      expect(result).toEqual(deactivatedSubscription);
    });

    it('should construct correct endpoint URL for deactivation', async () => {
      const mockResponse = { data: mockSubscription };
      (apiService.patch as any).mockResolvedValueOnce(mockResponse);

      await subscriptionsService.deactivate('sub-to-deactivate');

      expect(apiService.patch).toHaveBeenCalledWith(
        '/subscriptions/sub-to-deactivate/deactivate'
      );
    });

    it('should handle errors when deactivating subscription', async () => {
      const error = new Error('Cannot deactivate subscription');
      (apiService.patch as any).mockRejectedValueOnce(error);

      await expect(subscriptionsService.deactivate('subscription-1')).rejects.toThrow(
        'Cannot deactivate subscription'
      );
    });

    it('should not pass any data body to patch request', async () => {
      const mockResponse = { data: mockSubscription };
      (apiService.patch as any).mockResolvedValueOnce(mockResponse);

      await subscriptionsService.deactivate('subscription-1');

      expect(apiService.patch).toHaveBeenCalledWith(
        '/subscriptions/subscription-1/deactivate'
      );
      expect(apiService.patch).toHaveBeenCalledTimes(1);
    });
  });

  // ==================== DELETE TESTS ====================
  describe('delete', () => {
    it('should delete subscription with correct endpoint', async () => {
      const deletedSubscription = { ...mockSubscription, deletedAt: '2024-01-15T00:00:00Z' };
      const mockResponse = { data: deletedSubscription };
      (apiService.delete as any).mockResolvedValueOnce(mockResponse);

      const result = await subscriptionsService.delete('subscription-1');

      expect(apiService.delete).toHaveBeenCalledWith('/subscriptions/subscription-1');
      expect(result).toEqual(deletedSubscription);
    });

    it('should construct correct endpoint URL for deletion', async () => {
      const mockResponse = { data: mockSubscription };
      (apiService.delete as any).mockResolvedValueOnce(mockResponse);

      await subscriptionsService.delete('sub-to-delete');

      expect(apiService.delete).toHaveBeenCalledWith('/subscriptions/sub-to-delete');
    });

    it('should handle errors when deleting subscription', async () => {
      const error = new Error('Cannot delete subscription');
      (apiService.delete as any).mockRejectedValueOnce(error);

      await expect(subscriptionsService.delete('subscription-1')).rejects.toThrow(
        'Cannot delete subscription'
      );
    });
  });

  // ==================== HELPER METHOD TESTS ====================

  // ==================== GET ACTIVE ITEM TESTS ====================
  describe('getActiveItem', () => {
    it('should return active item when present', () => {
      const result = subscriptionsService.getActiveItem(mockSubscription);

      expect(result).toEqual(mockSubscriptionItem);
      expect(result?.status).toBe('active');
    });

    it('should return null when no items exist', () => {
      const subscriptionWithoutItems: Subscription = {
        ...mockSubscription,
        items: [],
      };

      const result = subscriptionsService.getActiveItem(subscriptionWithoutItems);

      expect(result).toBeNull();
    });

    it('should return null when no active item exists', () => {
      const pendingItem: SubscriptionItem = {
        ...mockSubscriptionItem,
        status: 'pending',
      };

      const subscriptionWithoutActive: Subscription = {
        ...mockSubscription,
        items: [pendingItem],
      };

      const result = subscriptionsService.getActiveItem(subscriptionWithoutActive);

      expect(result).toBeNull();
    });

    it('should return null when items array is null or undefined', () => {
      const subscriptionWithNullItems: Subscription = {
        ...mockSubscription,
        items: null as any,
      };

      const result = subscriptionsService.getActiveItem(subscriptionWithNullItems);

      expect(result).toBeNull();
    });

    it('should return first active item when multiple exist (should not happen)', () => {
      const activeItem1: SubscriptionItem = {
        ...mockSubscriptionItem,
        id: 'item-1',
        status: 'active',
      };

      const activeItem2: SubscriptionItem = {
        ...mockSubscriptionItem,
        id: 'item-2',
        status: 'active',
      };

      const subscriptionWithMultipleActive: Subscription = {
        ...mockSubscription,
        items: [activeItem1, activeItem2],
      };

      const result = subscriptionsService.getActiveItem(subscriptionWithMultipleActive);

      expect(result?.id).toBe('item-1');
    });
  });

  // ==================== GET PENDING ITEMS TESTS ====================
  describe('getPendingItems', () => {
    it('should return pending items sorted by start_date', () => {
      const pendingItem1: SubscriptionItem = {
        ...mockSubscriptionItem,
        id: 'item-2',
        status: 'pending',
        start_date: '2024-05-01T00:00:00Z',
      };

      const pendingItem2: SubscriptionItem = {
        ...mockSubscriptionItem,
        id: 'item-3',
        status: 'pending',
        start_date: '2024-04-01T00:00:00Z',
      };

      const subscriptionWithPending: Subscription = {
        ...mockSubscription,
        items: [pendingItem1, pendingItem2],
      };

      const result = subscriptionsService.getPendingItems(subscriptionWithPending);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('item-3');
      expect(result[1].id).toBe('item-2');
    });

    it('should return empty array when no pending items', () => {
      const activeItem: SubscriptionItem = {
        ...mockSubscriptionItem,
        status: 'active',
      };

      const subscriptionWithoutPending: Subscription = {
        ...mockSubscription,
        items: [activeItem],
      };

      const result = subscriptionsService.getPendingItems(subscriptionWithoutPending);

      expect(result).toEqual([]);
    });

    it('should return empty array when items array is empty', () => {
      const subscriptionWithoutItems: Subscription = {
        ...mockSubscription,
        items: [],
      };

      const result = subscriptionsService.getPendingItems(subscriptionWithoutItems);

      expect(result).toEqual([]);
    });

    it('should return empty array when items array is null', () => {
      const subscriptionWithNullItems: Subscription = {
        ...mockSubscription,
        items: null as any,
      };

      const result = subscriptionsService.getPendingItems(subscriptionWithNullItems);

      expect(result).toEqual([]);
    });

    it('should correctly sort multiple pending items chronologically', () => {
      const pendingItems: SubscriptionItem[] = [
        {
          ...mockSubscriptionItem,
          id: 'item-1',
          status: 'pending',
          start_date: '2024-06-01T00:00:00Z',
        },
        {
          ...mockSubscriptionItem,
          id: 'item-2',
          status: 'pending',
          start_date: '2024-04-01T00:00:00Z',
        },
        {
          ...mockSubscriptionItem,
          id: 'item-3',
          status: 'pending',
          start_date: '2024-05-01T00:00:00Z',
        },
      ];

      const subscription: Subscription = {
        ...mockSubscription,
        items: pendingItems,
      };

      const result = subscriptionsService.getPendingItems(subscription);

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('item-2');
      expect(result[1].id).toBe('item-3');
      expect(result[2].id).toBe('item-1');
    });
  });

  // ==================== GET EXPIRED ITEMS TESTS ====================
  describe('getExpiredItems', () => {
    it('should return expired items sorted by end_date descending', () => {
      const expiredItem1: SubscriptionItem = {
        ...mockSubscriptionItem,
        id: 'item-2',
        status: 'expired',
        end_date: '2024-02-01T00:00:00Z',
      };

      const expiredItem2: SubscriptionItem = {
        ...mockSubscriptionItem,
        id: 'item-3',
        status: 'expired',
        end_date: '2024-03-01T00:00:00Z',
      };

      const subscriptionWithExpired: Subscription = {
        ...mockSubscription,
        items: [expiredItem1, expiredItem2],
      };

      const result = subscriptionsService.getExpiredItems(subscriptionWithExpired);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('item-3');
      expect(result[1].id).toBe('item-2');
    });

    it('should return empty array when no expired items', () => {
      const activeItem: SubscriptionItem = {
        ...mockSubscriptionItem,
        status: 'active',
      };

      const subscriptionWithoutExpired: Subscription = {
        ...mockSubscription,
        items: [activeItem],
      };

      const result = subscriptionsService.getExpiredItems(subscriptionWithoutExpired);

      expect(result).toEqual([]);
    });

    it('should return empty array when items array is empty', () => {
      const subscriptionWithoutItems: Subscription = {
        ...mockSubscription,
        items: [],
      };

      const result = subscriptionsService.getExpiredItems(subscriptionWithoutItems);

      expect(result).toEqual([]);
    });

    it('should return empty array when items array is null', () => {
      const subscriptionWithNullItems: Subscription = {
        ...mockSubscription,
        items: null as any,
      };

      const result = subscriptionsService.getExpiredItems(subscriptionWithNullItems);

      expect(result).toEqual([]);
    });

    it('should correctly sort multiple expired items reverse chronologically', () => {
      const expiredItems: SubscriptionItem[] = [
        {
          ...mockSubscriptionItem,
          id: 'item-1',
          status: 'expired',
          end_date: '2024-01-01T00:00:00Z',
        },
        {
          ...mockSubscriptionItem,
          id: 'item-2',
          status: 'expired',
          end_date: '2024-03-01T00:00:00Z',
        },
        {
          ...mockSubscriptionItem,
          id: 'item-3',
          status: 'expired',
          end_date: '2024-02-01T00:00:00Z',
        },
      ];

      const subscription: Subscription = {
        ...mockSubscription,
        items: expiredItems,
      };

      const result = subscriptionsService.getExpiredItems(subscription);

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('item-2');
      expect(result[1].id).toBe('item-3');
      expect(result[2].id).toBe('item-1');
    });
  });

  // ==================== GET CURRENT BENEFITS TESTS ====================
  describe('getCurrentBenefits', () => {
    it('should return benefits from active item', () => {
      const result = subscriptionsService.getCurrentBenefits(mockSubscription);

      expect(result).toEqual({
        cost: 99.99,
        classes: 20,
        gym: 30,
        duration: 3,
        validUntil: '2024-04-01T00:00:00Z',
        name: 'Premium Membership',
      });
    });

    it('should return default zero values when no active item', () => {
      const subscriptionWithoutActive: Subscription = {
        ...mockSubscription,
        items: [],
      };

      const result = subscriptionsService.getCurrentBenefits(subscriptionWithoutActive);

      expect(result).toEqual({
        cost: 0,
        classes: 0,
        gym: 0,
        duration: 0,
        validUntil: null,
        name: null,
      });
    });

    it('should convert cost to number', () => {
      const itemWithStringCost: SubscriptionItem = {
        ...mockSubscriptionItem,
        cost: '149.99',
      };

      const subscription: Subscription = {
        ...mockSubscription,
        items: [itemWithStringCost],
      };

      const result = subscriptionsService.getCurrentBenefits(subscription);

      expect(result.cost).toBe(149.99);
      expect(typeof result.cost).toBe('number');
    });

    it('should return null name and validUntil when no active item', () => {
      const subscriptionWithoutActive: Subscription = {
        ...mockSubscription,
        items: [],
      };

      const result = subscriptionsService.getCurrentBenefits(subscriptionWithoutActive);

      expect(result.name).toBeNull();
      expect(result.validUntil).toBeNull();
    });

    it('should handle multiple items and return only active benefits', () => {
      const expiredItem: SubscriptionItem = {
        ...mockSubscriptionItem,
        id: 'item-2',
        status: 'expired',
        cost: '50.00',
        max_classes_assistance: 10,
      };

      const subscription: Subscription = {
        ...mockSubscription,
        items: [expiredItem, mockSubscriptionItem],
      };

      const result = subscriptionsService.getCurrentBenefits(subscription);

      expect(result.cost).toBe(99.99);
      expect(result.classes).toBe(20);
      expect(result.name).toBe('Premium Membership');
    });
  });

  // ==================== CALCULATE DAYS REMAINING TESTS ====================
  describe('calculateDaysRemaining', () => {
    it('should calculate days remaining correctly', () => {
      const now = new Date();
      const futureDate = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000); // 10 days from now

      const itemWithFutureDate: SubscriptionItem = {
        ...mockSubscriptionItem,
        end_date: futureDate.toISOString(),
      };

      const subscription: Subscription = {
        ...mockSubscription,
        items: [itemWithFutureDate],
      };

      const result = subscriptionsService.calculateDaysRemaining(subscription);

      expect(result).toBe(10);
    });

    it('should return 0 when no active item', () => {
      const subscriptionWithoutActive: Subscription = {
        ...mockSubscription,
        items: [],
      };

      const result = subscriptionsService.calculateDaysRemaining(subscriptionWithoutActive);

      expect(result).toBe(0);
    });

    it('should return 0 when subscription expired', () => {
      const now = new Date();
      const pastDate = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000); // 5 days ago

      const expiredItem: SubscriptionItem = {
        ...mockSubscriptionItem,
        end_date: pastDate.toISOString(),
        status: 'expired',
      };

      const subscription: Subscription = {
        ...mockSubscription,
        items: [expiredItem],
      };

      const result = subscriptionsService.calculateDaysRemaining(subscription);

      expect(result).toBe(0);
    });

    it('should round up partial days', () => {
      const now = new Date();
      const almostTwoDaysFromNow = new Date(now.getTime() + 1.5 * 24 * 60 * 60 * 1000);

      const item: SubscriptionItem = {
        ...mockSubscriptionItem,
        end_date: almostTwoDaysFromNow.toISOString(),
      };

      const subscription: Subscription = {
        ...mockSubscription,
        items: [item],
      };

      const result = subscriptionsService.calculateDaysRemaining(subscription);

      expect(result).toBe(2);
    });

    it('should handle exactly 1 day remaining', () => {
      const now = new Date();
      const oneDayFromNow = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);

      const item: SubscriptionItem = {
        ...mockSubscriptionItem,
        end_date: oneDayFromNow.toISOString(),
      };

      const subscription: Subscription = {
        ...mockSubscription,
        items: [item],
      };

      const result = subscriptionsService.calculateDaysRemaining(subscription);

      expect(result).toBe(1);
    });

    it('should handle items with null end_date gracefully', () => {
      const itemWithNullDate: SubscriptionItem = {
        ...mockSubscriptionItem,
        end_date: null as any,
      };

      const subscription: Subscription = {
        ...mockSubscription,
        items: [itemWithNullDate],
      };

      // This test documents current behavior - may throw depending on implementation
      expect(() => subscriptionsService.calculateDaysRemaining(subscription)).not.toThrow();
    });
  });

  // ==================== COMPLEX FLOW TESTS ====================

  // ==================== ADD MEMBERSHIPS TO USER SUBSCRIPTION TESTS ====================
  describe('addMembershipsToUserSubscription', () => {
    it('should add multiple memberships to user subscription', async () => {
      const mockResponse = mockSubscription;
      (apiService.get as any).mockResolvedValue(mockResponse);
      (apiService.post as any).mockResolvedValue({ data: mockSubscriptionItem });

      const membershipIds = ['membership-1', 'membership-2'];
      const result = await subscriptionsService.addMembershipsToUserSubscription('user-1', membershipIds);

      // Should call getByUserId at start
      expect(apiService.get).toHaveBeenNthCalledWith(1, '/subscriptions/user/user-1');

      // Should call addMembership for each membership
      expect(apiService.post).toHaveBeenNthCalledWith(1, '/subscriptions/subscription-1/memberships', {
        membershipId: 'membership-1',
      });
      expect(apiService.post).toHaveBeenNthCalledWith(2, '/subscriptions/subscription-1/memberships', {
        membershipId: 'membership-2',
      });

      // Should call getByUserId at end to return updated subscription
      expect(apiService.get).toHaveBeenLastCalledWith('/subscriptions/user/user-1');

      expect(result).toEqual(mockResponse);
    });

    it('should handle single membership addition', async () => {
      const mockResponse = mockSubscription;
      (apiService.get as any).mockResolvedValue(mockResponse);
      (apiService.post as any).mockResolvedValue({ data: mockSubscriptionItem });

      const membershipIds = ['membership-1'];
      await subscriptionsService.addMembershipsToUserSubscription('user-1', membershipIds);

      expect(apiService.post).toHaveBeenCalledTimes(1);
      expect(apiService.post).toHaveBeenCalledWith('/subscriptions/subscription-1/memberships', {
        membershipId: 'membership-1',
      });
    });

    it('should handle empty membership list', async () => {
      const mockResponse = mockSubscription;
      (apiService.get as any).mockResolvedValue(mockResponse);

      const membershipIds: string[] = [];
      const result = await subscriptionsService.addMembershipsToUserSubscription('user-1', membershipIds);

      // Should still call getByUserId at start and end
      expect(apiService.get).toHaveBeenCalledTimes(2);
      // Should not call addMembership
      expect(apiService.post).not.toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it('should stop adding memberships if one fails', async () => {
      const mockResponse = mockSubscription;
      (apiService.get as any).mockResolvedValue(mockResponse);
      (apiService.post as any)
        .mockResolvedValueOnce({ data: mockSubscriptionItem })
        .mockRejectedValueOnce(new Error('Failed to add membership'));

      const membershipIds = ['membership-1', 'membership-2', 'membership-3'];

      await expect(
        subscriptionsService.addMembershipsToUserSubscription('user-1', membershipIds)
      ).rejects.toThrow('Failed to add membership');

      // Should have attempted to add first and second membership before failing
      expect(apiService.post).toHaveBeenCalledTimes(2);
    });

    it('should correctly call getByUserId twice', async () => {
      const mockResponse = mockSubscription;
      (apiService.get as any).mockResolvedValue(mockResponse);
      (apiService.post as any).mockResolvedValue({ data: mockSubscriptionItem });

      const membershipIds = ['membership-1'];
      await subscriptionsService.addMembershipsToUserSubscription('user-1', membershipIds);

      // First call to get user subscription
      expect(apiService.get).toHaveBeenNthCalledWith(1, '/subscriptions/user/user-1');
      // Second call to get updated subscription
      expect(apiService.get).toHaveBeenNthCalledWith(2, '/subscriptions/user/user-1');
      expect(apiService.get).toHaveBeenCalledTimes(2);
    });

    it('should preserve subscription ID across multiple membership additions', async () => {
      const mockResponse = mockSubscription;
      (apiService.get as any).mockResolvedValue(mockResponse);
      (apiService.post as any).mockResolvedValue({ data: mockSubscriptionItem });

      const membershipIds = ['m1', 'm2', 'm3'];
      await subscriptionsService.addMembershipsToUserSubscription('user-1', membershipIds);

      // All calls should use the same subscription ID
      expect(apiService.post).toHaveBeenNthCalledWith(1, '/subscriptions/subscription-1/memberships', {
        membershipId: 'm1',
      });
      expect(apiService.post).toHaveBeenNthCalledWith(2, '/subscriptions/subscription-1/memberships', {
        membershipId: 'm2',
      });
      expect(apiService.post).toHaveBeenNthCalledWith(3, '/subscriptions/subscription-1/memberships', {
        membershipId: 'm3',
      });
    });
  });

  // ==================== INTEGRATION TESTS ====================
  describe('Integration scenarios', () => {
    it('should handle complete subscription workflow', async () => {
      // Mock all necessary calls
      (apiService.post as any).mockResolvedValueOnce({ data: mockSubscription }); // create
      (apiService.get as any).mockResolvedValueOnce(mockSubscription); // getByUserId
      (apiService.post as any).mockResolvedValueOnce({ data: mockSubscriptionItem }); // addMembership
      (apiService.patch as any).mockResolvedValueOnce({ data: { ...mockSubscription, isActive: true } }); // activate
      (apiService.get as any).mockResolvedValueOnce(mockSubscription); // final getByUserId

      // Create subscription
      await subscriptionsService.create('user-1');
      expect(apiService.post).toHaveBeenCalledWith('/subscriptions', { userId: 'user-1' });

      // Get subscription by user
      const subscription = await subscriptionsService.getByUserId('user-1');
      expect(apiService.get).toHaveBeenCalledWith('/subscriptions/user/user-1');

      // Add membership
      await subscriptionsService.addMembership('subscription-1', { membershipId: 'membership-1' });
      expect(apiService.post).toHaveBeenCalledWith('/subscriptions/subscription-1/memberships', {
        membershipId: 'membership-1',
      });

      // Activate subscription
      await subscriptionsService.activate('subscription-1');
      expect(apiService.patch).toHaveBeenCalledWith('/subscriptions/subscription-1/activate');
    });
  });
});
