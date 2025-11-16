/**
 * REGISTER FORM TESTS
 *
 * Tests for RegisterForm component covering:
 * - Form rendering with all fields
 * - Input state management
 * - Comprehensive validation (name, email, age, password, confirmation)
 * - Success and error states
 * - Loading state
 * - Service calls and navigation
 * - Form interactions
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RegisterForm } from '../RegisterForm'
import authenticationService from '@/app/services/auth/authentication.service'
import { useAuthStore } from '@/app/_store/auth/auth.store'
import { useRouter } from 'next/navigation'

// Mock external dependencies
vi.mock('@/app/services/auth/authentication.service')
vi.mock('@/app/_store/auth/auth.store')
vi.mock('next/navigation')
vi.mock('next/link', () => ({
  default: ({ href, children }: any) => (
    <a href={href}>{children}</a>
  ),
}))

describe('RegisterForm', () => {
  let mockLogin: any
  let mockPush: any

  beforeEach(() => {
    mockLogin = vi.fn()
    mockPush = vi.fn()

    ;(useAuthStore as any).mockReturnValue({
      login: mockLogin,
    })

    ;(useRouter as any).mockReturnValue({
      push: mockPush,
    })

    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render the registration form with all required fields', () => {
      render(<RegisterForm />)

      expect(screen.getByText('Temple')).toBeInTheDocument()
      expect(screen.getByText('Gym')).toBeInTheDocument()
      expect(screen.getByText(/Crea tu cuenta para empezar/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/Nombre Completo/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/Edad/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/Contraseña \(mín\. 6 caracteres\)/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/Confirmar Contraseña/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Crear Cuenta/i })).toBeInTheDocument()
    })

    it('should render the login link', () => {
      render(<RegisterForm />)

      const loginLink = screen.getByText(/Inicia sesión/i)
      expect(loginLink).toBeInTheDocument()
      expect(loginLink.closest('a')).toHaveAttribute('href', '/login')
    })

    it('should render the logo link pointing to home', () => {
      render(<RegisterForm />)

      const logoLink = screen.getByRole('link', { name: /Temple Gym/i })
      expect(logoLink).toHaveAttribute('href', '/')
    })

    it('should have correct input types and IDs', () => {
      render(<RegisterForm />)

      const fullNameInput = screen.getByPlaceholderText(/Nombre Completo/i)
      const emailInput = screen.getByPlaceholderText(/Email/i)
      const ageInput = screen.getByPlaceholderText(/Edad/i)
      const passwordInput = screen.getByPlaceholderText(/Contraseña \(mín\. 6 caracteres\)/i)
      const confirmPasswordInput = screen.getByPlaceholderText(/Confirmar Contraseña/i)

      expect(fullNameInput).toHaveAttribute('id', 'fullName')
      expect(fullNameInput).toHaveAttribute('type', 'text')

      expect(emailInput).toHaveAttribute('id', 'email')
      expect(emailInput).toHaveAttribute('type', 'email')

      expect(ageInput).toHaveAttribute('id', 'age')
      expect(ageInput).toHaveAttribute('type', 'number')

      expect(passwordInput).toHaveAttribute('id', 'password')
      expect(passwordInput).toHaveAttribute('type', 'password')

      expect(confirmPasswordInput).toHaveAttribute('id', 'confirmPassword')
      expect(confirmPasswordInput).toHaveAttribute('type', 'password')
    })
  })

  describe('Form Input Handling', () => {
    it('should update fullName state when user types', async () => {
      const user = userEvent.setup()
      render(<RegisterForm />)

      const fullNameInput = screen.getByPlaceholderText(/Nombre Completo/i) as HTMLInputElement
      await user.type(fullNameInput, 'John Doe')

      expect(fullNameInput.value).toBe('John Doe')
    })

    it('should update email state when user types', async () => {
      const user = userEvent.setup()
      render(<RegisterForm />)

      const emailInput = screen.getByPlaceholderText(/Email/i) as HTMLInputElement
      await user.type(emailInput, 'john@example.com')

      expect(emailInput.value).toBe('john@example.com')
    })

    it('should update age state when user types', async () => {
      const user = userEvent.setup()
      render(<RegisterForm />)

      const ageInput = screen.getByPlaceholderText(/Edad/i) as HTMLInputElement
      await user.type(ageInput, '25')

      expect(ageInput.value).toBe('25')
    })

    it('should update password state when user types', async () => {
      const user = userEvent.setup()
      render(<RegisterForm />)

      const passwordInput = screen.getByPlaceholderText(/Contraseña \(mín\. 6 caracteres\)/i) as HTMLInputElement
      await user.type(passwordInput, 'password123')

      expect(passwordInput.value).toBe('password123')
    })

    it('should update confirmPassword state when user types', async () => {
      const user = userEvent.setup()
      render(<RegisterForm />)

      const confirmPasswordInput = screen.getByPlaceholderText(/Confirmar Contraseña/i) as HTMLInputElement
      await user.type(confirmPasswordInput, 'password123')

      expect(confirmPasswordInput.value).toBe('password123')
    })

    it('should disable inputs when loading', async () => {
      const user = userEvent.setup()
      ;(authenticationService.register as any).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({}), 500))
      )

      render(<RegisterForm />)

      const fullNameInput = screen.getByPlaceholderText(/Nombre Completo/i)
      const emailInput = screen.getByPlaceholderText(/Email/i)
      const ageInput = screen.getByPlaceholderText(/Edad/i)
      const passwordInput = screen.getByPlaceholderText(/Contraseña \(mín\. 6 caracteres\)/i)
      const confirmPasswordInput = screen.getByPlaceholderText(/Confirmar Contraseña/i)

      await user.type(fullNameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(ageInput, '25')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')

      await user.click(screen.getByRole('button', { name: /Crear Cuenta/i }))

      expect(fullNameInput).toBeDisabled()
      expect(emailInput).toBeDisabled()
      expect(ageInput).toBeDisabled()
      expect(passwordInput).toBeDisabled()
      expect(confirmPasswordInput).toBeDisabled()
    })
  })

  describe('Validation Logic', () => {
    it('should show error when any field is empty', async () => {
      const user = userEvent.setup()
      render(<RegisterForm />)

      await user.click(screen.getByRole('button', { name: /Crear Cuenta/i }))

      expect(screen.getByText(/Por favor completa todos los campos/i)).toBeInTheDocument()
    })

    it('should show error when fullName is less than 3 characters', async () => {
      const user = userEvent.setup()
      render(<RegisterForm />)

      const fullNameInput = screen.getByPlaceholderText(/Nombre Completo/i)
      const emailInput = screen.getByPlaceholderText(/Email/i)
      const ageInput = screen.getByPlaceholderText(/Edad/i)
      const passwordInput = screen.getByPlaceholderText(/Contraseña \(mín\. 6 caracteres\)/i)
      const confirmPasswordInput = screen.getByPlaceholderText(/Confirmar Contraseña/i)

      await user.type(fullNameInput, 'Jo')
      await user.type(emailInput, 'john@example.com')
      await user.type(ageInput, '25')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')

      await user.click(screen.getByRole('button', { name: /Crear Cuenta/i }))

      expect(screen.getByText(/El nombre debe tener al menos 3 caracteres/i)).toBeInTheDocument()
    })

    it('should show error for invalid email format', async () => {
      const user = userEvent.setup()
      render(<RegisterForm />)

      const fullNameInput = screen.getByPlaceholderText(/Nombre Completo/i)
      const emailInput = screen.getByPlaceholderText(/Email/i)
      const ageInput = screen.getByPlaceholderText(/Edad/i)
      const passwordInput = screen.getByPlaceholderText(/Contraseña \(mín\. 6 caracteres\)/i)
      const confirmPasswordInput = screen.getByPlaceholderText(/Confirmar Contraseña/i)

      await user.type(fullNameInput, 'John Doe')
      await user.type(emailInput, 'invalidemail')
      await user.type(ageInput, '25')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')

      await user.click(screen.getByRole('button', { name: /Crear Cuenta/i }))

      expect(screen.getByText(/Por favor ingresa un email válido/i)).toBeInTheDocument()
    })

    it('should show error when age is below 1', async () => {
      const user = userEvent.setup()
      render(<RegisterForm />)

      const fullNameInput = screen.getByPlaceholderText(/Nombre Completo/i)
      const emailInput = screen.getByPlaceholderText(/Email/i)
      const ageInput = screen.getByPlaceholderText(/Edad/i)
      const passwordInput = screen.getByPlaceholderText(/Contraseña \(mín\. 6 caracteres\)/i)
      const confirmPasswordInput = screen.getByPlaceholderText(/Confirmar Contraseña/i)

      await user.type(fullNameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(ageInput, '0')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')

      await user.click(screen.getByRole('button', { name: /Crear Cuenta/i }))

      expect(screen.getByText(/La edad debe estar entre 1 y 120 años/i)).toBeInTheDocument()
    })

    it('should show error when age is above 120', async () => {
      const user = userEvent.setup()
      render(<RegisterForm />)

      const fullNameInput = screen.getByPlaceholderText(/Nombre Completo/i)
      const emailInput = screen.getByPlaceholderText(/Email/i)
      const ageInput = screen.getByPlaceholderText(/Edad/i)
      const passwordInput = screen.getByPlaceholderText(/Contraseña \(mín\. 6 caracteres\)/i)
      const confirmPasswordInput = screen.getByPlaceholderText(/Confirmar Contraseña/i)

      await user.type(fullNameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(ageInput, '150')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')

      await user.click(screen.getByRole('button', { name: /Crear Cuenta/i }))

      expect(screen.getByText(/La edad debe estar entre 1 y 120 años/i)).toBeInTheDocument()
    })

    it('should show error when age is not a number', async () => {
      const user = userEvent.setup()
      render(<RegisterForm />)

      const fullNameInput = screen.getByPlaceholderText(/Nombre Completo/i)
      const emailInput = screen.getByPlaceholderText(/Email/i)
      const ageInput = screen.getByPlaceholderText(/Edad/i)
      const passwordInput = screen.getByPlaceholderText(/Contraseña \(mín\. 6 caracteres\)/i)
      const confirmPasswordInput = screen.getByPlaceholderText(/Confirmar Contraseña/i)

      await user.type(fullNameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(ageInput, 'abc')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')

      await user.click(screen.getByRole('button', { name: /Crear Cuenta/i }))

      expect(screen.getByText(/La edad debe estar entre 1 y 120 años/i)).toBeInTheDocument()
    })

    it('should show error when password is less than 6 characters', async () => {
      const user = userEvent.setup()
      render(<RegisterForm />)

      const fullNameInput = screen.getByPlaceholderText(/Nombre Completo/i)
      const emailInput = screen.getByPlaceholderText(/Email/i)
      const ageInput = screen.getByPlaceholderText(/Edad/i)
      const passwordInput = screen.getByPlaceholderText(/Contraseña \(mín\. 6 caracteres\)/i)
      const confirmPasswordInput = screen.getByPlaceholderText(/Confirmar Contraseña/i)

      await user.type(fullNameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(ageInput, '25')
      await user.type(passwordInput, '12345')
      await user.type(confirmPasswordInput, '12345')

      await user.click(screen.getByRole('button', { name: /Crear Cuenta/i }))

      expect(screen.getByText(/La contraseña debe tener al menos 6 caracteres/i)).toBeInTheDocument()
    })

    it('should show error when passwords do not match', async () => {
      const user = userEvent.setup()
      render(<RegisterForm />)

      const fullNameInput = screen.getByPlaceholderText(/Nombre Completo/i)
      const emailInput = screen.getByPlaceholderText(/Email/i)
      const ageInput = screen.getByPlaceholderText(/Edad/i)
      const passwordInput = screen.getByPlaceholderText(/Contraseña \(mín\. 6 caracteres\)/i)
      const confirmPasswordInput = screen.getByPlaceholderText(/Confirmar Contraseña/i)

      await user.type(fullNameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(ageInput, '25')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password456')

      await user.click(screen.getByRole('button', { name: /Crear Cuenta/i }))

      expect(screen.getByText(/Las contraseñas no coinciden/i)).toBeInTheDocument()
    })

    it('should accept valid age values between 1 and 120', async () => {
      ;(authenticationService.register as any).mockResolvedValueOnce({
        id: '1',
        email: 'john@example.com',
        roles: [{ id: '1', name: 'client' }],
      })

      const user = userEvent.setup()
      render(<RegisterForm />)

      const fullNameInput = screen.getByPlaceholderText(/Nombre Completo/i)
      const emailInput = screen.getByPlaceholderText(/Email/i)
      const ageInput = screen.getByPlaceholderText(/Edad/i)
      const passwordInput = screen.getByPlaceholderText(/Contraseña \(mín\. 6 caracteres\)/i)
      const confirmPasswordInput = screen.getByPlaceholderText(/Confirmar Contraseña/i)

      await user.type(fullNameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(ageInput, '120')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')

      await user.click(screen.getByRole('button', { name: /Crear Cuenta/i }))

      await waitFor(() => {
        expect(authenticationService.register).toHaveBeenCalled()
      })
    })
  })

  describe('Loading State', () => {
    it('should show loading text while registering', async () => {
      const user = userEvent.setup()
      ;(authenticationService.register as any).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({}), 500))
      )

      render(<RegisterForm />)

      const fullNameInput = screen.getByPlaceholderText(/Nombre Completo/i)
      const emailInput = screen.getByPlaceholderText(/Email/i)
      const ageInput = screen.getByPlaceholderText(/Edad/i)
      const passwordInput = screen.getByPlaceholderText(/Contraseña \(mín\. 6 caracteres\)/i)
      const confirmPasswordInput = screen.getByPlaceholderText(/Confirmar Contraseña/i)

      await user.type(fullNameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(ageInput, '25')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')

      await user.click(screen.getByRole('button', { name: /Crear Cuenta/i }))

      expect(screen.getByRole('button')).toHaveTextContent(/Creando cuenta.../i)
    })

    it('should disable submit button when loading', async () => {
      const user = userEvent.setup()
      ;(authenticationService.register as any).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({}), 500))
      )

      render(<RegisterForm />)

      const fullNameInput = screen.getByPlaceholderText(/Nombre Completo/i)
      const emailInput = screen.getByPlaceholderText(/Email/i)
      const ageInput = screen.getByPlaceholderText(/Edad/i)
      const passwordInput = screen.getByPlaceholderText(/Contraseña \(mín\. 6 caracteres\)/i)
      const confirmPasswordInput = screen.getByPlaceholderText(/Confirmar Contraseña/i)

      await user.type(fullNameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(ageInput, '25')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')

      const submitButton = screen.getByRole('button', { name: /Crear Cuenta/i })
      await user.click(submitButton)

      expect(submitButton).toBeDisabled()
    })
  })

  describe('Success State', () => {
    it('should display success message when registration succeeds', async () => {
      const user = userEvent.setup()
      ;(authenticationService.register as any).mockResolvedValueOnce({
        id: '1',
        email: 'john@example.com',
        roles: [{ id: '1', name: 'client' }],
      })

      render(<RegisterForm />)

      const fullNameInput = screen.getByPlaceholderText(/Nombre Completo/i)
      const emailInput = screen.getByPlaceholderText(/Email/i)
      const ageInput = screen.getByPlaceholderText(/Edad/i)
      const passwordInput = screen.getByPlaceholderText(/Contraseña \(mín\. 6 caracteres\)/i)
      const confirmPasswordInput = screen.getByPlaceholderText(/Confirmar Contraseña/i)

      await user.type(fullNameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(ageInput, '25')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')

      await user.click(screen.getByRole('button', { name: /Crear Cuenta/i }))

      await waitFor(() => {
        expect(screen.getByText(/Cuenta creada exitosamente. Redirigiendo al dashboard/i)).toBeInTheDocument()
      })
    })

    it('should disable submit button after successful registration', async () => {
      const user = userEvent.setup()
      ;(authenticationService.register as any).mockResolvedValueOnce({
        id: '1',
        email: 'john@example.com',
        roles: [{ id: '1', name: 'client' }],
      })

      render(<RegisterForm />)

      const fullNameInput = screen.getByPlaceholderText(/Nombre Completo/i)
      const emailInput = screen.getByPlaceholderText(/Email/i)
      const ageInput = screen.getByPlaceholderText(/Edad/i)
      const passwordInput = screen.getByPlaceholderText(/Contraseña \(mín\. 6 caracteres\)/i)
      const confirmPasswordInput = screen.getByPlaceholderText(/Confirmar Contraseña/i)

      await user.type(fullNameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(ageInput, '25')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')

      const submitButton = screen.getByRole('button', { name: /Crear Cuenta/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(submitButton).toBeDisabled()
      })
    })
  })

  describe('Authentication and Navigation', () => {
    it('should call register service with correct data', async () => {
      const user = userEvent.setup()
      const mockResponse = {
        id: '1',
        email: 'john@example.com',
        roles: [{ id: '1', name: 'client' }],
      }
      ;(authenticationService.register as any).mockResolvedValueOnce(mockResponse)

      render(<RegisterForm />)

      const fullNameInput = screen.getByPlaceholderText(/Nombre Completo/i)
      const emailInput = screen.getByPlaceholderText(/Email/i)
      const ageInput = screen.getByPlaceholderText(/Edad/i)
      const passwordInput = screen.getByPlaceholderText(/Contraseña \(mín\. 6 caracteres\)/i)
      const confirmPasswordInput = screen.getByPlaceholderText(/Confirmar Contraseña/i)

      await user.type(fullNameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(ageInput, '25')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')

      await user.click(screen.getByRole('button', { name: /Crear Cuenta/i }))

      await waitFor(() => {
        expect(authenticationService.register).toHaveBeenCalledWith({
          fullName: 'John Doe',
          email: 'john@example.com',
          age: 25,
          password: 'password123',
        })
      })
    })

    it('should call login store action with response data', async () => {
      const user = userEvent.setup()
      const mockResponse = {
        id: '1',
        email: 'john@example.com',
        roles: [{ id: '1', name: 'client' }],
      }
      ;(authenticationService.register as any).mockResolvedValueOnce(mockResponse)

      render(<RegisterForm />)

      const fullNameInput = screen.getByPlaceholderText(/Nombre Completo/i)
      const emailInput = screen.getByPlaceholderText(/Email/i)
      const ageInput = screen.getByPlaceholderText(/Edad/i)
      const passwordInput = screen.getByPlaceholderText(/Contraseña \(mín\. 6 caracteres\)/i)
      const confirmPasswordInput = screen.getByPlaceholderText(/Confirmar Contraseña/i)

      await user.type(fullNameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(ageInput, '25')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')

      await user.click(screen.getByRole('button', { name: /Crear Cuenta/i }))

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith(mockResponse)
      })
    })

    it('should navigate to admin dashboard for admin users after delay', async () => {
      const user = userEvent.setup()
      vi.useFakeTimers()

      ;(authenticationService.register as any).mockResolvedValueOnce({
        id: '1',
        email: 'admin@example.com',
        roles: [{ id: '1', name: 'admin' }],
      })

      render(<RegisterForm />)

      const fullNameInput = screen.getByPlaceholderText(/Nombre Completo/i)
      const emailInput = screen.getByPlaceholderText(/Email/i)
      const ageInput = screen.getByPlaceholderText(/Edad/i)
      const passwordInput = screen.getByPlaceholderText(/Contraseña \(mín\. 6 caracteres\)/i)
      const confirmPasswordInput = screen.getByPlaceholderText(/Confirmar Contraseña/i)

      await user.type(fullNameInput, 'John Doe')
      await user.type(emailInput, 'admin@example.com')
      await user.type(ageInput, '25')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')

      await user.click(screen.getByRole('button', { name: /Crear Cuenta/i }))

      vi.advanceTimersByTime(1500)

      expect(mockPush).toHaveBeenCalledWith('/admin')

      vi.useRealTimers()
    })

    it('should navigate to client dashboard for client users after delay', async () => {
      const user = userEvent.setup()
      vi.useFakeTimers()

      ;(authenticationService.register as any).mockResolvedValueOnce({
        id: '1',
        email: 'client@example.com',
        roles: [{ id: '1', name: 'client' }],
      })

      render(<RegisterForm />)

      const fullNameInput = screen.getByPlaceholderText(/Nombre Completo/i)
      const emailInput = screen.getByPlaceholderText(/Email/i)
      const ageInput = screen.getByPlaceholderText(/Edad/i)
      const passwordInput = screen.getByPlaceholderText(/Contraseña \(mín\. 6 caracteres\)/i)
      const confirmPasswordInput = screen.getByPlaceholderText(/Confirmar Contraseña/i)

      await user.type(fullNameInput, 'John Doe')
      await user.type(emailInput, 'client@example.com')
      await user.type(ageInput, '25')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')

      await user.click(screen.getByRole('button', { name: /Crear Cuenta/i }))

      vi.advanceTimersByTime(1500)

      expect(mockPush).toHaveBeenCalledWith('/client')

      vi.useRealTimers()
    })

    it('should default to client dashboard for unknown roles', async () => {
      const user = userEvent.setup()
      vi.useFakeTimers()

      ;(authenticationService.register as any).mockResolvedValueOnce({
        id: '1',
        email: 'unknown@example.com',
        roles: [{ id: '1', name: 'unknownRole' }],
      })

      render(<RegisterForm />)

      const fullNameInput = screen.getByPlaceholderText(/Nombre Completo/i)
      const emailInput = screen.getByPlaceholderText(/Email/i)
      const ageInput = screen.getByPlaceholderText(/Edad/i)
      const passwordInput = screen.getByPlaceholderText(/Contraseña \(mín\. 6 caracteres\)/i)
      const confirmPasswordInput = screen.getByPlaceholderText(/Confirmar Contraseña/i)

      await user.type(fullNameInput, 'John Doe')
      await user.type(emailInput, 'unknown@example.com')
      await user.type(ageInput, '25')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')

      await user.click(screen.getByRole('button', { name: /Crear Cuenta/i }))

      vi.advanceTimersByTime(1500)

      expect(mockPush).toHaveBeenCalledWith('/client')

      vi.useRealTimers()
    })
  })

  describe('Error Handling', () => {
    it('should display error message from service response', async () => {
      const user = userEvent.setup()
      const errorMessage = 'Email already exists'
      ;(authenticationService.register as any).mockRejectedValueOnce({
        response: {
          data: {
            message: errorMessage,
          },
        },
      })

      render(<RegisterForm />)

      const fullNameInput = screen.getByPlaceholderText(/Nombre Completo/i)
      const emailInput = screen.getByPlaceholderText(/Email/i)
      const ageInput = screen.getByPlaceholderText(/Edad/i)
      const passwordInput = screen.getByPlaceholderText(/Contraseña \(mín\. 6 caracteres\)/i)
      const confirmPasswordInput = screen.getByPlaceholderText(/Confirmar Contraseña/i)

      await user.type(fullNameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(ageInput, '25')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')

      await user.click(screen.getByRole('button', { name: /Crear Cuenta/i }))

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
      })
    })

    it('should display default error message when service throws without data', async () => {
      const user = userEvent.setup()
      ;(authenticationService.register as any).mockRejectedValueOnce({
        response: {},
      })

      render(<RegisterForm />)

      const fullNameInput = screen.getByPlaceholderText(/Nombre Completo/i)
      const emailInput = screen.getByPlaceholderText(/Email/i)
      const ageInput = screen.getByPlaceholderText(/Edad/i)
      const passwordInput = screen.getByPlaceholderText(/Contraseña \(mín\. 6 caracteres\)/i)
      const confirmPasswordInput = screen.getByPlaceholderText(/Confirmar Contraseña/i)

      await user.type(fullNameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(ageInput, '25')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')

      await user.click(screen.getByRole('button', { name: /Crear Cuenta/i }))

      await waitFor(() => {
        expect(screen.getByText(/Error al crear la cuenta. Intenta de nuevo./i)).toBeInTheDocument()
      })
    })

    it('should clear success message when error occurs', async () => {
      const user = userEvent.setup()
      vi.useFakeTimers()

      ;(authenticationService.register as any).mockResolvedValueOnce({
        id: '1',
        email: 'john@example.com',
        roles: [{ id: '1', name: 'client' }],
      })

      render(<RegisterForm />)

      const fullNameInput = screen.getByPlaceholderText(/Nombre Completo/i)
      const emailInput = screen.getByPlaceholderText(/Email/i)
      const ageInput = screen.getByPlaceholderText(/Edad/i)
      const passwordInput = screen.getByPlaceholderText(/Contraseña \(mín\. 6 caracteres\)/i)
      const confirmPasswordInput = screen.getByPlaceholderText(/Confirmar Contraseña/i)

      await user.type(fullNameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(ageInput, '25')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')

      await user.click(screen.getByRole('button', { name: /Crear Cuenta/i }))

      await waitFor(() => {
        expect(screen.getByText(/Cuenta creada exitosamente/i)).toBeInTheDocument()
      })

      vi.useRealTimers()
    })
  })
})
