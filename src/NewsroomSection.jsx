import { useState } from 'react';
import { Calendar, User, X, BookOpen } from 'lucide-react';
import { ARTICLES } from './data.js';
import './NewsroomSection.css';

export default function NewsroomSection() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <section id="news" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* News Heading Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-serif font-black text-brand-dark tracking-tight mt-1 italic">
              Featured News & Updates
            </h2>
          </div>
          <p className="text-brand-charcoal/60 text-sm max-w-sm mt-3 md:mt-0 font-sans leading-relaxed">
            Latest announcements and community initiatives.
          </p>
        </div>

        {/* Carousel / Infinite Scroll Track style */}
        <div className="relative overflow-hidden py-4 -mx-6 px-6">
          <div className="flex gap-8 overflow-x-auto no-scrollbar newsroom-carousel-track scroll-smooth snap-x snap-mandatory pb-6">
            {ARTICLES.map((article) => (
              <article
                key={article.id}
                className="news-card-wrapper snap-start shrink-0 w-[300px] sm:w-[380px] rounded-2xl bg-brand-beige-light border border-brand-beige overflow-hidden hover:border-brand-gold/40 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Image layout */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 select-none"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 bg-brand-green text-white text-[9px] font-heading font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {article.category}
                  </span>
                </div>

                {/* Content Block */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Meta info info */}
                    <div className="flex items-center gap-4 text-brand-charcoal/50 font-sans text-[11px] mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {article.author}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-base sm:text-lg text-brand-dark mb-2 tracking-tight group-hover:text-brand-green transition-colors leading-snug">
                      {article.title}
                    </h3>

                    <p className="text-brand-charcoal/70 text-xs sm:text-sm font-sans leading-relaxed mb-4">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-brand-beige/50 flex justify-between items-center">
                    <button
                      onClick={() => setSelectedArticle(article)}
                      className="inline-flex items-center gap-2 text-brand-green hover:text-brand-gold font-heading text-xs font-extrabold tracking-wider uppercase transition-colors speed-300 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Read Entire Piece
                    </button>
                    <span className="text-brand-charcoal/40 font-mono text-[10px]">
                      0{article.id.split('-')[1]}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Prompt warning indicators for scroll */}
          <div className="flex justify-center items-center gap-2 mt-4 text-brand-charcoal/40 text-[11px] font-sans">
            <span>Swipe / Scroll horizontally to see references</span>
            <div className="w-24 h-[1px] bg-brand-beige" />
          </div>
        </div>

      </div>

      {/* Article Detail Overlay */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/95 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white text-brand-dark overflow-hidden relative shadow-3xl max-h-[90vh] flex flex-col animate-scale-up border border-brand-beige">
            
            {/* Upper banner section */}
            <div className="relative h-64 sm:h-80 shrink-0">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full shadow-lg transition-colors cursor-pointer"
                aria-label="Close article"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="bg-brand-gold font-heading text-[10px] font-extrabold tracking-widest px-3 py-1 rounded-full uppercase">
                  {selectedArticle.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight leading-tight pt-1">
                  {selectedArticle.title}
                </h3>
                <div className="flex items-center gap-4 text-white/70 font-sans text-xs pt-1">
                  <span>{selectedArticle.date}</span>
                  <span>•</span>
                  <span>By {selectedArticle.author}</span>
                </div>
              </div>
            </div>

            {/* Scrolling formatted main content */}
            <div className="p-6 sm:p-8 overflow-y-auto font-sans text-sm sm:text-base text-brand-charcoal/85 leading-relaxed space-y-4">
              {selectedArticle.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Bottom Actions footer bar */}
            <div className="p-4 sm:px-8 border-t border-brand-beige bg-brand-beige-light/50 flex justify-between items-center shrink-0">
              <span className="text-xs text-brand-charcoal/50 font-medium">
                Sanop Bio-Journalism
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="bg-brand-green hover:bg-brand-green-hover text-white px-6 py-2.5 rounded-xl font-heading text-xs font-bold uppercase tracking-widest"
              >
                Finished Reading
              </button>
            </div>
            
          </div>
        </div>
      )}
    </section>
  );
}
