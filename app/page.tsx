'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  type: 'shirt' | 'pants' | 'hat';
  rating: number;
  reviews: number;
}

interface CheckoutForm {
  email: string;
  name: string;
  address: string;
  city: string;
  country: string;
  zip: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

const products: Product[] = [
  {
    id: 'TS-201',
    name: 'TS-201',
    price: 45,
    image: 'https://wallpapers.com/images/high/blank-white-t-shirt-template-liwncdt13x1t5o3b-2.png',
    type: 'shirt',
    rating: 4.5,
    reviews: 12
  },
  {
    id: 'TS-304',
    name: 'TS-304',
    price: 45,
    image: 'https://wallpapers.com/images/high/blank-white-t-shirt-template-liwncdt13x1t5o3b-2.png',
    type: 'shirt',
    rating: 4.8,
    reviews: 8
  },
  {
    id: 'PS-102',
    name: 'PS-102',
    price: 65,
    image: 'https://static.vecteezy.com/system/resources/previews/047/064/685/non_2x/a-mockup-of-white-shorts-for-men-free-png.png',
    type: 'pants',
    rating: 4.2,
    reviews: 15
  },
  {
    id: 'PS-205',
    name: 'PS-205',
    price: 65,
    image: 'https://static.vecteezy.com/system/resources/previews/047/064/685/non_2x/a-mockup-of-white-shorts-for-men-free-png.png',
    type: 'pants',
    rating: 4.6,
    reviews: 10
  },
  {
    id: 'TS-405',
    name: 'TS-405',
    price: 45,
    image: 'https://wallpapers.com/images/high/blank-white-t-shirt-template-liwncdt13x1t5o3b-2.png',
    type: 'shirt',
    rating: 4.3,
    reviews: 7
  },
  {
    id: 'PS-308',
    name: 'PS-308',
    price: 65,
    image: 'https://static.vecteezy.com/system/resources/previews/047/064/685/non_2x/a-mockup-of-white-shorts-for-men-free-png.png',
    type: 'pants',
    rating: 4.7,
    reviews: 14
  },
  {
    id: 'HC-101',
    name: 'HC-101',
    price: 35,
    image: 'https://www.freeiconspng.com/uploads/baseball-white-cap-hat-png-14.png',
    type: 'hat',
    rating: 4.9,
    reviews: 18
  },
  {
    id: 'HC-102',
    name: 'HC-102',
    price: 35,
    image: 'https://www.freeiconspng.com/uploads/baseball-white-cap-hat-png-14.png',
    type: 'hat',
    rating: 4.7,
    reviews: 15
  },
  {
    id: 'HC-103',
    name: 'HC-103',
    price: 35,
    image: 'https://www.freeiconspng.com/uploads/baseball-white-cap-hat-png-14.png',
    type: 'hat',
    rating: 4.8,
    reviews: 20
  }
];

export default function Home() {
  const [cart, setCart] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'shirt' | 'pants' | 'hat'>('all');
  const [sortBy, setSortBy] = useState<'price' | 'rating'>('price');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
    email: '',
    name: '',
    address: '',
    city: '',
    country: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const filteredProducts = products
    .filter(product => filter === 'all' || product.type === filter)
    .sort((a, b) => sortBy === 'price' ? a.price - b.price : b.rating - a.rating);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId: string) => {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
      const newCart = [...cart];
      newCart.splice(index, 1);
      setCart(newCart);
    }
  };

  const toggleWishlist = (productId: string) => {
    const newWishlist = new Set(wishlist);
    if (wishlist.has(productId)) {
      newWishlist.delete(productId);
    } else {
      newWishlist.add(productId);
    }
    setWishlist(newWishlist);
  };

  const viewProduct = (product: Product) => {
    setQuickViewProduct(product);
    if (!recentlyViewed.find(p => p.id === product.id)) {
      setRecentlyViewed(prev => [product, ...prev].slice(0, 4));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checkoutStep === 'details') {
      setCheckoutStep('payment');
    } else if (checkoutStep === 'payment') {
      setIsProcessing(true);
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsProcessing(false);
      setCheckoutStep('confirmation');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCheckoutForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetCheckout = () => {
    setShowCheckout(false);
    setCheckoutStep('details');
    setCart([]);
    setCheckoutForm({
      email: '',
      name: '',
      address: '',
      city: '',
      country: '',
      zip: '',
      cardNumber: '',
      expiry: '',
      cvc: ''
    });
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div className="space-x-4">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-200"
            >
              <option value="all">All Products</option>
              <option value="shirt">Shirts</option>
              <option value="pants">Pants</option>
              <option value="hat">Hats</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-200"
            >
              <option value="price">Sort by Price</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>
        </motion.div>

        <motion.div 
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: inView ? 1 : 0 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.02 }}
                className="space-y-4"
              >
                <div className="aspect-square bg-gray-50 flex items-center justify-center p-4 relative group">
                  <Zoom>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </Zoom>
                  <button
                    onClick={() => viewProduct(product)}
                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
                  >
                    <span className="text-white bg-black px-4 py-2 text-xs">Quick View</span>
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm">{product.name}</p>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="text-xl"
                    >
                      {wishlist.has(product.id) ? '♥' : '♡'}
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-600">${product.price}</p>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs">★</span>
                        <span className="text-xs">{product.rating}</span>
                        <span className="text-xs text-gray-400">({product.reviews})</span>
                      </div>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-4 py-2 bg-black text-white text-xs hover:bg-gray-800 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {recentlyViewed.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-t pt-8"
          >
            <h2 className="text-sm mb-4">Recently Viewed</h2>
            <div className="grid grid-cols-4 gap-4">
              {recentlyViewed.map(product => (
                <div 
                  key={product.id} 
                  className="aspect-square bg-gray-50 p-2 cursor-pointer"
                  onClick={() => viewProduct(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-30"
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-8 max-w-2xl w-full relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-sm"
                aria-label="Close quick view"
              >
                ✕
              </button>
              <div className="grid grid-cols-2 gap-8">
                <Zoom>
                  <img
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    className="w-full aspect-square object-contain"
                  />
                </Zoom>
                <div className="space-y-4">
                  <h2 className="text-xl">{quickViewProduct.name}</h2>
                  <p className="text-lg">${quickViewProduct.price}</p>
                  <div className="flex items-center space-x-2">
                    <span>★</span>
                    <span>{quickViewProduct.rating}</span>
                    <span className="text-gray-400">({quickViewProduct.reviews} reviews)</span>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="w-full px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  if (checkoutStep === 'payment') {
                    setCheckoutStep('details');
                  } else {
                    setShowCheckout(false);
                  }
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>

              {checkoutStep === 'confirmation' ? (
                <div className="text-center space-y-4">
                  <h2 className="text-2xl">Thank you for your order!</h2>
                  <p className="text-gray-600">Order confirmation has been sent to your email.</p>
                  <button
                    onClick={resetCheckout}
                    className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                  <h2 className="text-xl mb-6">
                    {checkoutStep === 'details' ? 'Shipping Details' : 'Payment Information'}
                  </h2>

                  {/* Cart Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="text-sm font-medium mb-3">Order Summary</h3>
                    {cart.map((item, index) => (
                      <div key={`${item.id}-${index}`} className="flex justify-between items-center py-2">
                        <div className="flex items-center space-x-3">
                          <img src={item.image} alt={item.name} className="w-10 h-10 object-contain" />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm">${item.price}</span>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="border-t mt-3 pt-3 flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-medium">${getTotalPrice()}</span>
                    </div>
                  </div>
                  
                  {checkoutStep === 'details' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm mb-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={checkoutForm.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={checkoutForm.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Address</label>
                        <input
                          type="text"
                          name="address"
                          required
                          value={checkoutForm.address}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-1">City</label>
                          <input
                            type="text"
                            name="city"
                            required
                            value={checkoutForm.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border"
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">ZIP Code</label>
                          <input
                            type="text"
                            name="zip"
                            required
                            value={checkoutForm.zip}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {checkoutStep === 'payment' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm mb-1">Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          required
                          value={checkoutForm.cardNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-1">Expiry Date</label>
                          <input
                            type="text"
                            name="expiry"
                            required
                            value={checkoutForm.expiry}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">CVC</label>
                          <input
                            type="text"
                            name="cvc"
                            required
                            value={checkoutForm.cvc}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border"
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                    >
                      {isProcessing ? 'Processing...' : checkoutStep === 'details' ? 'Continue to Payment' : 'Place Order'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}

        {cart.length > 0 && (
          <motion.section
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20"
          >
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-600">Cart ({cart.length} items)</p>
                <p className="text-sm">Total: ${getTotalPrice()}</p>
              </div>
              <button
                onClick={() => setShowCheckout(true)}
                className="px-8 py-3 bg-black text-white text-xs hover:bg-gray-800 transition-colors"
              >
                Checkout
              </button>
            </div>
          </motion.section>
        )}
      </div>
    </main>
  );
}