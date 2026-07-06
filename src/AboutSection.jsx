import { useState } from 'react';
import { ShieldCheck, HeartPulse, Sparkles, ChevronRight, Sprout, Award, BookOpen, Quote, X, Leaf } from 'lucide-react';
import './AboutSection.css';

import kingsleyImg from './assets/images/kingsley_portrait_new_1781109728479.png';
import evelynImg from './assets/images/evelyn_portrait_new_1781109820075.png';
import kojoImg from './assets/images/kosua_portrait_new_1781109960403.png';
import ghanaianOrganicCropsImg from './assets/images/ghanaian_organic_crops_1781110412414.png';

const FOUNDERS = [
  {
    id: 'kingsley',
    name: 'Dr. Kingsley Sanop',
    role: 'Founder & Chief Visionary Officer',
    title: 'Pioneer of African Integrative Bio-medicine',
    education: 'MD, PhD in Integrative Cellular Biology',
    image: kingsleyImg,
    bio: 'Dr. Kingsley spent over fifteen years researching molecular cell path-chemistry in Europe and North America before returning to Ghana to establish Sanop Group. Witnessing the rising epidemic of metabolic system failures across Africa, his life-work became dedicated to rebuilding preventative health pathways. Driven by the philosophy that medicine is only as rich as the topsoil that feeds our bodies, he coordinates Sanop\'s research on native flora and regenerative cellular repair.',
    philosophy: 'We cannot treat disease on an individual level if the food, skin topicals, and living habitats we interact with daily are chemically corrupted. True healing requires systemic restoration — soil to soul.',
    credentials: [
      'Doctor of Medicine (MD) — Specialized in Endocrine Pathology',
      'PhD in Biochemical Cell Health & Plant Metabolites',
      'Advocate & Author on African Traditional Medicine Standardisation',
      'Ex-Consultant for Regional Wellness Alliances'
    ]
  },
  {
    id: 'evelyn',
    name: 'Evelyn Serwaa Sanop',
    role: 'Co-Founder & Director of Conscious Beauty',
    title: 'Natural Product Organic Chemist',
    education: 'MSc in Cosmetic Science & Green Chemistry',
    image: kojoImg,
    bio: 'Evelyn leads the scientific research and paraben-free formulation of Sanop Beauty. Believing that what you feed your dermal microbiome is directly absorbed into your blood streams, she spearheads the sourcing of wildcrafted botanical lipids. By training cooperative groups of women farmers in the Volta Region to ethically extract raw cold-pressed shea and neem, she ensures she matches luxury aesthetic quality with flawless hormonal safety indices.',
    philosophy: 'The cellular integrity of your hair and skin is an outer reflection of your internal hormonal rhythm. Our formulations work in absolute harmony with your cells, never against them.',
    credentials: [
      'Master of Sci. (MSc) in Botanical Extraction and Preservation',
      'Certified Dermal Biochemist & Hair Care Formulation Specialist',
      'Architect of Sanop’s 100% Bio-Active Shea and Seed Serum Lines',
      'Lead mentor of Ghana’s Women Butter Sourcing Cooperatives'
    ]
  },
  {
    id: 'kojo',
    name: 'Kojo Mensah Sanop',
    role: 'Co-Founder & Head of Regenerative Farming',
    title: 'Master Soil Microbiome Specialist & Agronomist',
    education: 'BSc in Agronomy & Certified Permaculture Designer',
    image: evelynImg,
    bio: 'Kojo is the soil wizard of the Sanop Volta lands. Frustrated by the toxic industrial chemical models that strip soils of standard mycorrhizae fungi, he designed Sanop\'s custom living carbon compost grids. Overseeing a polyculture framework of Cavendish bananas, rich seedless watermelon, and root tubers, Kojo connects traditional Ghanaian forest gardening with precision bio-yields.',
    philosophy: 'Feed the soil microbes first, and they will feed the plant. Feed the plant fully, and the human eating it becomes organically immunised against disease.',
    credentials: [
      'Award-winning West African Agroforestry Pioneer (2024)',
      'Designer of living carbon compost system near Lake Volta delta',
      'Leader of over 150 local smallholder farmers in community cooperatives',
      'Specialist in polyculture crop-pairing layout configurations'
    ]
  }
];

