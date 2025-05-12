import { render, screen, fireEvent, within } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Cart from './Cart';
import { CartContext } from '../context/CartContext';
import type { CartItem } from '../context/CartContext';

// Mock the useCart hook functionality by providing mock data through CartContext
const renderWithCartContext = (
  ui: React.ReactNode,
  {
    items = [] as CartItem[],
    removeItem = vi.fn(),
    updateQuantity = vi.fn(),
    getItemCount = vi.fn(),
    getTotalPrice = vi.fn(() => 0),
    clearCart = vi.fn(),
    addItem = vi.fn(),
  } = {}
) => {
  return render(
    <BrowserRouter>
      <CartContext.Provider
        value={{
          items,
          removeItem,
          updateQuantity,
          getItemCount,
          getTotalPrice,
          clearCart,
          addItem,
        }}
      >
        {ui}
      </CartContext.Provider>
    </BrowserRouter>
  );
};

describe('Cart Component', () => {
  test('renders empty cart message when cart is empty', () => {
    renderWithCartContext(<Cart />);
    
    expect(screen.getByRole('heading', { name: /your cart/i })).toBeInTheDocument();
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /browse products/i })).toBeInTheDocument();
  });

  test('renders cart items when cart has items', () => {
    const mockItems: CartItem[] = [
      {
        productId: 1,
        name: 'Test Product',
        price: 19.99,
        quantity: 2,
        imgName: 'test.png',
      },
    ];
    
    const mockGetTotalPrice = vi.fn(() => 39.98);
    const mockGetItemCount = vi.fn(() => 2);

    renderWithCartContext(<Cart />, {
      items: mockItems,
      getTotalPrice: mockGetTotalPrice,
      getItemCount: mockGetItemCount,
    });
    
    const cartItem = screen.getByRole('row', { name: /test product/i });

    // Check if product name is displayed
    expect(within(cartItem).getByText(/test product/i)).toBeInTheDocument();
    
    // Check if price is displayed
    expect(within(cartItem).getByText(/\$19\.99/i)).toBeInTheDocument();
    
    // Check if quantity is displayed
    expect(within(cartItem).getByText(/2/i)).toBeInTheDocument();
    
    // Check if subtotal for the item is displayed
    expect(within(cartItem).getByText(/\$39\.98/i)).toBeInTheDocument();
    
    // Check if order summary is displayed
    expect(screen.getByRole('heading', { name: /order summary/i })).toBeInTheDocument();
    
    // Check if total calculations are displayed - use more specific selectors
    const orderSummary = screen.getByRole('heading', { name: /order summary/i }).closest('div');
    expect(within(orderSummary as HTMLElement).getByText(/subtotal/i)).toBeInTheDocument();
    expect(within(orderSummary as HTMLElement).getByText(/shipping/i)).toBeInTheDocument();
    expect(within(orderSummary as HTMLElement).getByText(/tax/i)).toBeInTheDocument();
    
    // For "Total", find it within the order summary section
    const totalRow = within(orderSummary as HTMLElement).getAllByText(/total/i)[0].closest('div');
    expect(totalRow).toBeInTheDocument();
  });

  test('calls removeItem when remove button is clicked', () => {
    const mockRemoveItem = vi.fn();
    const mockItems: CartItem[] = [
      {
        productId: 1,
        name: 'Test Product',
        price: 19.99,
        quantity: 2,
        imgName: 'test.png',
      },
    ];

    renderWithCartContext(<Cart />, {
      items: mockItems,
      removeItem: mockRemoveItem,
    });
    
    const cartItem = screen.getByRole('row', { name: /test product/i });
    fireEvent.click(within(cartItem).getByRole('button', { name: /remove/i }));
    expect(mockRemoveItem).toHaveBeenCalledWith(1);
  });

  test('calls updateQuantity when quantity buttons are clicked', () => {
    const mockUpdateQuantity = vi.fn();
    const mockItems: CartItem[] = [
      {
        productId: 1,
        name: 'Test Product',
        price: 19.99,
        quantity: 2,
        imgName: 'test.png',
      },
    ];

    renderWithCartContext(<Cart />, {
      items: mockItems,
      updateQuantity: mockUpdateQuantity,
    });
    
    const cartItem = screen.getByRole('row', { name: /test product/i });

    // Increase quantity
    fireEvent.click(within(cartItem).getByRole('button', { name: /\+/i }));
    expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 3);
    
    // Decrease quantity
    fireEvent.click(within(cartItem).getByRole('button', { name: /-/i }));
    expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 1);
  });

  test('calls clearCart when clear cart button is clicked', () => {
    const mockClearCart = vi.fn();
    const mockItems: CartItem[] = [
      {
        productId: 1,
        name: 'Test Product',
        price: 19.99,
        quantity: 2,
        imgName: 'test.png',
      },
    ];

    renderWithCartContext(<Cart />, {
      items: mockItems,
      clearCart: mockClearCart,
    });
    
    fireEvent.click(screen.getByRole('button', { name: /clear cart/i }));
    expect(mockClearCart).toHaveBeenCalled();
  });

  test('displays correct pricing calculation', () => {
    const mockItems: CartItem[] = [
      {
        productId: 1,
        name: 'Test Product',
        price: 100,
        quantity: 1,
        imgName: 'test.png',
      },
    ];
    
    // Subtotal = 100, shipping = 10, tax = 10 (10%), total = 120
    const mockGetTotalPrice = vi.fn(() => 100);

    renderWithCartContext(<Cart />, {
      items: mockItems,
      getTotalPrice: mockGetTotalPrice,
    });

    // Get the order summary section
    const orderSummary = screen.getByRole('heading', { name: /order summary/i }).closest('div');
    
    // Find spans in the order summary that contain price values
    const priceValues = Array.from(orderSummary?.querySelectorAll('div > span:last-child') || []);
    
    // Check for subtotal
    expect(priceValues[0]).toHaveTextContent('$100.00');
    
    // Check for shipping
    expect(priceValues[1]).toHaveTextContent('$10.00');
    
    // Check for tax
    expect(priceValues[2]).toHaveTextContent('$10.00');
    
    // Check for total
    expect(priceValues[3]).toHaveTextContent('$120.00');
  });

  test('navigates to products page when continue shopping is clicked', () => {
    const mockItems: CartItem[] = [
      {
        productId: 1,
        name: 'Test Product',
        price: 19.99,
        quantity: 2,
        imgName: 'test.png',
      },
    ];

    renderWithCartContext(<Cart />, {
      items: mockItems,
    });
    
    const continueShoppingLink = screen.getByRole('link', { name: /continue shopping/i });
    expect(continueShoppingLink).toHaveAttribute('href', '/products');
  });
});