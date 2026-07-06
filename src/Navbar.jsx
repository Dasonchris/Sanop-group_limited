import { useState } from 'react';
import { Search, ShoppingCart, Menu, X, ChevronDown, Leaf } from 'lucide-react';
import './Navbar.css';

export default function Navbar({
  activeSection,
  setActiveSection,
  cartItems,
  onOpenCart,
  onOpenSearch,
  onOpenConsultation,
  user,
  onOpenAuth,
  onOpenPortal
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ecosystemDropdownOpen, setEcosystemDropdownOpen] = useState(false);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const menuItems = [
    { label: 'Home', value: 'home' },
    { label: 'About Us', value: 'about' },
    { label: 'Our Ecosystem', value: 'ecosystem', hasDropdown: true },
    { label: 'Newsroom', value: 'news' },
    { label: 'Online Shop', value: 'shop' },
    { label: 'Contact', value: 'contact' },
  ];

  const handleLinkClick = (value) => {
    setActiveSection(value);
    setMobileMenuOpen(false);
    const element = document.getElementById(value);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-beige/40 shadow-xs transition-all duration-300">
      {/* 
        To address "maintain the navbar design but the width should be long":
        We expand the container to w-full with generous horizontal density (px-6 md:px-12 xl:px-20) 
        and high-reach full spacing, creating a wide, premium "long" layout.
      */}
      <div className="w-full px-6 md:px-12 xl:px-20 py-4 flex items-center justify-between">
        
        {/* LOGO AREA */}
        <div className="flex items-center">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('home');
            }}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center text-brand-beige shadow-sm group-hover:bg-brand-gold transition-colors duration-300">
              <Leaf className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-xl tracking-wider text-brand-green group-hover:text-brand-gold transition-colors duration-300">
                SANOP
              </span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-brand-gold uppercase -mt-1">
                Group
              </span>
            </div>
          </a>
        </div>

        {/* NAVIGATION LINKS (DESKTOP) */}
        <nav className="hidden lg:flex items-center space-x-8">
          {menuItems.map((item) => {
            if (item.hasDropdown) {
              return (
                <div
                  key={item.value}
                  className="relative group"
                  onMouseEnter={() => setEcosystemDropdownOpen(true)}
                  onMouseLeave={() => setEcosystemDropdownOpen(false)}
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setEcosystemDropdownOpen((prev) => !prev);
                    }}
                    className={`flex items-center gap-1 font-heading text-sm font-semibold tracking-wide uppercase transition-colors duration-200 cursor-pointer ${
                      activeSection === 'ecosystem' ? 'text-brand-green font-bold' : 'text-brand-charcoal hover:text-brand-gold'
                    }`}
                  >
                    {item.label}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${ecosystemDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown overlay with bridging padding to avoid mouseout gaps */}
                  <div
                    className={`absolute left-0 top-full pt-2.5 w-64 transition-all duration-200 origin-top-left z-50 ${
                      ecosystemDropdownOpen
                        ? 'opacity-100 scale-100 translate-y-0 visible'
                        : 'opacity-0 scale-95 -translate-y-2 invisible pointer-events-none'
                    }`}
                  >
                    <div className="rounded-xl bg-white border border-brand-beige p-3 shadow-xl space-y-1">
                      <button
                        onClick={() => {
                          handleLinkClick('ecosystem-organics');
                          setEcosystemDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-brand-beige/50 text-brand-charcoal hover:text-brand-green font-heading text-xs font-bold tracking-wide transition-colors cursor-pointer"
                      >
                        🌱 Sanop Organic Harvest
                      </button>
                      <button
                        onClick={() => {
                          handleLinkClick('ecosystem-beauty');
                          setEcosystemDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-brand-beige/50 text-brand-charcoal hover:text-brand-green font-heading text-xs font-bold tracking-wide transition-colors cursor-pointer"
                      >
                        🧴 Sanop Beauty
                      </button>
                      <button
                        onClick={() => {
                          handleLinkClick('ecosystem-living');
                          setEcosystemDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-brand-beige/50 text-brand-charcoal hover:text-brand-green font-heading text-xs font-bold tracking-wide transition-colors cursor-pointer"
                      >
                        🏡 Regenerative Living Resort
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <button
                key={item.value}
                onClick={() => handleLinkClick(item.value)}
                className={`font-heading text-sm font-semibold tracking-wide uppercase transition-colors duration-200 cursor-pointer ${
                  activeSection === item.value
                    ? 'text-brand-green border-b-2 border-brand-green pb-0.5'
                    : 'text-brand-charcoal hover:text-brand-gold hover:border-b-2 hover:border-brand-gold/40'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* CONTROLS (RIGHT SIDE) */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-full hover:bg-brand-beige/40 text-brand-charcoal hover:text-brand-green transition-colors cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Cart Button with indicator */}
          <button
            onClick={onOpenCart}
            className="relative p-2 rounded-full hover:bg-brand-beige/40 text-brand-charcoal hover:text-brand-green transition-colors cursor-pointer"
            aria-label="ShoppingCart"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-gold text-white font-sans text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* User Active/Portal Trigger / Portal Login */}
          {user ? (
            <button
              onClick={onOpenPortal}
              className="bg-brand-gold hover:bg-brand-gold-hover text-white px-5 py-2 rounded-full font-heading text-xs font-bold tracking-wider uppercase shadow-xs hover:shadow-md transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
              <span>👤 Profile</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenAuth(false)}
              className="border border-brand-green text-brand-green hover:bg-brand-green hover:text-white px-5 py-2.5 rounded-full font-heading text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer"
            >
              Portal Login
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full hover:bg-brand-beige/40 text-brand-charcoal transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? 'max-h-screen border-t border-brand-beige/60 opacity-100 py-6' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="px-6 space-y-4">
          {menuItems.map((item) => {
            if (item.hasDropdown) {
              return (
                <div key={item.value} className="space-y-2">
                  <div className="font-heading text-sm font-bold tracking-wide uppercase text-brand-charcoal/60 px-2 py-1">
                    {item.label}
                  </div>
                  <div className="pl-4 space-y-1.5 border-l-2 border-brand-beige">
                    <button
                      onClick={() => handleLinkClick('ecosystem-organics')}
                      className="w-full text-left py-2 px-3 rounded-lg text-brand-charcoal hover:bg-brand-beige/30 text-xs font-semibold"
                    >
                      🌱 Sanop Organic Harvest
                    </button>
                    <button
                      onClick={() => handleLinkClick('ecosystem-beauty')}
                      className="w-full text-left py-2 px-3 rounded-lg text-brand-charcoal hover:bg-brand-beige/30 text-xs font-semibold"
                    >
                      🧴 Sanop Beauty
                    </button>
                    <button
                      onClick={() => handleLinkClick('ecosystem-living')}
                      className="w-full text-left py-2 px-3 rounded-lg text-brand-charcoal hover:bg-brand-beige/30 text-xs font-semibold"
                    >
                      🏡 Regenerative Living Resort
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <button
                key={item.value}
                onClick={() => handleLinkClick(item.value)}
                className={`block w-full text-left py-2 px-3 rounded-lg font-heading text-sm font-bold uppercase tracking-wider transition-all ${
                  activeSection === item.value
                    ? 'bg-brand-green/10 text-brand-green'
                    : 'text-brand-charcoal hover:bg-brand-beige/30'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="pt-4 border-t border-brand-beige/60 space-y-2">
            {user ? (
              <button
                onClick={() => {
                  onOpenPortal();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center bg-brand-gold text-white py-3 rounded-xl font-heading text-xs font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
              >
                Go to 👤 Profile Portal
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth(false);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center border border-brand-green text-brand-green py-3 rounded-xl font-heading text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Sign In to Member Portal
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
