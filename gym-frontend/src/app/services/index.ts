/**
 * SERVICES INDEX
 *
 * Exportación centralizada de todos los servicios.
 */

// Servicios específicos
export { default as authenticationService } from './auth/authentication.service';
export { default as membershipsService } from './memberships/memberships.service';
export { default as subscriptionsService } from './subscriptions/subscriptions.service';
export { default as attendancesService } from './attendances/attendances.service';

// Servicio base (opcional exportar)
export { default as apiService } from './api.service';

// Re-export tipos desde interfaces
export type {
  Role,
  User,
  AuthResponse,
  RegisterDto,
  LoginDto,
  UpdateUserDto,
} from '@/app/interfaces/auth.interface';

export type {
  Membership,
  CreateMembershipDto,
  UpdateMembershipDto,
} from '@/app/interfaces/memberships.interface';

export type {
  Subscription,
  CreateSubscriptionDto,
  AddMembershipDto,
  UpdateSubscriptionDto,
} from '@/app/interfaces/subscriptions.interface';

export type {
  Attendance,
  AttendanceStatus,
  AttendanceStats,
  CreateAttendanceDto,
  CheckOutDto,
  GetHistoryParams,
} from '@/app/interfaces/attendances.interface';
