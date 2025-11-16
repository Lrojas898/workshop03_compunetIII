import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../auth.store';
import { ValidRoles } from '@/lib/configuration/api-endpoints';
import type { LoginResponse, User } from '../interfaces/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('AuthStore', () => {
  beforeEach(() => {
    // Clear store state before each test
    useAuthStore.setState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
    // Clear localStorage
    localStorageMock.clear();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useAuthStore.getState();

      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBe(null);
      expect(state.token).toBe(null);
    });

    it('should have all required action methods', () => {
      const state = useAuthStore.getState();

      expect(typeof state.login).toBe('function');
      expect(typeof state.logout).toBe('function');
      expect(typeof state.updateUser).toBe('function');
    });
  });

  describe('login', () => {
    const mockLoginResponse: LoginResponse = {
      id: '1',
      email: 'test@example.com',
      fullName: 'Test User',
      age: 25,
      isActive: true,
      roles: [{ id: '1', name: ValidRoles.CLIENT }],
      token: 'mock-jwt-token',
    };

    it('should set authentication state correctly', () => {
      const { login } = useAuthStore.getState();

      login(mockLoginResponse);

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.token).toBe('mock-jwt-token');
    });

    it('should set user data without token', () => {
      const { login } = useAuthStore.getState();

      login(mockLoginResponse);

      const state = useAuthStore.getState();
      expect(state.user).toEqual({
        id: '1',
        email: 'test@example.com',
        fullName: 'Test User',
        age: 25,
        isActive: true,
        roles: [{ id: '1', name: ValidRoles.CLIENT }],
      });
    });

    it('should separate token from user data', () => {
      const { login } = useAuthStore.getState();

      login(mockLoginResponse);

      const state = useAuthStore.getState();
      expect(state.user).not.toHaveProperty('token');
      expect(state.token).toBe('mock-jwt-token');
    });

    it('should handle login with multiple roles', () => {
      const loginWithMultipleRoles: LoginResponse = {
        ...mockLoginResponse,
        roles: [
          { id: '1', name: ValidRoles.CLIENT },
          { id: '2', name: ValidRoles.COACH },
        ],
      };

      const { login } = useAuthStore.getState();
      login(loginWithMultipleRoles);

      const state = useAuthStore.getState();
      expect(state.user?.roles).toHaveLength(2);
      expect(state.user?.roles[0].name).toBe(ValidRoles.CLIENT);
      expect(state.user?.roles[1].name).toBe(ValidRoles.COACH);
    });

    it('should overwrite previous login state', () => {
      const { login } = useAuthStore.getState();

      // First login
      login(mockLoginResponse);

      // Second login with different data
      const secondLoginResponse: LoginResponse = {
        id: '2',
        email: 'admin@example.com',
        fullName: 'Admin User',
        age: 30,
        isActive: true,
        roles: [{ id: '2', name: ValidRoles.ADMIN }],
        token: 'new-token',
      };

      login(secondLoginResponse);

      const state = useAuthStore.getState();
      expect(state.user?.id).toBe('2');
      expect(state.user?.email).toBe('admin@example.com');
      expect(state.token).toBe('new-token');
    });
  });

  describe('logout', () => {
    const mockLoginResponse: LoginResponse = {
      id: '1',
      email: 'test@example.com',
      fullName: 'Test User',
      age: 25,
      isActive: true,
      roles: [{ id: '1', name: ValidRoles.CLIENT }],
      token: 'mock-jwt-token',
    };

    it('should clear authentication state', () => {
      const { login, logout } = useAuthStore.getState();

      // First login
      login(mockLoginResponse);

      // Then logout
      logout();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBe(null);
      expect(state.token).toBe(null);
    });

    it('should work when called without previous login', () => {
      const { logout } = useAuthStore.getState();

      // Logout without login
      expect(() => logout()).not.toThrow();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBe(null);
      expect(state.token).toBe(null);
    });

    it('should allow login after logout', () => {
      const { login, logout } = useAuthStore.getState();

      // Login, logout, then login again
      login(mockLoginResponse);
      logout();
      login(mockLoginResponse);

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).not.toBe(null);
      expect(state.token).toBe('mock-jwt-token');
    });
  });

  describe('updateUser', () => {
    const mockLoginResponse: LoginResponse = {
      id: '1',
      email: 'test@example.com',
      fullName: 'Test User',
      age: 25,
      isActive: true,
      roles: [{ id: '1', name: ValidRoles.CLIENT }],
      token: 'mock-jwt-token',
    };

    it('should update user data partially', () => {
      const { login, updateUser } = useAuthStore.getState();

      login(mockLoginResponse);

      updateUser({ fullName: 'Updated Name' });

      const state = useAuthStore.getState();
      expect(state.user?.fullName).toBe('Updated Name');
      expect(state.user?.email).toBe('test@example.com'); // Should remain unchanged
      expect(state.user?.age).toBe(25); // Should remain unchanged
    });

    it('should update multiple fields at once', () => {
      const { login, updateUser } = useAuthStore.getState();

      login(mockLoginResponse);

      updateUser({
        fullName: 'New Name',
        age: 30,
        email: 'newemail@example.com',
      });

      const state = useAuthStore.getState();
      expect(state.user?.fullName).toBe('New Name');
      expect(state.user?.age).toBe(30);
      expect(state.user?.email).toBe('newemail@example.com');
    });

    it('should update isActive status', () => {
      const { login, updateUser } = useAuthStore.getState();

      login(mockLoginResponse);

      updateUser({ isActive: false });

      const state = useAuthStore.getState();
      expect(state.user?.isActive).toBe(false);
    });

    it('should update user roles', () => {
      const { login, updateUser } = useAuthStore.getState();

      login(mockLoginResponse);

      const newRoles = [
        { id: '1', name: ValidRoles.CLIENT },
        { id: '2', name: ValidRoles.ADMIN },
      ];

      updateUser({ roles: newRoles });

      const state = useAuthStore.getState();
      expect(state.user?.roles).toHaveLength(2);
      expect(state.user?.roles).toEqual(newRoles);
    });

    it('should not update if user is null', () => {
      const { updateUser } = useAuthStore.getState();

      // Try to update without login
      updateUser({ fullName: 'Should Not Update' });

      const state = useAuthStore.getState();
      expect(state.user).toBe(null);
    });

    it('should preserve other fields when updating', () => {
      const { login, updateUser } = useAuthStore.getState();

      login(mockLoginResponse);

      const originalUser = useAuthStore.getState().user;

      updateUser({ fullName: 'Updated Name' });

      const state = useAuthStore.getState();
      expect(state.user?.id).toBe(originalUser?.id);
      expect(state.user?.email).toBe(originalUser?.email);
      expect(state.user?.age).toBe(originalUser?.age);
      expect(state.user?.isActive).toBe(originalUser?.isActive);
      expect(state.user?.roles).toEqual(originalUser?.roles);
    });

    it('should handle empty update object', () => {
      const { login, updateUser } = useAuthStore.getState();

      login(mockLoginResponse);

      const stateBefore = useAuthStore.getState().user;

      updateUser({});

      const stateAfter = useAuthStore.getState().user;
      expect(stateAfter).toEqual(stateBefore);
    });
  });

  describe('Store Persistence', () => {
    it('should persist state to localStorage on login', () => {
      const mockLoginResponse: LoginResponse = {
        id: '1',
        email: 'test@example.com',
        fullName: 'Test User',
        age: 25,
        isActive: true,
        roles: [{ id: '1', name: ValidRoles.CLIENT }],
        token: 'mock-jwt-token',
      };

      const { login } = useAuthStore.getState();
      login(mockLoginResponse);

      const stored = localStorageMock.getItem('auth-storage');
      expect(stored).toBeTruthy();
    });

    it('should clear localStorage on logout', () => {
      const mockLoginResponse: LoginResponse = {
        id: '1',
        email: 'test@example.com',
        fullName: 'Test User',
        age: 25,
        isActive: true,
        roles: [{ id: '1', name: ValidRoles.CLIENT }],
        token: 'mock-jwt-token',
      };

      const { login, logout } = useAuthStore.getState();
      login(mockLoginResponse);
      logout();

      const stored = localStorageMock.getItem('auth-storage');
      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.state.isAuthenticated).toBe(false);
        expect(parsed.state.user).toBe(null);
        expect(parsed.state.token).toBe(null);
      }
    });
  });

  describe('State Immutability', () => {
    const mockLoginResponse: LoginResponse = {
      id: '1',
      email: 'test@example.com',
      fullName: 'Test User',
      age: 25,
      isActive: true,
      roles: [{ id: '1', name: ValidRoles.CLIENT }],
      token: 'mock-jwt-token',
    };

    it('should not mutate state when updating user', () => {
      const { login, updateUser } = useAuthStore.getState();

      login(mockLoginResponse);
      const userBefore = useAuthStore.getState().user;

      updateUser({ fullName: 'New Name' });

      // Original reference should not be the same
      const userAfter = useAuthStore.getState().user;
      expect(userBefore).not.toBe(userAfter);
    });
  });
});
