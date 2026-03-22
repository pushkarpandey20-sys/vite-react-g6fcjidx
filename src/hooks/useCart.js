import { useState, useMemo, useEffect } from 'react';

export function useCart() {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('devsetu_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('devsetu_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        return { ...i, qty: Math.max(1, i.qty + delta) };
      }
      return i;
    }));
  };

  const clearCart = () => setCart([]);

  const subtotal = useMemo(() => cart.reduce((acc, i) => acc + (i.price * i.qty), 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((acc, i) => acc + i.qty, 0), [cart]);

  return { cart, addToCart, removeFromCart, updateQty, clearCart, subtotal, cartCount };
}
