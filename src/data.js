export const HERO_SLIDES = [
  {
    id: 'slide-1',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1600',
    title: 'Building a healthier Africa, naturally',
    description: 'Sanop Group is a Ghana-based holding company building an integrated regenerative health ecosystem that reconnects food, lifestyle, environment, and healthcare to address the root causes of modern health challenges 🟡',
    subTitle: 'WELCOME TO SANOP GROUP',
    ctaText: 'Explore Our Ecosystem'
  },
  {
    id: 'slide-2',
    image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=1600',
    title: 'Sanop Organic Harvest',
    description: 'Producing safe, nutrient-dense food through regenerative farming systems that restore soil health and reduce dependence on synthetic chemical inputs',
    subTitle: 'NATURE-DRIVEN AGRICULTURE',
    ctaText: 'Discover Organic Farming'
  },
  {
    id: 'slide-3',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1600',
    title: 'Conscious Beauty & Regenerative Living',
    description: 'Nourish your skin and scalp with toxic-free cosmetics, and realign your body with customized therapeutic protocols.',
    subTitle: 'RESTORE VITALLITY - SOIL TO SOUL'
  }
];

export const VENTURES = [
  {
    id: 'organics',
    name: 'Sanop Organic Harvest',
    subName: 'Regenerative Organic Farming',
    title: 'Nourishing the Earth, Healing Communities',
    description: 'Producing safe, nutrient-dense food through regenerative farming systems that restore soil health and reduce dependence on synthetic chemical inputs.',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=800',
    bullets: [
      '100% Pesticide & Chemical-Free organic practices',
      'Revitalized organic carbon compost breeding',
      'Ethically raised free-range livestock and organic poultry'
    ]
  },
  {
    id: 'beauty',
    name: 'Sanop Beauty',
    subName: 'Conscious Beauty & Lifestyle',
    title: 'Purity in Personal Care and Restoration',
    description: 'Developing safe personal care products that reduce unnecessary chemical exposure and support healthier daily living.',
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800',
    bullets: [
      'Handcrafted with raw, premium Ghanaian Shea Butter',
      'Infused with Cold-pressed Moringa, Neem, and local Essential Oils',
      'Zero synthetic endocrine disruptors, sulfates, or parabens'
    ]
  },
  {
    id: 'living',
    name: 'Sanop Regenerative Living',
    subName: 'Nature-Based Resort & Healthcare Center',
    title: 'Comprehensive Integrative Wellness Services',
    description: 'Creating regenerative healthcare and living environments that integrate medicine, nutrition, lifestyle, and nature into one coordinated system of care.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    bullets: [
      'Tailored functional medicine and organic detox protocols',
      'Overnight wellness lodging surrounded by pristine natural flora',
      'Farm-to-Table restaurant preparing biological superfoods'
    ]
  }
];

