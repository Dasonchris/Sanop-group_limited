import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQSection() {
  const [activeIdx, setActiveIdx] = useState(null);

  const faqs = [
    {
      q: 'Where is Sanop Group located in Ghana?',
      a: 'Our primary offices, organic harvest farms, and living spaces are centered in Ho, Volta Region, enjoying rich pristine topsoils and absolute forest privacy.'
    },
    {
      q: 'What makes Sanop Beauty products endocrine safe?',
      a: 'Every bar and serum is formulated from cold-pressed butter matrices without heat pasteurization. We strictly prohibit methylparabens, sulfates, and synthesized perfumes.'
    },
    {
      q: 'How to register for the Integrative Diagnostics?',
      a: 'Simply tap "Book Diagnostics" in our header to open our custom diagnostics form, or submit your name via the Volta Regional inquiry desk here in our portal.'
    }
  ];

  return (
    <section id="faq" className="py-24 bg-brand-beige border-y border-brand-beige/50 relative overflow-hidden">
      {/* Visual accents */}
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-brand-gold/5 rounded-full filter blur-2xl pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center space-y-3 mb-16">
          <span className="text-brand-gold font-heading text-xs font-black tracking-widest uppercase">
            COMMON INQUIRIES
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-black text-brand-dark tracking-tight italic">
            Frequently Asked Questions
          </h2>
          <p className="text-brand-charcoal/70 text-sm font-sans max-w-lg mx-auto leading-relaxed">
            Find simple, biological answers regarding our regional assets, therapeutic parameters, and ecological products.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeIdx === idx;
            return (
              <div 
                key={idx} 
                className={`bg-white border rounded-2xl overflow-hidden shadow-xs transition-all duration-300 ${
                  isOpen ? 'border-brand-green/30 ring-1 ring-brand-green/10' : 'border-brand-beige hover:border-brand-green/20'
                }`}
              >
                <button
                  onClick={() => setActiveIdx(isOpen ? null : idx)}
                  className="w-full text-left p-6 font-heading font-extrabold text-brand-dark flex justify-between items-center gap-4 hover:bg-brand-beige-light/35 transition-colors cursor-pointer"
                >
                  <span className="text-sm md:text-base tracking-tight">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full border border-brand-beige flex items-center justify-center shrink-0 text-brand-gold transition-transform duration-300 ${isOpen ? 'rotate-180 bg-brand-green/5 text-brand-green' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-40 border-t border-brand-beige/30' : 'max-h-0'
                  }`}
                >
                  <div className="p-6 font-sans text-brand-charcoal/80 text-sm leading-relaxed bg-brand-beige-light/10">
                    {faq.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
