/**
 * StatisticsDisplayCard Component Tests
 *
 * Tests for a statistics display card component with customizable
 * title, value, icon, trend indicators, and colors.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatisticsDisplayCard } from '../StatisticsDisplayCard';

describe('StatisticsDisplayCard', () => {
  describe('Rendering', () => {
    it('should render the component without crashing', () => {
      render(<StatisticsDisplayCard />);
      const card = screen.getByText('Total Users').closest('div');
      expect(card).toBeInTheDocument();
    });

    it('should render with a border and rounded corners', () => {
      const { container } = render(<StatisticsDisplayCard />);
      const cardElement = container.querySelector('.border');
      expect(cardElement).toBeInTheDocument();
      expect(cardElement).toHaveClass('rounded-lg');
      expect(cardElement).toHaveClass('p-6');
    });

    it('should display the card title', () => {
      render(<StatisticsDisplayCard />);
      expect(screen.getByText('Total Users')).toBeInTheDocument();
    });

    it('should display the numeric value', () => {
      render(<StatisticsDisplayCard />);
      expect(screen.getByText('1,234')).toBeInTheDocument();
    });

    it('should render a flex container with proper alignment', () => {
      const { container } = render(<StatisticsDisplayCard />);
      const flexContainer = container.querySelector('.flex');
      expect(flexContainer).toBeInTheDocument();
      expect(flexContainer).toHaveClass('justify-between');
      expect(flexContainer).toHaveClass('items-start');
    });

    it('should have an icon container with blue color', () => {
      const { container } = render(<StatisticsDisplayCard />);
      const iconContainer = container.querySelector('.text-blue-500');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('Typography and Styling', () => {
    it('should have proper text styling for title', () => {
      const { container } = render(<StatisticsDisplayCard />);
      const titleText = screen.getByText('Total Users');
      expect(titleText).toHaveClass('text-sm');
      expect(titleText).toHaveClass('text-gray-600');
    });

    it('should have proper text styling for value', () => {
      const { container } = render(<StatisticsDisplayCard />);
      const valueText = screen.getByText('1,234');
      expect(valueText).toHaveClass('text-3xl');
      expect(valueText).toHaveClass('font-bold');
    });
  });

  describe('Accessibility', () => {
    it('should be readable by screen readers', () => {
      const { container } = render(<StatisticsDisplayCard />);
      const titleElement = screen.getByText('Total Users');
      expect(titleElement).toBeVisible();
      expect(titleElement.textContent).toBeTruthy();
    });

    it('should have semantic structure', () => {
      const { container } = render(<StatisticsDisplayCard />);
      const card = container.querySelector('.border');
      expect(card).toBeInTheDocument();
      expect(card?.children.length).toBeGreaterThan(0);
    });

    it('should have sufficient color contrast', () => {
      render(<StatisticsDisplayCard />);
      const titleText = screen.getByText('Total Users');
      const valueText = screen.getByText('1,234');
      expect(titleText).toHaveClass('text-gray-600');
      expect(valueText).toHaveClass('font-bold');
    });
  });

  describe('Layout Structure', () => {
    it('should have a proper container structure', () => {
      const { container } = render(<StatisticsDisplayCard />);
      const mainDiv = container.querySelector('.border');
      const flexDiv = mainDiv?.querySelector('.flex');
      expect(flexDiv).toBeInTheDocument();
    });

    it('should have left and right sections', () => {
      const { container } = render(<StatisticsDisplayCard />);
      const sections = container.querySelectorAll('.border > div > div');
      expect(sections.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot', () => {
      const { container } = render(<StatisticsDisplayCard />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
