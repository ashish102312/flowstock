import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('wareflow_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('wareflow_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, warehouseId) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.productId === product.id && item.warehouseId === warehouseId);
      if (existing) {
        return prev.map(item =>
          item.productId === product.id && item.warehouseId === warehouseId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        productId: product.id,
        warehouseId,
        name: product.name,
        price: product.basePrice,
        quantity: 1
      }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, warehouseId) => {
    setCartItems(prev => prev.filter(item => !(item.productId === productId && item.warehouseId === warehouseId)));
  };

  const updateQuantity = (productId, warehouseId, quantity) => {
    if (quantity < 1) return;
    setCartItems(prev => prev.map(item =>
      item.productId === productId && item.warehouseId === warehouseId
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => setCartItems([]);

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalAmount,
      isCartOpen, setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
