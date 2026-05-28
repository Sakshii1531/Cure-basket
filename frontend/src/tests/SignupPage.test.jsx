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

  it('renders password and confirm password fields with show password checkbox', () => {
    renderComponent();

    expect(screen.getByLabelText(/Show password/i)).toBeInTheDocument();
  });

  it('toggles password type between password and text', async () => {
    renderComponent();

    const inputs = screen.getAllByPlaceholderText('••••••••');
    const pwdInput = inputs[0];
    const confirmPwdInput = inputs[1];

    expect(pwdInput.type).toBe('password');
    expect(confirmPwdInput.type).toBe('password');

    // Toggle the checkbox
    const checkbox = screen.getByLabelText(/Show password/i);
    fireEvent.click(checkbox);

    expect(pwdInput.type).toBe('text');
    expect(confirmPwdInput.type).toBe('text');

    // Toggle again to hide
    fireEvent.click(checkbox);
    expect(pwdInput.type).toBe('password');
    expect(confirmPwdInput.type).toBe('password');
  });

  it('validates that confirm password matches password', async () => {
    renderComponent();

    // Fill name, email, phone
    fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'test@example.com' } });
    
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
});
