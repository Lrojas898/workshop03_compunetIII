/**
 * NAVIGATION CONFIGURATION BY ROLE
 *
 * Define la navegación del sidebar según el rol del usuario.
 * Cada rol tiene acceso a diferentes secciones.
 */

import { ValidRoles } from '@/lib/configuration/api-endpoints'

export interface NavigationItem {
  label: string
  href: string
  icon?: string
  badge?: number
  children?: NavigationItem[]
}

type UserRole = 'admin' | 'receptionist' | 'coach' | 'client'

export const navigationConfig: Record<UserRole, NavigationItem[]> = {
  admin: [
    {
      label: 'Dashboard',
      href: '/dashboard/admin',
      icon: 'LayoutDashboard',
    },
    {
      label: 'Users Management',
      href: '/dashboard/admin/users',
      icon: 'Users',
    },
    {
      label: 'Memberships',
      href: '/dashboard/admin/memberships',
      icon: 'CreditCard',
    },
    {
      label: 'Subscriptions',
      href: '/dashboard/admin/subscriptions',
      icon: 'Calendar',
    },
    {
      label: 'Analytics',
      href: '/dashboard/admin/analytics',
      icon: 'BarChart',
    },
  ],

  receptionist: [
    {
      label: 'Dashboard',
      href: '/dashboard/receptionist',
      icon: 'LayoutDashboard',
    },
    {
      label: 'Check-In / Check-Out',
      href: '/dashboard/receptionist/check-in',
      icon: 'LogIn',
    },
    {
      label: 'Active Users',
      href: '/dashboard/receptionist/active-users',
      icon: 'Users',
    },
  ],

  coach: [
    {
      label: 'Dashboard',
      href: '/dashboard/coach',
      icon: 'LayoutDashboard',
    },
    {
      label: 'My Members',
      href: '/dashboard/coach/members',
      icon: 'Users',
    },
  ],

  client: [
    {
      label: 'Dashboard',
      href: '/dashboard/client',
      icon: 'LayoutDashboard',
    },
    {
      label: 'My Subscription',
      href: '/dashboard/client/my-subscription',
      icon: 'CreditCard',
    },
    {
      label: 'My Attendance',
      href: '/dashboard/client/my-attendance',
      icon: 'Calendar',
    },
  ],
}

/**
 * Obtiene los items de navegación para un rol específico
 */
export function getNavigationForRole(role: UserRole): NavigationItem[] {
  return navigationConfig[role] || []
}
