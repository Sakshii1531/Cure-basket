import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';
import LoginModal from '../components/LoginModal';
import api from '../utils/api';

vi.mock('../utils/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

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

describe('LoginModal Forgot Password OTP Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    api.get.mockRejectedValue(new Error('Unauthorized'));
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <AuthProvider>
          <LoginModal />
        </AuthProvider>
      </MemoryRouter>
    );
  };

  it('navigates through all phases of forgot password OTP reset and returns to login', async () => {
    api.post.mockResolvedValue({ data: { success: true } });

    const { container } = renderComponent();

    // 1. Initial State: Check that "Forgot Password?" button exists in Login Modal
    const forgotLink = screen.getByText('Forgot Password?');
    expect(forgotLink).toBeInTheDocument();

    // 2. Click "Forgot Password?" -> Switches to Phase 1 (Enter Email)
    fireEvent.click(forgotLink);
    expect(screen.getByText('Reset Password')).toBeInTheDocument();
    expect(screen.getByText('Email Address')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send OTP/i })).toBeInTheDocument();

    // Validation Check: Click Send OTP with empty email
    const emailInput = container.querySelector('input[name="email"]');
    fireEvent.change(emailInput, { target: { value: ' ' } });
    fireEvent.submit(container.querySelector('form'));
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    // Fill valid email and click Send OTP
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.submit(container.querySelector('form'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/forgot-password-otp', { email: 'test@example.com' });
    });

    // 3. Phase 2 (Enter OTP): Check OTP input displays
    await waitFor(() => {
      expect(screen.getByText('Enter OTP')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Verify OTP/i })).toBeInTheDocument();
    });

    // Validation Check: Click Verify OTP with invalid OTP length
    const otpInput = container.querySelector('input[name="otp"]');
    fireEvent.change(otpInput, { target: { value: '123' } });
    fireEvent.submit(container.querySelector('form'));
    await waitFor(() => {
      expect(screen.getByText('Enter a 6-digit OTP')).toBeInTheDocument();
    });

    // Enter valid 6-digit OTP and click Verify OTP
    fireEvent.change(otpInput, { target: { value: '123456' } });
    fireEvent.submit(container.querySelector('form'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/verify-otp', { email: 'test@example.com', otp: '123456' });
    });

    // 4. Phase 3 (Set New Password): Check password fields display
    await waitFor(() => {
      expect(screen.getByText('New Password')).toBeInTheDocument();
      expect(screen.getByText('Confirm Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reset Password/i })).toBeInTheDocument();
    });

    // Validation Check: Passwords do not match
    const passwordInputs = container.querySelectorAll('input[type="password"]');
    const newPwdInput = passwordInputs[0];
    const confirmPwdInput = passwordInputs[1];
    fireEvent.change(newPwdInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPwdInput, { target: { value: 'different123' } });
    fireEvent.submit(container.querySelector('form'));

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });

    // Enter matching passwords and submit
    fireEvent.change(confirmPwdInput, { target: { value: 'password123' } });
    fireEvent.submit(container.querySelector('form'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/reset-password-otp', {
        email: 'test@example.com',
        otp: '123456',
        password: 'password123',
      });
    });

    // 5. Phase 4 (Success Modal): Check success message and Go to Login button
    await waitFor(() => {
      expect(screen.getByText('Your password is successfully changed.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Go to Login/i })).toBeInTheDocument();
    });

    // Click "Go to Login" -> Switches back to Login screen
    fireEvent.click(screen.getByRole('button', { name: /Go to Login/i }));
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login to CureBasket/i })).toBeInTheDocument();
  });
});
