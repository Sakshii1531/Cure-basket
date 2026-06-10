import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UserDetails from '../components/../admin/pages/UserDetails';
import api from '../utils/api';

vi.mock('../utils/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('UserDetails Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (userId) => {
    return render(
      <MemoryRouter initialEntries={[`/admin/users/${userId}`]}>
        <Routes>
          <Route path="/admin/users/:id" element={<UserDetails />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('fetches and displays user profile and order list', async () => {
    const mockUser = {
      _id: 'user123',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      role: 'user',
      createdAt: '2026-05-28T00:00:00.000Z',
      addresses: [
        { name: 'Home', street: '123 Main St', city: 'Metropolis', phone: '1234567890' },
      ],
    };

    const mockOrders = [
      {
        _id: 'orderabc123',
        createdAt: '2026-05-28T01:00:00.000Z',
        totalAmount: 1200,
        paymentStatus: 'Paid',
        status: 'Delivered',
      },
    ];

    api.get.mockImplementation((url) => {
      if (url.includes('/users/')) {
        return Promise.resolve({ data: { data: mockUser } });
      }
      if (url.includes('/orders')) {
        return Promise.resolve({ data: { data: mockOrders } });
      }
      return Promise.reject(new Error('Not found'));
    });

    renderComponent('user123');

    // Check loading state ends and user details show
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getAllByText('1234567890')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Home')[0]).toBeInTheDocument();
    expect(screen.getByText('123 Main St, Metropolis')).toBeInTheDocument();

    // Check order history list shows up
    expect(screen.getByText('$1200')).toBeInTheDocument();
    expect(screen.getByText('ERABC123')).toBeInTheDocument(); // order ID slice last 8 chars uppercase
  });
});
