import { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, CheckCircle } from 'lucide-react';
import './ContactSection.css';

export default function ContactSection() {
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const [activeFaq, setActiveFaq] = useState(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMessage) return;
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setFormName('');
      setFormEmail('');
      setFormSubject('');
      setFormMessage('');
    }, 3500);
  };

  return (
    <section id="contact" className="py-24 bg-brand-beige border-t border-brand-beige/50 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Title Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Column 1: Coords */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-black text-brand-dark tracking-tight italic">
                Get in Touch
              </h2>
            </div>

            {/* Address Coords */}
            <div className="space-y-6">
              
              <a
                href="mailto:info@sanopgroup.com"
                className="flex items-start gap-4 p-4 rounded-xl bg-white/60 hover:bg-white border border-brand-beige transition-all group"
              >
                <div className="p-3 bg-brand-green/10 text-brand-green rounded-xl group-hover:bg-brand-green group-hover:text-white transition-colors duration-300">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading text-xs font-bold text-brand-charcoal/50 uppercase tracking-widest">
                    Email address
                  </h4>
                  <p className="text-sm font-medium text-brand-dark hover:text-brand-green mt-1">
                    info@sanopgroup.com
                  </p>
                </div>
              </a>

              <a
                href="tel:+233206053309"
                className="flex items-start gap-4 p-4 rounded-xl bg-white/60 hover:bg-white border border-brand-beige transition-all group"
              >
                <div className="p-3 bg-brand-green/10 text-brand-green rounded-xl group-hover:bg-brand-green group-hover:text-white transition-colors duration-300">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading text-xs font-bold text-brand-charcoal/50 uppercase tracking-widest">
                    Direct Phone call
                  </h4>
                  <p className="text-sm font-medium text-brand-dark hover:text-brand-green mt-1">
                    +233 (020) 605 3309
                  </p>
                </div>
              </a>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/60 border border-brand-beige">
                <div className="p-3 bg-brand-green/10 text-brand-green rounded-xl">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading text-xs font-bold text-brand-charcoal/50 uppercase tracking-widest">
                    Physical Location
                  </h4>
                  <p className="text-sm font-medium text-brand-dark mt-1">
                    Ho, Volta Region, Ghana.
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Column 2: Beautiful styled email submission form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-brand-beige p-8 shadow-xl">
            
            <h3 className="font-heading font-extrabold text-2xl text-brand-green tracking-tight mb-8">
              Send us a direct message
            </h3>

            {success ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-heading font-bold text-lg text-brand-green">Message Transmitted</h4>
                <p className="text-xs text-brand-charcoal/60 max-w-sm mx-auto">
                  Thank you! Your message has been successfully received by our administrative desks in Ho.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-heading font-bold text-brand-charcoal uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Sandra Bonsu"
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
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="sandra.bonsu@gmail.com"
                      className="w-full px-4 py-3 rounded-xl border border-brand-beige bg-brand-beige-light/50 text-xs font-sans outline-hidden focus:border-brand-green"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-heading font-bold text-brand-charcoal uppercase tracking-wider mb-1">
                    Your Message
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="Write your comments in details..."
                    className="w-full px-4 py-3 rounded-xl border border-brand-beige bg-brand-beige-light/50 text-xs font-sans outline-hidden focus:border-brand-green resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green-hover text-white px-8 py-3.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <span>Send Message</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
