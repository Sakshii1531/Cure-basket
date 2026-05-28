import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import api from '../utils/api';

// Mock the api module
vi.mock('../utils/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// Mock useAuth states by modifying window/localStorage or AuthProvider mock setup
// Let's mock localStorage so authLoading resolves immediately and isLoggedIn defaults to false
beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  api.get.mockRejectedValue(new Error('Unauthorized'));
});

// Since LoginModal depends on isLoginModalOpen inside AuthContext, let's mock it
vi.mock('../context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAuth: () => ({
      isLoginModalOpen: true,
      setIsLoginModalOpen: vi.fn(),
      login: vi.fn(),
      register: vi.fn(),
      pendingIntent: null,
      clearIntent: vi.fn(),
    }),
  };
});

describe('LoginModal Confirm Password and Toggles', () => {
  const renderComponent = () => {
    return render(
      <AuthProvider>
        <LoginModal />
      </AuthProvider>
    );
  };

  it('renders login tab by default with password checkbox', () => {
    renderComponent();

    expect(screen.getByLabelText(/Show password/i)).toBeInTheDocument();
    expect(screen.queryByText(/Confirm Password/i)).not.toBeInTheDocument();
  });

  it('renders signup tab with password & confirm password and the checkbox', () => {
    renderComponent();

    // Click Sign Up tab
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    expect(screen.getByLabelText(/Show password/i)).toBeInTheDocument();
    expect(screen.getByText(/Confirm Password/i)).toBeInTheDocument();
  });

  it('toggles password types between text and password in signup tab', () => {
    renderComponent();

    // Switch to Sign Up tab
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    const inputs = screen.getAllByPlaceholderText('••••••••');
    const pwdInput = inputs[0];
    const confirmPwdInput = inputs[1];

    expect(pwdInput.type).toBe('password');
    expect(confirmPwdInput.type).toBe('password');

    const checkbox = screen.getByLabelText(/Show password/i);
    
    // Toggle checkbox to check
    fireEvent.click(checkbox);
    expect(pwdInput.type).toBe('text');
    expect(confirmPwdInput.type).toBe('text');

    // Toggle checkbox to uncheck
    fireEvent.click(checkbox);
    expect(pwdInput.type).toBe('password');
    expect(confirmPwdInput.type).toBe('password');
  });

  it('validates matching passwords on signup', async () => {
    renderComponent();

    // Switch to Sign Up
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    // Fill form fields
    fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'jane@example.com' } });

    const inputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(inputs[0], { target: { value: 'password123' } });
    fireEvent.change(inputs[1], { target: { value: 'passwordDifferent' } });

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });
});
