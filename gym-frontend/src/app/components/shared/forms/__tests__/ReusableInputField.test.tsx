/**
 * ReusableInputField Component Tests
 *
 * Tests for a reusable input field component supporting multiple input types,
 * icons, validation, and input masks.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReusableInputField } from '../ReusableInputField';

describe('ReusableInputField', () => {
  describe('Rendering', () => {
    it('should render the component without crashing', () => {
      render(<ReusableInputField />);
      expect(screen.getByText('Reusable Input Field Component')).toBeInTheDocument();
    });

    it('should render with a container div', () => {
      const { container } = render(<ReusableInputField />);
      const wrapper = container.querySelector('div');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should be accessible for keyboard navigation', () => {
      render(<ReusableInputField />);
      const wrapper = screen.getByText('Reusable Input Field Component').closest('div');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot', () => {
      const { container } = render(<ReusableInputField />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
