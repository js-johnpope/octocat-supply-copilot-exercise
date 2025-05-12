import { createContext, useState, ReactNode, useEffect } from 'react';

// Define the cart item structure
export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imgName: string;
}

// Define the cart context interface
interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
}

// Create the context
export const CartContext = createContext<CartContextType | null>(null);

// Create the provider component
export function CartProvider({ children }: { children: ReactNode }) {
  // Initialize cart with items from localStorage or empty array
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Add an item to the cart
  const addItem = (newItem: CartItem) => {
    setItems(currentItems => {
      const existingItemIndex = currentItems.findIndex(item => item.productId === newItem.productId);
      
      if (existingItemIndex > -1) {
        // If item exists, update quantity
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return updatedItems;
      } else {
        // If item doesn't exist, add it
        return [...currentItems, newItem];
      }
    });
  };

  // Remove an item from the cart
  const removeItem = (productId: number) => {
    setItems(currentItems => currentItems.filter(item => item.productId !== productId));
  };

  // Update quantity of an item
  const updateQuantity = (productId: number, quantity: number) => {
    setItems(currentItems => 
      currentItems.map(item => 
        item.productId === productId ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0) // Remove items with quantity <= 0
    );
  };

  // Clear the entire cart
  const clearCart = () => {
    setItems([]);
  };

  // Get the total number of items
  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  // Get the total price of all items
  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Provide the cart context to children
  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getItemCount,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}