/**
 * ROLES BADGE TESTS
 *
 * Tests for RolesBadge component covering:
 * - Rendering with different roles
 * - Role color mapping
 * - Role label translation
 * - Empty roles array handling
 * - Multiple roles display
 * - Accessibility
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RolesBadge } from '../RolesBadge'
import { ValidRoles } from '@/lib/configuration/api-endpoints'

describe('RolesBadge', () => {
  describe('Rendering', () => {
    it('should render a single admin role', () => {
      const roles = [
        { id: '1', name: ValidRoles.ADMIN }
      ]

      render(<RolesBadge roles={roles} />)

      expect(screen.getByText('Administrador')).toBeInTheDocument()
    })

    it('should render a single coach role', () => {
      const roles = [
        { id: '1', name: ValidRoles.COACH }
      ]

      render(<RolesBadge roles={roles} />)

      expect(screen.getByText('Entrenador')).toBeInTheDocument()
    })

    it('should render a single receptionist role', () => {
      const roles = [
        { id: '1', name: ValidRoles.RECEPTIONIST }
      ]

      render(<RolesBadge roles={roles} />)

      expect(screen.getByText('Recepcionista')).toBeInTheDocument()
    })

    it('should render a single client role', () => {
      const roles = [
        { id: '1', name: ValidRoles.CLIENT }
      ]

      render(<RolesBadge roles={roles} />)

      expect(screen.getByText('Cliente')).toBeInTheDocument()
    })

    it('should render multiple roles', () => {
      const roles = [
        { id: '1', name: ValidRoles.ADMIN },
        { id: '2', name: ValidRoles.COACH },
        { id: '3', name: ValidRoles.CLIENT }
      ]

      render(<RolesBadge roles={roles} />)

      expect(screen.getByText('Administrador')).toBeInTheDocument()
      expect(screen.getByText('Entrenador')).toBeInTheDocument()
      expect(screen.getByText('Cliente')).toBeInTheDocument()
    })

    it('should render all four roles', () => {
      const roles = [
        { id: '1', name: ValidRoles.ADMIN },
        { id: '2', name: ValidRoles.COACH },
        { id: '3', name: ValidRoles.RECEPTIONIST },
        { id: '4', name: ValidRoles.CLIENT }
      ]

      render(<RolesBadge roles={roles} />)

      expect(screen.getByText('Administrador')).toBeInTheDocument()
      expect(screen.getByText('Entrenador')).toBeInTheDocument()
      expect(screen.getByText('Recepcionista')).toBeInTheDocument()
      expect(screen.getByText('Cliente')).toBeInTheDocument()
    })
  })

  describe('Empty Roles', () => {
    it('should display message when no roles are provided', () => {
      const roles: any[] = []

      render(<RolesBadge roles={roles} />)

      expect(screen.getByText('Sin roles asignados')).toBeInTheDocument()
    })

    it('should not render badge component when roles are empty', () => {
      const roles: any[] = []

      render(<RolesBadge roles={roles} />)

      const badgeContainer = screen.queryByText((content, element) => {
        return element?.className?.includes('flex') ?? false
      })

      // The "Sin roles asignados" span exists but is not in a flex container
      const noRolesText = screen.getByText('Sin roles asignados')
      expect(noRolesText).toBeInTheDocument()
      expect(noRolesText.className).not.toContain('flex flex-wrap')
    })
  })

  describe('Role Colors and Styling', () => {
    it('should apply admin badge styles', () => {
      const roles = [
        { id: '1', name: ValidRoles.ADMIN }
      ]

      render(<RolesBadge roles={roles} />)

      const badge = screen.getByText('Administrador')
      expect(badge.className).toContain('bg-red-100')
      expect(badge.className).toContain('text-red-800')
      expect(badge.className).toContain('border-red-300')
    })

    it('should apply coach badge styles', () => {
      const roles = [
        { id: '1', name: ValidRoles.COACH }
      ]

      render(<RolesBadge roles={roles} />)

      const badge = screen.getByText('Entrenador')
      expect(badge.className).toContain('bg-blue-100')
      expect(badge.className).toContain('text-blue-800')
      expect(badge.className).toContain('border-blue-300')
    })

    it('should apply receptionist badge styles', () => {
      const roles = [
        { id: '1', name: ValidRoles.RECEPTIONIST }
      ]

      render(<RolesBadge roles={roles} />)

      const badge = screen.getByText('Recepcionista')
      expect(badge.className).toContain('bg-purple-100')
      expect(badge.className).toContain('text-purple-800')
      expect(badge.className).toContain('border-purple-300')
    })

    it('should apply client badge styles', () => {
      const roles = [
        { id: '1', name: ValidRoles.CLIENT }
      ]

      render(<RolesBadge roles={roles} />)

      const badge = screen.getByText('Cliente')
      expect(badge.className).toContain('bg-green-100')
      expect(badge.className).toContain('text-green-800')
      expect(badge.className).toContain('border-green-300')
    })

    it('should apply common badge styles to all badges', () => {
      const roles = [
        { id: '1', name: ValidRoles.ADMIN }
      ]

      render(<RolesBadge roles={roles} />)

      const badge = screen.getByText('Administrador')
      expect(badge.className).toContain('px-3')
      expect(badge.className).toContain('py-1')
      expect(badge.className).toContain('rounded-full')
      expect(badge.className).toContain('text-xs')
      expect(badge.className).toContain('font-medium')
      expect(badge.className).toContain('border')
    })
  })

  describe('Role Labels', () => {
    it('should translate admin role correctly', () => {
      const roles = [
        { id: '1', name: ValidRoles.ADMIN }
      ]

      render(<RolesBadge roles={roles} />)

      expect(screen.getByText('Administrador')).toBeInTheDocument()
      expect(screen.queryByText('admin')).not.toBeInTheDocument()
    })

    it('should translate coach role correctly', () => {
      const roles = [
        { id: '1', name: ValidRoles.COACH }
      ]

      render(<RolesBadge roles={roles} />)

      expect(screen.getByText('Entrenador')).toBeInTheDocument()
      expect(screen.queryByText('coach')).not.toBeInTheDocument()
    })

    it('should translate receptionist role correctly', () => {
      const roles = [
        { id: '1', name: ValidRoles.RECEPTIONIST }
      ]

      render(<RolesBadge roles={roles} />)

      expect(screen.getByText('Recepcionista')).toBeInTheDocument()
      expect(screen.queryByText('receptionist')).not.toBeInTheDocument()
    })

    it('should translate client role correctly', () => {
      const roles = [
        { id: '1', name: ValidRoles.CLIENT }
      ]

      render(<RolesBadge roles={roles} />)

      expect(screen.getByText('Cliente')).toBeInTheDocument()
      expect(screen.queryByText('client')).not.toBeInTheDocument()
    })

    it('should display unknown role as-is', () => {
      const roles = [
        { id: '1', name: 'unknownRole' as any }
      ]

      render(<RolesBadge roles={roles} />)

      expect(screen.getByText('unknownRole')).toBeInTheDocument()
    })
  })

  describe('Props Handling', () => {
    it('should handle roles with different IDs', () => {
      const roles = [
        { id: 'unique-id-1', name: ValidRoles.ADMIN },
        { id: 'unique-id-2', name: ValidRoles.CLIENT }
      ]

      render(<RolesBadge roles={roles} />)

      expect(screen.getByText('Administrador')).toBeInTheDocument()
      expect(screen.getByText('Cliente')).toBeInTheDocument()
    })

    it('should accept roles array as prop', () => {
      const roles = [
        { id: '1', name: ValidRoles.COACH }
      ]

      const { container } = render(<RolesBadge roles={roles} />)

      expect(container).toBeInTheDocument()
      expect(screen.getByText('Entrenador')).toBeInTheDocument()
    })
  })

  describe('Layout', () => {
    it('should wrap badges in flex container', () => {
      const roles = [
        { id: '1', name: ValidRoles.ADMIN },
        { id: '2', name: ValidRoles.CLIENT }
      ]

      const { container } = render(<RolesBadge roles={roles} />)

      const flexContainer = container.querySelector('.flex.flex-wrap')
      expect(flexContainer).toBeInTheDocument()
    })

    it('should add gap between badges', () => {
      const roles = [
        { id: '1', name: ValidRoles.ADMIN },
        { id: '2', name: ValidRoles.CLIENT }
      ]

      const { container } = render(<RolesBadge roles={roles} />)

      const flexContainer = container.querySelector('.flex.flex-wrap.gap-2')
      expect(flexContainer).toBeInTheDocument()
    })

    it('should render badges in correct order', () => {
      const roles = [
        { id: '1', name: ValidRoles.ADMIN },
        { id: '2', name: ValidRoles.COACH },
        { id: '3', name: ValidRoles.CLIENT }
      ]

      const { container } = render(<RolesBadge roles={roles} />)

      const badges = container.querySelectorAll('span[class*="px-3"]')
      expect(badges[0]).toHaveTextContent('Administrador')
      expect(badges[1]).toHaveTextContent('Entrenador')
      expect(badges[2]).toHaveTextContent('Cliente')
    })
  })

  describe('Accessibility', () => {
    it('should use semantic span elements', () => {
      const roles = [
        { id: '1', name: ValidRoles.ADMIN }
      ]

      const { container } = render(<RolesBadge roles={roles} />)

      const badge = container.querySelector('span[class*="bg-red"]')
      expect(badge?.tagName).toBe('SPAN')
    })

    it('should have readable text for screen readers', () => {
      const roles = [
        { id: '1', name: ValidRoles.ADMIN }
      ]

      render(<RolesBadge roles={roles} />)

      const adminBadge = screen.getByText('Administrador')
      expect(adminBadge.textContent).toBe('Administrador')
    })

    it('should display message for empty roles that is clear to screen readers', () => {
      const roles: any[] = []

      render(<RolesBadge roles={roles} />)

      const noRolesText = screen.getByText('Sin roles asignados')
      expect(noRolesText).toHaveTextContent('Sin roles asignados')
    })
  })

  describe('Edge Cases', () => {
    it('should handle roles with duplicate IDs (last one wins)', () => {
      const roles = [
        { id: '1', name: ValidRoles.ADMIN },
        { id: '1', name: ValidRoles.CLIENT } // Same ID, different role
      ]

      const { container } = render(<RolesBadge roles={roles} />)

      const badges = container.querySelectorAll('span[class*="px-3"]')
      // Both should render but key will be the same (not ideal but testing behavior)
      expect(badges.length).toBe(2)
    })

    it('should handle large number of roles', () => {
      const roles = Array.from({ length: 10 }, (_, i) => ({
        id: `${i}`,
        name: i % 2 === 0 ? ValidRoles.ADMIN : ValidRoles.CLIENT
      }))

      const { container } = render(<RolesBadge roles={roles} />)

      const badges = container.querySelectorAll('span[class*="px-3"]')
      expect(badges.length).toBe(10)
    })

    it('should render correctly with only one role in array', () => {
      const roles = [
        { id: '1', name: ValidRoles.COACH }
      ]

      const { container } = render(<RolesBadge roles={roles} />)

      const flexContainer = container.querySelector('.flex.flex-wrap')
      expect(flexContainer?.children.length).toBe(1)
    })
  })
})
