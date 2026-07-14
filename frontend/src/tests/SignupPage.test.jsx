import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import SignupPage from '../components/SignupPage';
import { AuthProvider } from '../context/AuthContext';

// Mock AuthContext register function
vi.mock('../context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAuth: () => ({
      register: vi.fn(),
    }),
  };
});

describe('SignupPage Password & Confirm Password Fields', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
    );
  };

  it('renders password and confirm password fields with eye toggle buttons', () => {
    renderComponent();

    expect(screen.getByLabelText('Toggle password visibility')).toBeInTheDocument();
    expect(screen.getByLabelText('Toggle confirm password visibility')).toBeInTheDocument();
  });

  it('toggles password type between password and text using eye toggle buttons', async () => {
    renderComponent();

    const inputs = screen.getAllByPlaceholderText('••••••••');
    const pwdInput = inputs[0];
    const confirmPwdInput = inputs[1];

    expect(pwdInput.type).toBe('password');
    expect(confirmPwdInput.type).toBe('password');

    // Toggle password eye button
    const pwdToggle = screen.getByLabelText('Toggle password visibility');
    fireEvent.click(pwdToggle);
    expect(pwdInput.type).toBe('text');
    expect(confirmPwdInput.type).toBe('password');

    // Toggle confirm password eye button
    const confirmPwdToggle = screen.getByLabelText('Toggle confirm password visibility');
    fireEvent.click(confirmPwdToggle);
    expect(pwdInput.type).toBe('text');
    expect(confirmPwdInput.type).toBe('text');

    // Toggle password again to hide
    fireEvent.click(pwdToggle);
    expect(pwdInput.type).toBe('password');
    expect(confirmPwdInput.type).toBe('text');
  });

  it('validates that confirm password matches password', async () => {
    renderComponent();

    // Fill name, email, phone
    fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('800 000 0000'), { target: { value: '1234567890' } });
    
    const inputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(inputs[0], { target: { value: 'password123' } });
    fireEvent.change(inputs[1], { target: { value: 'different123' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    // Verify error message
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  it('requires confirm password to be filled', async () => {
    renderComponent();

    // Fill password but leave confirm password empty
    const inputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(inputs[0], { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(screen.getByText('Confirm password is required')).toBeInTheDocument();
    });
  });

  it('requires phone number to be filled and validates phone format', async () => {
    renderComponent();

    // Submit without phone
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(screen.getByText('Phone number is required')).toBeInTheDocument();
    });

    // Enter invalid phone number
    fireEvent.change(screen.getByPlaceholderText('800 000 0000'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(screen.getByText('Enter a valid phone number')).toBeInTheDocument();
    });
  });
});
