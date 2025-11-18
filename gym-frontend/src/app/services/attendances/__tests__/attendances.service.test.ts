/**
 * ATTENDANCES SERVICE UNIT TESTS
 *
 * Comprehensive test suite for the attendances service
 * covering all methods and API interactions.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import attendancesService from '../attendances.service';
import apiService from '../../api.service';
import { API_CONFIG } from '@/lib/configuration/api-endpoints';
import { AttendanceType } from '@/app/interfaces/attendance.interface';
import type {
  Attendance,
  AttendanceStatus,
  AttendanceStatsResponse,
  CreateAttendanceDto,
  CheckOutDto,
  ClassAttendance,
  RegisterClassAttendanceDto,
} from '@/app/interfaces/attendance.interface';

// Mock the apiService
vi.mock('../../api.service');

// Mock data factories
const createMockAttendance = (): Attendance => ({
  id: '1',
  entranceDatetime: '2025-11-16T10:00:00Z',
  exitDatetime: '2025-11-16T12:00:00Z',
  type: AttendanceType.GYM,
  dateKey: '2025-11-16',
  isActive: false,
  user: {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    roles: ['client'],
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  created_at: '2025-11-16T10:00:00Z',
  updated_at: '2025-11-16T12:00:00Z',
});

const createMockAttendanceStatus = (): AttendanceStatus => ({
  isInside: true,
  currentAttendance: {
    id: '1',
    entranceDatetime: new Date('2025-11-16T10:00:00Z'),
    type: AttendanceType.GYM,
  },
  availableAttendances: {
    gym: 5,
    classes: 3,
  },
});

const createMockAttendanceStats = (): AttendanceStatsResponse => ({
  totalGymAttendances: 15,
  totalClassAttendances: 8,
  monthlyStats: [
    {
      month: '2025-11',
      gymCount: 10,
      classCount: 5,
    },
    {
      month: '2025-10',
      gymCount: 5,
      classCount: 3,
    },
  ],
});

const createMockClassAttendance = (): ClassAttendance => ({
  ...createMockAttendance(),
  type: AttendanceType.CLASS,
  class: {
    id: 'class-1',
    name: 'CrossFit',
    description: 'CrossFit training',
    coach: {
      id: 'coach-1',
      name: 'Coach A',
      email: 'coach@example.com',
      phone: '9876543210',
      roles: ['coach'],
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    },
    schedule: 'Monday, Wednesday, Friday 6:00 PM',
    capacity: 20,
    isActive: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  notes: 'Great session',
  coach: {
    id: 'coach-1',
    name: 'Coach A',
    email: 'coach@example.com',
    phone: '9876543210',
    roles: ['coach'],
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
});

describe('AttendancesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('checkIn', () => {
    it('should call apiService.post with correct endpoint and data', async () => {
      const mockAttendance = createMockAttendance();
      const dto: CreateAttendanceDto = {
        userId: 'user-1',
        entranceDatetime: '2025-11-16T10:00:00Z',
        type: AttendanceType.GYM,
        dateKey: '2025-11-16',
      };

      vi.mocked(apiService.post).mockResolvedValueOnce({
        data: mockAttendance,
      } as any);

      const result = await attendancesService.checkIn(dto);

      expect(apiService.post).toHaveBeenCalledWith(
        `${API_CONFIG.ENDPOINTS.ATTENDANCES}/check-in`,
        dto
      );
      expect(result).toEqual(mockAttendance);
    });

    it('should pass through the complete DTO object', async () => {
      const dto: CreateAttendanceDto = {
        userId: 'user-123',
        entranceDatetime: '2025-11-16T09:30:00Z',
        exitDatetime: '2025-11-16T11:30:00Z',
        type: AttendanceType.GYM,
        dateKey: '2025-11-16',
      };

      vi.mocked(apiService.post).mockResolvedValueOnce({
        data: createMockAttendance(),
      } as any);

      await attendancesService.checkIn(dto);

      expect(apiService.post).toHaveBeenCalledWith(expect.any(String), dto);
      const callArgs = vi.mocked(apiService.post).mock.calls[0];
      expect(callArgs[1]).toEqual(dto);
    });
  });

  describe('checkOut', () => {
    it('should call apiService.post with correct endpoint and DTO', async () => {
      const mockAttendance = createMockAttendance();
      const dto: CheckOutDto = {
        userId: 'user-1',
      };

      vi.mocked(apiService.post).mockResolvedValueOnce({
        data: mockAttendance,
      } as any);

      const result = await attendancesService.checkOut(dto);

      expect(apiService.post).toHaveBeenCalledWith(
        `${API_CONFIG.ENDPOINTS.ATTENDANCES}/check-out`,
        dto
      );
      expect(result).toEqual(mockAttendance);
    });

    it('should return attendance data from response', async () => {
      const mockAttendance = createMockAttendance();
      mockAttendance.exitDatetime = '2025-11-16T12:30:00Z';

      vi.mocked(apiService.post).mockResolvedValueOnce({
        data: mockAttendance,
      } as any);

      const result = await attendancesService.checkOut({ userId: 'user-1' });

      expect(result.exitDatetime).toEqual('2025-11-16T12:30:00Z');
      expect(result.isActive).toBe(false);
    });
  });

  describe('getStatus', () => {
    it('should call apiService.get with correct endpoint', async () => {
      const userId = 'user-123';
      const mockStatus = createMockAttendanceStatus();

      vi.mocked(apiService.get).mockResolvedValueOnce(mockStatus);

      const result = await attendancesService.getStatus(userId);

      expect(apiService.get).toHaveBeenCalledWith(
        `${API_CONFIG.ENDPOINTS.ATTENDANCES}/status/${userId}`
      );
      expect(result).toEqual(mockStatus);
    });

    it('should include userId in the endpoint URL', async () => {
      const userId = 'specific-user-id';

      vi.mocked(apiService.get).mockResolvedValueOnce(
        createMockAttendanceStatus()
      );

      await attendancesService.getStatus(userId);

      const callArgs = vi.mocked(apiService.get).mock.calls[0][0];
      expect(callArgs).toContain(userId);
      expect(callArgs).toContain('/status/');
    });
  });

  describe('getHistory', () => {
    it('should call apiService.get with correct endpoint when no params provided', async () => {
      const userId = 'user-123';
      const mockHistory = [createMockAttendance()];

      vi.mocked(apiService.get).mockResolvedValueOnce(mockHistory);

      const result = await attendancesService.getHistory(userId);

      expect(apiService.get).toHaveBeenCalledWith(
        `${API_CONFIG.ENDPOINTS.ATTENDANCES}/history/${userId}`
      );
      expect(result).toEqual(mockHistory);
    });

    it('should append "from" query parameter when provided', async () => {
      const userId = 'user-123';
      const mockHistory = [createMockAttendance()];

      vi.mocked(apiService.get).mockResolvedValueOnce(mockHistory);

      await attendancesService.getHistory(userId, {
        from: '2025-11-01',
      });

      const callArgs = vi.mocked(apiService.get).mock.calls[0][0];
      expect(callArgs).toContain('from=2025-11-01');
    });

    it('should append "to" query parameter when provided', async () => {
      const userId = 'user-123';
      const mockHistory = [createMockAttendance()];

      vi.mocked(apiService.get).mockResolvedValueOnce(mockHistory);

      await attendancesService.getHistory(userId, {
        to: '2025-11-30',
      });

      const callArgs = vi.mocked(apiService.get).mock.calls[0][0];
      expect(callArgs).toContain('to=2025-11-30');
    });

    it('should append "type" query parameter when provided', async () => {
      const userId = 'user-123';
      const mockHistory = [createMockAttendance()];

      vi.mocked(apiService.get).mockResolvedValueOnce(mockHistory);

      await attendancesService.getHistory(userId, {
        type: AttendanceType.CLASS,
      });

      const callArgs = vi.mocked(apiService.get).mock.calls[0][0];
      expect(callArgs).toContain(`type=${AttendanceType.CLASS}`);
    });

    it('should append multiple query parameters together', async () => {
      const userId = 'user-123';
      const mockHistory = [createMockAttendance()];

      vi.mocked(apiService.get).mockResolvedValueOnce(mockHistory);

      await attendancesService.getHistory(userId, {
        from: '2025-11-01',
        to: '2025-11-30',
        type: AttendanceType.GYM,
      });

      const callArgs = vi.mocked(apiService.get).mock.calls[0][0];
      expect(callArgs).toContain('from=2025-11-01');
      expect(callArgs).toContain('to=2025-11-30');
      expect(callArgs).toContain(`type=${AttendanceType.GYM}`);
      expect(callArgs).toContain('?');
    });

    it('should not include query string when params is undefined', async () => {
      const userId = 'user-123';
      const mockHistory = [createMockAttendance()];

      vi.mocked(apiService.get).mockResolvedValueOnce(mockHistory);

      await attendancesService.getHistory(userId, undefined);

      const callArgs = vi.mocked(apiService.get).mock.calls[0][0];
      expect(callArgs).not.toContain('?');
    });

    it('should handle partial params object correctly', async () => {
      const userId = 'user-123';
      const mockHistory = [createMockAttendance()];

      vi.mocked(apiService.get).mockResolvedValueOnce(mockHistory);

      await attendancesService.getHistory(userId, {
        from: '2025-11-01',
        type: AttendanceType.CLASS,
      });

      const callArgs = vi.mocked(apiService.get).mock.calls[0][0];
      expect(callArgs).toContain('from=2025-11-01');
      expect(callArgs).toContain(`type=${AttendanceType.CLASS}`);
      expect(callArgs).not.toContain('to=');
    });
  });

  describe('getStats', () => {
    it('should call apiService.get with correct endpoint', async () => {
      const userId = 'user-123';
      const mockStats = createMockAttendanceStats();

      vi.mocked(apiService.get).mockResolvedValueOnce(mockStats);

      const result = await attendancesService.getStats(userId);

      expect(apiService.get).toHaveBeenCalledWith(
        `${API_CONFIG.ENDPOINTS.ATTENDANCES}/stats/${userId}`
      );
      expect(result).toEqual(mockStats);
    });

    it('should return attendance stats with monthly data', async () => {
      const userId = 'user-123';
      const mockStats = createMockAttendanceStats();

      vi.mocked(apiService.get).mockResolvedValueOnce(mockStats);

      const result = await attendancesService.getStats(userId);

      expect(result.totalGymAttendances).toBeDefined();
      expect(result.totalClassAttendances).toBeDefined();
      expect(result.monthlyStats).toBeDefined();
      expect(Array.isArray(result.monthlyStats)).toBe(true);
    });
  });

  describe('getActive', () => {
    it('should call apiService.get with correct endpoint', async () => {
      const mockActiveUsers = [createMockAttendance()];

      vi.mocked(apiService.get).mockResolvedValueOnce(mockActiveUsers);

      const result = await attendancesService.getActive();

      expect(apiService.get).toHaveBeenCalledWith(
        `${API_CONFIG.ENDPOINTS.ATTENDANCES}/active`
      );
      expect(result).toEqual(mockActiveUsers);
    });

    it('should return array of active attendances', async () => {
      const attendance1 = createMockAttendance();
      const attendance2 = createMockAttendance();
      attendance2.id = '2';
      const mockActiveUsers = [attendance1, attendance2];

      vi.mocked(apiService.get).mockResolvedValueOnce(mockActiveUsers);

      const result = await attendancesService.getActive();

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(result[0].isActive).toBe(false); // Mock data
    });

    it('should return empty array when no active users', async () => {
      vi.mocked(apiService.get).mockResolvedValueOnce([]);

      const result = await attendancesService.getActive();

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });
  });

  describe('registerClass', () => {
    it('should call apiService.post with correct endpoint and DTO', async () => {
      const mockClassAttendance = createMockClassAttendance();
      const dto: RegisterClassAttendanceDto = {
        userId: 'user-1',
        classId: 'class-1',
        notes: 'Great session',
      };

      vi.mocked(apiService.post).mockResolvedValueOnce({
        data: mockClassAttendance,
      } as any);

      const result = await attendancesService.registerClass(dto);

      expect(apiService.post).toHaveBeenCalledWith(
        API_CONFIG.ENDPOINTS.REGISTER_CLASS,
        dto
      );
      expect(result).toEqual(mockClassAttendance);
    });

    it('should handle DTO without optional notes', async () => {
      const mockClassAttendance = createMockClassAttendance();
      const dto: RegisterClassAttendanceDto = {
        userId: 'user-1',
        classId: 'class-1',
      };

      vi.mocked(apiService.post).mockResolvedValueOnce({
        data: mockClassAttendance,
      } as any);

      await attendancesService.registerClass(dto);

      const callArgs = vi.mocked(apiService.post).mock.calls[0];
      expect(callArgs[1]).toEqual(dto);
    });

    it('should return ClassAttendance data', async () => {
      const mockClassAttendance = createMockClassAttendance();

      vi.mocked(apiService.post).mockResolvedValueOnce({
        data: mockClassAttendance,
      } as any);

      const result = await attendancesService.registerClass({
        userId: 'user-1',
        classId: 'class-1',
      });

      expect(result.type).toBe(AttendanceType.CLASS);
      expect(result.class).toBeDefined();
      expect(result.coach).toBeDefined();
    });
  });

  describe('getMyClasses', () => {
    it('should call apiService.get with correct endpoint', async () => {
      const mockClasses = [createMockClassAttendance()];

      vi.mocked(apiService.get).mockResolvedValueOnce(mockClasses);

      const result = await attendancesService.getMyClasses();

      expect(apiService.get).toHaveBeenCalledWith(
        API_CONFIG.ENDPOINTS.MY_CLASSES
      );
      expect(result).toEqual(mockClasses);
    });

    it('should return array of class attendances', async () => {
      const class1 = createMockClassAttendance();
      const class2 = createMockClassAttendance();
      class2.id = '2';
      const mockClasses = [class1, class2];

      vi.mocked(apiService.get).mockResolvedValueOnce(mockClasses);

      const result = await attendancesService.getMyClasses();

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(result[0].type).toBe(AttendanceType.CLASS);
    });

    it('should return empty array when coach has no classes', async () => {
      vi.mocked(apiService.get).mockResolvedValueOnce([]);

      const result = await attendancesService.getMyClasses();

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });
  });

  describe('getTodayClasses', () => {
    it('should call apiService.get with correct endpoint', async () => {
      const mockClasses = [createMockClassAttendance()];

      vi.mocked(apiService.get).mockResolvedValueOnce(mockClasses);

      const result = await attendancesService.getTodayClasses();

      expect(apiService.get).toHaveBeenCalledWith(
        API_CONFIG.ENDPOINTS.TODAY_CLASSES
      );
      expect(result).toEqual(mockClasses);
    });

    it('should return array of today\'s class attendances', async () => {
      const class1 = createMockClassAttendance();
      const class2 = createMockClassAttendance();
      class2.id = '2';
      const mockClasses = [class1, class2];

      vi.mocked(apiService.get).mockResolvedValueOnce(mockClasses);

      const result = await attendancesService.getTodayClasses();

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no classes scheduled for today', async () => {
      vi.mocked(apiService.get).mockResolvedValueOnce([]);

      const result = await attendancesService.getTodayClasses();

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });
  });

  describe('getClassAttendees', () => {
    it('should call apiService.get with correct endpoint', async () => {
      const classId = 'class-123';
      const mockAttendees = [createMockClassAttendance()];

      vi.mocked(apiService.get).mockResolvedValueOnce(mockAttendees);

      const result = await attendancesService.getClassAttendees(classId);

      expect(apiService.get).toHaveBeenCalledWith(
        `/attendances/class/${classId}/attendees`
      );
      expect(result).toEqual(mockAttendees);
    });

    it('should include classId in the endpoint URL', async () => {
      const classId = 'specific-class-id';

      vi.mocked(apiService.get).mockResolvedValueOnce([
        createMockClassAttendance(),
      ]);

      await attendancesService.getClassAttendees(classId);

      const callArgs = vi.mocked(apiService.get).mock.calls[0][0];
      expect(callArgs).toContain(classId);
      expect(callArgs).toContain('/attendees');
    });

    it('should return array of class attendees', async () => {
      const attendee1 = createMockClassAttendance();
      const attendee2 = createMockClassAttendance();
      attendee2.id = '2';
      const mockAttendees = [attendee1, attendee2];

      vi.mocked(apiService.get).mockResolvedValueOnce(mockAttendees);

      const result = await attendancesService.getClassAttendees('class-1');

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(result[0].type).toBe(AttendanceType.CLASS);
    });

    it('should return empty array when class has no attendees', async () => {
      vi.mocked(apiService.get).mockResolvedValueOnce([]);

      const result = await attendancesService.getClassAttendees('class-1');

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });
  });

  describe('getAll', () => {
    it('should call apiService.get with correct endpoint', async () => {
      const mockAttendances = [createMockAttendance()];

      vi.mocked(apiService.get).mockResolvedValueOnce(mockAttendances);

      const result = await attendancesService.getAll();

      expect(apiService.get).toHaveBeenCalledWith(
        API_CONFIG.ENDPOINTS.ATTENDANCES
      );
      expect(result).toEqual(mockAttendances);
    });

    it('should return array of all attendances', async () => {
      const attendance1 = createMockAttendance();
      const attendance2 = createMockAttendance();
      attendance2.id = '2';
      const mockAttendances = [attendance1, attendance2];

      vi.mocked(apiService.get).mockResolvedValueOnce(mockAttendances);

      const result = await attendancesService.getAll();

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no attendances exist', async () => {
      vi.mocked(apiService.get).mockResolvedValueOnce([]);

      const result = await attendancesService.getAll();

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });

    it('should include both gym and class type attendances', async () => {
      const gymAttendance = createMockAttendance();
      const classAttendance = createMockClassAttendance();
      const mockAttendances = [gymAttendance, classAttendance];

      vi.mocked(apiService.get).mockResolvedValueOnce(mockAttendances);

      const result = await attendancesService.getAll();

      expect(result).toHaveLength(2);
      expect(result.some((a) => a.type === AttendanceType.GYM)).toBe(true);
      expect(result.some((a) => a.type === AttendanceType.CLASS)).toBe(true);
    });
  });

  describe('Integration tests - Multiple calls', () => {
    it('should handle multiple sequential calls to different methods', async () => {
      const mockAttendance = createMockAttendance();
      const mockStatus = createMockAttendanceStatus();

      vi.mocked(apiService.post).mockResolvedValueOnce({
        data: mockAttendance,
      } as any);
      vi.mocked(apiService.get).mockResolvedValueOnce(mockStatus);

      const checkInResult = await attendancesService.checkIn({
        userId: 'user-1',
        entranceDatetime: '2025-11-16T10:00:00Z',
        type: AttendanceType.GYM,
        dateKey: '2025-11-16',
      });

      const statusResult = await attendancesService.getStatus('user-1');

      expect(checkInResult).toEqual(mockAttendance);
      expect(statusResult).toEqual(mockStatus);
      expect(apiService.post).toHaveBeenCalledTimes(1);
      expect(apiService.get).toHaveBeenCalledTimes(1);
    });

    it('should handle concurrent calls with different return types', async () => {
      const mockStats = createMockAttendanceStats();
      const mockActive = [createMockAttendance()];

      vi.mocked(apiService.get)
        .mockResolvedValueOnce(mockStats)
        .mockResolvedValueOnce(mockActive);

      const [statsResult, activeResult] = await Promise.all([
        attendancesService.getStats('user-1'),
        attendancesService.getActive(),
      ]);

      expect(statsResult).toEqual(mockStats);
      expect(activeResult).toEqual(mockActive);
      expect(apiService.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error handling', () => {
    it('should propagate errors from apiService.post', async () => {
      const error = new Error('API Error: Check-in failed');

      vi.mocked(apiService.post).mockRejectedValueOnce(error);

      await expect(
        attendancesService.checkIn({
          userId: 'user-1',
          entranceDatetime: '2025-11-16T10:00:00Z',
          type: AttendanceType.GYM,
          dateKey: '2025-11-16',
        })
      ).rejects.toThrow('API Error: Check-in failed');
    });

    it('should propagate errors from apiService.get', async () => {
      const error = new Error('API Error: Not found');

      vi.mocked(apiService.get).mockRejectedValueOnce(error);

      await expect(attendancesService.getStatus('user-1')).rejects.toThrow(
        'API Error: Not found'
      );
    });

    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network error');

      vi.mocked(apiService.get).mockRejectedValueOnce(networkError);

      await expect(attendancesService.getAll()).rejects.toThrow(
        'Network error'
      );
    });
  });

  describe('Type safety', () => {
    it('should return correctly typed data for checkIn', async () => {
      const mockAttendance = createMockAttendance();

      vi.mocked(apiService.post).mockResolvedValueOnce({
        data: mockAttendance,
      } as any);

      const result = await attendancesService.checkIn({
        userId: 'user-1',
        entranceDatetime: '2025-11-16T10:00:00Z',
        type: AttendanceType.GYM,
        dateKey: '2025-11-16',
      });

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('entranceDatetime');
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('user');
    });

    it('should return correctly typed data for getHistory', async () => {
      const mockHistory = [createMockAttendance()];

      vi.mocked(apiService.get).mockResolvedValueOnce(mockHistory);

      const result = await attendancesService.getHistory('user-1');

      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('id');
        expect(result[0]).toHaveProperty('user');
        expect(result[0]).toHaveProperty('type');
      }
    });

    it('should return correctly typed data for getStats', async () => {
      const mockStats = createMockAttendanceStats();

      vi.mocked(apiService.get).mockResolvedValueOnce(mockStats);

      const result = await attendancesService.getStats('user-1');

      expect(result).toHaveProperty('totalGymAttendances');
      expect(result).toHaveProperty('totalClassAttendances');
      expect(result).toHaveProperty('monthlyStats');
      expect(typeof result.totalGymAttendances).toBe('number');
      expect(Array.isArray(result.monthlyStats)).toBe(true);
    });
  });
});
