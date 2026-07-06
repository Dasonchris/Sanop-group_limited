import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { HERO_SLIDES } from './data.js';
import './HeroSlider.css';

export default function HeroSlider({ onExploreClick }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <div id="home" className="relative h-[90vh] min-h-[600px] overflow-hidden bg-brand-dark pt-16">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 scale-105"
            style={{
              backgroundImage: `url(${HERO_SLIDES[current].image})`,
            }}
          />

          {/* Clean ambient dark overlay supporting text visibility */}
          <div className="absolute inset-0 bg-linear-to-r from-brand-dark/95 via-brand-dark/75 to-transparent" />

          {/* Hero Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full px-6 md:px-12 xl:px-20">
              <div className="max-w-3xl space-y-6">
                
                {/* Micro badge/subtitle */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-flex items-center gap-2 bg-brand-gold/20 border border-brand-gold/40 text-brand-gold px-4 py-1 rounded-full text-xs font-heading font-extrabold tracking-widest uppercase"
                >
                  <Compass className="w-3.5 h-3.5" />
                  {HERO_SLIDES[current].subTitle}
                </motion.div>

                {/* Animated Heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white tracking-tight leading-tight italic"
                >
                  {HERO_SLIDES[current].title}
                </motion.h1>

                {/* Animated Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-white/80 max-w-xl text-base sm:text-lg leading-relaxed font-sans"
                >
                  {HERO_SLIDES[current].description}
                </motion.p>

                {/* Animated CTA */}
                {HERO_SLIDES[current].ctaText && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="pt-4"
                  >
                    <button
                      onClick={() => {
                        const target = current === 0 ? 'ecosystem' : current === 1 ? 'ecosystem-organics' : 'ecosystem-living';
                        onExploreClick(target);
                      }}
                      className="group flex items-center gap-3 bg-brand-green hover:bg-brand-green-hover text-white px-8 py-4 rounded-xl font-heading text-xs font-bold tracking-widest uppercase shadow-md transition-all duration-300"
                    >
                      <span>{HERO_SLIDES[current].ctaText}</span>
                      <span className="w-2 h-2 rounded-full bg-brand-gold group-hover:scale-150 transition-transform duration-300" />
                    </button>
                  </motion.div>
                )}

              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Control Navigation Elements */}
      <div className="absolute bottom-8 right-6 md:right-12 xl:right-20 flex items-center space-x-4 z-20">
        <button
          onClick={handlePrev}
          className="p-3 rounded-full border border-white/20 bg-brand-dark/25 text-white/80 hover:bg-brand-gold hover:text-white transition-all cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="p-3 rounded-full border border-white/20 bg-brand-dark/25 text-white/80 hover:bg-brand-gold hover:text-white transition-all cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Line Progress Indicator and Slide Counters */}
      <div className="absolute bottom-10 left-6 md:left-12 xl:left-20 flex items-center space-x-6 z-20">
        <div className="flex space-x-2">
          {HERO_SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                current === i ? 'w-10 bg-brand-gold' : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <span className="text-white/45 font-mono text-xs font-semibold">
          0{current + 1} <span className="text-white/20">/</span> 0{HERO_SLIDES.length}
        </span>
      </div>
    </div>
  );
}
