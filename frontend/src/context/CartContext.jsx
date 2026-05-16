import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'cb_cart';

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product, qty = 1, pkg = null) => {
    setItems(prev => {
      const itemKey = pkg ? `${product._id}_${pkg.id}` : String(product._id);
      const existing = prev.find(i => i.itemKey === itemKey);

      if (existing) {
        return prev.map(i => i.itemKey === itemKey ? { ...i, qty: i.qty + qty } : i);
      }

      return [...prev, {
        ...product,
        qty,
        pkg,
        itemKey,
        price: pkg ? pkg.price : product.price,
        mrp: pkg ? pkg.mrp : product.mrp,
      }];
    });
  };

  const removeFromCart = (itemKey) => {
    setItems(prev => prev.filter(i => i.itemKey !== itemKey));
  };

  const updateQty = (itemKey, qty) => {
    if (qty <= 0) {
      removeFromCart(itemKey);
      return;
    }
    setItems(prev => prev.map(i => i.itemKey === itemKey ? { ...i, qty } : i));
  };

  const clearCart = () => setItems([]);

  const cartCount = items.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = items.reduce((sum, i) => sum + (i.price || 0) * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
