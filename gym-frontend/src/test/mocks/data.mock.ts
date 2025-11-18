// Mock user data
export const mockUser = {
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  roles: ['CLIENT'],
  isActive: true,
};

export const mockAdminUser = {
  id: 2,
  email: 'admin@example.com',
  name: 'Admin User',
  roles: ['ADMIN'],
  isActive: true,
};

// Mock login response
export const mockLoginResponse = {
  user: mockUser,
  token: 'mock-jwt-token',
};

// Mock membership
export const mockMembership = {
  id: 1,
  name: 'Basic Plan',
  description: 'Basic gym access',
  price: 50,
  durationDays: 30,
  isActive: true,
};

// Mock subscription
export const mockSubscription = {
  id: 1,
  userId: 1,
  membershipId: 1,
  startDate: '2025-01-01',
  endDate: '2025-01-31',
  status: 'ACTIVE',
  membership: mockMembership,
};

// Mock class
export const mockClass = {
  id: 1,
  name: 'Yoga Class',
  description: 'Beginner friendly yoga',
  coachId: 1,
  schedule: '2025-01-15T10:00:00Z',
  duration: 60,
  maxCapacity: 20,
  isActive: true,
};

// Mock attendance
export const mockAttendance = {
  id: 1,
  userId: 1,
  classId: 1,
  checkInTime: '2025-01-15T09:55:00Z',
  checkOutTime: null,
  status: 'CHECKED_IN',
};
