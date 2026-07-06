import { motion } from 'motion/react';
import { ArrowLeft, ShoppingBag, Sprout, Heart, Star, Leaf } from 'lucide-react';
import './OrganicHarvestPage.css';

// Custom harvest products list
const HARVEST_ITEMS = [
  {
    id: 'harvest-banana',
    name: 'Sweet Cavendish Bananas',
    scientificName: 'Musa acuminata',
    category: 'organics',
    description: 'Pesticide-free, thick-skinned bananas rich in vital minerals. Sourced directly from our regenerative polyculture soils near Volta Lake.',
    longBenefits: 'Naturally high in potassium, complex prebiotic starches, and vitamin B6 to revitalize neurological pathways and build stomach-lining integrity.',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&q=80&w=600',
    origin: 'Anfoega Farms, Volta Region',
    soilMethod: 'Living Carbon Compost & Legumer Intercropping',
    season: 'Year-Round Harvest',
    rating: 4.9,
    stock: 250
  },
  {
    id: 'harvest-watermelon',
    name: 'Volta Red Seedless Watermelon',
    scientificName: 'Citrullus lanatus',
    category: 'organics',
    description: 'Incredibly hydrating, sun-bathed sweet watermelon with premium natural lycopene counts.',
    longBenefits: 'Offers supercharged hydration with rich L-citrulline and lycopene molecules, optimizing cardiovascular pressure and oxygen flow inside active muscle cells.',
    price: 5.49,
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89134292?auto=format&fit=crop&q=80&w=600',
    origin: 'Kpando Delta Soils, Volta Region',
    soilMethod: 'Polyculture Cover-Cropping & Bee Cross-Pollination',
    season: 'June - September Peak',
    rating: 4.8,
    stock: 120
  },
  {
    id: 'harvest-papaya',
    name: 'Sun-Ripened Solo Papaya',
    scientificName: 'Carica papaya',
    category: 'organics',
    description: 'Enzyme-rich orange papaya with an exceptionally sweet flesh and delicate skin, fully ripened on the tree.',
    longBenefits: 'Brimming with raw papain and chymopapain digestive enzymes which aid protein breakdown, protect the digestive tract, and soothe systemic irritation.',
    price: 4.25,
    image: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&q=80&w=600',
    origin: 'Logba Botanical Station, Volta Region',
    soilMethod: 'Mycorrhizal Soil Biomass Injection',
    season: 'Year-Round Peak',
    rating: 4.9,
    stock: 85
  },
  {
    id: 'harvest-avocado',
    name: 'Creamy Volta Avocados',
    scientificName: 'Persea americana',
    category: 'organics',
    description: 'Buttery, nutrient-dense local avocados loaded with clean monounsaturated lipids.',
    longBenefits: 'Packed with high-density protective fatty acids, vitamin E, and glutathione. Strengthens cell membrane health and acts as a synergistic booster for absorbing other fat-soluble vitamins.',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=600',
    origin: 'Ho Forest Garden, Volta Region',
    soilMethod: 'Deep Mulch Forest Eco-Forestry',
    season: 'April - August Peak',
    rating: 5.0,
    stock: 95
  },
  {
    id: 'harvest-yam',
    name: 'Traditional Organic White Yam',
    scientificName: 'Dioscorea rotundata',
    category: 'organics',
    description: 'Clean-soil complex tuber crop harvested under non-chemical traditional mounds.',
    longBenefits: 'An exceptional high-fiber premium source of low-glycemic carbohydrates to stabilize pancreatic rhythm, supply slow-release endocrine stamina list, and fuel gut bacteria.',
    price: 6.50,
    image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=600',
    origin: 'Oti-Volta Borders, Ghana',
    soilMethod: 'No-Till Organic Mound Cultivation',
    season: 'October - February Harvest',
    rating: 4.7,
    stock: 310
  },
  {
    id: 'harvest-cocoa',
    name: 'Biological Raw Cocoa Pods',
    scientificName: 'Theobroma cacao',
    category: 'organics',
    description: 'Freshly plucked biological cocoa pods preserving raw medicinal polyphenols in their natural state.',
    longBenefits: 'Contains active theobromine, powerful flavanols, and essential magnesium. Improves mental clarity, dilates systemic pathways, and elevates mood neurotransmission naturally.',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&q=80&w=600',
    origin: 'Vane Eco-Reserve, Volta Region',
    soilMethod: 'Shade-Grown Agroforestry Guilds',
    season: 'Harvest Peak: November',
    rating: 4.9,
    stock: 140
  },
  {
    id: 'harvest-mango',
    name: 'Forest Sweet Haden Mangoes',
    scientificName: 'Mangifera indica',
    category: 'organics',
    description: 'Immensely aromatic, fiberless forest mangoes bursting with vitamins and natural probiotics.',
    longBenefits: 'High levels of bioactive prebiotic fiber, Vitamin A, and beta-carotenes to protect vision, skin cell matrices, and digestive mucosa.',
    price: 3.50,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=600',
    origin: 'Kpando Foothills, Volta Region',
    soilMethod: 'Rainwater-Fed Organic Orchards',
    season: 'May - July Peak',
    rating: 4.8,
    stock: 160
  }
];

