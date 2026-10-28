/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductDetailPage } from './components/ProductDetailPage';
import { TestimonialsSection } from './components/TestimonialsSection';
import { RecommendationSection } from './components/RecommendationSection';
import { FeaturesGuaranteeSection } from './components/FeaturesGuaranteeSection';
import { FAQSection } from './components/FAQSection';
import { HelpContactSection } from './components/HelpContactSection';
import { CartDrawer } from './components/CartDrawer';
import { PaymentModal } from './components/PaymentModal';
import { AuthModal } from './components/AuthModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { WarrantyModal } from './components/WarrantyModal';
import { WebConsultModal } from './components/WebConsultModal';
import { LiveSalesToast } from './components/LiveSalesToast';
import { FloatingActions } from './components/FloatingActions';
import { NotFoundPage } from './components/NotFoundPage';
import { AdminControlPanelModal } from './components/AdminControlPanelModal';
import { ReferralModal } from './components/ReferralModal';
import { setAppliedReferralCode, getAppliedReferralCode } from './utils/referral';
import { Gift } from 'lucide-react';

import { PRODUCTS_DATA, STORE_INFO } from './data/products';
import { Product, ProductVariant, CartItem, Order, UserProfile, ProductCategory } from './types';
import {
  getStoredUser,
  setStoredUser,
  getStoredCart,
  setStoredCart,
  getStoredOrders,
  saveOrderToStorage,
  getProductOverrides,
  saveProductOverride,
  resetAllProductOverrides,
} from './utils/storage';
import { generateRandomInvoice } from './utils/formatters';

function getMergedProducts(): Product[] {
  const overrides = getProductOverrides();
  return PRODUCTS_DATA.map((p) => {
    if (overrides[p.id]) {
      const ov = overrides[p.id];
      return {
        ...p,
        stockCount: ov.stockCount,
        isSoldOut: ov.isSoldOut,
        price: ov.price !== undefined ? ov.price : p.price,
        originalPrice: ov.originalPrice !== undefined ? ov.originalPrice : p.originalPrice,
      };
    }
    return p;
  });
}

