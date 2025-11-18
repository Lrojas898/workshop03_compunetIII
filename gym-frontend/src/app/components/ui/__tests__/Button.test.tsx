/**
 * BUTTON COMPONENT TESTS
 *
 * Tests for Button component covering:
 * - Rendering with different variants
 * - Size variations
 * - Loading state
 * - Disabled state
 * - Click handlers
 * - Custom className merging
 * - Accessibility
 * - Props spreading
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../Button'

describe('Button', () => {
  describe('Rendering', () => {
    it('should render a button with text', () => {
      render(<Button>Click Me</Button>)

      expect(screen.getByRole('button', { name: /Click Me/i })).toBeInTheDocument()
    })

    it('should render a button with children elements', () => {
      render(
        <Button>
          <span>Test</span>
          <span>Button</span>
        </Button>
      )

      expect(screen.getByText('Test')).toBeInTheDocument()
      expect(screen.getByText('Button')).toBeInTheDocument()
    })

    it('should have button element', () => {
      const { container } = render(<Button>Click Me</Button>)

      const button = container.querySelector('button')
      expect(button?.tagName).toBe('BUTTON')
    })

    it('should render default button type', () => {
      const { container } = render(<Button>Click Me</Button>)

      const button = container.querySelector('button')
      expect(button?.type).toBe('submit')
    })
  })

  describe('Variants', () => {
    it('should apply primary variant styles by default', () => {
      const { container } = render(<Button>Click</Button>)

      const button = container.querySelector('button')
      expect(button?.className).toContain('bg-blue-600')
      expect(button?.className).toContain('hover:bg-blue-700')
      expect(button?.className).toContain('text-white')
    })

    it('should apply primary variant styles when explicitly set', () => {
      const { container } = render(<Button variant="primary">Click</Button>)

      const button = container.querySelector('button')
      expect(button?.className).toContain('bg-blue-600')
      expect(button?.className).toContain('hover:bg-blue-700')
      expect(button?.className).toContain('text-white')
    })

    it('should apply secondary variant styles', () => {
      const { container } = render(<Button variant="secondary">Click</Button>)

      const button = container.querySelector('button')
      expect(button?.className).toContain('bg-gray-200')
      expect(button?.className).toContain('hover:bg-gray-300')
      expect(button?.className).toContain('text-gray-900')
    })

    it('should apply danger variant styles', () => {
      const { container } = render(<Button variant="danger">Delete</Button>)

      const button = container.querySelector('button')
      expect(button?.className).toContain('bg-red-600')
      expect(button?.className).toContain('hover:bg-red-700')
      expect(button?.className).toContain('text-white')
    })

    it('should apply ghost variant styles', () => {
      const { container } = render(<Button variant="ghost">Cancel</Button>)

      const button = container.querySelector('button')
      expect(button?.className).toContain('bg-transparent')
      expect(button?.className).toContain('hover:bg-gray-100')
      expect(button?.className).toContain('text-gray-700')
    })
  })

  describe('Sizes', () => {
    it('should apply small size styles by default (no, default is md)', () => {
      const { container } = render(<Button size="sm">Click</Button>)

      const button = container.querySelector('button')
      expect(button?.className).toContain('px-3')
      expect(button?.className).toContain('py-1.5')
      expect(button?.className).toContain('text-sm')
    })

    it('should apply medium size styles by default', () => {
      const { container } = render(<Button>Click</Button>)

      const button = container.querySelector('button')
      expect(button?.className).toContain('px-4')
      expect(button?.className).toContain('py-2')
      expect(button?.className).toContain('text-base')
    })

    it('should apply medium size styles when explicitly set', () => {
      const { container } = render(<Button size="md">Click</Button>)

      const button = container.querySelector('button')
      expect(button?.className).toContain('px-4')
      expect(button?.className).toContain('py-2')
      expect(button?.className).toContain('text-base')
    })

    it('should apply large size styles', () => {
      const { container } = render(<Button size="lg">Click</Button>)

      const button = container.querySelector('button')
      expect(button?.className).toContain('px-6')
      expect(button?.className).toContain('py-3')
      expect(button?.className).toContain('text-lg')
    })
  })

  describe('Disabled State', () => {
    it('should accept disabled prop', () => {
      const { container } = render(<Button disabled>Click</Button>)

      const button = container.querySelector('button')
      expect(button).toBeDisabled()
    })

    it('should apply disabled styles', () => {
      const { container } = render(<Button disabled>Click</Button>)

      const button = container.querySelector('button')
      expect(button?.className).toContain('disabled:opacity-50')
      expect(button?.className).toContain('disabled:cursor-not-allowed')
    })

    it('should not trigger click when disabled', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      render(
        <Button disabled onClick={handleClick}>
          Click
        </Button>
      )

      const button = screen.getByRole('button')
      await user.click(button)

      expect(handleClick).not.toHaveBeenCalled()
    })

    it('should be disabled when isLoading prop is true', () => {
      const { container } = render(<Button isLoading>Click</Button>)

      const button = container.querySelector('button')
      expect(button).toBeDisabled()
    })
  })

  describe('Loading State', () => {
    it('should show loading spinner and text when isLoading is true', () => {
      render(<Button isLoading>Click</Button>)

      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('should show loading spinner with correct styles', () => {
      const { container } = render(<Button isLoading>Click</Button>)

      const spinner = container.querySelector('.w-4.h-4')
      expect(spinner?.className).toContain('border-2')
      expect(spinner?.className).toContain('border-white')
      expect(spinner?.className).toContain('border-t-transparent')
      expect(spinner?.className).toContain('rounded-full')
      expect(spinner?.className).toContain('animate-spin')
    })

    it('should hide children when loading', () => {
      render(<Button isLoading>Click Me</Button>)

      expect(screen.queryByText('Click Me')).not.toBeInTheDocument()
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('should show children when not loading', () => {
      render(<Button isLoading={false}>Click Me</Button>)

      expect(screen.getByText('Click Me')).toBeInTheDocument()
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    it('should have flex layout for loading state', () => {
      const { container } = render(<Button isLoading>Click</Button>)

      const button = container.querySelector('button')
      expect(button?.className).toContain('flex')
      expect(button?.className).toContain('items-center')
      expect(button?.className).toContain('gap-2')
    })

    it('should disable button when loading starts', async () => {
      const { rerender, container } = render(<Button isLoading={false}>Click</Button>)

      let button = container.querySelector('button')
      expect(button).not.toBeDisabled()

      rerender(<Button isLoading={true}>Click</Button>)

      button = container.querySelector('button')
      expect(button).toBeDisabled()
    })
  })

  describe('Click Handler', () => {
    it('should trigger onClick when clicked', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click</Button>)

      const button = screen.getByRole('button')
      await user.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should pass event to onClick handler', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click</Button>)

      const button = screen.getByRole('button')
      await user.click(button)

      expect(handleClick).toHaveBeenCalledWith(expect.objectContaining({
        type: 'click'
      }))
    })

    it('should handle multiple clicks', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click</Button>)

      const button = screen.getByRole('button')
      await user.click(button)
      await user.click(button)
      await user.click(button)

      expect(handleClick).toHaveBeenCalledTimes(3)
    })
  })

  describe('Custom Styling', () => {
    it('should merge custom className', () => {
      const { container } = render(
        <Button className="custom-class">Click</Button>
      )

      const button = container.querySelector('button')
      expect(button?.className).toContain('custom-class')
    })

    it('should include base styles with custom className', () => {
      const { container } = render(
        <Button className="custom-class">Click</Button>
      )

      const button = container.querySelector('button')
      expect(button?.className).toContain('font-medium')
      expect(button?.className).toContain('rounded-lg')
      expect(button?.className).toContain('transition-colors')
      expect(button?.className).toContain('custom-class')
    })

    it('should support multiple custom classes', () => {
      const { container } = render(
        <Button className="custom-1 custom-2">Click</Button>
      )

      const button = container.querySelector('button')
      expect(button?.className).toContain('custom-1')
      expect(button?.className).toContain('custom-2')
    })
  })

  describe('Props Spreading', () => {
    it('should support type attribute', () => {
      const { container } = render(
        <Button type="button">Click</Button>
      )

      const button = container.querySelector('button')
      expect(button?.type).toBe('button')
    })

    it('should support aria-label attribute', () => {
      render(<Button aria-label="Submit form">Click</Button>)

      const button = screen.getByRole('button', { name: /Submit form/i })
      expect(button).toBeInTheDocument()
    })

    it('should support data attributes', () => {
      const { container } = render(
        <Button data-testid="custom-button">Click</Button>
      )

      const button = container.querySelector('[data-testid="custom-button"]')
      expect(button).toBeInTheDocument()
    })

    it('should support title attribute', () => {
      const { container } = render(
        <Button title="Tooltip">Click</Button>
      )

      const button = container.querySelector('button')
      expect(button?.title).toBe('Tooltip')
    })

    it('should support form attribute', () => {
      const { container } = render(
        <Button form="myForm">Click</Button>
      )

      const button = container.querySelector('button')
      expect(button?.getAttribute('form')).toBe('myForm')
    })
  })

  describe('Base Styles', () => {
    it('should always include font-medium class', () => {
      const { container } = render(<Button>Click</Button>)

      const button = container.querySelector('button')
      expect(button?.className).toContain('font-medium')
    })

    it('should always include rounded-lg class', () => {
      const { container } = render(<Button>Click</Button>)

      const button = container.querySelector('button')
      expect(button?.className).toContain('rounded-lg')
    })

    it('should always include transition-colors class', () => {
      const { container } = render(<Button>Click</Button>)

      const button = container.querySelector('button')
      expect(button?.className).toContain('transition-colors')
    })

    it('should always have flex layout styles', () => {
      const { container } = render(<Button>Click</Button>)

      const button = container.querySelector('button')
      expect(button?.className).toContain('flex')
      expect(button?.className).toContain('items-center')
      expect(button?.className).toContain('gap-2')
      expect(button?.className).toContain('justify-center')
    })
  })

  describe('Combinations', () => {
    it('should combine variant, size, and loading state', () => {
      render(
        <Button variant="danger" size="lg" isLoading>
          Delete
        </Button>
      )

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(screen.getByText('Loading...')).toBeInTheDocument()
      expect(button.className).toContain('bg-red-600')
      expect(button.className).toContain('px-6')
      expect(button.className).toContain('py-3')
    })

    it('should combine disabled and isLoading state', () => {
      const { container } = render(
        <Button disabled isLoading>
          Click
        </Button>
      )

      const button = container.querySelector('button')
      expect(button).toBeDisabled()
    })

    it('should apply all styles together', () => {
      const { container } = render(
        <Button
          variant="primary"
          size="md"
          className="my-custom-class"
        >
          Submit
        </Button>
      )

      const button = container.querySelector('button')
      expect(button?.className).toContain('font-medium') // base
      expect(button?.className).toContain('rounded-lg') // base
      expect(button?.className).toContain('bg-blue-600') // variant
      expect(button?.className).toContain('px-4') // size
      expect(button?.className).toContain('my-custom-class') // custom
    })
  })

  describe('Accessibility', () => {
    it('should be keyboard accessible', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click</Button>)

      const button = screen.getByRole('button')
      button.focus()
      expect(button).toHaveFocus()

      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalled()
    })

    it('should have proper semantic button element', () => {
      const { container } = render(<Button>Click</Button>)

      const button = container.querySelector('button')
      expect(button?.tagName).toBe('BUTTON')
    })

    it('should support aria attributes', () => {
      render(
        <Button aria-pressed="false" aria-describedby="help">
          Toggle
        </Button>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-pressed', 'false')
      expect(button).toHaveAttribute('aria-describedby', 'help')
    })

    it('should show disabled state to screen readers', () => {
      render(<Button disabled>Click</Button>)

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('should have sufficient contrast with color variant', () => {
      const { container } = render(<Button variant="primary">Click</Button>)

      const button = container.querySelector('button')
      // Primary: white text on blue background
      expect(button?.className).toContain('text-white')
      expect(button?.className).toContain('bg-blue-600')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty children', () => {
      const { container } = render(<Button>{''}</Button>)

      expect(container.querySelector('button')).toBeInTheDocument()
    })

    it('should handle null className prop gracefully', () => {
      const { container } = render(
        <Button className="">Click</Button>
      )

      const button = container.querySelector('button')
      expect(button).toBeInTheDocument()
    })

    it('should render with only required props (children)', () => {
      render(<Button>Minimal</Button>)

      expect(screen.getByRole('button', { name: /Minimal/i })).toBeInTheDocument()
    })

    it('should handle very long text', () => {
      const longText = 'Click me if you want to perform this very long action that has a lot of text'
      render(<Button>{longText}</Button>)

      expect(screen.getByRole('button')).toHaveTextContent(longText)
    })

    it('should handle special characters in children', () => {
      render(<Button>Click & Confirm!</Button>)

      expect(screen.getByRole('button')).toHaveTextContent('Click & Confirm!')
    })
  })
})