export default function AboutSection() {
  const [selectedFounder, setSelectedFounder] = useState(null);

  return (
    <section id="about" className="py-24 md:py-32 bg-brand-beige-light relative overflow-hidden">
      {/* Decorative organic layout shapes */}
      <div className="absolute top-10 right-0 w-96 h-96 bg-brand-green/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-72 h-72 bg-brand-gold/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-24">
        
        {/* Title Banner & Who We Are */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <span className="text-brand-gold font-heading text-xs font-black tracking-[0.2em] uppercase">
            WHO WE ARE
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-black text-brand-dark tracking-tight leading-none italic">
            Our Story & Vision
          </h2>
          <p className="text-brand-charcoal/70 text-sm md:text-base font-sans max-w-2xl mx-auto leading-relaxed">
            Discover how Sanop was created out of a need to challenge modern lifestyle ailments and return to sustainable health ecosystems.
          </p>
          <div className="w-16 h-1 bg-brand-green mx-auto rounded-full mt-4" />
          
          <div className="pt-8 text-left md:text-center text-brand-charcoal/90 font-sans text-base md:text-lg leading-relaxed max-w-4xl mx-auto bg-white/45 border border-brand-beige p-6 md:p-8 rounded-3xl">
            <p className="font-medium text-brand-green-hover">
              Sanop Group of Companies Ltd is a Ghana-based holding company building a regenerative health ecosystem designed to restore human and environmental health.
            </p>
            <p className="mt-4 text-sm md:text-base text-brand-charcoal/80">
              Through regenerative food systems, safe personal care solutions, and regenerative healthcare and living environments, we are creating a unified approach to prevention, wellbeing, and long-term health.
            </p>
          </div>
        </div>

        {/* Our Vision and Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision card */}
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-brand-beige shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-green" />
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-heading font-black text-brand-dark tracking-tight">
                Vision
              </h3>
              <p className="text-brand-charcoal/85 font-sans text-sm md:text-base leading-relaxed">
                To build a healthier Africa where the environment, nutrition, and lifestyle are the primary forms of medicine.
              </p>
            </div>
            <span className="text-[10px] text-brand-gold font-mono font-bold uppercase tracking-widest mt-8">
              Unified Healing Goal
            </span>
          </div>

          {/* Mission card */}
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-brand-beige shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-gold" />
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-heading font-black text-brand-dark tracking-tight">
                Mission
              </h3>
              <p className="text-brand-charcoal/85 font-sans text-sm md:text-base leading-relaxed">
                To design and operate an integrated ecosystem that eliminates exposure to toxins and chronic stress by providing regenerative food systems, safe personal care solutions, and nature-based healing and healthcare communities.
              </p>
            </div>
            <span className="text-[10px] text-brand-green font-mono font-bold uppercase tracking-widest mt-8">
              Ecosystem Deliverables
            </span>
          </div>
        </div>

        {/* Our Story Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white border border-brand-beige p-8 md:p-12 rounded-3xl shadow-xs">
          {/* Story textual */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-brand-gold font-heading text-xs font-black tracking-widest uppercase">
              OUR JOURNEY
            </span>
            <h3 className="text-2xl md:text-3xl font-heading font-black text-brand-green leading-tight tracking-tight">
              Born from a Vision of True Wellness
            </h3>
            
            <div className="space-y-4 font-sans text-brand-charcoal/85 text-sm md:text-base leading-relaxed">
              <p>
                Sanop was founded by a biomedical scientist who recognized that chronic illness is rarely addressed without reconstructing the basic building blocks of human life: our nutrition, physical applications, and biological environments.
              </p>
              <p>
                To heal the body, we must first heal the soil. This inspired the framework for <strong className="text-brand-dark">Sanop Organic Harvest</strong>. We then addressed self-care with <strong className="text-brand-dark">Sanop Beauty</strong>, and finalized the process with holistic clinical frameworks inside <strong className="text-brand-dark">Sanop Regenerative Living</strong>.
              </p>
              <p className="italic text-brand-green-hover font-medium">
                We believe that standard medicine is powerful, but sustainable health requires natural synergy.
              </p>
            </div>
          </div>

          {/* Story graphics representation */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="relative rounded-2xl overflow-hidden aspect-4/3 shadow-md border-4 border-brand-beige-light">
              <img
                src={ghanaianOrganicCropsImg}
                alt="Ghanaian organic cacao pods and forest garden crops"
                className="w-full h-full object-cover select-none"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/30 to-transparent" />
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="space-y-12">
          <div className="text-center md:max-w-xl mx-auto space-y-2">
            <span className="text-brand-green font-heading text-xs font-black tracking-widest uppercase">
              FOUNDATION PILLARS
            </span>
            <h3 className="text-2xl sm:text-3.5xl font-heading font-extrabold text-brand-dark tracking-tight">
              Core Values
            </h3>
            <p className="text-brand-charcoal/70 text-xs sm:text-sm">
              The ethical and biological codes driving our everyday execution across Volta.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 md:p-8 bg-white/60 border border-brand-beige hover:border-brand-green/20 rounded-2xl transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green mb-4">
                <Sprout className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-black text-sm text-brand-dark uppercase tracking-wider mb-2">Soil-First Priority</h4>
              <p className="text-brand-charcoal/80 text-xs font-sans leading-relaxed">
                By restoring native mycelium matrix and deep soil biology, we cure chronic nutrition challenges at the source.
              </p>
            </div>

            <div className="p-6 md:p-8 bg-white/60 border border-brand-beige hover:border-brand-green/20 rounded-2xl transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-black text-sm text-brand-dark uppercase tracking-wider mb-2">Hormonal Safety</h4>
              <p className="text-brand-charcoal/80 text-xs font-sans leading-relaxed">
                Eliminating industrial parabens, chemical sulfates, and artificial fragrances across every personal product we compile.
              </p>
            </div>

            <div className="p-6 md:p-8 bg-white/60 border border-brand-beige hover:border-brand-green/20 rounded-2xl transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green mb-4">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-black text-sm text-brand-dark uppercase tracking-wider mb-2">Systemic Wellness</h4>
              <p className="text-brand-charcoal/80 text-xs font-sans leading-relaxed">
                Connecting agriculture, medicine, skincare, and luxury lifestyle retreats under one coordinated biological care loop.
              </p>
            </div>

            <div className="p-6 md:p-8 bg-white/60 border border-brand-beige hover:border-brand-green/20 rounded-2xl transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-black text-sm text-brand-dark uppercase tracking-wider mb-2">Local Sourcing</h4>
              <p className="text-brand-charcoal/80 text-xs font-sans leading-relaxed">
                Empowering smallholder organic cooperative farmers and wild shea pickers across the beautiful Volta Region.
              </p>
            </div>
          </div>
        </div>

        {/* Meet Our Founders Grid (Leadership) */}
        <div className="pt-16 border-t border-brand-beige">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-gold font-heading text-xs font-bold tracking-[0.2em] uppercase">
              THE SOUL & SCIENCE
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-brand-dark mt-2 tracking-tight italic">
              Leadership
            </h2>
            <p className="text-brand-charcoal/70 text-xs sm:text-sm mt-2 max-w-lg mx-auto">
              Bridging certified biological research, natural organic chemistry, and ancestral agriculture to protect human longevity.
            </p>
            <div className="w-12 h-[3px] bg-brand-gold mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FOUNDERS.map((founder) => (
              <div 
                key={founder.id}
                id={`founder-card-${founder.id}`}
                className="bg-white rounded-3xl border border-brand-beige shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                {/* Founder Image Portrait with beautiful aspect */}
                <div className="aspect-square w-full relative overflow-hidden bg-brand-beige/20">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/50 via-transparent to-transparent opacity-65" />
                  
                  {/* Small academic seal badge over the image */}
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs rounded-xl px-2.5 py-1 flex items-center gap-1 border border-brand-beige/50">
                    <BookOpen className="w-3 h-3 text-brand-gold" />
                    <span className="text-[9px] font-mono font-bold text-brand-charcoal uppercase tracking-wider">{founder.education}</span>
                  </div>
                </div>

                {/* Founder brief description */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-brand-gold font-mono font-bold uppercase tracking-wider">
                      {founder.role}
                    </span>
                    <h3 className="text-xl font-heading font-black text-brand-green mt-1 tracking-tight">
                      {founder.name}
                    </h3>
                    <p className="text-brand-charcoal/50 text-[10px] font-mono leading-none mt-1.5 mb-4">
                      {founder.title}
                    </p>
                    <p className="text-brand-charcoal/80 text-xs leading-relaxed font-sans line-clamp-3">
                      {founder.bio}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-brand-beige/50">
                    <button
                      onClick={() => setSelectedFounder(founder)}
                      className="w-full py-3 bg-brand-green hover:bg-brand-green-hover text-white rounded-xl text-[10px] font-heading font-bold uppercase tracking-widest transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Read Bio & Philosophy</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Pop-up Interactive Biography Modal for Founders */}
      {selectedFounder && (
        <div 
          id="founder-bio-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-brand-dark/70 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
          onClick={() => setSelectedFounder(null)}
        >
          <div 
            className="w-full max-w-3xl bg-brand-beige-light rounded-3xl border border-brand-beige overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col sm:flex-row animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left side: big high-res image representing their sector */}
            <div className="w-full sm:w-2/5 h-64 sm:h-auto min-h-[250px] relative">
              <img
                src={selectedFounder.image}
                alt={selectedFounder.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-brand-dark/20 to-transparent" />
              
              <div className="absolute bottom-6 left-6 text-white text-left z-10 hidden sm:block">
                <span className="text-[10px] bg-brand-gold/95 backdrop-blur-xs text-brand-dark font-mono font-black uppercase tracking-wider px-2.5 py-1 rounded-md">
                  VOLTA SECTOR LEAD
                </span>
              </div>
            </div>

            {/* Right side: Biography metadata scrolling contents */}
            <div className="w-full sm:w-3/5 p-6 sm:p-10 overflow-y-auto max-h-[60vh] sm:max-h-[85vh] flex flex-col justify-between">
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedFounder(null)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/90 hover:bg-white text-brand-dark border border-brand-beige shadow-xs transition-colors cursor-pointer z-20"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4 text-brand-charcoal" />
              </button>

              <div className="space-y-6">
                <div>
                  <span className="text-[10px] text-brand-gold font-mono font-extrabold uppercase tracking-widest">{selectedFounder.role}</span>
                  <h3 className="text-2xl sm:text-3xl font-heading font-black text-brand-green mt-1 leading-none tracking-tight">
                    {selectedFounder.name}
                  </h3>
                  <p className="text-[11px] text-brand-charcoal/60 font-mono mt-1.5 italic">
                    {selectedFounder.education} • {selectedFounder.title}
                  </p>
                </div>

                {/* Main bio narrative styling */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#a87b50] border-b border-brand-beige pb-1">
                    BIOGRAPHY & BACKGROUND
                  </h4>
                  <p className="text-brand-charcoal/90 text-xs sm:text-sm leading-relaxed font-sans whitespace-pre-line">
                    {selectedFounder.bio}
                  </p>
                </div>

                {/* Professional science/agriculture accomplishments */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-brand-green border-b border-brand-beige pb-1">
                    CERTIFIED CREDENTIALS
                  </h4>
                  <ul className="space-y-2">
                    {selectedFounder.credentials.map((cred, idx) => (
                      <li key={idx} className="flex gap-2 items-start text-xs text-brand-charcoal">
                        <Award className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                        <span className="font-sans leading-normal">{cred}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Founder quote philosophy statement */}
                <div className="bg-white border border-brand-beige rounded-2xl p-4 sm:p-5 relative overflow-hidden">
                  <Quote className="absolute -right-2 -bottom-2 w-20 h-20 text-brand-beige opacity-25 -rotate-12 pointer-events-none" />
                  <div className="flex gap-1 items-center text-brand-gold text-[10px] font-heading font-bold uppercase tracking-widest mb-1.5">
                    <HeartPulse className="w-3.5 h-3.5" />
                    <span>Personal Health Creed</span>
                  </div>
                  <p className="text-xs text-brand-charcoal/90 leading-relaxed font-sans italic relative z-10">
                    "{selectedFounder.philosophy}"
                  </p>
                </div>
              </div>

              {/* Close bio block button */}
              <div className="pt-6 mt-6 border-t border-brand-beige">
                <button
                  onClick={() => setSelectedFounder(null)}
                  className="w-full py-3 bg-brand-charcoal hover:bg-brand-dark/95 text-white rounded-xl text-xs font-heading font-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Return to Ecosystem
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </section>
  );
}
