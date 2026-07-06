import { useState } from 'react';
import { Search, ShoppingBag, Plus, Star, Eye, CheckCircle } from 'lucide-react';
import { PRODUCTS } from './data.js';
import './ShopSection.css';

export default function ShopSection({
  onAddToCart,
  selectedCategory,
  setSelectedCategory
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuickView, setActiveQuickView] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const filterTabs = [
    { label: 'All Ecosystem Products', value: 'all' },
    { label: 'Organic Harvest', value: 'organics' },
    { label: 'Conscious Beauty', value: 'beauty' },
    { label: 'Regenerative Living', value: 'living' }
  ];

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleQuickAdd = (product) => {
    onAddToCart(product, 1);
    setToastMessage(`Added ${product.name} to your biological shopping bag!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <section id="shop" className="py-24 bg-brand-beige-light relative scroll-mt-20">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-brand-green border border-white/20 text-white font-sans text-xs font-semibold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-brand-gold" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Title row */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-brand-gold font-heading text-xs font-black tracking-widest uppercase">
            SANOP ONLINE STORE
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-black text-brand-dark tracking-tight leading-none italic">
            Ecosystem Herbary & Store
          </h2>
          <div className="w-12 h-1 bg-brand-gold mx-auto" />
          <p className="text-brand-charcoal/70 text-sm font-sans leading-relaxed">
            Purchase unrefined bio-active ingredients, organic superfoods, skin therapeutic products, and restorative diagnostic consultations directly from Ho, Volta Region.
          </p>
        </div>

        {/* Filter and Search Actions layout */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-brand-beige pb-6">
          
          {/* Categories Tab selector */}
          <div className="flex flex-wrap gap-2.5">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedCategory(tab.value)}
                className={`px-4 py-2.5 rounded-full font-heading text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  selectedCategory === tab.value
                    ? 'bg-brand-green text-white shadow-sm'
                    : 'bg-white border border-brand-beige hover:border-brand-green/30 text-brand-charcoal'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Clean Inner Search bar */}
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product range..."
              className="w-full text-xs font-sans pl-10 pr-4 py-3 rounded-xl border border-brand-beige bg-white outline-hidden focus:border-brand-green"
            />
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-charcoal/40" />
          </div>

        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group rounded-2xl bg-white border border-brand-beige p-5 hover:border-brand-gold/30 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  
                  {/* Decorative Thumbnail container */}
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-brand-beige-light mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 select-none"
                      referrerPolicy="no-referrer"
                    />

                    {/* Left category tab indicator */}
                    <span className="absolute top-2.5 left-2.5 bg-white/95 text-brand-green text-[9px] font-heading font-black tracking-wider px-2.5 py-1 rounded-full uppercase shadow-xs">
                      {product.category}
                    </span>

                    {/* Action hovering icons */}
                    <div className="absolute inset-0 bg-brand-dark/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                      <button
                        onClick={() => setActiveQuickView(product)}
                        className="bg-white hover:bg-brand-gold hover:text-white p-2.5 rounded-full text-brand-charcoal shadow-md transition-all cursor-pointer"
                        title="Quick View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleQuickAdd(product)}
                        className="bg-brand-green hover:bg-brand-green-hover text-white p-2.5 rounded-full shadow-md transition-all cursor-pointer"
                        title="Add to Shopping Bag"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Rating indicator */}
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 fill-brand-gold text-brand-gold" />
                    <span className="text-[10px] font-mono text-brand-charcoal/50">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-sm text-brand-dark mb-1 tracking-tight group-hover:text-brand-green transition-colors line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="text-brand-charcoal/60 text-xs font-sans line-clamp-2 leading-relaxed mb-4">
                    {product.description}
                  </p>
                </div>

                {/* Price and Add button section */}
                <div className="pt-3 border-t border-brand-beige/40 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono text-brand-charcoal/40 uppercase tracking-widest">
                      Price
                    </span>
                    <span className="text-brand-green font-heading font-extrabold text-base">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleQuickAdd(product)}
                    className="flex items-center gap-1.5 bg-brand-beige/70 hover:bg-brand-green hover:text-white text-brand-green text-[10px] font-heading font-extrabold tracking-widest uppercase px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>Quick Add</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-brand-beige space-y-3">
            <div className="w-12 h-12 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold mx-auto">
              <Plus className="w-6 h-6 rotate-45" />
            </div>
            <h4 className="font-heading font-bold text-base text-brand-dark">No Products Found</h4>
            <p className="text-xs text-brand-charcoal/50 max-w-xs mx-auto">
              No biological assets matched your search inputs. Try filtering another category or clearing your queries.
            </p>
          </div>
        )}

      </div>

      {/* Quick View Dialog Modal */}
      {activeQuickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/90 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white overflow-hidden text-brand-dark shadow-3xl relative animate-scale-up border border-brand-beige max-h-[90vh] flex flex-col md:flex-row">
            
            {/* Visual media gallery */}
            <div className="w-full md:w-1/2 aspect-square md:aspect-auto relative bg-brand-beige-light">
              <img
                src={activeQuickView.image}
                alt={activeQuickView.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-4 left-4 bg-brand-green text-white text-[10px] font-heading font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {activeQuickView.category}
              </span>
            </div>

            {/* Content info panels */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                {/* Close Button */}
                <button
                  onClick={() => setActiveQuickView(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-brand-beige/40 text-brand-charcoal cursor-pointer"
                  aria-label="Close details"
                >
                  <Plus className="w-5 h-5 rotate-45" />
                </button>

                <span className="text-[10px] text-brand-gold font-heading font-bold tracking-widest uppercase">
                  BIOLOGICAL SPECIFICATIONS
                </span>
                <h3 className="text-xl font-heading font-extrabold text-brand-green mt-1 tracking-tight leading-tight">
                  {activeQuickView.name}
                </h3>

                <div className="flex items-center gap-2 mt-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-3.5 h-3.5 ${
                          idx < Math.floor(activeQuickView.rating)
                            ? 'fill-brand-gold text-brand-gold'
                            : 'text-brand-charcoal/20'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono text-brand-charcoal/50 font-bold">
                    {activeQuickView.rating.toFixed(1)} / 5.0
                  </span>
                </div>

                <p className="text-brand-charcoal/80 text-xs sm:text-sm font-sans leading-relaxed mb-6">
                  {activeQuickView.description}
                </p>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-brand-beige">
                  <div>
                    <span className="block text-[9px] font-mono text-brand-charcoal/45 uppercase tracking-widest">
                      Resource Stock
                    </span>
                    <span className="text-xs font-bold text-brand-charcoal">
                      {activeQuickView.stock} Units Available
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-brand-charcoal/45 uppercase tracking-widest">
                      Regional Source
                    </span>
                    <span className="text-xs font-bold text-brand-charcoal flex items-center gap-1">
                      🌱 Volta Region, Ghana
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Rows */}
              <div className="pt-6 flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-heading font-bold text-brand-charcoal/45 uppercase">Total price</span>
                  <span className="text-2xl font-heading font-extrabold text-brand-green">
                    ${activeQuickView.price.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    handleQuickAdd(activeQuickView);
                    setActiveQuickView(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green-hover text-white py-3.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add To Bag</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
}
