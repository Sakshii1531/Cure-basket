import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { CartProvider, useCart } from '../context/CartContext';

// Stub localStorage
beforeEach(() => {
  localStorage.clear();
});

const PRODUCT_A = { _id: 'p1', name: 'Product A', price: 100, mrp: 120 };
const PRODUCT_B = { _id: 'p2', name: 'Product B', price: 200, mrp: 250 };
const PKG_1 = { id: 'strip10', price: 80, mrp: 100 };
const PKG_2 = { id: 'strip30', price: 220, mrp: 280 };

function TestHarness({ onRender }) {
  const cart = useCart();
  onRender(cart);
  return null;
}

function renderCart(onRender) {
  return render(
    <CartProvider>
      <TestHarness onRender={onRender} />
    </CartProvider>
  );
}

describe('CartContext — addToCart', () => {
  it('adds a new item', () => {
    let cart;
    renderCart(c => { cart = c; });
    act(() => cart.addToCart(PRODUCT_A, 2));
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].qty).toBe(2);
  });

  it('increments qty for same product (no pkg)', () => {
    let cart;
    renderCart(c => { cart = c; });
    act(() => cart.addToCart(PRODUCT_A, 1));
    act(() => cart.addToCart(PRODUCT_A, 3));
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].qty).toBe(4);
  });

  it('uses package price and mrp when pkg is provided', () => {
    let cart;
    renderCart(c => { cart = c; });
    act(() => cart.addToCart(PRODUCT_A, 1, PKG_1));
    expect(cart.items[0].price).toBe(80);
    expect(cart.items[0].mrp).toBe(100);
  });

  it('creates separate entries for same product with different packages', () => {
    let cart;
    renderCart(c => { cart = c; });
    act(() => cart.addToCart(PRODUCT_A, 1, PKG_1));
    act(() => cart.addToCart(PRODUCT_A, 1, PKG_2));
    expect(cart.items).toHaveLength(2);
  });

  it('creates separate entry for same product without pkg vs with pkg', () => {
    let cart;
    renderCart(c => { cart = c; });
    act(() => cart.addToCart(PRODUCT_A, 1));
    act(() => cart.addToCart(PRODUCT_A, 1, PKG_1));
    expect(cart.items).toHaveLength(2);
  });

  it('uses product price/mrp when no pkg', () => {
    let cart;
    renderCart(c => { cart = c; });
    act(() => cart.addToCart(PRODUCT_A));
    expect(cart.items[0].price).toBe(100);
    expect(cart.items[0].mrp).toBe(120);
  });
});

describe('CartContext — removeFromCart', () => {
  it('removes item by itemKey', () => {
    let cart;
    renderCart(c => { cart = c; });
    act(() => cart.addToCart(PRODUCT_A));
    const key = cart.items[0].itemKey;
    act(() => cart.removeFromCart(key));
    expect(cart.items).toHaveLength(0);
  });

  it('does not remove other items', () => {
    let cart;
    renderCart(c => { cart = c; });
    act(() => cart.addToCart(PRODUCT_A));
    act(() => cart.addToCart(PRODUCT_B));
    const keyA = cart.items.find(i => i._id === 'p1').itemKey;
    act(() => cart.removeFromCart(keyA));
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0]._id).toBe('p2');
  });
});

describe('CartContext — updateQty', () => {
  it('updates quantity', () => {
    let cart;
    renderCart(c => { cart = c; });
    act(() => cart.addToCart(PRODUCT_A, 2));
    const key = cart.items[0].itemKey;
    act(() => cart.updateQty(key, 5));
    expect(cart.items[0].qty).toBe(5);
  });

  it('removes item when qty set to 0', () => {
    let cart;
    renderCart(c => { cart = c; });
    act(() => cart.addToCart(PRODUCT_A, 2));
    const key = cart.items[0].itemKey;
    act(() => cart.updateQty(key, 0));
    expect(cart.items).toHaveLength(0);
  });

  it('removes item when qty set to negative', () => {
    let cart;
    renderCart(c => { cart = c; });
    act(() => cart.addToCart(PRODUCT_A));
    const key = cart.items[0].itemKey;
    act(() => cart.updateQty(key, -1));
    expect(cart.items).toHaveLength(0);
  });
});

describe('CartContext — computed values', () => {
  it('cartCount sums all quantities', () => {
    let cart;
    renderCart(c => { cart = c; });
    act(() => cart.addToCart(PRODUCT_A, 3));
    act(() => cart.addToCart(PRODUCT_B, 2));
    expect(cart.cartCount).toBe(5);
  });

  it('cartTotal sums price * qty for all items', () => {
    let cart;
    renderCart(c => { cart = c; });
    act(() => cart.addToCart(PRODUCT_A, 2)); // 100 * 2 = 200
    act(() => cart.addToCart(PRODUCT_B, 1)); // 200 * 1 = 200
    expect(cart.cartTotal).toBe(400);
  });

  it('clearCart empties the cart', () => {
    let cart;
    renderCart(c => { cart = c; });
    act(() => cart.addToCart(PRODUCT_A, 2));
    act(() => cart.addToCart(PRODUCT_B, 1));
    act(() => cart.clearCart());
    expect(cart.items).toHaveLength(0);
    expect(cart.cartCount).toBe(0);
  });
});

describe('CartContext — persistence', () => {
  it('persists cart to localStorage', () => {
    let cart;
    renderCart(c => { cart = c; });
    act(() => cart.addToCart(PRODUCT_A, 2));
    const stored = JSON.parse(localStorage.getItem('cb_cart'));
    expect(stored).toHaveLength(1);
    expect(stored[0].qty).toBe(2);
  });

  it('loads cart from localStorage on mount', () => {
    localStorage.setItem('cb_cart', JSON.stringify([
      { ...PRODUCT_A, qty: 3, itemKey: 'p1', pkg: null, price: 100, mrp: 120 }
    ]));
    let cart;
    renderCart(c => { cart = c; });
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].qty).toBe(3);
  });
});
