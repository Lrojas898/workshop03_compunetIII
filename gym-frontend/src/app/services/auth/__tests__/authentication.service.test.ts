import { describe, it, expect, vi, beforeEach } from 'vitest';
import authenticationService from '../authentication.service';
import apiService from '../../api.service';
import { API_CONFIG, ValidRoles } from '@/lib/configuration/api-endpoints';
import type { User, AuthResponse, RegisterDto, LoginDto, UpdateUserDto } from '@/app/interfaces/auth.interface';

// Mock apiService
vi.mock('../../api.service', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('AuthenticationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const mockResponse: AuthResponse = {
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          roles: [{ id: 1, name: ValidRoles.CLIENT }],
          isActive: true,
        },
        token: 'mock-token',
      };

      vi.mocked(apiService.post).mockResolvedValue({ data: mockResponse });

      const result = await authenticationService.register(registerDto);

      expect(apiService.post).toHaveBeenCalledWith(API_CONFIG.ENDPOINTS.REGISTER, registerDto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse: AuthResponse = {
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          roles: [{ id: 1, name: ValidRoles.CLIENT }],
          isActive: true,
        },
        token: 'mock-token',
      };

      vi.mocked(apiService.post).mockResolvedValue({ data: mockResponse });

      const result = await authenticationService.login(loginDto);

      expect(apiService.post).toHaveBeenCalledWith(API_CONFIG.ENDPOINTS.LOGIN, loginDto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      const mockUser: User = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        roles: [{ id: 1, name: ValidRoles.CLIENT }],
        isActive: true,
      };

      vi.mocked(apiService.get).mockResolvedValue(mockUser);

      const result = await authenticationService.getCurrentUser();

      expect(apiService.get).toHaveBeenCalledWith(`${API_CONFIG.ENDPOINTS.AUTH}/me`);
      expect(result).toEqual(mockUser);
    });
  });

  describe('getAllUsers', () => {
    it('should get all users successfully', async () => {
      const mockUsers: User[] = [
        {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          roles: [{ id: 1, name: ValidRoles.CLIENT }],
          isActive: true,
        },
      ];

      vi.mocked(apiService.get).mockResolvedValue(mockUsers);

      const result = await authenticationService.getAllUsers();

      expect(apiService.get).toHaveBeenCalledWith(API_CONFIG.ENDPOINTS.AUTH);
      expect(result).toEqual(mockUsers);
    });
  });

  describe('getUserById', () => {
    it('should get user by id successfully', async () => {
      const userId = '123';
      const mockUser: User = {
        id: 123,
        email: 'test@example.com',
        name: 'Test User',
        roles: [{ id: 1, name: ValidRoles.CLIENT }],
        isActive: true,
      };

      vi.mocked(apiService.get).mockResolvedValue(mockUser);

      const result = await authenticationService.getUserById(userId);

      expect(apiService.get).toHaveBeenCalledWith(`${API_CONFIG.ENDPOINTS.AUTH}/${userId}`);
      expect(result).toEqual(mockUser);
    });
  });

  describe('getUser', () => {
    it('should call getUserById', async () => {
      const userId = '123';
      const mockUser: User = {
        id: 123,
        email: 'test@example.com',
        name: 'Test User',
        roles: [{ id: 1, name: ValidRoles.CLIENT }],
        isActive: true,
      };

      vi.mocked(apiService.get).mockResolvedValue(mockUser);

      const result = await authenticationService.getUser(userId);

      expect(result).toEqual(mockUser);
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const userId = '123';
      const updateDto: UpdateUserDto = {
        name: 'Updated Name',
      };

      const mockUser: User = {
        id: 123,
        email: 'test@example.com',
        name: 'Updated Name',
        roles: [{ id: 1, name: ValidRoles.CLIENT }],
        isActive: true,
      };

      vi.mocked(apiService.patch).mockResolvedValue({ data: mockUser });

      const result = await authenticationService.updateUser(userId, updateDto);

      expect(apiService.patch).toHaveBeenCalledWith(`${API_CONFIG.ENDPOINTS.AUTH}/${userId}`, updateDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const userId = '123';
      const mockUser: User = {
        id: 123,
        email: 'test@example.com',
        name: 'Test User',
        roles: [{ id: 1, name: ValidRoles.CLIENT }],
        isActive: false,
      };

      vi.mocked(apiService.delete).mockResolvedValue({ data: mockUser });

      const result = await authenticationService.deleteUser(userId);

      expect(apiService.delete).toHaveBeenCalledWith(`${API_CONFIG.ENDPOINTS.AUTH}/${userId}`);
      expect(result).toEqual(mockUser);
    });
  });

  describe('toggleUserActive', () => {
    it('should toggle user active status successfully', async () => {
      const userId = '123';
      const isActive = false;
      const mockUser: User = {
        id: 123,
        email: 'test@example.com',
        name: 'Test User',
        roles: [{ id: 1, name: ValidRoles.CLIENT }],
        isActive: false,
      };

      vi.mocked(apiService.patch).mockResolvedValue({ data: mockUser });

      const result = await authenticationService.toggleUserActive(userId, isActive);

      expect(apiService.patch).toHaveBeenCalledWith(
        `${API_CONFIG.ENDPOINTS.AUTH}/${userId}/toggle-active`,
        { isActive }
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('assignRoles', () => {
    it('should assign roles successfully', async () => {
      const userId = '123';
      const roles = [ValidRoles.ADMIN, ValidRoles.CLIENT];
      const mockUser: User = {
        id: 123,
        email: 'test@example.com',
        name: 'Test User',
        roles: [
          { id: 1, name: ValidRoles.ADMIN },
          { id: 2, name: ValidRoles.CLIENT },
        ],
        isActive: true,
      };

      vi.mocked(apiService.patch).mockResolvedValue({ data: mockUser });

      const result = await authenticationService.assignRoles(userId, roles);

      expect(apiService.patch).toHaveBeenCalledWith(
        `${API_CONFIG.ENDPOINTS.AUTH}/${userId}/roles/assign`,
        { roles }
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('addRoles', () => {
    it('should add roles successfully', async () => {
      const userId = '123';
      const roles = [ValidRoles.COACH];
      const mockUser: User = {
        id: 123,
        email: 'test@example.com',
        name: 'Test User',
        roles: [
          { id: 1, name: ValidRoles.CLIENT },
          { id: 2, name: ValidRoles.COACH },
        ],
        isActive: true,
      };

      vi.mocked(apiService.patch).mockResolvedValue({ data: mockUser });

      const result = await authenticationService.addRoles(userId, roles);

      expect(apiService.patch).toHaveBeenCalledWith(
        `${API_CONFIG.ENDPOINTS.AUTH}/${userId}/roles/add`,
        { roles }
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('removeRoles', () => {
    it('should remove roles successfully', async () => {
      const userId = '123';
      const roles = [ValidRoles.COACH];
      const mockUser: User = {
        id: 123,
        email: 'test@example.com',
        name: 'Test User',
        roles: [{ id: 1, name: ValidRoles.CLIENT }],
        isActive: true,
      };

      vi.mocked(apiService.patch).mockResolvedValue({ data: mockUser });

      const result = await authenticationService.removeRoles(userId, roles);

      expect(apiService.patch).toHaveBeenCalledWith(
        `${API_CONFIG.ENDPOINTS.AUTH}/${userId}/roles/remove`,
        { roles }
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('Helper Methods', () => {
    const mockUser: User = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      roles: [
        { id: 1, name: ValidRoles.CLIENT },
        { id: 2, name: ValidRoles.COACH },
      ],
      isActive: true,
    };

    describe('hasRole', () => {
      it('should return true if user has the role', () => {
        const result = authenticationService.hasRole(mockUser, ValidRoles.CLIENT);
        expect(result).toBe(true);
      });

      it('should return false if user does not have the role', () => {
        const result = authenticationService.hasRole(mockUser, ValidRoles.ADMIN);
        expect(result).toBe(false);
      });
    });

    describe('isAdmin', () => {
      it('should return true if user is admin', () => {
        const adminUser: User = {
          ...mockUser,
          roles: [{ id: 1, name: ValidRoles.ADMIN }],
        };
        const result = authenticationService.isAdmin(adminUser);
        expect(result).toBe(true);
      });

      it('should return false if user is not admin', () => {
        const result = authenticationService.isAdmin(mockUser);
        expect(result).toBe(false);
      });
    });

    describe('isReceptionist', () => {
      it('should return true if user is receptionist', () => {
        const receptionistUser: User = {
          ...mockUser,
          roles: [{ id: 1, name: ValidRoles.RECEPTIONIST }],
        };
        const result = authenticationService.isReceptionist(receptionistUser);
        expect(result).toBe(true);
      });

      it('should return false if user is not receptionist', () => {
        const result = authenticationService.isReceptionist(mockUser);
        expect(result).toBe(false);
      });
    });

    describe('isCoach', () => {
      it('should return true if user is coach', () => {
        const result = authenticationService.isCoach(mockUser);
        expect(result).toBe(true);
      });

      it('should return false if user is not coach', () => {
        const clientUser: User = {
          ...mockUser,
          roles: [{ id: 1, name: ValidRoles.CLIENT }],
        };
        const result = authenticationService.isCoach(clientUser);
        expect(result).toBe(false);
      });
    });

    describe('isClient', () => {
      it('should return true if user is client', () => {
        const result = authenticationService.isClient(mockUser);
        expect(result).toBe(true);
      });

      it('should return false if user is not client', () => {
        const adminUser: User = {
          ...mockUser,
          roles: [{ id: 1, name: ValidRoles.ADMIN }],
        };
        const result = authenticationService.isClient(adminUser);
        expect(result).toBe(false);
      });
    });
  });
});