export default function OrganicHarvestPage({ onBackToMain, onAddToCart }) {
  
  const handlePurchase = (item) => {
    const productRepresentation = {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      category: item.category,
      rating: item.rating,
      stock: item.stock
    };
    onAddToCart(productRepresentation, 1);
  };

  return (
    <div id="organic-harvest-view" className="min-h-screen bg-brand-beige-light text-brand-dark pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Navigation Breadcrumb / Control block */}
        <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button
            onClick={onBackToMain}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-brand-beige hover:border-brand-green/35 text-brand-charcoal hover:text-brand-green text-xs font-heading font-black uppercase tracking-wider shadow-xs transition-all duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-brand-gold" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center gap-2 text-xs font-mono text-brand-charcoal/50">
            <span>VOLTA ECOSYSTEM</span>
            <span>/</span>
            <span className="text-brand-green font-bold">SANOP ORGANIC HARVEST</span>
          </div>
        </div>

        {/* Hero Section of Organic Harvest */}
        <div className="relative rounded-3xl bg-brand-charcoal text-white overflow-hidden p-8 sm:p-12 md:p-16 mb-16 shadow-xl border border-white/5">
          {/* Background visuals and accents */}
          <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-25" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=1600')` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/95 to-transparent z-0" />
          
          <div className="relative z-10 max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 bg-brand-green/20 border border-brand-green/30 px-3.5 py-1 rounded-full text-brand-green font-mono text-[10px] font-bold uppercase tracking-widest">
              <Sprout className="w-3.5 h-3.5 animate-pulse" />
              <span>100% Chemical-Free Soils</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight leading-none text-white">
              The Volta Harvest
            </h1>
            
            <p className="text-white/80 font-sans text-sm sm:text-base leading-relaxed">
              At Sanop Group, our fields are biological healers. Located across the rich volcanic soils of the Volta Region, we breed nutritious, pesticide-free, pure heritage fruits and roots. Every crop is raised with active living compost and rainwater to restore gut integrity and cell longevity.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-white/90">
              <div className="space-y-1">
                <p className="text-[10px] text-brand-gold font-bold tracking-widest font-mono uppercase">FERTILIZER</p>
                <p className="text-xs font-semibold">0% Synthetics used</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-brand-gold font-bold tracking-widest font-mono uppercase">IRRIGATION</p>
                <p className="text-xs font-semibold">Rainfed & Lake-Hydrated</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-brand-gold font-bold tracking-widest font-mono uppercase">BENEFIT</p>
                <p className="text-xs font-semibold">High-density enzymes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Informative Grid Header */}
        <div className="mb-10 text-left border-b border-brand-beige pb-6">
          <h2 className="text-2xl md:text-3xl font-heading font-black text-brand-green">
            Fresh Crop Catalog & Bio-Profiles
          </h2>
          <p className="text-brand-charcoal/65 text-xs sm:text-sm mt-1 max-w-2xl">
            Click on "Add to Bag" on any of our organic crops to source them directly. All harvests are dispatched fresh from Volta farms.
          </p>
        </div>

        {/* Harvest Catalog Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {HARVEST_ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="flex flex-col justify-between bg-white rounded-3xl border border-brand-beige shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group relative"
            >
              {/* Product Visual */}
              <div className="h-56 w-full relative overflow-hidden bg-brand-beige/20">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-brand-charcoal text-brand-gold font-mono text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-brand-gold/20 shadow-xs">
                    {item.season}
                  </span>
                </div>
                
                {/* Rating badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xs px-2 px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-xs">
                  <Star className="w-3 h-3 text-brand-gold fill-brand-gold" />
                  <span className="font-mono text-[10px] font-extrabold text-brand-dark">{item.rating}</span>
                </div>
              </div>

              {/* Product Info Description */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] text-brand-gold font-mono font-bold uppercase tracking-wider">
                      {item.origin}
                    </span>
                    <span className="text-brand-beige">•</span>
                    <span className="text-[10px] text-brand-green font-mono font-semibold">
                      Scientific: {item.scientificName}
                    </span>
                  </div>

                  <h3 className="text-xl font-heading font-black text-brand-green mb-2.5 tracking-tight group-hover:text-brand-green-hover transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-brand-charcoal/80 text-xs leading-relaxed mb-4 font-sans">
                    {item.description}
                  </p>

                  {/* Biological Profile / Medical science value */}
                  <div className="bg-brand-beige-light rounded-2xl p-4 mb-6 border border-brand-beige/50">
                    <div className="flex items-center gap-1.5 text-brand-gold text-[10px] font-heading font-extrabold uppercase tracking-widest mb-1.5">
                      <Heart className="w-3.5 h-3.5 shrink-0" />
                      <span>Biological Efficacy Profile</span>
                    </div>
                    <p className="text-[11px] text-brand-charcoal leading-relaxed font-sans">
                      {item.longBenefits}
                    </p>
                  </div>

                  {/* Farming technique specifications */}
                  <div className="space-y-1.5 text-[10px] font-sans text-brand-charcoal/60 mb-6 border-t border-brand-beige/60 pt-4">
                    <div className="flex justify-between">
                      <span className="font-semibold text-brand-charcoal/50">Regenerative Technique:</span>
                      <span className="text-brand-dark font-medium">{item.soilMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-brand-charcoal/50">Soil Nutrition Index:</span>
                      <span className="text-brand-green font-bold">Excellent Clean Yield</span>
                    </div>
                  </div>
                </div>

                {/* Purchase block */}
                <div className="flex items-center justify-between pt-4 border-t border-brand-beige/60 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-brand-charcoal/45 uppercase tracking-wide">Fresh Dispatch Price</span>
                    <span className="text-xl font-heading font-black text-brand-green">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => handlePurchase(item)}
                    className="flex items-center gap-2 bg-brand-green hover:bg-brand-green-hover text-white text-[11px] font-heading font-bold uppercase tracking-widest px-5 py-3 rounded-xl shadow-xs transition-colors duration-200 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic biological agricultural Q&A informational block */}
        <div className="mt-16 bg-white border border-brand-beige rounded-3xl p-8 sm:p-12">
          <div className="flex items-center gap-2 mb-4 text-brand-gold">
            <Leaf className="w-5 h-5" />
            <h3 className="font-heading font-extrabold text-sm tracking-widest uppercase text-brand-green">
              SANOP COMMITTED POLYCULTURE PRACTICES
            </h3>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-brand-dark mb-6">
            Why biological health starts with pure agricultural topsoils
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-brand-charcoal/80 leading-relaxed font-sans">
            <p>
              Traditional chemical farms deplete basic soil fungi while infusing fruits with glyphosate and endocrine disruptors. At Sanop Group, we refuse shortcuts. We use active microbial bio-fertilizers bred inside our own farms from decomposed organic matter. This nurtures symbiotic networks of mycorrhiza that pull complex soil compounds into vital food matrices.
            </p>
            <p>
              When you eat our Cavendish banana and organic red watermelon, your digestive juices absorb real bio-available potassium and digestive enzymes. By eating clean, biological forest food, you lower oxidative cell inflation and secure a healthy gut microbiota. We are proving that health is a continuous cycle from rich soil to healthy soul.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
