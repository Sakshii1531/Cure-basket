import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ErrorBoundary from '../components/ErrorBoundary';

const ProblemChild = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary Component', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    // Mock window.location properties
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        reload: vi.fn(),
        pathname: '/',
        href: '',
      },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
    vi.restoreAllMocks();
  });

  it('renders standard fallback UI and redirects to homepage for general user errors', () => {
    window.location.pathname = '/checkout';

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Go to Homepage')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Go to Homepage'));
    expect(window.location.href).toBe('/');
  });

  it('renders admin fallback UI and redirects to admin dashboard for admin errors', () => {
    window.location.pathname = '/admin/users/123/edit';

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Go to Dashboard'));
    expect(window.location.href).toBe('/admin');
  });
});