export default function App() {
  // Theme state: dark / light
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('yuraa_theme');
    return saved !== null ? saved === 'dark' : true;
  });

  // Dynamic products state with Admin restock & soldout persistence
  const [products, setProducts] = useState<Product[]>(() => getMergedProducts());

  // Routing and active view state: 'home' | 'product_detail' | '404'
  const [currentView, setCurrentView] = useState<'home' | 'product_detail' | '404'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // User and cart state
  const [user, setUser] = useState<UserProfile | null>(getStoredUser());
  const [cart, setCart] = useState<CartItem[]>(getStoredCart());
  const [orders, setOrders] = useState<Order[]>(getStoredOrders());

  // Filter & Search states
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isReferralOpen, setIsReferralOpen] = useState(false);
  const [appliedVoucherCode, setAppliedVoucherCode] = useState<string>('');
  const [referralToast, setReferralToast] = useState<string | null>(null);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isWarrantyOpen, setIsWarrantyOpen] = useState(false);
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const [activePaymentOrder, setActivePaymentOrder] = useState<Order | null>(null);

  // Check URL parameter for ?ref=... invitation
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const ref = searchParams.get('ref');
      if (ref && ref.trim()) {
        const cleanRef = ref.trim().toUpperCase();
        setAppliedReferralCode(cleanRef);
        setAppliedVoucherCode(cleanRef);
        setReferralToast(`🎉 Selamat datang! Anda menggunakan link referral ${cleanRef}. Diskon 10% otomatis dipasang di keranjang belanja!`);
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, []);

  // Initialize theme classes
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('yuraa_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('yuraa_theme', 'light');
    }
  }, [darkMode]);

  // Sync route from URL hash for deep linking on mobile & direct sharing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#product/')) {
        const prodId = hash.replace('#product/', '');
        const found = products.find((p) => p.id === prodId);
        if (found) {
          setSelectedProduct(found);
          setCurrentView('product_detail');
        } else {
          setCurrentView('404');
        }
      } else if (hash === '#404') {
        setCurrentView('404');
      } else {
        setCurrentView('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [products]);

  // Save cart changes
  useEffect(() => {
    setStoredCart(cart);
  }, [cart]);

  // Save user changes
  const handleUpdateUser = (newUser: UserProfile | null) => {
    setUser(newUser);
    setStoredUser(newUser);
  };

  // Stock update handler from Admin Control Panel
  const handleUpdateProductStock = (
    productId: string,
    newStock: number,
    isSoldOut: boolean,
    newPrice?: number
  ) => {
    saveProductOverride(productId, {
      stockCount: newStock,
      isSoldOut,
      price: newPrice,
    });
    const updated = getMergedProducts();
    setProducts(updated);
    setSelectedProduct((prev) => {
      if (prev && prev.id === productId) {
        return updated.find((p) => p.id === productId) || prev;
      }
      return prev;
    });
  };

  const handleResetAllOverrides = () => {
    resetAllProductOverrides();
    const reset = getMergedProducts();
    setProducts(reset);
    setSelectedProduct((prev) => {
      if (prev) {
        return reset.find((p) => p.id === prev.id) || prev;
      }
      return prev;
    });
  };

  // Filtered products list
  const filteredProducts = products.filter((item) => {
    const matchCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Navigation handlers
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product_detail');
    window.location.hash = `#product/${product.id}`;
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const handleAddToCart = (product: Product, variant?: ProductVariant, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const chosenVariant = variant || product.variants[0];
    const existingIndex = cart.findIndex(
      (item) => item.productId === product.id && item.selectedVariant.id === chosenVariant.id
    );

    let updatedCart: CartItem[];
    if (existingIndex > -1) {
      updatedCart = cart.map((item, index) =>
        index === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: product.id,
        product,
        selectedVariant: chosenVariant,
        quantity: 1,
        addedAt: Date.now(),
      };
      updatedCart = [...cart, newItem];
    }

    setCart(updatedCart);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(cartItemId);
    } else {
      setCart((prev) => prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQty } : item)));
    }
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  // Direct checkout from PDP
  const handleDirectBuy = (
    product: Product,
    variant: ProductVariant,
    customerData: { name: string; whatsapp: string; email: string }
  ) => {
    const singleCartItem: CartItem = {
      id: `direct-${Date.now()}`,
      productId: product.id,
      product,
      selectedVariant: variant,
      quantity: 1,
      addedAt: Date.now(),
    };

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      invoiceNumber: generateRandomInvoice(),
      items: [singleCartItem],
      totalAmount: variant.price,
      discountAmount: 0,
      feeAmount: 0,
      paymentMethod: 'dana',
      paymentStatus: 'pending',
      customerName: customerData.name,
      customerWhatsapp: customerData.whatsapp,
      customerEmail: customerData.email,
      createdAt: Date.now(),
    };

    saveOrderToStorage(newOrder);
    setOrders(getStoredOrders());
    setActivePaymentOrder(newOrder);
  };

  // Checkout from Cart Drawer
  const handleCartCheckout = (appliedDiscount: number) => {
    if (cart.length === 0) return;
    const subtotal = cart.reduce((acc, item) => acc + item.selectedVariant.price * item.quantity, 0);
    const totalAmount = Math.max(0, subtotal - appliedDiscount);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      invoiceNumber: generateRandomInvoice(),
      items: [...cart],
      totalAmount,
      discountAmount: appliedDiscount,
      feeAmount: 0,
      paymentMethod: 'dana',
      paymentStatus: 'pending',
      customerName: user?.name || 'Pelanggan Yuraa',
      customerWhatsapp: user?.whatsapp || '08123456789',
      customerEmail: user?.email || 'pembeli@gmail.com',
      createdAt: Date.now(),
    };

    saveOrderToStorage(newOrder);
    setOrders(getStoredOrders());
    setIsCartOpen(false);
    setActivePaymentOrder(newOrder);
  };

  // Quick Buy directly from card (skips PDP, directly triggers payment modal)
  const handleQuickBuy = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const primaryVariant = product.variants[0] || {
      id: `${product.id}-default`,
      name: '1 Bulan',
      price: product.price,
      originalPrice: product.originalPrice,
      stock: product.stockCount,
      durationDays: 30,
      description: 'Akses 30 hari legal',
    };

    const singleCartItem: CartItem = {
      id: `quick-${Date.now()}`,
      productId: product.id,
      product,
      selectedVariant: primaryVariant,
      quantity: 1,
      addedAt: Date.now(),
    };

    const quickOrder: Order = {
      id: `ord-${Date.now()}`,
      invoiceNumber: generateRandomInvoice(),
      items: [singleCartItem],
      totalAmount: primaryVariant.price,
      discountAmount: 0,
      feeAmount: 0,
      paymentMethod: 'dana',
      paymentStatus: 'pending',
      customerName: user?.name || 'Pelanggan Yuraa',
      customerWhatsapp: user?.whatsapp || STORE_INFO.danaNumber,
      customerEmail: user?.email || 'pelanggan@gmail.com',
      createdAt: Date.now(),
    };

    saveOrderToStorage(quickOrder);
    setOrders(getStoredOrders());
    setActivePaymentOrder(quickOrder);
  };

  const handlePaymentSuccess = (updatedOrder: Order) => {
    saveOrderToStorage(updatedOrder);
    setOrders(getStoredOrders());
    setActivePaymentOrder(updatedOrder);
    // Clear cart if items were purchased
    setCart([]);
  };

  const totalCartItemsCount = cart.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        darkMode ? 'bg-[#0b0f19] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
      }`}
    >
      {/* Top Referral Welcome Toast Banner */}
      {referralToast && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-slate-950 px-4 py-2.5 text-xs font-bold shadow-md relative z-50">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 shrink-0 animate-bounce text-slate-950" />
              <span>{referralToast}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setIsCartOpen(true);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-950 text-white text-[11px] font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cek Keranjang
              </button>
              <button
                onClick={() => setReferralToast(null)}
                className="p-1 rounded hover:bg-black/10 transition-colors text-slate-950 cursor-pointer font-bold"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Top Bar / Header */}
      <Header
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        cartCount={totalCartItemsCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setIsAuthOpen(true)}
        onOpenReferral={() => setIsReferralOpen(true)}
      />

      {/* Main Content Area */}
      <main>
        {currentView === '404' ? (
          <NotFoundPage
            onBackToHome={handleBackToHome}
            onSearchProduct={(q) => {
              setSearchQuery(q);
              handleBackToHome();
            }}
          />
        ) : currentView === 'product_detail' && selectedProduct ? (
          <ProductDetailPage
            product={selectedProduct}
            user={user}
            onBack={handleBackToHome}
            onOpenAuth={() => setIsAuthOpen(true)}
            onAddToCart={(prod, variant) => handleAddToCart(prod, variant)}
            onDirectBuy={handleDirectBuy}
          />
        ) : (
          /* Catalog & Storefront Homepage matching screenshots */
          <div className="space-y-6 sm:space-y-8">
            {/* Hero Section */}
            <Hero
              onScrollToProducts={() => {
                const el = document.getElementById('katalog-populer');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenConsultModal={() => setIsConsultOpen(true)}
              onOpenReferral={() => setIsReferralOpen(true)}
            />

            {/* Content Container */}
            <div className="max-w-6xl mx-auto px-4 space-y-8" id="katalog-populer">
              {/* Category Filter and Search */}
              <CategoryFilter
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                totalProductsCount={filteredProducts.length}
              />

              {/* Products 2-Column (Mobile) up to 4-Column (Desktop) Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelectProduct={handleSelectProduct}
                    onAddToCart={(p, e) => handleAddToCart(p, undefined, e)}
                    onQuickBuy={handleQuickBuy}
                  />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="rounded-3xl bg-[#121929] border border-slate-800 p-10 text-center space-y-3">
                  <p className="text-slate-400 text-sm">
                    Tidak ditemukan produk untuk "{searchQuery}".
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
                  >
                    Reset Filter
                  </button>
                </div>
              )}

              {/* Testimonials Section (Screenshot 2) */}
              <TestimonialsSection />

              {/* Recommendations Section (Screenshot 2 & 5) */}
              <RecommendationSection
                products={products}
                onSelectProduct={handleSelectProduct}
                onQuickBuy={handleQuickBuy}
              />

              {/* Features & 100% Guarantee Cards (Screenshot 3 & 4) */}
              <FeaturesGuaranteeSection
                onScrollToProducts={() => {
                  window.scrollTo({ top: 350, behavior: 'smooth' });
                }}
                onOpenConsultModal={() => setIsConsultOpen(true)}
              />

              {/* FAQ QnA Section (Screenshot 5) */}
              <FAQSection />

              {/* Help & Contact Section (Screenshot 5) */}
              <HelpContactSection
                onOpenWarrantyModal={() => setIsWarrantyOpen(true)}
                onOpenConsultModal={() => setIsConsultOpen(true)}
              />
            </div>
          </div>
        )}
      </main>

      {/* Live Sales Purchase Notification Toast (Bottom Left) */}
      <LiveSalesToast />

      {/* Floating Action Buttons (Cart, AI Assistant, WhatsApp) */}
      <FloatingActions
        cartCount={totalCartItemsCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAI={() => setIsAIOpen(true)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCartCheckout}
        appliedCouponCode={appliedVoucherCode}
        onOpenReferral={() => setIsReferralOpen(true)}
        onBrowseProducts={() => {
          setIsCartOpen(false);
          const el = document.getElementById('katalog-populer');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Payment Gateway & Instant Delivery Modal */}
      {activePaymentOrder && (
        <PaymentModal
          order={activePaymentOrder}
          isOpen={Boolean(activePaymentOrder)}
          onClose={() => setActivePaymentOrder(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Auth / Account / History Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={user}
        onLogin={handleUpdateUser}
        onLogout={() => handleUpdateUser(null)}
        orders={orders}
        onOpenAdminPanel={() => setIsAdminOpen(true)}
        onSelectOrderForPayment={(ord) => {
          setIsAuthOpen(false);
          setActivePaymentOrder(ord);
        }}
      />

      {/* AI Asisten Jualan Drawer */}
      <AIAssistantDrawer
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        onSelectProductByName={(name) => {
          const found = products.find((p) => p.name.toLowerCase().includes(name.toLowerCase()));
          if (found) {
            handleSelectProduct(found);
            setIsAIOpen(false);
          }
        }}
      />

      {/* Warranty Claim Modal */}
      <WarrantyModal isOpen={isWarrantyOpen} onClose={() => setIsWarrantyOpen(false)} />

      {/* Web Consultancy Modal */}
      <WebConsultModal isOpen={isConsultOpen} onClose={() => setIsConsultOpen(false)} />

      {/* Referral Program Modal */}
      <ReferralModal
        isOpen={isReferralOpen}
        onClose={() => setIsReferralOpen(false)}
        user={user}
        onApplyCouponToCart={(couponCode) => {
          setAppliedVoucherCode(couponCode);
          setIsReferralOpen(false);
          setIsCartOpen(true);
        }}
      />

      {/* Admin Secret Control Panel Modal with Logout & Transaction Deletion Log */}
      <AdminControlPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onUpdateProductStock={handleUpdateProductStock}
        onResetAllOverrides={handleResetAllOverrides}
        orders={orders}
        onOrdersChange={() => setOrders(getStoredOrders())}
        onUpdateOrderStatus={(orderId, status) => {
          const updated = orders.map((o) => (o.id === orderId ? { ...o, paymentStatus: status } : o));
          setOrders(updated);
          localStorage.setItem('yuraa_user_orders', JSON.stringify(updated));
        }}
      />
    </div>
  );
}