export const PRODUCTS = [
  // Organics
  {
    id: 'p-1',
    name: 'Raw Forest Wildflower Honey',
    description: 'Pure, unpasteurized natural wildflower honey sourced from the bio-diverse forests of the Volta Region. Loaded with protective enzymes.',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=600',
    category: 'organics',
    rating: 4.9,
    stock: 42
  },
  {
    id: 'p-2',
    name: 'Pure Organic Moringa Powder',
    description: 'Superfood nutrient powerhouse crushed from shade-dried organic Moringa leaves. Rich in iron, calcium, and vitamin A/C.',
    price: 12.50,
    image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&q=80&w=600',
    category: 'organics',
    rating: 4.8,
    stock: 58
  },
  {
    id: 'p-3',
    name: 'Aromatic Hibiscus Herbal Tea (Sobolo Pure)',
    description: 'Sun-dried premium hibiscus calyces yielding a ruby-red antioxidant brew that naturally monitors healthy blood flow.',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600',
    category: 'organics',
    rating: 4.7,
    stock: 120
  },
  // Beauty
  {
    id: 'p-4',
    name: 'Premium Raw Shea Butter (Unrefined)',
    description: 'Ultra-nourishing, hand-extracted unrefined shea butter enriched with vitamins A, E & F to treat eczema, stretch marks, and split ends.',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600',
    category: 'beauty',
    rating: 4.9,
    stock: 35
  },
  {
    id: 'p-5',
    name: 'Herbal Scalp Vitalizing Serum',
    description: 'Infusion of tea tree, rosemary, ginger, and cold-pressed neem oils to boost healthy hair strands and alleviate flakes.',
    price: 24.50,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=600',
    category: 'beauty',
    rating: 4.6,
    stock: 22
  },
  {
    id: 'p-6',
    name: 'Moringa & Charcoal Clarifying Soap',
    description: 'Deep pore exfoliating and vitamin-infused natural soap bar for clearing blemishes and restoring cellular hydration.',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1607006342411-9136a53165b8?auto=format&fit=crop&q=80&w=600',
    category: 'beauty',
    rating: 4.8,
    stock: 150
  },
  // Living
  {
    id: 'p-7',
    name: '3-Day Regenerative Wellness Pass',
    description: 'Comprehensive day retreat including complete functional biological health screening, thermal steam baths, sound therapy, and cell-nourishing meals.',
    price: 180.00,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600',
    category: 'living',
    rating: 5.0,
    stock: 10
  },
  {
    id: 'p-8',
    name: 'Diagnostic Biological consultation',
    description: 'Comprehensive 1-on-1 biological health consultation with our in-house Integrative Medicine experts to trace gut and cellular markers.',
    price: 75.00,
    image: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=600',
    category: 'living',
    rating: 4.9,
    stock: 15
  }
];

export const ARTICLES = [
  {
    id: 'art-1',
    title: 'Sanop Group Launches New Organic Wellness Initiative',
    excerpt: 'Expanding our commitment to natural health with an organic community garden & bio-nutrition program built in collaboration with local specialists.',
    date: 'Jun 05, 2026',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=600',
    author: 'Dr. Michael Anan',
    category: 'Community',
    content: `Sanop Group is thrilled to announce the rollout of our Volta Bio-Nutrition and Community Wellness program. Over the next twelve months, we are partnering with smallholder farmer cooperatives to distribute non-GMO heirloom seeds, train youth in dynamic composting, and create local bio-nutritional stations.\n\n"True healthcare doesn't start in the pharmacy; it starts inside our primary agricultural topsoils," states Dr. Michael Anan, lead biomedical advisor at Sanop Group. By ensuring our communities have accessible, chemical-free nutrition, we prevent cardiovascular ailments and secure true longevity.`
  },
  {
    id: 'art-2',
    title: 'Breakthrough in Regenerative Living Research',
    excerpt: 'Our integrated clinical trials reveal the therapeutic efficacy of combining ancient West African herbal protocols with functional cell detox therapies.',
    date: 'May 24, 2026',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600',
    author: 'Prof. Sandra Mensah',
    category: 'Scientific Research',
    content: `For over two years, the team at Sanop Regenerative Living has tracked the immunological responses of patients under customized functional herbal therapies. Combining key extracts of indigenous leaves like Moringa Oleifera and Neem with thermal sauna detoxification led to significant drops in systemic markers of chronic cellular bloating.\n\nThese insights prove that returning to natural protocols, backed by robust research and clinical precision, can solve the root metabolic issues plaguing modern society.`
  },
  {
    id: 'art-3',
    title: 'New Partnerships to Expand Wellness Access',
    excerpt: 'Sanop joins hands with regional health ministries and eco-lodges to introduce restorative forest therapy programs throughout West Africa.',
    date: 'Apr 18, 2026',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600',
    author: 'David Osei',
    category: 'Partnerships',
    content: `We are officializing collaborations with sustainable tourism boards to expand our 'Regenerative Forest Bathing' initiatives. Guided by Volta native herbalists and biological guides, participants walk dense biodiverse forest trails to lower stress cortisol levels. Reaching out with these preventative programs is a central pillar of our vision to rewrite Africa’s health economy.`
  }
];
