import { useCart } from '../hooks/useCart';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { items, removeItem, updateQuantity, getItemCount, getTotalPrice, clearCart } = useCart();
  
  // Calculate subtotal, tax, and shipping
  const subtotal = getTotalPrice();
  const shipping = subtotal > 0 ? 10 : 0; // $10 shipping fee if cart has items
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-dark pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <h1 className="text-3xl font-bold text-light mb-6">Your Cart</h1>
            <p className="text-gray-300 mb-6">Your cart is empty</p>
            <Link 
              to="/products" 
              className="inline-block bg-primary hover:bg-accent text-white px-6 py-3 rounded-md transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-4 md:p-8">
          <h1 className="text-3xl font-bold text-light mb-6">Your Cart</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-900 rounded-lg">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-light uppercase tracking-wider">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-light uppercase tracking-wider">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-light uppercase tracking-wider">Quantity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-light uppercase tracking-wider">Total</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-light uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {items.map((item) => (
                      <tr key={item.productId} className="hover:bg-gray-800">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              src={`/${item.imgName}`} 
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-light">{item.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-light">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center bg-gray-700 text-light hover:bg-gray-600 rounded"
                            >
                              -
                            </button>
                            <span className="text-light">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center bg-gray-700 text-light hover:bg-gray-600 rounded"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-light">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-light">
                          <button 
                            onClick={() => removeItem(item.productId)}
                            className="text-red-500 hover:text-red-400"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex justify-between">
                <div>
                  <button
                    onClick={clearCart}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Clear Cart
                  </button>
                </div>
                <Link
                  to="/products"
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="bg-gray-900 p-6 rounded-lg h-fit">
              <h2 className="text-xl font-bold text-light mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-light">
                  <span>Subtotal ({getItemCount()} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-light">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-light">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-light pt-4 border-t border-gray-700 font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Discount code input */}
                <div>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Discount code"
                      className="w-full px-3 py-2 bg-gray-700 text-light rounded-l focus:outline-none"
                    />
                    <button
                      className="px-4 py-2 bg-gray-600 text-light rounded-r hover:bg-gray-500"
                    >
                      Apply
                    </button>
                  </div>
                </div>
                
                {/* Checkout button */}
                <button
                  className="w-full py-3 bg-primary hover:bg-accent text-white rounded transition-colors"
                >
                  Proceed To Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;