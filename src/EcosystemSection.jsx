import { useState } from 'react';
import { ArrowRight, CheckCircle2, Sprout, Heart, Moon, Compass, X, Leaf } from 'lucide-react';
import { VENTURES } from './data.js';
import './EcosystemSection.css';

export default function EcosystemSection({ onProductClick, onOpenConsultation, onViewHarvestPage }) {
  const [selectedVenture, setSelectedVenture] = useState(null);
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');

  const getVentureIcon = (id) => {
    switch (id) {
      case 'organics':
        return <Sprout className="w-6 h-6 text-brand-green" />;
      case 'beauty':
        return <Heart className="w-6 h-6 text-brand-gold" />;
      case 'living':
        return <Moon className="w-6 h-6 text-brand-green" />;
      default:
        return <Compass className="w-6 h-6" />;
    }
  };

  const handleSendInquiry = (e) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail) return;
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      setSelectedVenture(null);
      setInquiryName('');
      setInquiryEmail('');
      setInquiryMessage('');
    }, 3000);
  };

  return (
    <section id="ecosystem" className="py-24 bg-brand-charcoal text-white relative overflow-hidden">
      {/* Background shape */}
      <div className="absolute inset-0 bg-[radial-gradient(#a87b50_1px,transparent_1px)] [background-size:24px_24px] opacity-7 pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-brand-green/10 rounded-full filter blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-5">
          <span className="text-brand-gold font-heading text-xs font-black tracking-[0.25em] uppercase">
            OUR ECOSYSTEM
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tight italic">
            The Regenerative Health Ecosystem
          </h2>
          <div className="space-y-4 text-white/75 font-sans text-base leading-relaxed max-w-2xl mx-auto">
            <p>
              Health begins with the food we eat, the products we use, the environments we live in, and the habits we practice every day.
            </p>
            <p>
              Sanop integrates these foundations into one coordinated ecosystem designed to restore health at its roots.
            </p>
          </div>
        </div>

        {/* Ventures Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {VENTURES.map((venture) => {
            const isOrganics = venture.id === 'organics';
            return (
              <div
                key={venture.id}
                id={`ecosystem-${venture.id}`}
                onClick={() => {
                  if (isOrganics) {
                    onViewHarvestPage();
                  }
                }}
                className={`scroll-mt-28 flex flex-col justify-between rounded-3xl bg-brand-charcoal border p-8 hover:bg-brand-dark/50 transition-all duration-300 shadow-lg group relative ${
                  isOrganics 
                    ? 'border-brand-green/45 hover:border-brand-green cursor-pointer hover:scale-[1.01] scale-100' 
                    : 'border-white/10 hover:border-brand-gold/40'
                }`}
              >
                {/* Highlight active gradient on hover */}
                <div className={`absolute inset-x-0 -top-px h-1 rounded-t-3xl bg-linear-to-r from-transparent to-transparent group-hover:via-brand-gold transition-all duration-300 ${isOrganics ? 'via-brand-green group-hover:via-brand-green' : 'via-brand-gold/0'}`} />

                <div>
                  {/* Header of Item */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-colors">
                      {getVentureIcon(venture.id)}
                    </div>
                    {isOrganics ? (
                      <span className="text-[10px] bg-brand-green/20 text-brand-green hover:bg-brand-green/30 px-2.5 py-1 rounded-full font-heading font-black tracking-wider uppercase animate-pulse">
                        🍌 See Volta Harvest Page
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono tracking-widest text-[#a87b50] font-extrabold uppercase animate-none">
                        Ecosystem 0{venture.id === 'beauty' ? '02' : '03'}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-heading font-extrabold text-white mb-2 leading-tight tracking-tight">
                    {venture.name}
                  </h3>
                  
                  <p className="text-brand-gold font-heading text-xs font-bold tracking-widest uppercase mb-4">
                    ({venture.subName})
                  </p>

                  <p className="text-white/70 text-sm leading-relaxed mb-6 font-sans">
                    {venture.description}
                  </p>

                  {/* Bullets */}
                  <ul className="space-y-3 mb-8">
                    {venture.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex gap-2 items-start text-xs text-white/80">
                        <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Info and Navigation indicators for clicking card */}
                {isOrganics && (
                  <div className="mb-4 bg-brand-green/10 border border-brand-green/20 p-3.5 rounded-xl flex items-start gap-2.5">
                    <Leaf className="w-4 h-4 text-brand-green shrink-0 mt-0.5 animate-bounce" />
                    <p className="text-[11px] text-brand-green leading-normal font-sans">
                      Harvesting Cavendish Bananas, seedless Watermelons, papaya, and avocado. <strong>Click here to view full catalog.</strong>
                    </p>
                  </div>
                )}

                {/* Action Rows */}
                <div 
                  className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setSelectedVenture(venture)}
                    className="w-full text-center bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-xl font-heading text-[11px] font-bold tracking-widest uppercase transition-all"
                  >
                    Request Info
                  </button>
                  <button
                    onClick={() => {
                      if (isOrganics) {
                        onViewHarvestPage();
                      } else {
                        onProductClick(venture.id);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green-hover text-white py-3 rounded-xl font-heading text-[11px] font-bold tracking-widest uppercase transition-all"
                  >
                    <span>{isOrganics ? 'See Harvest' : 'Shop Sector'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Inquiry Dialog Modal */}
      {selectedVenture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/85 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white text-brand-dark p-6 relative border border-brand-beige shadow-2xl animate-scale-up">
            <button
              onClick={() => setSelectedVenture(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-brand-beige/40 text-brand-charcoal cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] text-brand-gold font-heading font-bold uppercase tracking-widest">
              INQUIRY DESK
            </span>
            <h3 className="text-xl font-heading font-extrabold text-brand-green mt-1">
              {selectedVenture.name}
            </h3>
            <p className="text-xs text-brand-charcoal/60 mt-1 font-sans">
              Enter details below to connect with our regional consultants.
            </p>

            {inquirySent ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-brand-green/15 flex items-center justify-center text-brand-green mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-heading font-bold text-lg text-brand-green">Inquiry Logged</h4>
                <p className="text-xs text-brand-charcoal/70">
                  Thank you. A Sanop specialist from Volta Region will call/email you directly within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="mt-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-heading font-bold text-brand-charcoal uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    placeholder="e.g. Ama Serwaa"
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
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    placeholder="ama.serwaa@domain.com"
                    className="w-full px-4 py-3 rounded-xl border border-brand-beige bg-brand-beige-light/50 text-xs font-sans outline-hidden focus:border-brand-green"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-heading font-bold text-brand-charcoal uppercase tracking-wider mb-1">
                    Your Message
                  </label>
                  <textarea
                    rows={3}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="Tell us what you are looking to learn..."
                    className="w-full px-4 py-3 rounded-xl border border-brand-beige bg-brand-beige-light/50 text-xs font-sans outline-hidden focus:border-brand-green resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-brand-green hover:bg-brand-green-hover text-white py-3 rounded-xl font-heading text-xs font-bold uppercase tracking-wider shadow-md transition-all mt-2"
                >
                  Send Inquiry Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
