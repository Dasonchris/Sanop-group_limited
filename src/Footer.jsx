import { useState } from 'react';
import { Leaf, Facebook, Linkedin, Instagram, Twitter, Send, Check } from 'lucide-react';
import './Footer.css';

export default function Footer({ onNavigate, user, onOpenAuth, onOpenPortal, onOpenConsultation }) {
  const [emailSubbed, setEmailSubbed] = useState(false);
  const [newsEmail, setNewsEmail] = useState('');

  const handleNewsSubmit = (e) => {
    e.preventDefault();
    if (!newsEmail) return;
    setEmailSubbed(true);
    setTimeout(() => {
      setEmailSubbed(false);
      setNewsEmail('');
    }, 4000);
  };

  const handleLink = (id) => {
    onNavigate(id);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-brand-dark text-white border-t border-white/5 pt-20 pb-8 relative overflow-hidden">
      
      {/* Upper newsletter bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/5">
        
        {/* Brand visual column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center text-brand-beige">
              <Leaf className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-xl tracking-wider text-white">
                SANOP
              </span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-brand-gold uppercase -mt-1">
                Group
              </span>
            </div>
          </div>

          <p className="text-white/60 text-xs sm:text-sm font-sans leading-relaxed max-w-sm">
            Building Ghana's first integrated regenerative health ecosystem to restoring health through food, lifestyle, environment, and healthcare designed to work as one system.
          </p>

          {/* Socials rows */}
          <div className="flex items-center space-x-3.5">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-green flex items-center justify-center text-white/85 hover:text-white transition-all cursor-pointer"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-green flex items-center justify-center text-white/85 hover:text-white transition-all cursor-pointer"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-green flex items-center justify-center text-white/85 hover:text-white transition-all cursor-pointer"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-green flex items-center justify-center text-white/85 hover:text-white transition-all cursor-pointer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 select-none">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.94.01 1.88-.01 2.82.01v4.06c-1.39-.01-2.79-.37-4.01-1.06-.05 1.93-.05 3.86-.02 5.79-.01 4.58-3.03 8.35-7.73 8.87-4.59.85-9.37-2.12-10.15-6.73-.97-4.73 2.1-9.59 6.84-10.37 1.14-.23 2.33-.19 3.46.12v4.18c-1.29-.46-2.73-.24-3.83.56-.99.64-1.57 1.77-1.55 2.95.02 2.51 2.51 4.41 5.02 3.89 2.1-.38 3.51-2.3 3.58-4.41V0h.07z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-green flex items-center justify-center text-white/85 hover:text-white transition-all cursor-pointer"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Navigation column */}
        <div className="lg:col-span-3 space-y-4 col-span-1">
          <h4 className="font-heading text-xs font-black tracking-widest text-brand-gold uppercase">
            Quick Navigation
          </h4>
          <ul className="space-y-2.5 text-xs text-white/65 font-medium">
            <li>
              <button onClick={() => handleLink('home')} className="hover:text-brand-gold transition-colors text-left cursor-pointer">
                Back to Top
              </button>
            </li>
            <li>
              <button onClick={() => handleLink('about')} className="hover:text-brand-gold transition-colors text-left cursor-pointer">
                About Our Story
              </button>
            </li>
            <li>
              <button onClick={() => handleLink('ecosystem')} className="hover:text-brand-gold transition-colors text-left cursor-pointer">
                The Ecosystem
              </button>
            </li>
            <li>
              <button onClick={() => handleLink('news')} className="hover:text-brand-gold transition-colors text-left cursor-pointer">
                News journals
              </button>
            </li>
            <li>
              <button onClick={() => handleLink('shop')} className="hover:text-brand-gold transition-colors text-left cursor-pointer">
                Ecosystem Shop
              </button>
            </li>
            <li className="pt-2 border-t border-white/10 flex flex-col gap-2">
              <button 
                onClick={onOpenConsultation} 
                className="text-brand-gold hover:text-white transition-colors text-left cursor-pointer flex items-center gap-1.5 font-semibold text-xs"
              >
                🩺 Diagnostics Consultation
              </button>
            </li>
            <li className="pt-2 border-t border-white/10 flex flex-col gap-2">
              <button
                onClick={() => onOpenPortal()}
                className="text-brand-beige hover:text-white transition-colors text-left cursor-pointer flex items-center gap-1.5 font-semibold text-xs"
              >
                {user?.role === 'admin' ? 'Go to Admin Dashboard' : 'Admin Portal Login'}
              </button>
            </li>
          </ul>
        </div>

        {/* Newsletter subscribe form */}
        <div className="lg:col-span-4 space-y-4 col-span-1">
          <h4 className="font-heading text-xs font-black tracking-widest text-[#a87b50] uppercase">
            Newsletter
          </h4>
          <p className="text-white/60 text-xs font-sans leading-relaxed">
            Subscribe to our newsletter & event right now to stay updated
          </p>

          {emailSubbed ? (
            <div className="p-4 rounded-xl bg-brand-green/10 text-brand-green border border-brand-green/20 text-xs flex items-center gap-2 font-medium">
              <Check className="w-4 h-4 shrink-0 text-brand-gold" />
              <span>Diagnostic subscription successful!</span>
            </div>
          ) : (
            <form onSubmit={handleNewsSubmit} className="flex gap-2">
              <input
                type="email"
                required
                value={newsEmail}
                onChange={(e) => setNewsEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-hidden focus:border-brand-gold font-sans placeholder-white/30"
              />
              <button
                type="submit"
                className="bg-brand-green hover:bg-brand-green-hover text-white px-4.5 rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="Subscribe"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Bottom meta area */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-white/40 font-sans gap-4">
        <div>
          <p>© {new Date().getFullYear()} SANOP GROUP OF COMPANIES LTD. All Rights Reserved.</p>
          <p className="mt-1 text-white/30">Designed naturally for high-metabolic diagnostic longevity.</p>
        </div>

        <div className="flex items-center space-x-6">
          <a href="#about" onClick={(e) => { e.preventDefault(); handleLink('about'); }} className="hover:text-brand-gold transition-colors">
            Privacy Policy
          </a>
          <span>•</span>
          <a href="#contact" onClick={(e) => { e.preventDefault(); handleLink('contact'); }} className="hover:text-brand-gold transition-colors">
            Terms of Use
          </a>
        </div>
      </div>

    </footer>
  );
}
