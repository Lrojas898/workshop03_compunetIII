/**
 * EmptyStateDisplay Component Tests
 *
 * Tests for an empty state display component with customizable icon,
 * message, and call-to-action button.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyStateDisplay } from '../EmptyStateDisplay';

describe('EmptyStateDisplay', () => {
  describe('Rendering', () => {
    it('should render the component without crashing', () => {
      render(<EmptyStateDisplay />);
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('should render with a container div', () => {
      const { container } = render(<EmptyStateDisplay />);
      const wrapper = container.querySelector('.text-center');
      expect(wrapper).toBeInTheDocument();
    });

    it('should display the empty state message', () => {
      render(<EmptyStateDisplay />);
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have text-center class for center alignment', () => {
      const { container } = render(<EmptyStateDisplay />);
      const wrapper = container.querySelector('.text-center');
      expect(wrapper).toHaveClass('text-center');
    });

    it('should have proper padding for vertical spacing', () => {
      const { container } = render(<EmptyStateDisplay />);
      const wrapper = container.querySelector('.py-12');
      expect(wrapper).toHaveClass('py-12');
    });

    it('should have gray text color for the message', () => {
      const { container } = render(<EmptyStateDisplay />);
      const messageText = screen.getByText('No data available');
      expect(messageText).toHaveClass('text-gray-500');
    });
  });

  describe('Accessibility', () => {
    it('should be accessible to screen readers', () => {
      render(<EmptyStateDisplay />);
      const message = screen.getByText('No data available');
      expect(message).toBeVisible();
      expect(message.textContent).toBeTruthy();
    });

    it('should have semantic text structure', () => {
      const { container } = render(<EmptyStateDisplay />);
      const messageElement = screen.getByText('No data available');
      expect(messageElement).toBeInTheDocument();
      expect(messageElement.tagName).toBe('P');
    });

    it('should be readable with sufficient color contrast', () => {
      render(<EmptyStateDisplay />);
      const message = screen.getByText('No data available');
      expect(message).toHaveClass('text-gray-500');
    });
  });

  describe('Conditional Rendering', () => {
    it('should render the empty state container', () => {
      const { container } = render(<EmptyStateDisplay />);
      const emptyStateDiv = container.querySelector('.text-center');
      expect(emptyStateDiv).toBeInTheDocument();
      expect(emptyStateDiv?.children.length).toBeGreaterThan(0);
    });

    it('should always display the message', () => {
      render(<EmptyStateDisplay />);
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('should have centered layout with padding', () => {
      const { container } = render(<EmptyStateDisplay />);
      const wrapper = container.querySelector('div');
      expect(wrapper).toHaveClass('text-center');
      expect(wrapper).toHaveClass('py-12');
    });

    it('should contain a paragraph element for the message', () => {
      const { container } = render(<EmptyStateDisplay />);
      const paragraph = container.querySelector('p');
      expect(paragraph).toBeInTheDocument();
      expect(paragraph?.textContent).toBe('No data available');
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot', () => {
      const { container } = render(<EmptyStateDisplay />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
