import { useState, useEffect } from 'react';
import { X, Search, Trash2, Calendar, MapPin, CheckCircle, Clock } from 'lucide-react';
import Navbar from './Navbar';
import HeroSlider from './HeroSlider';
import AboutSection from './AboutSection';
import EcosystemSection from './EcosystemSection';
import RegenerativeEducation from './RegenerativeEducation';
import NewsroomSection from './NewsroomSection';
import ShopSection from './ShopSection';
import ContactSection from './ContactSection';
import FAQSection from './FAQSection';
import Footer from './Footer';
import OrganicHarvestPage from './OrganicHarvestPage';
import AdminPortalPage from './components/AdminPortalPage';
import { PRODUCTS } from './data';
import AuthModal from './components/AuthModal';
import PortalModal from './components/PortalModal';
import { postEncryptedJSON } from './secureTransport';
import './App.css';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [currentView, setCurrentView] = useState('main');
  const [cartItems, setCartItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Active Authenticated Session
  const [user, setUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalInitiallyAdmin, setAuthModalInitiallyAdmin] = useState(false);
  const [portalModalOpen, setPortalModalOpen] = useState(false);

  // Validate any existing session tokens upon network boot
  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('sanop_session_token');
      if (!token) return;
      try {
        const resp = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resp.ok) {
          const data = await resp.json();
          setUser(data.user);
        } else {
          throw new Error('Server token validation returned non-ok status');
        }
      } catch (err) {
        console.warn('Credentials session validation failing, using frontend fallback check: ', err.message);
        if (token.startsWith('mock_token_')) {
          const matchedId = token.replace('mock_token_', '');
          const localUsers = JSON.parse(localStorage.getItem('sanop_fallback_users') || '[]');
          const matchedUser = localUsers.find(u => u.id === matchedId);
          if (matchedUser) {
            setUser(matchedUser);
            return;
          }
        }
        localStorage.removeItem('sanop_session_token');
      }
    };
    fetchMe();
  }, []);

  // Listen to address hash updates to support direct URL access to sections & admin panel desk
  useEffect(() => {
    const parseAddressHash = () => {
      const hash = window.location.hash;
      if (hash === '#admin' || hash === '#admin-portal') {
        setCurrentView('admin-portal');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#organic-harvest' || hash === '#ecosystem-organics') {
        setCurrentView('organic-harvest');
        setActiveSection('ecosystem');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash) {
        const sectionId = hash.substring(1);
        const sections = ['home', 'about', 'ecosystem', 'news', 'shop', 'contact'];
        if (sections.includes(sectionId)) {
          setCurrentView('main');
          setActiveSection(sectionId);
          setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 150);
        }
      }
    };

    window.addEventListener('hashchange', parseAddressHash);
    parseAddressHash(); // Execute on initial mount

    return () => window.removeEventListener('hashchange', parseAddressHash);
  }, []);

  // Interactive Overlays
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);

  // Search logic
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Consultation Form State
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingType, setBookingType] = useState('full-cellular');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Checkout State
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutMomoPhone, setCheckoutMomoPhone] = useState('');
  const [checkoutMomoReference, setCheckoutMomoReference] = useState('');

  // Mobile Money Interactive OTP + PIN states
  const [momoStep, setMomoStep] = useState('idle'); // 'idle' | 'handshake' | 'otp' | 'pin' | 'processing'
  const [momoInputOtp, setMomoInputOtp] = useState('');
  const [momoInputPin, setMomoInputPin] = useState('');

  // Settle Section Observer on Scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'ecosystem', 'news', 'shop', 'contact'];
      const scrollPosition = window.scrollY + 160;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update live search results
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const results = PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  }, [searchQuery]);

  // Cart operations
  const handleAddToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity,
          image: product.image,
          category: product.category,
        },
      ];
    });
  };

  const handleUpdateQuantity = (id, change) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQuantity = item.quantity + change;
            return { ...item, quantity: nextQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliverySurcharge = cartSubtotal > 100 || cartSubtotal === 0 ? 0 : 9.99;
  const cartTotal = cartSubtotal + deliverySurcharge;

  // Handle click on specific ecosystem segment from Navbar/Ecosystem section
  const handleTargetCategoryShop = (category) => {
    setSelectedCategory(category);
    const element = document.getElementById('shop');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNavigateToSection = (sectionId) => {
    if (sectionId === 'ecosystem-organics' || sectionId === 'organic-harvest') {
      setCurrentView('organic-harvest');
      setActiveSection('ecosystem');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    if (sectionId === 'admin-portal') {
      setCurrentView('admin-portal');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setCurrentView('main');
    setActiveSection(sectionId);
    
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 80);
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    if (userData?.role === 'admin') {
      setCurrentView('admin-portal');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBookSession = async (e) => {
    e.preventDefault();
    if (!bookingName || !bookingEmail || !bookingPhone || !bookingDate) return;

    const consultationObj = {
      id: `consultation_${Date.now()}`,
      userId: user?.id || 'guest',
      name: bookingName,
      email: bookingEmail,
      phone: bookingPhone,
      scope: bookingType,
      date: bookingDate,
      createdAt: new Date().toISOString()
    };

    // Store in local ledger immediately
    let consultations = [];
    try {
      consultations = JSON.parse(localStorage.getItem('sanop_fallback_consultations') || '[]');
    } catch (err) {}
    consultations.unshift(consultationObj);
    localStorage.setItem('sanop_fallback_consultations', JSON.stringify(consultations));

    // Log locally
    let logs = [];
    try {
      logs = JSON.parse(localStorage.getItem('sanop_fallback_logs') || '[]');
    } catch (err) {}
    logs.unshift({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userEmail: bookingEmail,
      ip: '127.0.0.1 (Frontend)',
      action: 'CONSULT_BOOKED',
      details: `Booked a clinic diagnostic session (${bookingType}) for regional focus.`
    });
    localStorage.setItem('sanop_fallback_logs', JSON.stringify(logs.slice(0, 100)));

    try {
      const token = localStorage.getItem('sanop_session_token');
      const resp = await postEncryptedJSON('/api/consultations/create', {
        name: bookingName,
        email: bookingEmail,
        phone: bookingPhone,
        scope: bookingType,
        date: bookingDate,
      }, token);
      if (!resp.ok) {
        const errorText = await resp.text().catch(() => "Server responded with an error");
        console.warn('Consultation sync failed:', errorText);
      }
    } catch (err) {
      console.warn('Network booking sync bypassed. Cached locally offline-first.', err.message);
    }

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingName('');
      setBookingEmail('');
      setBookingPhone('');
      setBookingDate('');
      setConsultationOpen(false);
    }, 4000);
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!checkoutName || !checkoutEmail || !checkoutMomoPhone) return;

    // Transition to simulated secure carrier database connection
    setMomoStep('handshake');
    setTimeout(() => {
      setMomoStep('otp');
    }, 1500);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!momoInputOtp) return;
    setMomoStep('pin');
  };

  const handleCompletePaymentFlow = async (e) => {
    e.preventDefault();
    if (!momoInputPin) return;

    setMomoStep('processing');

    // Simulate live payment confirmation & ledger recording
    setTimeout(async () => {
      const liveRef = checkoutMomoReference || `TX_${Math.floor(100000000 + Math.random() * 900000000)}`;
      const orderObj = {
        id: `order_${Date.now()}`,
        userId: user?.id || 'guest',
        customerName: checkoutName,
        customerEmail: checkoutEmail,
        items: cartItems,
        subtotal: cartSubtotal,
        deliveryFee: deliverySurcharge,
        total: cartTotal,
        momoPhone: checkoutMomoPhone,
        momoReference: liveRef,
        createdAt: new Date().toISOString()
      };

      // Store order locally immediately
      let orders = [];
      try {
        orders = JSON.parse(localStorage.getItem('sanop_fallback_orders') || '[]');
      } catch (err) {}
      orders.unshift(orderObj);
      localStorage.setItem('sanop_fallback_orders', JSON.stringify(orders));

      // Log security event locally
      let logs = [];
      try {
        logs = JSON.parse(localStorage.getItem('sanop_fallback_logs') || '[]');
      } catch (err) {}
      logs.unshift({
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        userEmail: checkoutEmail,
        ip: '127.0.0.1 (Frontend)',
        action: 'ECOSYSTEM_ORDER',
        details: `Dispatched MoMo order with ref: ${liveRef}. Total value: $${orderObj.total.toFixed(2)}.`
      });
      localStorage.setItem('sanop_fallback_logs', JSON.stringify(logs.slice(0, 100)));

      try {
        const token = localStorage.getItem('sanop_session_token');
        const resp = await postEncryptedJSON('/api/orders/create', {
          customerName: checkoutName,
          customerEmail: checkoutEmail,
          items: cartItems,
          subtotal: cartSubtotal,
          deliveryFee: deliverySurcharge,
          total: cartTotal,
          momoPhone: checkoutMomoPhone,
          momoReference: liveRef
        }, token);
        if (!resp.ok) throw new Error('Order dispatch register failed');
      } catch (err) {
        console.warn('Network checkout sync bypassed. Cached locally offline-first.', err.message);
      }

      setCheckoutSuccess(true);
      setMomoStep('idle');
      setMomoInputOtp('');
      setMomoInputPin('');

      const whatsappUrl = 'https://wa.me/233598580995?text=Thank%20you%20for%20your%20order.%20Please%20send%20my%20order%20details%20for%20confirmation.';
      window.open(whatsappUrl, '_blank');

      setTimeout(() => {
        setCheckoutSuccess(false);
        setCartItems([]);
        setCheckoutName('');
        setCheckoutEmail('');
        setCheckoutMomoPhone('');
        setCheckoutMomoReference('');
        setCartOpen(false);
      }, 5000);
    }, 2500);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans select-text select-none">
      
      {/* 
        Full sticky header element. Nav is full width (width: 100%) and padded deeply to 
        address "maintain the navbar design but the width should be long" 
      */}
      {currentView !== 'admin-portal' && (
        <Navbar
          activeSection={activeSection}
          setActiveSection={handleNavigateToSection}
          cartItems={cartItems}
          onOpenCart={() => setCartOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenConsultation={() => setConsultationOpen(true)}
          user={user}
          onOpenAuth={(isAdmin = false) => {
            setAuthModalInitiallyAdmin(isAdmin);
            setAuthModalOpen(true);
          }}
          onOpenPortal={() => {
            setCurrentView('admin-portal');
            setPortalModalOpen(false);
            setAuthModalOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {currentView === 'organic-harvest' ? (
        <OrganicHarvestPage
          onBackToMain={() => {
            setCurrentView('main');
            setActiveSection('ecosystem');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onAddToCart={handleAddToCart}
        />
      ) : currentView === 'admin-portal' ? (
        <AdminPortalPage
          user={user}
          onBackToMain={() => {
            setCurrentView('main');
            setActiveSection('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onLogOut={() => {
            setUser(null);
            localStorage.removeItem('sanop_session_token');
            setCurrentView('main');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onUserUpdate={(updatedUser) => {
            setUser(updatedUser);
          }}
          onAuthSuccess={(userData) => {
            setUser(userData);
          }}
        />
      ) : (
        <main className="flex-1">
          {/* Animated Hero Slider */}
          <HeroSlider
            onExploreClick={(id) => {
              if (id === 'ecosystem-organics') {
                setCurrentView('organic-harvest');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
              }
              if (id.startsWith('ecosystem-')) {
                const element = document.getElementById(id);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              } else {
                const element = document.getElementById(id);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }
            }}
          />

          {/* Section: About block */}
          <AboutSection />

          {/* Section: Ecosystem block (Sourcing 3 business vectors) */}
          <EcosystemSection
            onProductClick={handleTargetCategoryShop}
            onOpenConsultation={() => setConsultationOpen(true)}
            onViewHarvestPage={() => {
              setCurrentView('organic-harvest');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          {/* Section: Educational & Clinical biological systems */}
          <RegenerativeEducation />

          {/* Section: News auto-carousel */}
          <NewsroomSection />

          {/* Section: Interactive e-commerce Shop */}
          <ShopSection
            onAddToCart={handleAddToCart}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          {/* Section: Frequently asked questions */}
          <FAQSection />

          {/* Section: Contact coords and FAQs */}
          <ContactSection />
        </main>
      )}

      {/* Corporate Footer */}
      {currentView !== 'admin-portal' && (
        <Footer 
          onNavigate={handleNavigateToSection} 
          user={user}
          onOpenAuth={(isAdmin = false) => {
            setAuthModalInitiallyAdmin(isAdmin);
            setAuthModalOpen(true);
          }}
          onOpenPortal={() => {
            setCurrentView('admin-portal');
            setPortalModalOpen(false);
            setAuthModalOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenConsultation={() => setConsultationOpen(true)}
        />
      )}

      {/* OVERLAY 1: Interactive Shopping Cart Drawer (Right Slide-over) */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-brand-dark/90 backdrop-blur-xs">
          {/* Backdrop click closer */}
          <div className="absolute inset-0" onClick={() => setCartOpen(false)} />
          
          <div className="relative w-full max-w-md bg-white h-full flex flex-col justify-between shadow-2xl border-l border-brand-beige animate-slide-left z-10 p-6 sm:p-8">
            
            {/* Header info */}
            <div className="pb-4 border-b border-brand-beige flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl font-heading font-extrabold text-brand-green">Your Sourced Bag</span>
                <span className="text-xs bg-brand-beige text-brand-gold font-bold px-2 py-0.5 rounded-full">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)} Items
                </span>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-1.5 rounded-full hover:bg-brand-beige/40 text-brand-charcoal cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Shopping cart bodies */}
            {checkoutSuccess ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-8">
                <div className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green animate-pulse">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-lg text-brand-green">Order Synthesized Successfully</h3>
                <p className="text-xs text-brand-charcoal/70 max-w-xs leading-relaxed">
                  Excellent choice. Your biological resources order is locked. A Sanop distribution coordinator in Volta Region will contact you to confirm payment and direct dispatch options.
                </p>
              </div>
            ) : cartItems.length > 0 ? (
              <>
                {/* Scrolling Items listing */}
                <div className="flex-1 overflow-y-auto py-5 space-y-4 pr-1">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 bg-brand-beige-light border border-brand-beige/50 rounded-xl items-center justify-between"
                    >
                      <div className="flex gap-3 items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="font-heading font-bold text-xs text-brand-dark line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-[10px] text-brand-charcoal/50 uppercase font-mono mt-0.5">
                            {item.category}
                          </p>
                          <span className="text-brand-green font-mono text-[11px] font-extrabold">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Quantity editors and trash icon */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-white border border-brand-beige rounded-lg px-2 py-1">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                            className="text-brand-charcoal hover:text-brand-green font-bold text-xs px-1 cursor-pointer"
                          >
                            −
                          </button>
                          <span className="text-xs font-mono font-bold px-2 text-brand-dark">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                            className="text-brand-charcoal hover:text-brand-green font-bold text-xs px-1 cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="text-red-500/80 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotals & Surcharges info blocks */}
                <div className="border-t border-brand-beige pt-4 space-y-3 shrink-0">
                  <div className="flex justify-between text-xs text-brand-charcoal/70">
                    <span>Products Subtotal</span>
                    <span className="font-mono font-semibold">${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-brand-charcoal/70">
                    <span>Delivery dispatch Surcharge</span>
                    <span className="font-mono font-semibold">
                      {deliverySurcharge > 0 ? `$${deliverySurcharge.toFixed(2)}` : 'FREE (Over $100)'}
                    </span>
                  </div>
                  <div className="flex justify-between h-px bg-brand-beige my-2" />
                  <div className="flex justify-between text-sm text-brand-dark font-extrabold pb-4">
                    <span>Grand total price</span>
                    <span className="text-brand-green font-heading text-base">${cartTotal.toFixed(2)}</span>
                  </div>                   {/* Micro validation checkout form */}
                  {momoStep === 'idle' && (
                    <form onSubmit={handleCheckoutSubmit} className="space-y-3 pt-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-heading font-black text-brand-charcoal/40 uppercase tracking-widest mb-1">
                            Your Name
                          </label>
                          <input
                            type="text"
                            required
                            value={checkoutName}
                            onChange={(e) => setCheckoutName(e.target.value)}
                            placeholder="e.g. Ama Mensah"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-brand-beige bg-brand-beige-light/50 text-[11px] font-sans outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-heading font-black text-brand-charcoal/40 uppercase tracking-widest mb-1">
                            Email address
                          </label>
                          <input
                            type="email"
                            required
                            value={checkoutEmail}
                            onChange={(e) => setCheckoutEmail(e.target.value)}
                            placeholder="ama@domain.com"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-brand-beige bg-brand-beige-light/50 text-[11px] font-sans outline-hidden"
                          />
                        </div>
                      </div>

                      {/* Ghana Mobile Money (MoMo) Information & Payment Panel */}
                      <div className="p-3 bg-brand-beige-light border border-brand-beige rounded-xl space-y-2 mt-2 text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                          <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-brand-gold">
                            Ghana Mobile Money (MoMo) Payment
                          </span>
                        </div>
                        <p className="text-[10px] text-brand-charcoal/80 leading-relaxed font-sans">
                          Please transfer the total amount to our verified ecosystem merchant receiver below:
                        </p>
                        <div className="bg-white border border-brand-beige p-2 rounded-lg text-xs space-y-1">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-brand-charcoal/60">Provider/Network:</span>
                            <span className="font-semibold text-brand-dark">Telecel / MTN</span>
                          </div>
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-brand-charcoal/60">Merchant Phone:</span>
                            <span className="font-bold font-mono text-brand-green selection:bg-brand-green/20">+233 (020) 605 3309</span>
                          </div>
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-brand-charcoal/60">Display Name:</span>
                            <span className="font-semibold text-brand-dark">Sanop Group</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div>
                            <label className="block text-[8.5px] font-heading font-black text-brand-charcoal/50 uppercase tracking-wider mb-0.5">
                              Your Momo Number
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. 054XXXXXXX"
                              value={checkoutMomoPhone}
                              onChange={(e) => setCheckoutMomoPhone(e.target.value)}
                              className="w-full px-2 py-1.5 rounded-md border border-brand-beige bg-white text-[10px] font-sans outline-hidden"
                            />
                          </div>
                          <div>
                            <label className="block text-[8.5px] font-heading font-black text-brand-charcoal/50 uppercase tracking-wider mb-0.5">
                              Reference / ID (Optional)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. auto-generated"
                              value={checkoutMomoReference}
                              onChange={(e) => setCheckoutMomoReference(e.target.value)}
                              className="w-full px-2 py-1.5 rounded-md border border-brand-beige bg-white text-[10px] font-sans outline-hidden"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-brand-green hover:bg-brand-green-hover text-white py-3.5 rounded-xl font-heading text-xs font-bold uppercase tracking-widest shadow-md transition-all mt-2 cursor-pointer"
                      >
                        Secure checkout Dispatch Order
                      </button>
                    </form>
                  )}

                  {/* Step 1: Handshake */}
                  {momoStep === 'handshake' && (
                    <div className="p-5 bg-brand-dark text-white rounded-xl space-y-4 text-center border border-brand-green/30 my-2">
                      <div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <div className="space-y-1">
                        <p className="text-xs uppercase font-heading font-black tracking-wider text-brand-gold">Secure carrier handshake</p>
                        <p className="text-[10px] text-white/70">Contacting National MTN & Telecel switches for secure token allocation to {checkoutMomoPhone}...</p>
                      </div>
                    </div>
                  )}

                  {/* Step 2: OTP Verification Prompt */}
                  {momoStep === 'otp' && (
                    <form onSubmit={handleVerifyOtp} className="p-4 bg-brand-dark/95 text-white rounded-xl space-y-3 border border-brand-gold/30 text-left my-2">
                      <div className="flex items-center gap-1.5 justify-between">
                        <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-brand-gold">Momo OTP Verification</span>
                        <span className="text-[9px] font-mono bg-brand-gold/15 text-brand-gold px-1.5 py-0.5 rounded animate-pulse">Awaiting Verification</span>
                      </div>
                      <p className="text-[10px] text-white/80 leading-relaxed font-sans">
                        We have sent a simulated One-Time Password (OTP) validation key to your registered device <strong className="font-mono text-brand-gold">{checkoutMomoPhone}</strong>.
                      </p>
                      <div className="space-y-1.55">
                        <label className="block text-[9px] font-heading font-black text-white/50 uppercase tracking-widest">Enter 6-Digit Code</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={6}
                            required
                            pattern="[0-9]*"
                            placeholder="e.g. 486201"
                            value={momoInputOtp}
                            onChange={(e) => setMomoInputOtp(e.target.value.replace(/\D/g, ''))}
                            className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-xs font-mono tracking-widest outline-hidden focus:border-brand-gold"
                          />
                          <button
                            type="button"
                            onClick={() => setMomoInputOtp('486201')}
                            className="px-2.5 py-2 text-[9px] font-bold uppercase tracking-wider bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all cursor-pointer"
                          >
                            Autofill (486201)
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setMomoStep('idle')}
                          className="flex-1 py-1.5 text-[10px] text-center font-heading font-bold text-white/60 hover:text-white uppercase transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={momoInputOtp.length < 4}
                          className={`flex-1 py-1.5 text-[11px] font-heading font-bold uppercase tracking-wider rounded-lg text-center transition-all cursor-pointer ${
                            momoInputOtp.length >= 4 ? 'bg-brand-gold hover:bg-brand-gold-hover text-white shadow-md' : 'bg-white/10 text-white/40 cursor-not-allowed'
                          }`}
                        >
                          Verify OTP &rarr;
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Step 3: Wallet PIN Prompt */}
                  {momoStep === 'pin' && (
                    <form onSubmit={handleCompletePaymentFlow} className="p-4 bg-zinc-900 text-white rounded-xl space-y-3 border border-brand-gold/45 text-left my-2">
                      <div className="flex items-center gap-1.5 justify-between">
                        <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-brand-gold">Personal Wallet Authorization</span>
                        <span className="text-[9px] font-mono bg-brand-gold/15 text-brand-gold px-1.5 py-0.5 rounded">STEP 2 OF 2</span>
                      </div>
                      <p className="text-[10px] text-zinc-300 leading-relaxed font-sans">
                        Kindly input your simulated secure 4-digit Mobile Money WALLET PIN to authorize the fund transfer of <strong className="font-mono text-brand-gold">${cartTotal.toFixed(2)}</strong>.
                      </p>
                      <div className="space-y-1.5">
                        <label className="block text-[9px] font-heading font-black text-white/50 uppercase tracking-widest">Enter 4-Digit Wallet PIN</label>
                        <div className="flex gap-2">
                          <input
                            type="password"
                            maxLength={4}
                            required
                            pattern="[0-9]*"
                            placeholder="••••"
                             value={momoInputPin}
                             onChange={(e) => setMomoInputPin(e.target.value.replace(/\D/g, ''))}
                            className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-center text-xs font-mono tracking-widest outline-hidden focus:border-brand-gold"
                          />
                          <button
                            type="button"
                            onClick={() => setMomoInputPin('1234')}
                            className="px-2.5 py-2 text-[9px] font-bold uppercase tracking-wider bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all cursor-pointer"
                          >
                            Autofill (1234)
                          </button>
                        </div>
                      </div>
                      <p className="text-[9px] text-amber-200/50 italic leading-normal">
                        *Wallet funds will be routed securely to Sanop Group enterprise pool trusts.
                      </p>
                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setMomoStep('otp')}
                          className="flex-1 py-1.5 text-[10px] text-center font-heading font-bold text-white/60 hover:text-white uppercase transition-colors cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={momoInputPin.length < 4}
                          className={`flex-1 py-1.5 text-[11px] font-heading font-bold uppercase tracking-wider rounded-lg text-center transition-all cursor-pointer ${
                            momoInputPin.length >= 4 ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md' : 'bg-white/10 text-white/40 cursor-not-allowed'
                          }`}
                        >
                          Authorize PIN Payment
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Step 4: Vault Clearing Processing UI */}
                  {momoStep === 'processing' && (
                    <div className="p-6 bg-brand-dark text-white rounded-xl space-y-4 text-center border border-emerald-500/30 my-2">
                      <div className="relative w-12 h-12 mx-auto">
                        <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs uppercase font-heading font-black tracking-wider text-emerald-400">Processing Merchant Clearing</p>
                        <p className="text-[10px] text-white/70">Connecting with <strong className="text-brand-gold">Sanop Group Enterprise Pool Trust</strong> accounts...</p>
                        <span className="text-[9px] block font-mono text-white/40">Securing payment clearance with MTN/Telecel networks...</span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 pb-20">
                <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                  <Trash2 className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-semibold text-brand-dark text-base">Your Bag is Empty</h4>
                <p className="text-xs text-brand-charcoal/50 max-w-xs leading-relaxed">
                  Browse our biological herbs, cold-pressed raw shea cosmetic serums, or book premium diagnostics from the online shop section.
                </p>
                <button
                  onClick={() => {
                    setCartOpen(false);
                    const el = document.getElementById('shop');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-brand-green text-white text-[10px] font-heading font-black uppercase tracking-widest px-4 py-2.5 rounded-lg mt-2"
                >
                  Visit the shop
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* OVERLAY 2: Search Dialogue Modal (Center screen popup) */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/95 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-brand-beige overflow-hidden shadow-3xl animate-scale-up relative">
            
            {/* Input row */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-brand-beige">
              <Search className="w-5 h-5 text-brand-charcoal/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type keywords to search products..."
                autoFocus
                className="w-full bg-transparent border-0 outline-hidden focus:ring-0 text-brand-dark text-sm sm:text-base font-sans"
              />
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchOpen(false);
                }}
                className="p-1 rounded-full hover:bg-brand-beige/50 text-brand-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrolling results area */}
            <div className="p-6 max-h-[300px] overflow-y-auto">
              {searchQuery ? (
                searchResults.length > 0 ? (
                  <div className="space-y-4">
                    <span className="text-[10px] text-brand-gold font-heading font-bold uppercase tracking-widest">
                      Matches Found ({searchResults.length})
                    </span>
                    <div className="space-y-2">
                      {searchResults.map((product) => (
                        <button
                           key={product.id}
                           onClick={() => {
                             setSelectedCategory(product.category);
                             setSearchOpen(false);
                             const el = document.getElementById('shop');
                             if (el) el.scrollIntoView({ behavior: 'smooth' });
                           }}
                           className="w-full text-left flex gap-3 p-2 rounded-xl hover:bg-brand-beige-light items-center border border-transparent hover:border-brand-beige cursor-pointer"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="font-heading font-extrabold text-xs text-brand-dark">
                              {product.name}
                            </h4>
                            <p className="text-[10px] text-brand-charcoal/45 mt-0.5 line-clamp-1">
                              {product.description}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-brand-charcoal/50 text-xs">
                    No matching products found for "{searchQuery}"
                  </div>
                )
              ) : (
                <div className="space-y-3">
                  <span className="text-[10px] text-brand-charcoal/50 font-heading font-black uppercase tracking-wider">
                    Quick Suggestions
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {['Wildflower Honey', 'Shea Butter', 'Hibiscus Tea', 'Moringa Powder', 'Diagnostics'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="bg-brand-beige-light border border-brand-beige px-3 py-1.5 rounded-lg text-xs hover:border-brand-green/30"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* OVERLAY 3: Book Diagnostics Consultation Form Modal */}
      {consultationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/95 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white text-brand-dark p-6 sm:p-8 relative border border-brand-beige shadow-3xl animate-scale-up max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => {
                setConsultationOpen(false);
                setBookingSuccess(false);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-brand-beige/40 text-brand-charcoal cursor-pointer"
              aria-label="Close booking modal"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] text-brand-gold font-heading font-extrabold tracking-widest uppercase">
              SANOP REGENERATIVE CLINIC
            </span>
            <h3 className="text-2xl font-heading font-black text-brand-green mt-1">
              Book Integrative Diagnostics Consultation
            </h3>
            <p className="text-xs text-brand-charcoal/60 mt-1">
              Connect 1-on-1 with our clinical advisors in Ho, Volta Region to trace gut markers and design custom detox plans.
            </p>

            <div className="w-full h-px bg-brand-beige my-5" />

            {bookingSuccess ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green mx-auto animate-bounce">
                  <Calendar className="w-8 h-8" />
                </div>
                <h4 className="font-heading font-bold text-lg text-brand-green">Consultation booked</h4>
                <p className="text-xs text-brand-charcoal/60 max-w-xs mx-auto">
                  Your appointment slot for our diagnostics has been successfully captured. An advisor will reach you by phone/email to finalize exact hour and biological steps.
                </p>
                <div className="p-3 bg-brand-beige-light border border-brand-beige rounded-xl text-[11px] text-left space-y-1 max-w-sm mx-auto">
                  <p className="flex items-center gap-1.5 text-brand-charcoal">
                    <Clock className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                    <span>Selected Date: <strong className="text-brand-dark">{bookingDate}</strong></span>
                  </p>
                  <p className="flex items-center gap-1.5 text-brand-charcoal">
                    <MapPin className="w-3.5 h-3.5 text-brand-green shrink-0" />
                    <span>Location: Ho Regenerative Resort Clinic, Volta Region, Ghana.</span>
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookSession} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-heading font-bold text-brand-charcoal uppercase tracking-wider mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      placeholder="e.g. Sandra Sarpong"
                      className="w-full px-4 py-3 rounded-xl border border-brand-beige bg-brand-beige-light/50 text-xs font-sans outline-hidden focus:border-brand-green"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-heading font-bold text-brand-charcoal uppercase tracking-wider mb-1">
                      Email address
                    </label>
                    <input
                      type="email"
                      required
                      value={bookingEmail}
                      onChange={(e) => setBookingEmail(e.target.value)}
                      placeholder="sandra.sarpong@domain.com"
                      className="w-full px-4 py-3 rounded-xl border border-brand-beige bg-brand-beige-light/50 text-xs font-sans outline-hidden focus:border-brand-green"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-heading font-bold text-brand-charcoal uppercase tracking-wider mb-1">
                      Phone Number (WhatsApp preferred)
                    </label>
                    <input
                      type="tel"
                      required
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      placeholder="+233 XX XXX XXXX"
                      className="w-full px-4 py-3 rounded-xl border border-brand-beige bg-brand-beige-light/50 text-xs font-sans outline-hidden focus:border-brand-green"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-heading font-bold text-brand-charcoal uppercase tracking-wider mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-brand-beige bg-brand-beige-light/50 text-xs font-sans outline-hidden focus:border-brand-green text-brand-charcoal/80"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-heading font-bold text-brand-charcoal uppercase tracking-wider mb-1">
                    Select Consultation Scope
                  </label>
                  <select
                    value={bookingType}
                    onChange={(e) => setBookingType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-brand-beige bg-brand-beige-light/50 text-xs font-sans outline-hidden focus:border-brand-green text-brand-charcoal/80"
                  >
                    <option value="full-cellular">🌱 Complete Cellular longevities ($75.00)</option>
                    <option value="gut-microbiome">🔬 Biological Gut microbiome assessment ($60.00)</option>
                    <option value="detox-wellness">🏡 Farm-to-Table eco-retreat detox program ($120.00)</option>
                    <option value="natural-beauty">🧴 Phytocosmetic hair & skin consult ($40.00)</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-brand-green hover:bg-brand-green-hover text-white py-3.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                  >
                    Transmit Diagnostics Request
                  </button>
                </div>

              </form>
            )}

            <div className="mt-6 pt-4 border-t border-brand-beige text-center">
              <p className="text-[10px] text-brand-charcoal/40 font-sans leading-relaxed">
                Consultations are governed under integrative wellness frameworks. Diagnostic results are coordinated securely.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* Dynamic Authorization Portal dialog */}
      <AuthModal
        isOpen={authModalOpen}
        isAdminInitially={authModalInitiallyAdmin}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(userData) => {
          handleAuthSuccess(userData);
          if (userData?.role !== 'admin') {
            setPortalModalOpen(true);
          }
        }}
      />

      {/* Dynamic Membership / Admin Portal dialog */}
      <PortalModal
        isOpen={portalModalOpen}
        onClose={() => setPortalModalOpen(false)}
        user={user}
        onLogOut={() => {
          setUser(null);
          setPortalModalOpen(false);
        }}
        onUserUpdate={(updatedUser) => {
          setUser(updatedUser);
        }}
      />

    </div>
  );
}
