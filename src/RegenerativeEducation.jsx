import { useState } from 'react';
import { ArrowUpRight, Award, Compass, X } from 'lucide-react';
import './RegenerativeEducation.css';

import biologicalResearchImg from './assets/images/biological_research_new_1781110241540.png';
import regenerativeFarmCycleImg from './assets/images/regenerative_farm_cycle_1781110396294.png';

export default function RegenerativeEducation() {
  const [eduModalContent, setEduModalContent] = useState(null);

  const handleOpenEducation = (type) => {
    if (type === 'health') {
      setEduModalContent({
        title: 'What is Regenerative Health?',
        body: 'Regenerative Health is a dynamic living health methodology that moves beyond standard symptomatic healthcare. Instead of treating isolated pathology, it asks: What are the root cellular and agricultural deficiencies of the environment? \n\nAt Sanop Group, we treat human bodies and soil assets as integrated biological loops. By rebuilding organic carbon reserves in Ghana’s soil, we elevate crop secondary metabolites (antioxidants, trace minerals). When you ingest these living resources, your gut microbiome heals, systemic hormones adjust safely, and the cellular mechanism heals from the inside out — aligning body, soil, and spirit.'
      });
    } else {
      setEduModalContent({
        title: 'Impact, Science & Innovation',
        body: 'Our structural research goes beyond mere sustainability. Sustainability implies maintaining a state of baseline balance; regeneration means actively curing past ecological and metabolic debt.\n\nKey Innovations under deployment include:\n\n1. Bio-compost Microbe Inoculations: Replacing ammonia-heavy salts with live forest mycelium cultures that digest organic trash into clean humic minerals.\n\n2. Phyto-Cosmetic Bio-mapping: Assessing endemic West African herbs for anti-fungal and structural scalp revitalization to construct chemical-free, safe cosmetics.\n\n3. Personalized Integrative Protocols: Utilizing heat cycle saunas combined with anti-inflammatory medicinal teas to lower vascular tension clinically.'
      });
    }
  };

  return (
    <section className="bg-brand-beige border-y border-brand-beige/50">
      
      {/* SECTION 1: What is Regenerative Health */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left text */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 text-brand-gold">
            <Award className="w-5 h-5" />
            <span className="font-heading text-xs font-bold tracking-widest uppercase">From Soil to Soul</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-brand-dark tracking-tight leading-none italic">
            What is Regenerative Health?
          </h2>

          <p className="text-brand-charcoal/80 text-base leading-relaxed font-sans">
            Regenerative Health is an ecosystem of comprehensive, integrated, living-level health. Sanop brings together three interconnected ventures to create a holistic approach to wellness — from the biology of our Ghanaian soils, to the conscious products we touch, to the healing experiences that nourish our souls.
          </p>

          <button
            onClick={() => handleOpenEducation('health')}
            className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-hover text-white px-6 py-3 rounded-xl font-heading text-xs font-bold tracking-wider uppercase shadow-xs transition-colors cursor-pointer"
          >
            <span>Learn More About the Biological Cycle</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right crop image */}
        <div className="relative rounded-3xl overflow-hidden aspect-4/3 shadow-xl border-4 border-white">
          <img
            src={regenerativeFarmCycleImg}
            alt="Sanop Organics beautiful high-density edible forest garden in Volta Region"
            className="w-full h-full object-cover select-none"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4 bg-brand-gold text-white text-[10px] font-heading font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
            Sanop Organics
          </div>
        </div>

      </div>

      {/* Separator line */}
      <div className="h-px bg-brand-beige-light max-w-7xl mx-auto" />

      {/* SECTION 2: Impact & Innovation */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left graphic */}
        <div className="order-2 lg:order-1 relative rounded-3xl overflow-hidden aspect-4/3 shadow-xl border-4 border-white">
          <img
            src={biologicalResearchImg}
            alt="Biological research bench with microscope and plant metabolites"
            className="w-full h-full object-cover select-none"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 right-4 bg-brand-green text-white text-[10px] font-heading font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
            Biological Research
          </div>
        </div>

        {/* Right text layout */}
        <div className="order-1 lg:order-2 space-y-6">
          <div className="inline-flex items-center gap-2 text-brand-gold">
            <Compass className="w-5 h-5" />
            <span className="font-heading text-xs font-bold tracking-widest uppercase">ECOLOGICAL RESTORATION</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-black text-brand-dark tracking-tight leading-none italic">
            Impact & Innovation
          </h2>

          <p className="text-brand-charcoal/80 text-base leading-relaxed font-sans">
            Our approach goes beyond sustainability. It is about rebuilding the systems that sustain health for generations. From restoring soil fertility and advancing regenerative organic farming, to creating safe personal care solutions and pioneering nature-based healthcare models, we are shaping a future where nature and science work in harmony to build a healthier Africa.
          </p>

          <button
            onClick={() => handleOpenEducation('impact')}
            className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-hover text-white px-6 py-3 rounded-xl font-heading text-xs font-bold tracking-wider uppercase shadow-xs transition-colors cursor-pointer"
          >
            <span>Explore Innovation Pillars</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Detailed educational dialog */}
      {eduModalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/90 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white text-brand-dark p-8 relative border border-brand-beige shadow-3xl animate-scale-up">
            <button
              onClick={() => setEduModalContent(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-brand-beige/40 text-brand-charcoal cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] text-brand-gold font-heading font-extrabold tracking-[0.2em] uppercase">
              DEEP DIVE READ
            </span>
            <h3 className="text-2xl font-heading font-extrabold text-brand-green mt-1 leading-tight">
              {eduModalContent.title}
            </h3>

            <div className="w-full h-px bg-brand-beige my-4" />

            {/* Custom line break parse */}
            <div className="text-sm font-sans text-brand-charcoal/85 leading-relaxed space-y-4 max-h-[350px] overflow-y-auto pr-2">
              {eduModalContent.body.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-brand-beige flex justify-end">
              <button
                onClick={() => setEduModalContent(null)}
                className="bg-brand-green hover:bg-brand-green-hover text-white px-6 py-2.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
