import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, waitFor, act } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Mock the api module
vi.mock('../utils/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

import api from '../utils/api';

function TestHarness({ onRender }) {
  const auth = useAuth();
  onRender(auth);
  return null;
}

function renderAuth(onRender) {
  return render(
    <AuthProvider>
      <TestHarness onRender={onRender} />
    </AuthProvider>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  // Default: /auth/me returns 401 (not logged in)
  api.get.mockRejectedValue(new Error('Unauthorized'));
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('AuthContext — initial state', () => {
  it('starts with authLoading=true, then false after me check', async () => {
    let auth;
    renderAuth(a => { auth = a; });
    expect(auth.authLoading).toBe(true);
    await waitFor(() => expect(auth.authLoading).toBe(false));
    expect(auth.isLoggedIn).toBe(false);
    expect(auth.user).toBeNull();
  });

  it('sets user when /auth/me succeeds', async () => {
    api.get.mockResolvedValue({ data: { user: { id: '1', name: 'Alice', email: 'alice@test.com' } } });
    let auth;
    renderAuth(a => { auth = a; });
    await waitFor(() => expect(auth.isLoggedIn).toBe(true));
    expect(auth.user.name).toBe('Alice');
  });
});

describe('AuthContext — login', () => {
  it('sets user and isLoggedIn on successful login', async () => {
    const mockUser = { id: '1', name: 'Bob', email: 'bob@test.com' };
    api.post.mockResolvedValue({ data: { user: mockUser } });

    let auth;
    renderAuth(a => { auth = a; });
    await waitFor(() => expect(auth.authLoading).toBe(false));

    await act(async () => {
      await auth.login('bob@test.com', 'password');
    });

    expect(auth.isLoggedIn).toBe(true);
    expect(auth.user).toEqual(mockUser);
  });

  it('throws when login API fails', async () => {
    api.post.mockRejectedValue(new Error('Invalid credentials'));

    let auth;
    renderAuth(a => { auth = a; });
    await waitFor(() => expect(auth.authLoading).toBe(false));

    await expect(
      act(async () => { await auth.login('bad@test.com', 'wrong'); })
    ).rejects.toThrow();
  });
});

describe('AuthContext — logout', () => {
  it('clears user state after logout', async () => {
    api.get.mockResolvedValue({ data: { user: { id: '1', name: 'Carol' } } });
    api.post.mockResolvedValue({});

    let auth;
    renderAuth(a => { auth = a; });
    await waitFor(() => expect(auth.isLoggedIn).toBe(true));

    await act(async () => { await auth.logout(); });

    expect(auth.isLoggedIn).toBe(false);
    expect(auth.user).toBeNull();
  });
});

describe('AuthContext — pendingIntent', () => {
  it('executes pending intent fn after login', async () => {
    const mockUser = { id: '2', name: 'Dave' };
    api.post.mockResolvedValue({ data: { user: mockUser } });

    const intentFn = vi.fn();
    let auth;
    renderAuth(a => { auth = a; });
    await waitFor(() => expect(auth.authLoading).toBe(false));

    // Set a pending intent
    act(() => { auth.requireAuth({ fn: intentFn, args: ['arg1'] }); });

    // Login — should trigger the pending intent
    await act(async () => { await auth.login('dave@test.com', 'password'); });

    await waitFor(() => expect(intentFn).toHaveBeenCalledWith('arg1'));
  });

  it('requireAuth returns true when already logged in', async () => {
    api.get.mockResolvedValue({ data: { user: { id: '1', name: 'Eve' } } });

    let auth;
    renderAuth(a => { auth = a; });
    await waitFor(() => expect(auth.isLoggedIn).toBe(true));

    const result = auth.requireAuth({ fn: vi.fn() });
    expect(result).toBe(true);
  });
});

describe('AuthContext — useAuth guard', () => {
  it('throws when used outside AuthProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(
      <TestHarness onRender={() => {}} />
    )).toThrow('useAuth must be used inside AuthProvider');
    consoleSpy.mockRestore();
  });
});
