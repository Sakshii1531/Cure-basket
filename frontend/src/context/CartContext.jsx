import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const CartContext = createContext(null);

const STORAGE_KEY = 'cb_cart';

function loadCart() {
  try {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(items)) return [];
    
    const merged = [];
    items.forEach(item => {
      const itemKey = String(item._id || item.id);
      const existing = merged.find(i => i.itemKey === itemKey || i._id === item._id);
      if (existing) {
        existing.qty = (existing.qty || 1) + (item.qty || 1);
        if (item.pkg || (!existing.pkg && item.price > existing.price)) {
          existing.pkg = item.pkg;
          existing.price = item.price;
          existing.mrp = item.mrp;
        }
      } else {
        merged.push({
          ...item,
          itemKey
        });
      }
    });
    return merged;
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
      const itemKey = String(product._id || product.id);
      const existing = prev.find(i => i.itemKey === itemKey);

      if (existing) {
        return prev.map(i => i.itemKey === itemKey ? { 
          ...i, 
          qty: i.qty + qty,
          pkg: pkg || i.pkg,
          price: pkg ? pkg.price : i.price,
          mrp: pkg ? pkg.mrp : i.mrp
        } : i);
      }

      return [...prev, {
        ...product,
        qty,
        pkg,
        itemKey,
        price: pkg ? pkg.price : (product.pricePerUnit ?? product.price),
        mrp:   pkg ? pkg.mrp   : (product.mrp ?? product.pricePerUnit ?? product.price),
      }];
    });
    toast.success('Added to cart!');
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

  // Clear cart when the user logs out (AuthContext dispatches this event)
  useEffect(() => {
    const handler = () => clearCart();
    window.addEventListener('cb:logout', handler);
    return () => window.removeEventListener('cb:logout', handler);
  }, []);

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
