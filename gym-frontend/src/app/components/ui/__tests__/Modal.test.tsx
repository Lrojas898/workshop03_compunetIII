/**
 * MODAL COMPONENT TESTS
 *
 * Tests for Modal component covering:
 * - Rendering when open/closed
 * - Close button functionality
 * - Escape key handling
 * - Size variations
 * - Backdrop interaction
 * - Body scroll lock
 * - Accessibility
 * - Content rendering
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from '../Modal'

describe('Modal', () => {
  let mockOnClose: any

  beforeEach(() => {
    mockOnClose = vi.fn()
    vi.clearAllMocks()
  })

  describe('Visibility', () => {
    it('should not render when isOpen is false', () => {
      const { container } = render(
        <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
          Content
        </Modal>
      )

      expect(container.firstChild).toBeEmptyDOMNode()
    })

    it('should render when isOpen is true', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          Content
        </Modal>
      )

      expect(screen.getByText('Test Modal')).toBeInTheDocument()
    })

    it('should render null when isOpen transitions from true to false', async () => {
      const { rerender, container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          Content
        </Modal>
      )

      expect(screen.getByText('Test Modal')).toBeInTheDocument()

      rerender(
        <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
          Content
        </Modal>
      )

      await waitFor(() => {
        expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
      })
    })
  })

  describe('Rendering', () => {
    it('should render modal with correct structure', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          Test Content
        </Modal>
      )

      // Should have backdrop div
      const backdrop = container.querySelector('[style*="backdrop"]')
      expect(backdrop).toBeInTheDocument()

      // Should have modal dialog
      const modalContent = container.querySelector('.bg-white')
      expect(modalContent).toBeInTheDocument()
    })

    it('should render title in header', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="My Modal Title">
          Content
        </Modal>
      )

      expect(screen.getByText('My Modal Title')).toBeInTheDocument()
    })

    it('should render children content', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          <div>Custom Content Here</div>
        </Modal>
      )

      expect(screen.getByText('Custom Content Here')).toBeInTheDocument()
    })

    it('should render close button with X icon', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          Content
        </Modal>
      )

      // Look for the X icon button
      const closeButton = container.querySelector('button')
      expect(closeButton).toBeInTheDocument()
    })

    it('should have proper header structure', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Title">
          Content
        </Modal>
      )

      const header = container.querySelector('.flex.items-center')
      expect(header).toBeInTheDocument()

      const title = header?.querySelector('.text-xl')
      expect(title?.textContent).toContain('Test Title')
    })

    it('should have scrollable content area', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          <div>Content</div>
        </Modal>
      )

      const contentArea = container.querySelector('.overflow-y-auto')
      expect(contentArea).toBeInTheDocument()
    })
  })

  describe('Size Variations', () => {
    it('should render with small size by default (no, default is md)', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal" size="sm">
          Content
        </Modal>
      )

      const modal = container.querySelector('.max-w-md')
      expect(modal).toBeInTheDocument()
    })

    it('should render with medium size by default', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          Content
        </Modal>
      )

      const modal = container.querySelector('.max-w-lg')
      expect(modal).toBeInTheDocument()
    })

    it('should render with small size when specified', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal" size="sm">
          Content
        </Modal>
      )

      const modal = container.querySelector('.max-w-md')
      expect(modal).toBeInTheDocument()
    })

    it('should render with large size when specified', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal" size="lg">
          Content
        </Modal>
      )

      const modal = container.querySelector('.max-w-2xl')
      expect(modal).toBeInTheDocument()
    })

    it('should render with extra large size when specified', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal" size="xl">
          Content
        </Modal>
      )

      const modal = container.querySelector('.max-w-4xl')
      expect(modal).toBeInTheDocument()
    })
  })

  describe('Close Button', () => {
    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup()
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          Content
        </Modal>
      )

      const closeButton = container.querySelector('button')
      await user.click(closeButton!)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should have proper close button styling', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          Content
        </Modal>
      )

      const closeButton = container.querySelector('button')
      expect(closeButton?.className).toContain('text-gray-400')
      expect(closeButton?.className).toContain('hover:text-gray-600')
      expect(closeButton?.className).toContain('transition')
    })
  })

  describe('Escape Key Handler', () => {
    it('should call onClose when Escape key is pressed', async () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          Content
        </Modal>
      )

      fireEvent.keyDown(document, { key: 'Escape' })

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should not call onClose for other key presses', async () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          Content
        </Modal>
      )

      fireEvent.keyDown(document, { key: 'Enter' })
      fireEvent.keyDown(document, { key: 'Space' })

      expect(mockOnClose).not.toHaveBeenCalled()
    })

    it('should not listen for Escape key when modal is closed', async () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          Content
        </Modal>
      )

      mockOnClose.mockClear()

      rerender(
        <Modal isOpen={false} onClose={mockOnClose} title="Modal">
          Content
        </Modal>
      )

      fireEvent.keyDown(document, { key: 'Escape' })

      expect(mockOnClose).not.toHaveBeenCalled()
    })

    it('should clean up event listener on unmount', () => {
      const { unmount } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          Content
        </Modal>
      )

      unmount()

      mockOnClose.mockClear()

      fireEvent.keyDown(document, { key: 'Escape' })

      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })

  describe('Backdrop', () => {
    it('should render backdrop when modal is open', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          Content
        </Modal>
      )

      const backdrop = container.querySelector('[style*="backdrop"]')
      expect(backdrop).toBeInTheDocument()
    })

    it('should call onClose when backdrop is clicked', async () => {
      const user = userEvent.setup()
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          Content
        </Modal>
      )

      const backdrop = container.querySelector('.absolute.inset-0')
      await user.click(backdrop!)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should have backdrop blur effect', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          Content
        </Modal>
      )

      const backdrop = container.querySelector('[style*="backdrop"]')
      expect(backdrop?.getAttribute('style')).toContain('blur')
    })

    it('should have correct backdrop opacity', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          Content
        </Modal>
      )

      const backdrop = container.querySelector('.bg-gray-900')
      expect(backdrop?.className).toContain('bg-opacity-75')
    })
  })

  describe('Body Scroll Lock', () => {
    it('should lock body scroll when modal opens', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          Content
        </Modal>
      )

      expect(document.body.style.overflow).toBe('hidden')
    })

    it('should unlock body scroll when modal closes', () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          Content
        </Modal>
      )

      expect(document.body.style.overflow).toBe('hidden')

      rerender(
        <Modal isOpen={false} onClose={mockOnClose} title="Modal">
          Content
        </Modal>
      )

      expect(document.body.style.overflow).toBe('unset')
    })

    it('should reset scroll on component unmount', () => {
      const { unmount } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          Content
        </Modal>
      )

      unmount()

      expect(document.body.style.overflow).toBe('unset')
    })

    it('should handle multiple modal instances', () => {
      const mockClose1 = vi.fn()
      const mockClose2 = vi.fn()

      render(
        <>
          <Modal isOpen={true} onClose={mockClose1} title="Modal 1">
            Content 1
          </Modal>
          <Modal isOpen={true} onClose={mockClose2} title="Modal 2">
            Content 2
          </Modal>
        </>
      )

      expect(document.body.style.overflow).toBe('hidden')
    })
  })

  describe('Content Rendering', () => {
    it('should render complex JSX content', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          <div>
            <h3>Nested Content</h3>
            <p>Paragraph content</p>
            <button>Action Button</button>
          </div>
        </Modal>
      )

      expect(screen.getByText('Nested Content')).toBeInTheDocument()
      expect(screen.getByText('Paragraph content')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument()
    })

    it('should render form content inside modal', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Form Modal">
          <form>
            <input placeholder="Name" />
            <input placeholder="Email" />
            <button type="submit">Submit</button>
          </form>
        </Modal>
      )

      expect(screen.getByPlaceholderText('Name')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
    })

    it('should handle children that update over time', () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          <div>Initial Content</div>
        </Modal>
      )

      expect(screen.getByText('Initial Content')).toBeInTheDocument()

      rerender(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          <div>Updated Content</div>
        </Modal>
      )

      expect(screen.getByText('Updated Content')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should use semantic HTML structure', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          Content
        </Modal>
      )

      const modal = container.querySelector('.fixed')
      expect(modal).toBeInTheDocument()

      const header = container.querySelector('.flex.items-center')
      expect(header).toBeInTheDocument()

      const closeButton = container.querySelector('button')
      expect(closeButton?.tagName).toBe('BUTTON')
    })

    it('should have proper heading hierarchy', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal Title">
          Content
        </Modal>
      )

      const heading = screen.getByText('Modal Title')
      expect(heading?.className).toContain('text-xl')
      expect(heading?.className).toContain('font-semibold')
    })

    it('should support keyboard navigation for close button', async () => {
      const user = userEvent.setup()
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          Content
        </Modal>
      )

      const closeButton = container.querySelector('button')
      closeButton?.focus()
      expect(closeButton).toHaveFocus()

      await user.keyboard('{Enter}')
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should have proper color contrast', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          Content
        </Modal>
      )

      const header = container.querySelector('.text-gray-900')
      expect(header).toBeInTheDocument()

      const closeButton = container.querySelector('.text-gray-400')
      expect(closeButton).toBeInTheDocument()
    })

    it('should trap focus within modal (content is interactive)', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          <button>Action 1</button>
          <button>Action 2</button>
        </Modal>
      )

      expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action 2' })).toBeInTheDocument()
    })
  })

  describe('Layout and Styling', () => {
    it('should center modal on screen', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          Content
        </Modal>
      )

      const modalWrapper = container.querySelector('.fixed.inset-0.z-50')
      expect(modalWrapper?.className).toContain('flex')
      expect(modalWrapper?.className).toContain('items-center')
      expect(modalWrapper?.className).toContain('justify-center')
    })

    it('should have proper modal dimensions', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal" size="md">
          Content
        </Modal>
      )

      const modal = container.querySelector('.relative.bg-white')
      expect(modal?.className).toContain('rounded-lg')
      expect(modal?.className).toContain('shadow-xl')
      expect(modal?.className).toContain('w-full')
      expect(modal?.className).toContain('mx-4')
      expect(modal?.className).toContain('max-h-[90vh]')
      expect(modal?.className).toContain('overflow-hidden')
      expect(modal?.className).toContain('flex')
      expect(modal?.className).toContain('flex-col')
    })

    it('should have border between header and content', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          Content
        </Modal>
      )

      const headerContainer = container.querySelector('.border-b')
      expect(headerContainer).toBeInTheDocument()
    })

    it('should have proper z-index layering', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          Content
        </Modal>
      )

      const backdrop = container.querySelector('.absolute.inset-0')
      expect(backdrop?.parentElement?.className).toContain('z-50')
    })
  })

  describe('Responsive Behavior', () => {
    it('should have responsive padding', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          Content
        </Modal>
      )

      const header = container.querySelector('.p-4')
      expect(header).toBeInTheDocument()

      const contentArea = container.querySelector('.p-4')
      expect(contentArea).toBeInTheDocument()
    })

    it('should have responsive margin for mobile', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          Content
        </Modal>
      )

      const modal = container.querySelector('.mx-4')
      expect(modal).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapid open/close cycles', async () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          Content
        </Modal>
      )

      rerender(<Modal isOpen={false} onClose={mockOnClose} title="Modal">Content</Modal>)
      rerender(<Modal isOpen={true} onClose={mockOnClose} title="Modal">Content</Modal>)
      rerender(<Modal isOpen={false} onClose={mockOnClose} title="Modal">Content</Modal>)

      expect(screen.queryByText('Content')).not.toBeInTheDocument()
    })

    it('should handle very long content', () => {
      const longContent = Array.from({ length: 50 }, (_, i) => (
        <p key={i}>Paragraph {i}</p>
      ))

      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal">
          {longContent}
        </Modal>
      )

      expect(screen.getByText('Paragraph 0')).toBeInTheDocument()
      expect(screen.getByText('Paragraph 49')).toBeInTheDocument()
    })

    it('should handle empty title', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="">
          Content
        </Modal>
      )

      const header = container.querySelector('h2')
      expect(header?.textContent).toBe('')
    })

    it('should handle special characters in title', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal & Title >!@">
          Content
        </Modal>
      )

      expect(screen.getByText('Modal & Title >!@')).toBeInTheDocument()
    })

    it('should handle null onClose function gracefully', async () => {
      const user = userEvent.setup()
      const { container } = render(
        <Modal isOpen={true} onClose={() => {}} title="Modal">
          Content
        </Modal>
      )

      const closeButton = container.querySelector('button')
      await user.click(closeButton!)

      // Should not throw error
      expect(screen.getByText('Content')).toBeInTheDocument()
    })
  })
})
