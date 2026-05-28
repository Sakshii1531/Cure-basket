import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UserForm from '../admin/pages/UserForm';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

vi.mock('../utils/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('UserForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      user: { role: 'admin' },
    });
  });

  const renderComponent = (userId = null) => {
    const path = userId ? `/admin/users/${userId}/edit` : '/admin/users/new';
    const routePattern = userId ? '/admin/users/:id/edit' : '/admin/users/new';
    return render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path={routePattern} element={<UserForm />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders Add User form and validates fields', async () => {
    const { container } = renderComponent();

    expect(screen.getByText('Add User')).toBeInTheDocument();
    
    // Attempt submission with empty values
    fireEvent.submit(container.querySelector('form'));

    const nameInput = container.querySelector('input[name="name"]');
    const emailInput = container.querySelector('input[name="email"]');
    const passwordInput = container.querySelector('input[name="password"]');

    fireEvent.change(nameInput, { target: { value: ' ' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });

    fireEvent.submit(container.querySelector('form'));

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });
  });

  it('calls POST /users when creating a new user successfully', async () => {
    api.post.mockResolvedValue({ data: { success: true } });

    const { container } = renderComponent();

    const nameInput = container.querySelector('input[name="name"]');
    const emailInput = container.querySelector('input[name="email"]');
    const phoneInput = container.querySelector('input[name="phone"]');
    const passwordInput = container.querySelector('input[name="password"]');
    const addressTextarea = container.querySelector('textarea[name="address"]');

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '9876543210' } });
    fireEvent.change(passwordInput, { target: { value: 'securepassword123' } });
    fireEvent.change(addressTextarea, { target: { value: '456 Oak Road' } });

    fireEvent.click(screen.getByRole('button', { name: /Save User/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/users', {
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '9876543210',
        password: 'securepassword123',
        role: 'user',
        customRole: null,
        address: '456 Oak Road',
      });
      expect(toast.success).toHaveBeenCalledWith('User created successfully');
      expect(mockNavigate).toHaveBeenCalledWith('/admin/users');
    });
  });

  it('fetches details and calls PUT /users/:id when editing an existing user', async () => {
    const mockUser = {
      _id: 'user123',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '1112223333',
      role: 'user',
      address: '789 Pine Ave',
    };

    api.get.mockResolvedValue({ data: { data: mockUser } });
    api.put.mockResolvedValue({ data: { success: true } });

    const { container } = renderComponent('user123');

    const nameInput = () => container.querySelector('input[name="name"]');
    const emailInput = () => container.querySelector('input[name="email"]');
    const phoneInput = () => container.querySelector('input[name="phone"]');
    const passwordInput = () => container.querySelector('input[name="password"]');

    // Wait for the loading state to end and inputs to be filled
    await waitFor(() => {
      expect(nameInput().value).toBe('John Smith');
    });

    expect(emailInput().value).toBe('john.smith@example.com');
    expect(phoneInput().value).toBe('1112223333');
    expect(passwordInput().value).toBe(''); // empty on edit mode by default

    // Modify a field and submit without typing a new password
    fireEvent.change(nameInput(), { target: { value: 'John Smith Jr.' } });
    fireEvent.click(screen.getByRole('button', { name: /Save User/i }));

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/users/user123', {
        name: 'John Smith Jr.',
        email: 'john.smith@example.com',
        phone: '1112223333',
        role: 'user',
        customRole: null,
        address: '789 Pine Ave',
      });
      expect(toast.success).toHaveBeenCalledWith('User updated successfully');
      expect(mockNavigate).toHaveBeenCalledWith('/admin/users');
    });
  });

  it('allows updating password when editing if a secure password is provided', async () => {
    const mockUser = {
      _id: 'user123',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '1112223333',
      role: 'user',
      address: '789 Pine Ave',
    };

    api.get.mockResolvedValue({ data: { data: mockUser } });
    api.put.mockResolvedValue({ data: { success: true } });

    const { container } = renderComponent('user123');

    const nameInput = () => container.querySelector('input[name="name"]');
    const passwordInput = () => container.querySelector('input[name="password"]');

    await waitFor(() => {
      expect(nameInput().value).toBe('John Smith');
    });

    // Provide a valid new password
    fireEvent.change(passwordInput(), { target: { value: 'newpassword123' } });
    fireEvent.click(screen.getByRole('button', { name: /Save User/i }));

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/users/user123', {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '1112223333',
        role: 'user',
        password: 'newpassword123',
        customRole: null,
        address: '789 Pine Ave',
      });
    });
  });

  it('loads and displays custom roles if current logged-in user is a superadmin', async () => {
    useAuth.mockReturnValue({
      user: { role: 'superadmin' },
    });

    const mockRoles = [
      { _id: 'role1', name: 'Manager' },
      { _id: 'role2', name: 'Support' },
    ];

    api.get.mockImplementation((url) => {
      if (url === '/roles') {
        return Promise.resolve({ data: { data: mockRoles } });
      }
      return Promise.resolve({ data: { data: {} } });
    });

    const { container } = renderComponent();

    const roleSelect = () => container.querySelector('select[name="role"]');

    // Select role "Admin" to trigger custom role dropdown visibility
    fireEvent.change(roleSelect(), { target: { value: 'admin' } });

    await waitFor(() => {
      expect(container.querySelector('select[name="customRole"]')).toBeInTheDocument();
    });

    expect(screen.getByText('Manager')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
  });
});
