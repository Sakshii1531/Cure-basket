import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const CartContext = createContext(null);

const STORAGE_KEY = 'cb_cart';

function getItemKey(product, pkg) {
  const baseId = String(product._id || product.id || '');
  
  if (!product.packages || product.packages.length === 0) {
    return baseId;
  }
  
  let activePkg = pkg;
  if (!activePkg) {
    activePkg = product.packages.find(p => p.popular) || product.packages[0];
  }
  
  if (!activePkg) return baseId;
  
  const pkgId = activePkg.id || activePkg._id || activePkg.label || '';
  return `${baseId}_pkg_${pkgId}`;
}

function loadCart() {
  try {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(items)) return [];
    
    const merged = [];
    items.forEach(item => {
      const itemKey = item.itemKey || getItemKey(item, item.pkg);
      const existing = merged.find(i => i.itemKey === itemKey);
      if (existing) {
        existing.qty = (existing.qty || 1) + (item.qty || 1);
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
      const itemKey = getItemKey(product, pkg);
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

  const cartCount = items.length;
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
