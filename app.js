let homepageContent = null;
/**
 * The Red Box - Client Application Logic
 * Supports Multi-Page Architecture & Dedicated Section Pages
 * Integrated with RedBox Admin Backend (https://admin.theredboxfood.com)
 */

// RedBox Admin Backend API Configuration
const REDBOX_API = {
  BASE: '/api',
  ADMIN_PANEL: 'admin.html',
  BRANCHES: 'data/branches.json',
  MENU_CATEGORIES: 'data/menu.json',
  MENU_ITEMS: 'data/menu.json',
  FRANCHISE_ENQUIRY: '/api/franchises',
  CATERING_REQUEST: '/api/catering',
  CONTACT_ENQUIRY: '/api/enquiries',
  RESERVATION: '/api/reservations'
};

// Modern Floating Toast Notification Utility
function showRedBoxToast(title, message, type = 'success') {
  let toastContainer = document.getElementById('redboxToastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'redboxToastContainer';
    toastContainer.className = 'fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const isSuccess = type === 'success';
  const iconName = isSuccess ? 'check-circle' : (type === 'error' ? 'alert-triangle' : 'info');
  const iconColor = isSuccess ? 'text-emerald-500 bg-emerald-50' : (type === 'error' ? 'text-brand-red bg-red-50' : 'text-blue-500 bg-blue-50');

  toast.className = 'pointer-events-auto bg-white border border-zinc-200/90 shadow-2xl rounded-2xl p-4 flex items-start gap-3.5 transform translate-y-[-20px] opacity-0 transition-all duration-300';
  toast.innerHTML = `
    <div class="w-9 h-9 rounded-xl ${iconColor} flex items-center justify-center shrink-0">
      <i data-lucide="${iconName}" class="w-5 h-5"></i>
    </div>
    <div class="flex-1">
      <h4 class="font-heading font-black text-xs text-zinc-900 uppercase tracking-wide">${title}</h4>
      <p class="text-xs text-zinc-600 mt-0.5 leading-relaxed font-sans">${message}</p>
    </div>
    <button onclick="this.parentElement.remove()" class="text-zinc-400 hover:text-zinc-600 cursor-pointer p-1">
      <i data-lucide="x" class="w-4 h-4"></i>
    </button>
  `;

  toastContainer.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-[-20px]', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });

  setTimeout(() => {
    toast.classList.add('translate-y-[-20px]', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

// Global State
let branchesData = [];
let menuData = [];
let activeCategory = 'All';
let activeFoodType = 'all'; // 'all' | 'veg' | 'non-veg'
let activeCity = 'All';
let menuSearchQuery = '';
let branchSearchQuery = '';
let displayedMenuLimit = 12;
let mapInstance = null;
let mapMarkers = [];

// Hero Carousel State & Dynamic Media Storage
let heroIndex = 0;
let heroSlideTimer = null;
let heroSlides = [];

// Fallback Default Slides (Loaded if data/slides.json or localStorage is unavailable)
const defaultHeroSlides = [
  {
    id: 'slide-1',
    type: 'video',
    media: 'assets/videos/wok-cooking-flame.webm',
    tag: '1000°F FLAME CRAFT',
    title: 'Real Wok Hei. Sizzling Fresh.',
    desc: 'Witness the intense high-heat wok tossing that seals in authentic smoky aroma and crisp vegetable crunch.',
    playToEnd: true,
    duration: 0,
    primaryCta: { text: 'Explore Full Menu', link: 'menu.html', icon: 'utensils' },
    secondaryCta: { text: 'Order Online', action: 'openOrderModal()', icon: 'shopping-bag' },
    active: true
  },
  {
    id: 'slide-2',
    type: 'image',
    media: 'assets/images/hdr-bnr-01.jpg',
    tag: 'SIGNATURE DIM SUMS',
    title: 'Real Wok Craft. Iconic Red Box.',
    desc: 'Steaming, freshly tossed Indo-Chinese specialties packed hot in our 45-minute heat-retention fold box.',
    playToEnd: false,
    duration: 6,
    primaryCta: { text: 'Explore Full Menu', link: 'menu.html', icon: 'utensils' },
    secondaryCta: { text: 'Order Online', action: 'openOrderModal()', icon: 'shopping-bag' },
    active: true
  },
  {
    id: 'slide-3',
    type: 'image',
    media: 'assets/images/hdr-bnr-02.jpg',
    tag: '1000°F FLAME CRAFT',
    title: 'Sizzling Wok Hei Flavours',
    desc: 'Intense high-heat wok tossing that seals in the authentic smoky aroma and crisp vegetable crunch.',
    playToEnd: false,
    duration: 6,
    primaryCta: { text: 'Explore Full Menu', link: 'menu.html', icon: 'utensils' },
    secondaryCta: { text: 'Order Online', action: 'openOrderModal()', icon: 'shopping-bag' },
    active: true
  },
  {
    id: 'slide-4',
    type: 'image',
    media: 'assets/images/hdr-bnr-03.jpg',
    tag: 'ARTISANAL SPICE BLENDS',
    title: 'Legendary Dragon Chicken & Gravies',
    desc: 'Crafted fresh daily with whole sun-dried chillies, crushed garlic, and zero artificial preservatives.',
    playToEnd: false,
    duration: 6,
    primaryCta: { text: 'Explore Full Menu', link: 'menu.html', icon: 'utensils' },
    secondaryCta: { text: 'Order Online', action: 'openOrderModal()', icon: 'shopping-bag' },
    active: true
  },
  {
    id: 'slide-5',
    type: 'image',
    media: 'assets/images/hdr-bnr-04.jpg',
    tag: 'PATENTED THERMAL PACKAGING',
    title: 'Piping Hot Comfort On The Go',
    desc: 'Virgin eco-board geometric fold keeps your meal above 65°C for 45 minutes on the road.',
    playToEnd: false,
    duration: 6,
    primaryCta: { text: 'The Box Innovation', link: 'about.html#the-box', icon: 'box' },
    secondaryCta: { text: 'Order Online', action: 'openOrderModal()', icon: 'shopping-bag' },
    active: true
  },
  {
    id: 'slide-6',
    type: 'image',
    media: 'assets/images/hdr-bnr-05.jpg',
    tag: 'GLOBAL EXPANSION',
    title: '57+ Branches Across Global Hubs',
    desc: 'India’s fastest growing organized Indo-Chinese quick service restaurant chain, serving 100,000+ meals monthly.',
    playToEnd: false,
    duration: 6,
    primaryCta: { text: 'Explore 57 Branches', link: 'branches.html', icon: 'map-pin' },
    secondaryCta: { text: 'Franchise Model', link: 'franchise.html', icon: 'briefcase' },
    active: true
  }
];

// Timeline Milestones Data
const timelineData = {
  2015: {
    year: '2015',
    title: 'The Inception & Petrol Pump Kiosks',
    tag: 'Born in Chennai',
    desc: 'The Red Box began with a revolutionary concept: quick, hygienic Indo-Chinese food packed in high-grade heat-retaining boxes. We launched 3 compact takeaway kiosks located at high-traffic fuel stations across Chennai, serving piping hot noodles to late-night travelers.',
    stat1: '3 Kiosks',
    stat2: '12 Menu Items',
    img: 'assets/images/story-img-01.jpg'
  },
  2017: {
    year: '2017',
    title: 'First Flagship Dine-In & Open Wok Kitchen',
    tag: 'Restaurant Validation',
    desc: 'Customer demand prompted our first sit-down restaurant with an open theatrical wok kitchen. Customers could watch master chefs tossing noodles over high flames while enjoying authentic dim sums and momos.',
    stat1: '8 Branches',
    stat2: 'Open Wok Theatre',
    img: 'assets/images/FO1.jpg'
  },
  2020: {
    year: '2020',
    title: 'The Delivery Scale & Cloud Kitchen Model',
    tag: 'Contactless Pioneer',
    desc: 'During the global shifts of 2020, our proprietary packaging became our greatest superpower. With 45-minute thermal retention, our delivery orders surged 400% on Swiggy & Zomato, establishing The Red Box as Chennai’s top Indo-Chinese takeaway choice.',
    stat1: '22 Branches',
    stat2: '45-Min Thermal Seal',
    img: 'assets/images/FO2.jpg'
  },
  2023: {
    year: '2023',
    title: 'Multi-State Expansion to Tech Capitals',
    tag: 'National Footprint',
    desc: 'The Red Box expanded outside Tamil Nadu, opening flagship hubs in Bengaluru (Koramangala, Whitefield) and Hyderabad (Hitec City, Gachibowli), catering to hundreds of thousands of tech professionals and college students.',
    stat1: '40 Branches',
    stat2: '4 States',
    img: 'assets/images/FO3.jpg'
  },
  2026: {
    year: '2026',
    title: '57 Branches Worldwide & Institutional Scale',
    tag: 'The Next Decade',
    desc: 'Today, The Red Box operates 57+ branches across 17 regional hubs including recent launches in Nagpur, Vizag, and Kerala. With institutional corporate catering, campus fest live stations, and turnkey franchise models, we are India’s premier wok-box brand.',
    stat1: '57+ Branches',
    stat2: '17 Regions',
    img: 'assets/images/FO4.jpg'
  }
};

// Document Ready Initialization
document.addEventListener('DOMContentLoaded', async () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Mobile Menu Toggle
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileMenuDrawer');
  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('hidden');
    });
  }

  // Initialize Adaptive Transparent Navbar
  initAdaptiveNavbar();

  // Load Data
  await loadBranchesData();
  await loadMenuData();
  await loadHomepageContent();

  // Load Operations CMS features
  await initPromotionsBanner();
  await initDynamicTestimonials();

  // Initialize Timeline if on story page or home
  if (document.getElementById('timelineContentBox')) {
    setTimelineYear(2015);
  }

  // Initialize Hero Slideshow if hero exists
  if (document.getElementById('heroSliderSection') || document.getElementById('heroBannerImg')) {
    initHeroCarousel();
  }

  // Initialize Menu Search Listeners
  const menuSearch = document.getElementById('menuSearchInput');
  if (menuSearch) {
    menuSearch.addEventListener('input', (e) => {
      menuSearchQuery = e.target.value.toLowerCase().trim();
      displayedMenuLimit = 12;
      renderMenuItems();
    });
  }

  // Initialize Branch Search Listeners
  const branchSearch = document.getElementById('branchSearchInput');
  if (branchSearch) {
    branchSearch.addEventListener('input', (e) => {
      branchSearchQuery = e.target.value.toLowerCase().trim();
      renderBranchesList();
    });
  }

  // Initial Catering Calculation if calculator exists
  if (document.getElementById('calcPackage')) {
    calculateCateringEstimate();
  }
});

// ================= HERO CAROUSEL (IMAGES & FULL EXTENT VIDEOS) =================
async function initHeroCarousel() {
  // Load slides from localStorage (admin edited) or data/slides.json
  await loadHeroSlides();

  // Setup touch gestures for swipe on mobile devices
  const sliderEl = document.getElementById('heroSliderSection');
  if (sliderEl) {
    let touchStartX = 0;
    let touchEndX = 0;

    sliderEl.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderEl.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const threshold = 40;
      if (touchEndX < touchStartX - threshold) {
        nextHeroSlide(); // Swiped left -> next
      } else if (touchEndX > touchStartX + threshold) {
        prevHeroSlide(); // Swiped right -> prev
      }
    }
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!document.getElementById('heroSliderSection')) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft') prevHeroSlide();
    if (e.key === 'ArrowRight') nextHeroSlide();
  });

  // Listen for admin changes in other tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'redbox_hero_slides' || e.key === 'redbox_homepage_content') {
      loadHomepageContent();
    }
  });

  // Display initial slide
  updateHeroDisplay();
}

async function loadHeroSlides() {
  // 1. Fetch from data/slides.json with cache buster to guarantee synchronized content
  try {
    const res = await fetch('data/slides.json?v=' + Date.now());
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        heroSlides = data.filter(s => s.active !== false);
        try { localStorage.setItem('redbox_hero_slides', JSON.stringify(heroSlides)); } catch(e){}
        return;
      }
    }
  } catch (err) {
    console.warn('Could not fetch data/slides.json:', err);
  }

  // 2. Try localStorage fallback
  try {
    const cached = localStorage.getItem('redbox_hero_slides');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        heroSlides = parsed.filter(s => s.active !== false);
        if (heroSlides.length > 0) return;
      }
    }
  } catch (err) {
    console.warn('Could not read redbox_hero_slides from localStorage:', err);
  }

  // 3. Fallback to default slides
  heroSlides = defaultHeroSlides.filter(s => s.active !== false);
}

function changeHeroSlide(index) {
  if (heroSlides.length === 0) return;
  heroIndex = (index + heroSlides.length) % heroSlides.length;
  updateHeroDisplay();
}

function nextHeroSlide() {
  if (heroSlides.length === 0) return;
  heroIndex = (heroIndex + 1) % heroSlides.length;
  updateHeroDisplay();
}

function prevHeroSlide() {
  if (heroSlides.length === 0) return;
  heroIndex = (heroIndex - 1 + heroSlides.length) % heroSlides.length;
  updateHeroDisplay();
}

function updateHeroDisplay() {
  if (!heroSlides || heroSlides.length === 0) return;
  if (heroIndex >= heroSlides.length) heroIndex = 0;

  // Clear any existing slide timer
  if (heroSlideTimer) {
    clearTimeout(heroSlideTimer);
    heroSlideTimer = null;
  }

  const current = heroSlides[heroIndex];
  const imgEl = document.getElementById('heroBannerImg');
  const videoEl = document.getElementById('heroBannerVideo');
  const tagEl = document.getElementById('heroBannerTag');
  const titleEl = document.getElementById('heroBannerTitle');
  const descEl = document.getElementById('heroBannerDesc');
  const primaryCta = document.getElementById('heroBannerPrimaryCta');
  const primaryText = document.getElementById('heroBannerPrimaryText');
  const primaryIcon = document.getElementById('heroBannerPrimaryIcon');
  const secondaryCta = document.getElementById('heroBannerSecondaryCta');
  const secondaryText = document.getElementById('heroBannerSecondaryText');
  const secondaryIcon = document.getElementById('heroBannerSecondaryIcon');

  // Handle Media: Video vs Image
  const isVideo = current.type === 'video' || (current.media && (/\.(webm|mp4|mov|ogg)$/i.test(current.media)));
  const fitClass = current.fit === 'contain' ? 'object-contain' : 'object-cover';
  const removeFitClass = current.fit === 'contain' ? 'object-cover' : 'object-contain';
  if (videoEl) { videoEl.classList.remove(removeFitClass); videoEl.classList.add(fitClass); }
  if (imgEl) { imgEl.classList.remove(removeFitClass); imgEl.classList.add(fitClass); }

  if (isVideo && videoEl) {
    // Hide Image, Show Video
    if (imgEl) imgEl.classList.add('hidden');
    videoEl.classList.remove('hidden');

    // Only update src if different to prevent reload flicker
    const mediaSrc = current.media || current.image;
    const currentSrc = videoEl.getAttribute('data-src') || '';
    if (currentSrc !== mediaSrc) {
      videoEl.setAttribute('data-src', mediaSrc);
      videoEl.src = mediaSrc;
      videoEl.load();
    }

    videoEl.currentTime = 0;
    videoEl.muted = true;
    
    // Play video
    const playPromise = videoEl.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.log('Video autoplay muted fallback:', err);
      });
    }

    // "if the video is there it should run to its full extent before scrolling"
    videoEl.onended = () => {
      nextHeroSlide();
    };

    // Safety fallback: if video is very long or fails to trigger onended, advance after duration
    videoEl.onloadedmetadata = () => {
      const vidDuration = videoEl.duration;
      if (vidDuration && isFinite(vidDuration) && vidDuration > 0) {
        heroSlideTimer = setTimeout(() => {
          nextHeroSlide();
        }, (vidDuration + 0.5) * 1000);
      }
    };

    videoEl.onerror = () => {
      console.warn('Video failed to load, falling back to 6s timer');
      heroSlideTimer = setTimeout(nextHeroSlide, 6000);
    };

  } else if (imgEl) {
    // Hide Video, Pause & Show Image
    if (videoEl) {
      videoEl.pause();
      videoEl.classList.add('hidden');
      videoEl.onended = null;
    }
    imgEl.classList.remove('hidden');

    const mediaSrc = current.media || current.image || 'assets/images/hdr-bnr-01.jpg';
    imgEl.style.opacity = '0.4';
    setTimeout(() => {
      imgEl.src = mediaSrc;
      imgEl.style.opacity = '1';
    }, 150);

    // Auto-advance for image slides based on slide duration
    const slideDuration = (current.duration && current.duration > 0 ? current.duration : 6) * 1000;
    heroSlideTimer = setTimeout(() => {
      nextHeroSlide();
    }, slideDuration);
  }

  // Update Context Overlay (Bottom Side)
  if (tagEl) {
    tagEl.textContent = current.tag || 'RED BOX SIGNATURE';
    tagEl.style.display = current.tag ? 'inline-block' : 'none';
  }

  if (titleEl) {
    titleEl.textContent = current.title || 'Real Wok Craft. Iconic Red Box.';
  }

  if (descEl) {
    descEl.textContent = current.desc || '';
    descEl.style.display = current.desc ? 'block' : 'none';
  }

  // Update Primary CTA
  if (primaryCta && current.primaryCta) {
    primaryCta.style.display = 'inline-flex';
    if (primaryText) primaryText.textContent = current.primaryCta.text || 'Explore Menu';
    if (current.primaryCta.link) primaryCta.setAttribute('href', current.primaryCta.link);
  }

  // Update Secondary CTA
  if (secondaryCta) {
    if (current.secondaryCta && current.secondaryCta.text) {
      secondaryCta.style.display = 'inline-flex';
      if (secondaryText) secondaryText.textContent = current.secondaryCta.text;
      if (current.secondaryCta.action) {
        secondaryCta.setAttribute('onclick', current.secondaryCta.action);
      }
    } else {
      secondaryCta.style.display = 'none';
    }
  }

  // Refresh Lucide Icons if available
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

// ================= LOAD MENU DATA =================
async function loadMenuData() {
  try {
    const res = await fetch('data/menu.json');
    menuData = await res.json();
    
    // Check if on dedicated menu page
    if (document.getElementById('menuItemsGrid')) {
      setupWebsiteMenuFilters();
      renderMenuItems();
    }

    // Check if on homepage with featured dishes teaser
    if (document.getElementById('featuredDishesGrid')) {
      renderFeaturedDishes();
    }
  } catch (err) {
    console.error('Error loading menu:', err);
  }
}

// Render Featured 6 Bestsellers on Homepage

// ================= MAJOR CATEGORIES DEFINITIONS FOR WEBSITE =================
const MAJOR_CATEGORIES = {
  "Rice & Noodles": ['Noodles', 'Rice', 'Rice & Noodle', 'Rice-Noodle-Gravy'],
  "Combos & Red Meals": ['Combo (Serves 1-2)', 'Combo For 1', 'Red Meal', 'Special Combo', 'Festival Combo', 'Festive Special Menu', 'Value Treat for 2', 'Light Eaters (Little Box)', 'Little Red Box'],
  "Starters & Appetizers": ['Starter - Veg', 'Starter - Non Veg'],
  "Soups & Broths": ['Soup - Veg', 'Soup - Non Veg'],
  "Main Course Gravies": ['Chicken Main Course', 'Beef Main Course', 'Seafood Main Course', 'Vegetarian Main Course'],
  "Momos & Dim Sum": ["Momo's"],
  "Chef Specials & Signatures": ['Chef Special Menu', 'Red Box Special (Serves 1-2)', 'Healthy Delights', 'Children Special'],
  "Beverages & Desserts": ['Beverages', 'Dessert']
};

function getMajorCategory(rawCat) {
  if (!rawCat) return "Rice & Noodles";
  const lower = rawCat.toLowerCase().trim();
  for (const [major, subList] of Object.entries(MAJOR_CATEGORIES)) {
    if (subList.some(s => s.toLowerCase() === lower)) return major;
  }
  return "Chef Specials & Signatures";
}

const MENU_HUBS_DEF = {
  "india-south": { label: "India (South Hub)", continent: "Asia", country: "India", currency: "INR", symbol: "₹" },
  "gulf-middle-east": { label: "Gulf & Middle East", continent: "Middle East", country: "United Arab Emirates", currency: "AED", symbol: "AED " },
  "southeast-asia": { label: "Southeast Asia (SG/MY)", continent: "Asia", countries: ["Singapore", "Malaysia"], currency: "SGD", symbol: "S$" },
  "uk-europe": { label: "UK & Europe", continent: "Europe", country: "United Kingdom", currency: "GBP", symbol: "£" },
  "us-east": { label: "US East Coast", continent: "North America", country: "United States", currency: "USD", symbol: "$" }
};

// Dynamically augment menu regional hubs from all branches in branchesData
function getWebsiteAllMenuHubs() {
  const hubs = { ...MENU_HUBS_DEF };
  const branches = branchesData || [];
  branches.forEach(b => {
    if (!b.country) return;
    const country = b.country.trim();
    const countryLower = country.toLowerCase();
    const isCovered = Object.values(hubs).some(def => {
      if (Array.isArray(def.countries)) return def.countries.some(c => c.toLowerCase() === countryLower);
      return (def.country || '').toLowerCase() === countryLower;
    });
    if (!isCovered) {
      const slug = countryLower.replace(/[^a-z0-9]+/g, '-');
      hubs[slug] = {
        label: `${country} Hub`,
        continent: b.continent || 'Global',
        country: country,
        currency: 'USD',
        symbol: '$'
      };
    }
  });
  return hubs;
}

let activeMajorCategory = 'All';
let activeContinent = 'All';
let activeCountry = 'All';
let activeHub = 'All';

function setupWebsiteMenuFilters() {
  renderWebsiteMajorCategories();
  populateWebsiteContinentFilter();
  populateWebsiteCountryFilter();
  populateWebsiteHubFilter();
}

function renderWebsiteMajorCategories() {
  const container = document.getElementById('websiteMajorCategoriesList');
  if (!container) return;

  const totalCount = menuData.length;
  const counts = { "All": totalCount };
  Object.keys(MAJOR_CATEGORIES).forEach(k => counts[k] = 0);

  menuData.forEach(m => {
    const major = getMajorCategory(m.category || m.category_name);
    if (counts[major] !== undefined) counts[major]++;
  });

  const majorIcons = {
    "All": `<i data-lucide="layout-grid" class="w-3.5 h-3.5 flex-shrink-0"></i>`,
    "Rice & Noodles": `<i data-lucide="soup" class="w-3.5 h-3.5 flex-shrink-0"></i>`,
    "Combos & Red Meals": `<i data-lucide="package" class="w-3.5 h-3.5 flex-shrink-0"></i>`,
    "Starters & Appetizers": `<i data-lucide="utensils" class="w-3.5 h-3.5 flex-shrink-0"></i>`,
    "Soups & Broths": `<i data-lucide="coffee" class="w-3.5 h-3.5 flex-shrink-0"></i>`,
    "Main Course Gravies": `<i data-lucide="utensils" class="w-3.5 h-3.5 flex-shrink-0"></i>`,
    "Momos & Dim Sum": `<i data-lucide="sparkles" class="w-3.5 h-3.5 flex-shrink-0"></i>`,
    "Chef Specials & Signatures": `<i data-lucide="award" class="w-3.5 h-3.5 flex-shrink-0"></i>`,
    "Beverages & Desserts": `<i data-lucide="glass-water" class="w-3.5 h-3.5 flex-shrink-0"></i>`
  };

  const items = ["All", ...Object.keys(MAJOR_CATEGORIES)];

  container.innerHTML = items.map(cat => {
    const isSelected = activeMajorCategory === cat;
    const icon = majorIcons[cat] || majorIcons["All"];
    const label = cat === "All" ? "All Dishes" : cat;
    const count = counts[cat] || 0;

    return `
      <button type="button" onclick="setMenuMajorCategory('${cat}')" class="w-full flex items-center justify-between px-3 py-2 rounded-xl transition text-left cursor-pointer group ${isSelected ? 'bg-red-50 text-brand-red font-bold border border-red-200 shadow-xs' : 'hover:bg-zinc-50 text-zinc-700 font-medium border border-transparent'}">
        <span class="flex items-center gap-2 truncate pr-2">
          <span class="${isSelected ? 'text-brand-red' : 'text-zinc-400 group-hover:text-zinc-600'}">${icon}</span>
          <span class="truncate">${label}</span>
        </span>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${isSelected ? 'bg-red-100 text-brand-red' : 'bg-zinc-100 text-zinc-500'}">${count}</span>
      </button>
    `;
  }).join('');

  const lblSelected = document.getElementById('labelSelectedMajorCatWeb');
  if (lblSelected) lblSelected.innerText = activeMajorCategory === 'All' ? 'All Dishes' : activeMajorCategory;

  if (window.lucide) window.lucide.createIcons();
}

function setMenuMajorCategory(cat) {
  activeMajorCategory = cat;
  displayedMenuLimit = 12;
  renderWebsiteMajorCategories();
  renderMenuItems();
}

function populateWebsiteContinentFilter() {
  const el = document.getElementById('menuFilterContinent');
  if (!el) return;
  const allHubs = getWebsiteAllMenuHubs();
  const branchContinents = (branchesData || []).map(b => (b.continent || '').trim()).filter(Boolean);
  const hubContinents = Object.values(allHubs).map(h => (h.continent || '').trim()).filter(Boolean);
  const uniqueContinents = ['All', ...new Set([...branchContinents, ...hubContinents])].sort();
  el.innerHTML = uniqueContinents.map(c => `<option value="${c}" ${c.toLowerCase() === activeContinent.toLowerCase() ? 'selected' : ''}>${c === 'All' ? `All Continents (${uniqueContinents.length - 1})` : c}</option>`).join('');
}

function populateWebsiteCountryFilter() {
  const el = document.getElementById('menuFilterCountry');
  if (!el) return;

  const allHubs = getWebsiteAllMenuHubs();
  let countries = [];
  Object.values(allHubs).forEach(h => {
    if (activeContinent === 'All' || (h.continent || '').toLowerCase().trim() === activeContinent.toLowerCase().trim()) {
      if (Array.isArray(h.countries)) countries.push(...h.countries);
      else if (h.country) countries.push(h.country);
    }
  });

  (branchesData || []).forEach(b => {
    if (b.country && (activeContinent === 'All' || (b.continent || '').toLowerCase().trim() === activeContinent.toLowerCase().trim())) {
      countries.push(b.country);
    }
  });

  const canonicalMap = new Map();
  countries.forEach(c => {
    const trimmed = (c || '').trim();
    if (trimmed && !canonicalMap.has(trimmed.toLowerCase())) {
      canonicalMap.set(trimmed.toLowerCase(), trimmed);
    }
  });

  const uniqueCountries = ['All', ...Array.from(canonicalMap.values()).sort((a, b) => a.localeCompare(b))];
  el.innerHTML = uniqueCountries.map(c => `<option value="${c}" ${c.toLowerCase() === activeCountry.toLowerCase() ? 'selected' : ''}>${c === 'All' ? `All Countries (${uniqueCountries.length - 1})` : c}</option>`).join('');
}

function populateWebsiteHubFilter() {
  const el = document.getElementById('menuFilterHub');
  if (!el) return;

  const allHubs = getWebsiteAllMenuHubs();
  let hubKeys = Object.keys(allHubs);
  if (activeContinent !== 'All') {
    hubKeys = hubKeys.filter(k => (allHubs[k].continent || '').toLowerCase().trim() === activeContinent.toLowerCase().trim());
  }
  if (activeCountry !== 'All') {
    const selCountryLower = activeCountry.toLowerCase().trim();
    hubKeys = hubKeys.filter(k => {
      const def = allHubs[k];
      if (Array.isArray(def.countries)) return def.countries.some(c => c.toLowerCase().trim() === selCountryLower);
      return (def.country || '').toLowerCase().trim() === selCountryLower;
    });
  }

  let options = `<option value="All" ${activeHub === 'All' ? 'selected' : ''}>All Regional Hubs (${hubKeys.length})</option>`;
  options += hubKeys.map(h => `<option value="${h}" ${h === activeHub ? 'selected' : ''}>${allHubs[h].label}</option>`).join('');
  el.innerHTML = options;
}

function onMenuContinentChange(val) {
  activeContinent = val;
  activeCountry = 'All';
  activeHub = 'All';
  populateWebsiteCountryFilter();
  populateWebsiteHubFilter();
  displayedMenuLimit = 12;
  renderMenuItems();
}

function onMenuCountryChange(val) {
  activeCountry = val;
  activeHub = 'All';
  populateWebsiteHubFilter();
  displayedMenuLimit = 12;
  renderMenuItems();
}

function onMenuHubChange(val) {
  activeHub = val;
  displayedMenuLimit = 12;
  renderMenuItems();
}

function onWebsiteMenuSearch() {
  const input = document.getElementById('menuSearchInput');
  menuSearchQuery = input ? input.value.toLowerCase().trim() : '';
  displayedMenuLimit = 12;
  renderMenuItems();
}

function resetWebsiteMenuFilters() {
  activeMajorCategory = 'All';
  activeFoodType = 'all';
  activeContinent = 'All';
  activeCountry = 'All';
  activeHub = 'All';
  menuSearchQuery = '';
  displayedMenuLimit = 12;

  const searchInput = document.getElementById('menuSearchInput');
  if (searchInput) searchInput.value = '';

  document.querySelectorAll('.food-filter-btn').forEach(btn => {
    btn.classList.remove('bg-white', 'text-zinc-900', 'shadow-sm');
    btn.classList.add('text-zinc-600');
  });
  const btnAll = document.getElementById('filterTypeAll');
  if (btnAll) {
    btnAll.classList.add('bg-white', 'text-zinc-900', 'shadow-sm');
    btnAll.classList.remove('text-zinc-600');
  }

  renderWebsiteMajorCategories();
  populateWebsiteContinentFilter();
  populateWebsiteCountryFilter();
  populateWebsiteHubFilter();
  renderMenuItems();
}

function setFoodTypeFilter(type) {
  activeFoodType = type;
  displayedMenuLimit = 12;

  document.querySelectorAll('.food-filter-btn').forEach(btn => {
    btn.classList.remove('bg-white', 'text-zinc-900', 'shadow-sm');
    btn.classList.add('text-zinc-600');
  });

  const targetId = type === 'non-veg' ? 'filterTypeNonVeg' : (type === 'veg' ? 'filterTypeVeg' : 'filterTypeAll');
  const activeBtn = document.getElementById(targetId) || document.getElementById(`filterType${type.charAt(0).toUpperCase() + type.slice(1).replace('-', '')}`);
  if (activeBtn) {
    activeBtn.classList.add('bg-white', 'text-zinc-900', 'shadow-sm');
    activeBtn.classList.remove('text-zinc-600');
  }

  renderMenuItems();
}

function getCategoryDishImage(category, foodType) {
  const cat = (category || '').toLowerCase();
  if (cat.includes('momo') || cat.includes('dim sum')) return 'assets/images/img-01.png';
  if (cat.includes('noodle') || cat.includes('chow')) return 'assets/images/img-02.png';
  if (cat.includes('rice') || cat.includes('biryani')) return 'assets/images/img-03.png';
  if (cat.includes('gravy') || cat.includes('course') || cat.includes('curry')) return 'assets/images/img-04.png';
  if (cat.includes('combo') || cat.includes('meal') || cat.includes('box')) return 'assets/images/img-07.png';
  if (cat.includes('beverage') || cat.includes('dessert') || cat.includes('soup')) return 'assets/images/img-06.png';
  if (cat.includes('chicken') || cat.includes('starter') || cat.includes('dragon')) return 'assets/images/img-08.png';
  if (cat.includes('prawn') || cat.includes('seafood') || cat.includes('crispy')) return 'assets/images/img-08.png';
  return (foodType === 'veg' || (category && category.toLowerCase().includes('veg'))) ? 'assets/images/img-03.png' : 'assets/images/img-08.png';
}

function updateWebsiteBreadcrumbs() {
  const container = document.getElementById('websiteMenuFilterBreadcrumbs');
  if (!container) return;

  const pills = [];
  if (menuSearchQuery) pills.push(`"${menuSearchQuery}"`);
  if (activeMajorCategory !== 'All') pills.push(`${activeMajorCategory}`);
  if (activeContinent !== 'All') pills.push(`${activeContinent}`);
  if (activeCountry !== 'All') pills.push(`${activeCountry}`);
  if (activeHub !== 'All') pills.push(`${MENU_HUBS_DEF[activeHub]?.label || activeHub}`);
  if (activeFoodType !== 'all') pills.push(activeFoodType === 'veg' ? 'Veg' : 'Non-Veg');

  if (pills.length === 0) {
    container.innerHTML = `
      <span class="font-bold text-zinc-400">Filters:</span>
      <span class="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-medium">All Global</span>
    `;
  } else {
    container.innerHTML = `
      <span class="font-bold text-zinc-700">Filters:</span>
      ${pills.map(p => `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-brand-red border border-red-200 font-semibold">${p}</span>`).join('')}
      <button onclick="resetWebsiteMenuFilters()" class="text-zinc-400 hover:text-brand-red underline text-[10px] ml-1 cursor-pointer">Clear</button>
    `;
  }
}

function renderMenuItems() {
  const grid = document.getElementById('menuItemsGrid');
  const countDisplay = document.getElementById('displayedCount');
  const totalDisplay = document.getElementById('totalFilteredCount');
  const loadMoreBtn = document.getElementById('loadMoreMenuBtn');
  const loadMoreCount = document.getElementById('loadMoreRemainingCount');
  const headingTitle = document.getElementById('webCategoryHeadingTitle');
  const countBadge = document.getElementById('webCategoryCountBadge');
  if (!grid) return;

  let filtered = menuData.filter(item => {
    // 1. Major Category
    if (activeMajorCategory !== 'All') {
      const major = getMajorCategory(item.category || item.category_name);
      if (major !== activeMajorCategory) return false;
    }

    // 2. Food Type
    if (activeFoodType === 'veg') {
      const isVeg = (item.food_type && item.food_type.toLowerCase() === 'veg') || item.is_veg === true;
      if (!isVeg) return false;
    } else if (activeFoodType === 'non-veg') {
      const isVeg = (item.food_type && item.food_type.toLowerCase() === 'veg') || item.is_veg === true;
      if (isVeg) return false;
    }

    // 3. Search Query
    if (menuSearchQuery) {
      const major = getMajorCategory(item.category || item.category_name);
      const haystack = `${item.name || ''} ${item.description || ''} ${item.category || ''} ${major}`.toLowerCase();
      if (!haystack.includes(menuSearchQuery)) return false;
    }

    const regs = Array.isArray(item.availableRegions) && item.availableRegions.length > 0 
      ? item.availableRegions 
      : ["india-south", "gulf-middle-east", "southeast-asia", "uk-europe", "us-east"];

    // Branch context / Nearby Hub Filter (Only filters if user is verified and NOT out of zone)
    if (typeof userFulfillment !== 'undefined' && userFulfillment.isVerified && userFulfillment.nearestBranch && !userFulfillment.isOutOfZone) {
      const branchRegion = userFulfillment.nearestBranch.menuRegion;
      if (branchRegion && !regs.includes(branchRegion)) return false;
    }

    const allHubs = getWebsiteAllMenuHubs();

    // 4. Hub Filter
    if (activeHub !== 'All') {
      if (!regs.includes(activeHub) && !regs.includes('all')) return false;
    }

    // 5. Country Filter
    if (activeCountry !== 'All') {
      const selCountryLower = activeCountry.toLowerCase().trim();
      const matchesCountry = regs.includes('all') || regs.some(r => {
        const def = allHubs[r];
        if (!def) return false;
        if (Array.isArray(def.countries)) return def.countries.some(c => c.toLowerCase().trim() === selCountryLower);
        return (def.country || '').toLowerCase().trim() === selCountryLower;
      });
      if (!matchesCountry) return false;
    }

    // 6. Continent Filter
    if (activeContinent !== 'All') {
      const selContLower = activeContinent.toLowerCase().trim();
      const matchesContinent = regs.includes('all') || regs.some(r => {
        const def = allHubs[r];
        return def && (def.continent || '').toLowerCase().trim() === selContLower;
      });
      if (!matchesContinent) return false;
    }

    return true;
  });

  const totalFiltered = filtered.length;
  const toDisplay = filtered.slice(0, displayedMenuLimit);

  if (headingTitle) headingTitle.innerText = activeMajorCategory === 'All' ? 'All Dishes' : activeMajorCategory;
  if (countBadge) countBadge.innerText = `${totalFiltered} dishes`;
  if (countDisplay) countDisplay.textContent = toDisplay.length;
  if (totalDisplay) totalDisplay.textContent = totalFiltered;

  if (loadMoreBtn) {
    if (toDisplay.length >= totalFiltered) {
      loadMoreBtn.classList.add('hidden');
    } else {
      loadMoreBtn.classList.remove('hidden');
      const rem = Math.min(12, totalFiltered - toDisplay.length);
      if (loadMoreCount) loadMoreCount.textContent = `+${rem} More`;
    }
  }

  updateWebsiteBreadcrumbs();

  if (toDisplay.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-16 text-center text-zinc-500">
        <i data-lucide="utensils" class="w-10 h-10 mx-auto mb-3 text-zinc-300"></i>
        <p class="font-bold text-base text-zinc-700">No dishes match your selection.</p>
        <p class="text-xs mt-1">Try switching categories, clearing search, or selecting another regional market.</p>
        <button onclick="resetWebsiteMenuFilters()" class="mt-4 px-5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full text-xs font-bold transition">Clear All Filters</button>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  grid.innerHTML = toDisplay.map(dish => {
    const isVeg = (dish.food_type && dish.food_type.toLowerCase() === 'veg') || dish.is_veg === true;
    const dishImg = dish.image || getCategoryDishImage(dish.category, dish.food_type);
    const majorCat = getMajorCategory(dish.category || dish.category_name);

    // Contextual Price
    let priceDisplay = `₹ ${dish.price}`;
    if (activeHub !== 'All' && dish.regionalPricing && dish.regionalPricing[activeHub]) {
      const rp = dish.regionalPricing[activeHub];
      priceDisplay = `${rp.symbol}${rp.amount} <span class="text-[10px] text-zinc-400 font-mono">${rp.currency}</span>`;
    }

    return `
      <div class="food-card bg-white rounded-3xl overflow-hidden border border-zinc-200/80 shadow-sm hover:shadow-xl hover:border-brand-red/30 transition-all duration-300 group flex flex-col justify-between">
        <div>
          <!-- Prominent Top Product Image (Full, Uncut Food Photo) -->
          <div class="relative h-48 sm:h-52 w-full overflow-hidden bg-zinc-900 border-b border-zinc-100">
            <img src="${dishImg}" alt="${dish.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            <!-- Top Badges Overlay -->
            <div class="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
              <span class="${isVeg ? 'badge-veg' : 'badge-nonveg'}" title="${isVeg ? 'Vegetarian' : 'Non-Vegetarian'}"></span>
              <span class="px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-brand-red text-[10px] font-heading font-extrabold uppercase tracking-wider shadow-xs border border-red-100">
                ${majorCat}
              </span>
            </div>

            <!-- Price Badge Overlay on Image -->
            <div class="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs shadow-md border border-zinc-200 flex items-center gap-1">
              <span class="font-mono font-bold text-brand-red text-base sm:text-lg tracking-tight price-val">${priceDisplay}</span>
            </div>
          </div>

          <!-- Product Details Below Image -->
          <div class="p-5 space-y-2">
            <div class="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
              <span>${dish.category || ''}</span>
              <span class="text-brand-gold font-bold uppercase tracking-wider flex items-center gap-1">
                Fresh Wok Toss
              </span>
            </div>

            <h3 class="font-heading font-extrabold text-base sm:text-lg text-zinc-900 tracking-wide group-hover:text-brand-red transition-colors leading-snug line-clamp-1">
              ${dish.name}
            </h3>

            <p class="text-xs text-zinc-600 font-sans leading-relaxed line-clamp-2">
              ${dish.description || 'Authentic Indo-Chinese delicacy prepared hot with fresh daily ingredients and house-made spices.'}
            </p>
          </div>
        </div>

        <!-- Card Action Footer -->
        <div class="px-5 pb-5 pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
          <div class="text-[11px] font-heading font-extrabold text-zinc-400 uppercase tracking-wider">
            Hot In Red Box
          </div>
          <button onclick="handleDishOrderClick('${dish.id}', '${(dish.name || '').replace(/'/g, "\\'")}')" class="px-5 py-2 bg-brand-red hover:bg-brand-red-dark text-white rounded-full font-heading font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 hover:scale-102 cursor-pointer">
            <span>${(typeof userFulfillment !== 'undefined' && userFulfillment.isOutOfZone) ? 'Order / Inquire' : ((typeof userFulfillment !== 'undefined' && userFulfillment.mode === 'takeaway') ? 'Takeaway' : 'Order')}</span>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

function loadMoreMenuItems() {
  displayedMenuLimit += 12;
  renderMenuItems();
}

// ================= HAVERSINE DISTANCE CALCULATOR =================
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) return 99999;
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Global Filter State for Deep Filtering & Geolocation
let selectedContinent = 'All';
let selectedCountry = 'All';
let selectedState = 'All';
let selectedCity = 'All';
let selectedArea = 'All';
let userCoordinates = null; // { lat, lng }
let nearestBranchId = null;
let filterDineInOnly = false;
let filterLateNightOnly = false;
let filterCateringOnly = false;

// ================= LOAD BRANCHES & MAP =================
async function loadBranchesData() {
  try {
    // Primary: load rich international dataset from data/branches.json
    try {
      const res = await fetch('data/branches.json');
      if (res.ok) {
        branchesData = await res.json();
      }
    } catch (e) {
      console.warn('Local branches.json read fallback:', e);
    }

    // Fallback if empty: fetch from live API
    if (!branchesData || branchesData.length === 0) {
      try {
        const liveRes = await fetch(REDBOX_API.BRANCHES, { signal: AbortSignal.timeout(3000) });
        if (liveRes.ok) {
          const liveJson = await liveRes.json();
          branchesData = liveJson.results || liveJson.data || liveJson;
        }
      } catch (err) {
        console.warn('Live API unavailable:', err);
      }
    }

    console.log(`Loaded ${branchesData.length} global Red Box branches`);
    updateDynamicBranchCounters();

    // If on branches locator page (branches.html or branches.html)
    if (document.getElementById('branchCardsContainer')) {
      initDeepBranchFilters();
      initLeafletMap();
      renderBranchesList();
    }

    // If on menu page with ?branch= query parameter
    if (document.getElementById('branchContextHeader')) {
      initMenuBranchContext();
    }

    // Initialize Global Location State & Nearest Hub Routing across all pages
    initGlobalLocationState();

    // Initialize Menu Location & Fulfillment Pipeline if on menu.html
    if (document.getElementById('menuFulfillmentBar')) {
      initMenuLocationPipeline();
    }

    // Initialize Catering Deck if on catering.html
    if (document.getElementById('cateringNearbyHubsCardsGrid')) {
      renderNearbyHubsCards('cateringNearbyHubsCardsGrid', 'catering');
      updateCateringFulfillmentBarUI();
    }

  } catch (err) {
    console.error('Error loading branches:', err);
  }
}

// ================= DYNAMIC REGIONAL STATS & COUNTERS =================
function updateDynamicBranchCounters() {
  if (!branchesData || branchesData.length === 0) return;
  const count = branchesData.length;
  const uniqueCities = getWebsiteCanonicalGeographicList('city');
  const uniqueCountries = getWebsiteCanonicalGeographicList('country');

  // Hero section stats on homepage
  const elBranchCount = document.getElementById('hero-stat-branches-count');
  if (elBranchCount) elBranchCount.innerText = `${count}+`;

  const elRegionCount = document.getElementById('hero-stat-regions-count');
  if (elRegionCount) elRegionCount.innerText = `Across ${uniqueCities.length} Regions`;

  // Mobile nav badges
  const elNavCount = document.getElementById('nav-branches-badge');
  if (elNavCount) elNavCount.innerText = `${count}+ Hubs`;
  document.querySelectorAll('.nav-branches-count-badge').forEach(el => {
    el.innerText = `${count}+ Hubs`;
  });

  // Footer Regional Hubs text
  const elFooterHubs = document.getElementById('footer-regional-hubs-text');
  if (elFooterHubs) {
    const cityCounts = {};
    branchesData.forEach(b => {
      const c = (b.city || '').trim();
      if (c) cityCounts[c] = (cityCounts[c] || 0) + 1;
    });
    const sortedCities = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]);
    const summaryStr = sortedCities.slice(0, 11).map(([city, num]) => num > 1 ? `${city} (${num})` : city).join(' · ');
    elFooterHubs.innerText = summaryStr;
  }
}

// ================= DEEP HIERARCHICAL FILTERS =================
function getWebsiteCanonicalGeographicList(key, parentFilters = {}) {
  let list = branchesData || [];
  if (parentFilters.continent && parentFilters.continent !== 'All') {
    const pCont = parentFilters.continent.toLowerCase().trim();
    list = list.filter(b => (b.continent || '').toLowerCase().trim() === pCont);
  }
  if (parentFilters.country && parentFilters.country !== 'All') {
    const pCount = parentFilters.country.toLowerCase().trim();
    list = list.filter(b => (b.country || '').toLowerCase().trim() === pCount);
  }
  if (parentFilters.state && parentFilters.state !== 'All') {
    const pState = parentFilters.state.toLowerCase().trim();
    list = list.filter(b => (b.state || '').toLowerCase().trim() === pState);
  }
  if (parentFilters.city && parentFilters.city !== 'All') {
    const pCity = parentFilters.city.toLowerCase().trim();
    list = list.filter(b => (b.city || '').toLowerCase().trim() === pCity);
  }

  const map = new Map();
  list.forEach(b => {
    const raw = (b[key] || '').trim();
    if (raw && !map.has(raw.toLowerCase())) {
      map.set(raw.toLowerCase(), raw);
    }
  });
  return Array.from(map.values()).sort((a, b) => a.localeCompare(b));
}

function initDeepBranchFilters() {
  populateContinentFilter();
  populateCountryFilter('All');
  populateStateFilter('All', 'All');
  populateCityFilter('All', 'All', 'All');
  populateAreaFilter('All', 'All', 'All', 'All');
  updateFilterBreadcrumbs();
}

function populateContinentFilter() {
  const el = document.getElementById('filterContinent');
  if (!el) return;
  const rawContinents = getWebsiteCanonicalGeographicList('continent');
  const continents = ['All', ...rawContinents];
  el.innerHTML = continents.map(c => `
    <option value="${c}" ${c.toLowerCase() === selectedContinent.toLowerCase() ? 'selected' : ''}>
      ${c === 'All' ? `All Continents (${rawContinents.length} Global Hubs)` : c}
    </option>
  `).join('');
}

function populateCountryFilter(continent) {
  const el = document.getElementById('filterCountry');
  if (!el) return;
  const rawCountries = getWebsiteCanonicalGeographicList('country', { continent });
  const countries = ['All', ...rawCountries];
  el.innerHTML = countries.map(c => `
    <option value="${c}" ${c.toLowerCase() === selectedCountry.toLowerCase() ? 'selected' : ''}>
      ${c === 'All' ? `All Countries (${rawCountries.length})` : c}
    </option>
  `).join('');
}

function populateStateFilter(continent, country) {
  const el = document.getElementById('filterState');
  if (!el) return;
  const rawStates = getWebsiteCanonicalGeographicList('state', { continent, country });
  const states = ['All', ...rawStates];
  el.innerHTML = states.map(s => `
    <option value="${s}" ${s.toLowerCase() === selectedState.toLowerCase() ? 'selected' : ''}>
      ${s === 'All' ? `All States / Provinces (${rawStates.length})` : s}
    </option>
  `).join('');
}

function populateCityFilter(continent, country, state) {
  const el = document.getElementById('filterCity');
  if (!el) return;
  const rawCities = getWebsiteCanonicalGeographicList('city', { continent, country, state });
  const cities = ['All', ...rawCities];
  
  // Sort with Chennai first
  cities.sort((a, b) => {
    if (a === 'All') return -1;
    if (b === 'All') return 1;
    if (a.toLowerCase() === 'chennai') return -1;
    if (b.toLowerCase() === 'chennai') return 1;
    return a.localeCompare(b);
  });

  el.innerHTML = cities.map(c => `
    <option value="${c}" ${c.toLowerCase() === selectedCity.toLowerCase() ? 'selected' : ''}>
      ${c === 'All' ? `All Cities (${rawCities.length})` : c}
    </option>
  `).join('');
}

function populateAreaFilter(continent, country, state, city) {
  const el = document.getElementById('filterArea');
  if (!el) return;
  const rawAreas = getWebsiteCanonicalGeographicList('area', { continent, country, state, city });
  const areas = ['All', ...rawAreas];
  areas.sort((a, b) => a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b));

  el.innerHTML = areas.map(a => `
    <option value="${a}" ${a.toLowerCase() === selectedArea.toLowerCase() ? 'selected' : ''}>
      ${a === 'All' ? `All Areas (${rawAreas.length})` : a}
    </option>
  `).join('');
}

// Cascading change event handlers
function onContinentChange(val) {
  selectedContinent = val;
  selectedCountry = 'All';
  selectedState = 'All';
  selectedCity = 'All';
  selectedArea = 'All';
  
  populateCountryFilter(selectedContinent);
  populateStateFilter(selectedContinent, selectedCountry);
  populateCityFilter(selectedContinent, selectedCountry, selectedState);
  populateAreaFilter(selectedContinent, selectedCountry, selectedState, selectedCity);
  
  updateFilterBreadcrumbs();
  renderBranchesList();
  syncMapToFilter();
}

function onCountryChange(val) {
  selectedCountry = val;
  selectedState = 'All';
  selectedCity = 'All';
  selectedArea = 'All';
  
  populateStateFilter(selectedContinent, selectedCountry);
  populateCityFilter(selectedContinent, selectedCountry, selectedState);
  populateAreaFilter(selectedContinent, selectedCountry, selectedState, selectedCity);

  updateFilterBreadcrumbs();
  renderBranchesList();
  syncMapToFilter();
}

function onStateChange(val) {
  selectedState = val;
  selectedCity = 'All';
  selectedArea = 'All';
  
  populateCityFilter(selectedContinent, selectedCountry, selectedState);
  populateAreaFilter(selectedContinent, selectedCountry, selectedState, selectedCity);

  updateFilterBreadcrumbs();
  renderBranchesList();
  syncMapToFilter();
}

function onCityChange(val) {
  selectedCity = val;
  selectedArea = 'All';
  
  populateAreaFilter(selectedContinent, selectedCountry, selectedState, selectedCity);

  updateFilterBreadcrumbs();
  renderBranchesList();
  syncMapToFilter();
}

function onAreaChange(val) {
  selectedArea = val;
  updateFilterBreadcrumbs();
  renderBranchesList();
  syncMapToFilter();
}

function applyFacilityFilters() {
  const dineInEl = document.getElementById('facilityDineIn');
  const lateEl = document.getElementById('facilityLateNight');
  const caterEl = document.getElementById('facilityCatering');

  filterDineInOnly = dineInEl ? dineInEl.checked : false;
  filterLateNightOnly = lateEl ? lateEl.checked : false;
  filterCateringOnly = caterEl ? caterEl.checked : false;

  renderBranchesList();
  updateMapMarkers();
}

function handleBranchSearch(val) {
  branchSearchQuery = val.toLowerCase().trim();
  renderBranchesList();
  updateMapMarkers();
}

function resetAllFilters() {
  selectedContinent = 'All';
  selectedCountry = 'All';
  selectedState = 'All';
  selectedCity = 'All';
  selectedArea = 'All';
  branchSearchQuery = '';
  nearestBranchId = null;
  filterDineInOnly = false;
  filterLateNightOnly = false;
  filterCateringOnly = false;

  const searchInput = document.getElementById('branchSearchInput');
  if (searchInput) searchInput.value = '';

  const dEl = document.getElementById('facilityDineIn');
  const lEl = document.getElementById('facilityLateNight');
  const cEl = document.getElementById('facilityCatering');
  if (dEl) dEl.checked = false;
  if (lEl) lEl.checked = false;
  if (cEl) cEl.checked = false;

  initDeepBranchFilters();
  renderBranchesList();
  syncMapToFilter();
}

function updateFilterBreadcrumbs() {
  const container = document.getElementById('filterBreadcrumbs');
  if (!container) return;

  const parts = [];
  if (selectedContinent !== 'All') parts.push(selectedContinent);
  if (selectedCountry !== 'All') parts.push(selectedCountry);
  if (selectedState !== 'All') parts.push(selectedState);
  if (selectedCity !== 'All') parts.push(selectedCity);
  if (selectedArea !== 'All') parts.push(selectedArea);

  if (parts.length === 0) {
    container.innerHTML = `<span class="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-800 font-bold text-xs">Global Network (All Hubs)</span>`;
  } else {
    container.innerHTML = parts.map((p, idx) => `
      <span class="px-2.5 py-1 rounded-lg bg-red-50 text-brand-red font-bold text-xs flex items-center gap-1">
        ${p} ${idx < parts.length - 1 ? '<span class="text-zinc-400 font-normal">›</span>' : ''}
      </span>
    `).join('');
  }
}

// ================= RENDER BRANCHES LIST =================
function getFilteredBranches() {
  return branchesData.filter(b => {
    if (selectedContinent !== 'All' && (b.continent || '').toLowerCase().trim() !== selectedContinent.toLowerCase().trim()) return false;
    if (selectedCountry !== 'All' && (b.country || '').toLowerCase().trim() !== selectedCountry.toLowerCase().trim()) return false;
    if (selectedState !== 'All' && (b.state || '').toLowerCase().trim() !== selectedState.toLowerCase().trim()) return false;
    if (selectedCity !== 'All' && (b.city || '').toLowerCase().trim() !== selectedCity.toLowerCase().trim()) return false;
    if (selectedArea !== 'All' && (b.area || '').toLowerCase().trim() !== selectedArea.toLowerCase().trim()) return false;

    if (filterDineInOnly && (!b.facilities || !b.facilities.some(f => f.toLowerCase().includes('dine')))) return false;
    if (filterLateNightOnly && (!b.facilities || !b.facilities.some(f => f.toLowerCase().includes('late') || (b.hours && (b.hours.includes('01:') || b.hours.includes('02:') || b.hours.includes('12:00 AM')))))) return false;
    if (filterCateringOnly && (!b.facilities || !b.facilities.some(f => f.toLowerCase().includes('catering')))) return false;

    if (branchSearchQuery) {
      const q = branchSearchQuery;
      const matchName = b.name && b.name.toLowerCase().includes(q);
      const matchAddress = b.address && b.address.toLowerCase().includes(q);
      const matchCity = b.city && b.city.toLowerCase().includes(q);
      const matchArea = b.area && b.area.toLowerCase().includes(q);
      const matchCode = b.branch_code && b.branch_code.toLowerCase().includes(q);
      if (!matchName && !matchAddress && !matchCity && !matchArea && !matchCode) return false;
    }

    return true;
  });
}

function renderBranchesList() {
  const container = document.getElementById('branchCardsContainer');
  const countEl = document.getElementById('visibleBranchCount');
  const totalEl = document.getElementById('totalBranchCount');

  if (totalEl) totalEl.textContent = branchesData.length;

  const filtered = getFilteredBranches();

  if (countEl) countEl.textContent = filtered.length;

  if (!container) return;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full p-10 bg-white rounded-3xl border border-zinc-200 text-center text-zinc-500 shadow-xs">
        <i data-lucide="map-pin-off" class="w-10 h-10 mx-auto mb-3 text-zinc-300"></i>
        <h4 class="font-heading font-bold text-base text-zinc-800">No branches match your filter criteria</h4>
        <p class="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">Try broadening your continent/city selection on the right or resetting all filters.</p>
        <button onclick="resetAllFilters()" class="mt-4 px-4 py-2 bg-brand-red text-white text-xs font-bold rounded-xl shadow-xs hover:bg-brand-red-dark transition-all cursor-pointer">
          Reset All Filters
        </button>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  container.innerHTML = filtered.map(b => {
    const isNearest = (b.id === nearestBranchId);
    const distanceBadge = (b.distanceKm !== undefined) ?
      `<span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px] flex items-center gap-1">
        <i data-lucide="navigation" class="w-2.5 h-2.5"></i> ${b.distanceKm.toFixed(1)} km away
      </span>` : '';

    const nearestRibbon = isNearest ?
      `<div class="mb-2 px-2.5 py-1 rounded-lg bg-emerald-500 text-white font-extrabold text-[10px] uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs">
        <i data-lucide="check-circle" class="w-3 h-3"></i> Nearest Store to You
      </div>` : '';

    const mapsLink = `https://www.google.com/maps/dir/?api=1&destination=${b.latitude},${b.longitude}`;
    const swiggyLink = (b.deliveryLinks && b.deliveryLinks.swiggy) || 'https://www.swiggy.com/direct/brand/1636';

    return `
      <div class="bg-white rounded-3xl p-5 sm:p-6 border ${isNearest ? 'border-2 border-emerald-500 shadow-md ring-2 ring-emerald-500/20' : 'border-zinc-200 shadow-xs hover:border-brand-red/40 hover:shadow-md'} transition-all flex flex-col justify-between group">
        <div>
          ${nearestRibbon}
          
          <div class="flex items-start justify-between gap-3 mb-2">
            <div>
              <div class="flex items-center gap-1.5 flex-wrap mb-1">
                <span class="text-[10px] font-mono font-bold text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">${b.branch_code || 'RBX-001'}</span>
                <span class="text-[10px] font-bold text-brand-red bg-red-50 px-2 py-0.5 rounded uppercase tracking-wider">${b.city}, ${b.country}</span>
                ${distanceBadge}
              </div>
              <h4 class="font-heading font-extrabold text-lg text-zinc-900 tracking-wide group-hover:text-brand-red transition-colors">${b.name}</h4>
              <span class="text-[11px] font-semibold text-zinc-400 block">${b.area} · PIN: ${b.postalCode || '600001'}</span>
            </div>
            <span class="flex-shrink-0 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Open
            </span>
          </div>

          <p class="text-xs text-zinc-600 mb-4 leading-relaxed line-clamp-2">
            ${b.address}
          </p>

          <div class="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-zinc-500 mb-4 pb-3 border-b border-zinc-100">
            <span class="flex items-center gap-1 text-[11px]">
              <i data-lucide="clock" class="w-3.5 h-3.5 text-zinc-400"></i>
              <span>${b.hours || '11:00 AM – 11:30 PM'}</span>
            </span>
            <a href="tel:${b.phone || '+918939444411'}" class="flex items-center gap-1 text-[11px] font-bold text-zinc-700 hover:text-brand-red">
              <i data-lucide="phone" class="w-3.5 h-3.5 text-brand-red"></i>
              <span>${b.phone || '+91 89394 44411'}</span>
            </a>
          </div>

          <div class="flex flex-wrap gap-1.5 mb-5">
            ${(b.facilities || ['Dine-In', 'Takeaway', '45-Min Heat Lock']).slice(0, 3).map(f => `
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600">${f}</span>
            `).join('')}
          </div>
        </div>

        <div class="space-y-2 pt-2">
          <!-- Primary CTA: View Menu & Catering -->
          <a href="menu.html?branch=${encodeURIComponent(b.id)}" class="w-full py-2.5 bg-brand-red hover:bg-brand-red-dark text-white rounded-xl text-xs font-heading font-extrabold uppercase tracking-wider text-center shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer">
            <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
            <span>View Branch Menu & Catering</span>
          </a>

          <!-- Secondary Actions -->
          <div class="grid grid-cols-2 gap-2">
            <button onclick="openBranchDetailModal('${b.id}')" class="py-2 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer">
              <i data-lucide="info" class="w-3 h-3 text-zinc-500"></i>
              <span>Full Details</span>
            </button>
            <a href="${mapsLink}" target="_blank" class="py-2 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-[11px] font-bold transition-colors flex items-center justify-center gap-1">
              <i data-lucide="navigation-2" class="w-3 h-3 text-brand-red"></i>
              <span>Directions</span>
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

// ================= LEAFLET MAP & FILTER SYNCHRONIZATION =================
function initLeafletMap() {
  const mapElement = document.getElementById('leafletMap');
  if (!mapElement || typeof L === 'undefined') return;

  if (mapInstance) {
    mapInstance.remove();
  }

  // World / Regional initial view centered
  mapInstance = L.map('leafletMap').setView([20, 55], 3);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(mapInstance);

  updateMapMarkers();
}

function syncMapToFilter() {
  if (!mapInstance || typeof L === 'undefined') return;

  const filtered = getFilteredBranches();

  // If specific area or single branch matched
  if (selectedArea !== 'All' && filtered.length > 0) {
    const b = filtered[0];
    mapInstance.flyTo([b.latitude, b.longitude], 15, { duration: 1.2 });
    document.getElementById('mapScopeTitle').textContent = `Map View: ${b.name} (${b.area})`;
    updateMapMarkers();
    return;
  }

  // If city selected
  if (selectedCity !== 'All' && filtered.length > 0) {
    const latSum = filtered.reduce((s, b) => s + b.latitude, 0);
    const lngSum = filtered.reduce((s, b) => s + b.longitude, 0);
    mapInstance.flyTo([latSum / filtered.length, lngSum / filtered.length], 12, { duration: 1.2 });
    document.getElementById('mapScopeTitle').textContent = `Map View: ${selectedCity} Metro Area (${filtered.length} Branches)`;
    updateMapMarkers();
    return;
  }

  // If country selected
  if (selectedCountry !== 'All') {
    if (selectedCountry === 'India') mapInstance.flyTo([16.5, 80], 5, { duration: 1.2 });
    else if (selectedCountry === 'United Arab Emirates') mapInstance.flyTo([25.1, 55.2], 8, { duration: 1.2 });
    else if (selectedCountry === 'Singapore') mapInstance.flyTo([1.3, 103.8], 11, { duration: 1.2 });
    else if (selectedCountry === 'United Kingdom') mapInstance.flyTo([52, -0.5], 6, { duration: 1.2 });
    else if (selectedCountry === 'United States') mapInstance.flyTo([39.5, -98.3], 4, { duration: 1.2 });
    else if (filtered.length > 0) mapInstance.flyTo([filtered[0].latitude, filtered[0].longitude], 6, { duration: 1.2 });
    document.getElementById('mapScopeTitle').textContent = `Map View: ${selectedCountry} Network`;
    updateMapMarkers();
    return;
  }

  // If continent selected
  if (selectedContinent !== 'All') {
    if (selectedContinent === 'Asia') mapInstance.flyTo([15, 80], 4, { duration: 1.2 });
    else if (selectedContinent === 'Middle East') mapInstance.flyTo([25, 50], 5, { duration: 1.2 });
    else if (selectedContinent === 'Europe') mapInstance.flyTo([52, 5], 4, { duration: 1.2 });
    else if (selectedContinent === 'North America') mapInstance.flyTo([40, -95], 4, { duration: 1.2 });
    document.getElementById('mapScopeTitle').textContent = `Map View: ${selectedContinent} Continental Hubs`;
    updateMapMarkers();
    return;
  }

  // Global All
  mapInstance.flyTo([20, 55], 3, { duration: 1.2 });
  document.getElementById('mapScopeTitle').textContent = `Interactive World & Regional Map (57+ Hubs)`;
  updateMapMarkers();
}

function updateMapMarkers() {
  if (!mapInstance || typeof L === 'undefined') return;

  mapMarkers.forEach(m => mapInstance.removeLayer(m));
  mapMarkers = [];

  const filtered = getFilteredBranches();

  const counterEl = document.getElementById('mapBranchCounter');
  if (counterEl) counterEl.textContent = `${filtered.length} active branches in current view`;

  // Custom Red Box Brand Pin (SVG Wok / Box silhouette - clean, no AI icons)
  const redPinIcon = L.divIcon({
    className: 'redbox-map-pin',
    html: `
      <div style="cursor:pointer; transform: translate(-50%, -100%);">
        <svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="#D9232D"/>
          <circle cx="14" cy="14" r="11" fill="white"/>
          <path d="M9 10H19L17.5 18H10.5L9 10Z" fill="#D9232D"/>
          <line x1="14" y1="8" x2="14" y2="12" stroke="#D9232D" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
    `,
    iconSize: [28, 36],
    iconAnchor: [14, 36]
  });

  filtered.forEach(b => {
    const marker = L.marker([b.latitude, b.longitude], { icon: redPinIcon }).addTo(mapInstance);
    
    const popupContent = `
      <div style="font-family:Plus Jakarta Sans, sans-serif; min-width:220px; padding:12px;">
        <div style="display:flex; align-items:center; justify-content:space-between; gap:6px; margin-bottom:4px;">
          <span style="font-size:9px; font-weight:800; color:#D9232D; text-transform:uppercase; background:#FFF1F2; padding:2px 6px; border-radius:4px;">${b.city}, ${b.country}</span>
          <span style="font-size:9px; font-weight:700; color:#059669;">● Open</span>
        </div>
        <div style="font-size:14px; font-weight:800; color:#1C1D1F; margin:2px 0 4px;">${b.name}</div>
        <div style="font-size:11px; color:#52525B; line-height:1.4; margin-bottom:8px;">${b.address}</div>
        <div style="font-size:11px; color:#71717A; margin-bottom:10px;">⏰ ${b.hours || '11:00 AM – 11:30 PM'}</div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          <a href="menu.html?branch=${encodeURIComponent(b.id)}" style="display:block; text-align:center; background:#D9232D; color:#FFFFFF; font-size:11px; font-weight:800; text-transform:uppercase; padding:7px 10px; border-radius:8px; text-decoration:none;">View Menu & Catering</a>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${b.latitude},${b.longitude}" target="_blank" style="display:block; text-align:center; background:#F4F4F5; color:#27272A; font-size:11px; font-weight:700; padding:5px 8px; border-radius:8px; text-decoration:none;">Get Directions</a>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent);
    mapMarkers.push(marker);
  });
}

// ================= GEOLOCATION: FIND NEAREST BRANCH =================
function findNearestBranch() {
  const statusAlert = document.getElementById('locationStatusAlert');
  const statusText = document.getElementById('locationStatusText');
  const locBtn = document.getElementById('btnFindNearest');

  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser.');
    return;
  }

  if (statusAlert) statusAlert.classList.remove('hidden');
  if (statusText) statusText.textContent = 'Requesting GPS access to find the nearest Red Box store...';
  if (locBtn) locBtn.classList.add('opacity-75');

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      if (locBtn) locBtn.classList.remove('opacity-75');
      const userLat = pos.coords.latitude;
      const userLng = pos.coords.longitude;
      userCoordinates = { lat: userLat, lng: userLng };

      // Calculate distance for all branches
      branchesData.forEach(b => {
        b.distanceKm = calculateDistanceKm(userLat, userLng, b.latitude, b.longitude);
      });

      // Sort ascending by distance
      branchesData.sort((a, b) => a.distanceKm - b.distanceKm);
      const closest = branchesData[0];
      nearestBranchId = closest.id;

      if (statusText) {
        statusText.innerHTML = `<strong>Closest Red Box located:</strong> ${closest.name} (${closest.distanceKm.toFixed(1)} km away in ${closest.area}, ${closest.city}). Showing full store details below.`;
      }

      // Add user location pulsing marker on map
      if (mapInstance && typeof L !== 'undefined') {
        if (window.userMapMarker) mapInstance.removeLayer(window.userMapMarker);
        const bluePulseIcon = L.divIcon({
          className: 'user-pulse-pin',
          html: `<div style="background:#2563EB; width:20px; height:20px; border-radius:50%; border:3px solid white; box-shadow:0 0 12px rgba(37,99,235,0.9); display:flex; align-items:center; justify-content:center;">
                   <div style="background:white; width:6px; height:6px; border-radius:50%;"></div>
                 </div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
        window.userMapMarker = L.marker([userLat, userLng], { icon: bluePulseIcon }).addTo(mapInstance);
        window.userMapMarker.bindPopup('<b>Your Current Location</b>');

        // Zoom map to show both user and closest store
        const bounds = L.latLngBounds([[userLat, userLng], [closest.latitude, closest.longitude]]);
        mapInstance.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }

      renderBranchesList();
      updateMapMarkers();

      // Automatically open the Full Store Data Drawer!
      openBranchDetailModal(closest.id);
    },
    (err) => {
      if (locBtn) locBtn.classList.remove('opacity-75');
      if (statusText) {
        statusText.innerHTML = 'Location access was not enabled or timed out. Please choose your city/area from the Deep Filter on the right.';
      }
      console.warn('Geolocation error:', err.message);
    },
    { timeout: 10000, enableHighAccuracy: true }
  );
}

function dismissLocationAlert() {
  const alertEl = document.getElementById('locationStatusAlert');
  if (alertEl) alertEl.classList.add('hidden');
}

// ================= FULL BRANCH DATA PROFILE MODAL =================
function openBranchDetailModal(branchId) {
  const b = branchesData.find(item => item.id === branchId || item.branch_code === branchId);
  if (!b) return;

  const modal = document.getElementById('branchDetailModal');
  if (!modal) return;

  const codeEl = document.getElementById('modalStoreCode');
  const regEl = document.getElementById('modalRegionBadge');
  const distEl = document.getElementById('modalDistanceBadge');
  const nameEl = document.getElementById('modalBranchName');
  const areaEl = document.getElementById('modalBranchArea');
  const addrEl = document.getElementById('modalAddress');
  const hoursEl = document.getElementById('modalHours');
  const phoneText = document.getElementById('modalPhoneText');
  const phoneLink = document.getElementById('modalPhoneLink');
  const mgrEl = document.getElementById('modalManagerText');
  const dirLink = document.getElementById('modalDirectionsLink');
  const menuBtn = document.getElementById('modalMenuCateringBtn');
  const facList = document.getElementById('modalFacilitiesList');

  if (codeEl) codeEl.textContent = b.branch_code || 'RBX-IND-001';
  if (regEl) regEl.textContent = `${b.continent} · ${b.country}`;
  if (nameEl) nameEl.textContent = b.name;
  if (areaEl) areaEl.textContent = `${b.area} · ${b.city}, ${b.state}`;
  if (addrEl) addrEl.textContent = b.address;
  if (hoursEl) hoursEl.textContent = b.hours || '11:00 AM – 11:30 PM';
  if (phoneText) phoneText.textContent = b.phone || '+91 89394 44411';
  if (phoneLink) phoneLink.href = `tel:${b.phone || '+918939444411'}`;
  if (mgrEl) mgrEl.textContent = `Direct Store Manager: ${b.managerPhone || '+91 98401 23456'}`;

  if (distEl) {
    if (b.distanceKm !== undefined) {
      distEl.textContent = `${b.distanceKm.toFixed(1)} km from your location`;
      distEl.classList.remove('hidden');
    } else {
      distEl.classList.add('hidden');
    }
  }

  if (dirLink) {
    dirLink.href = `https://www.google.com/maps/dir/?api=1&destination=${b.latitude},${b.longitude}`;
  }

  if (menuBtn) {
    menuBtn.href = `menu.html?branch=${encodeURIComponent(b.id)}`;
  }

  if (facList) {
    const facs = b.facilities || ['Dine-In', 'Takeaway', '45-Min Heat Lock Delivery', 'Catering Base Hub'];
    facList.innerHTML = facs.map(f => `
      <span class="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 font-semibold text-[11px]">${f}</span>
    `).join('');
  }

  const swiggy = document.getElementById('modalSwiggyLink');
  const zomato = document.getElementById('modalZomatoLink');
  const whatsapp = document.getElementById('modalWhatsappLink');
  if (swiggy) swiggy.href = (b.deliveryLinks && b.deliveryLinks.swiggy) || 'https://www.swiggy.com/direct/brand/1636';
  if (zomato) zomato.href = (b.deliveryLinks && b.deliveryLinks.zomato) || 'https://www.zomato.com/search?query=RedBox';
  if (whatsapp) whatsapp.href = (b.deliveryLinks && b.deliveryLinks.whatsapp) || `https://wa.me/918939444411?text=Hi%20Red%20Box%20${encodeURIComponent(b.name)}`;

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
  if (window.lucide) window.lucide.createIcons();
}

function closeBranchDetailModal() {
  const modal = document.getElementById('branchDetailModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

// ================= MENU PAGE BRANCH CONTEXT INITIALIZER =================
function initMenuBranchContext() {
  const params = new URLSearchParams(window.location.search);
  const branchId = params.get('branch');
  if (!branchId) return;

  const branch = branchesData.find(b => b.id === branchId || b.branch_code === branchId);
  if (!branch) return;

  const header = document.getElementById('branchContextHeader');
  if (!header) return;

  header.classList.remove('hidden');
  const codeEl = document.getElementById('branchHeaderCode');
  const regEl = document.getElementById('branchHeaderRegion');
  const nameEl = document.getElementById('branchHeaderName');
  const addrEl = document.getElementById('branchHeaderAddress');

  if (codeEl) codeEl.textContent = branch.branch_code || 'RBX-IND-001';
  if (regEl) regEl.textContent = `${branch.continent} · ${branch.country} · ${branch.city}`;
  if (nameEl) nameEl.textContent = branch.name;
  if (addrEl) addrEl.textContent = `${branch.address} · Call: ${branch.phone} · Hours: ${branch.hours}`;

  // Pre-fill catering form with fulfilling store info
  const notesField = document.getElementById('cateringNotes');
  if (notesField) {
    notesField.value = `Fulfilling Store: ${branch.name} (${branch.branch_code}, ${branch.area}, ${branch.city})
`;
  }
  const subTitle = document.getElementById('cateringModalSubtitle');
  if (subTitle) {
    subTitle.textContent = `Event fulfilled directly by ${branch.name} · Store Manager: ${branch.managerPhone}`;
  }

  if (window.lucide) window.lucide.createIcons();
}

// ================= CATERING CALCULATOR =================
function calculateCateringEstimate() {
  const packageSelect = document.getElementById('calcPackage');
  const slider = document.getElementById('guestSlider');
  const guestDisplay = document.getElementById('guestCountDisplay');
  const costDisplay = document.getElementById('estimatedCostDisplay');

  if (!packageSelect || !slider || !costDisplay) return;

  const perHead = parseInt(packageSelect.value, 10);
  const guests = parseInt(slider.value, 10);
  const total = perHead * guests;

  if (guestDisplay) guestDisplay.textContent = guests;
  costDisplay.textContent = `₹ ${total.toLocaleString('en-IN')}`;
}

// ================= MENU GEOLOCATION, FULFILLMENT & OUT-OF-SERVICE PIPELINE =================
let userFulfillment = {
  isVerified: false,
  mode: 'delivery', // 'delivery' | 'takeaway'
  localityName: 'Location not verified',
  fullAddress: '45, G.N. Chetty Road, T. Nagar, Chennai - 600017',
  accuracyMeters: null,
  latitude: null,
  longitude: null,
  nearestBranch: null,
  distanceKm: null,
  isOutOfZone: false, // true if distance > 25km
  isTakeawayOnly: false, // true if distance > 12km and <= 25km
  pendingDishId: null
};

// Initialize global location state across all pages (index, menu, branches, etc.)
function initGlobalLocationState() {
  if (!branchesData || branchesData.length === 0) return;

  // 1. Check saved session in localStorage
  try {
    const saved = localStorage.getItem('redbox_fulfillment');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.isVerified && parsed.nearestBranch) {
        userFulfillment = { ...userFulfillment, ...parsed };
        updateGlobalDeliveryLinks(userFulfillment.nearestBranch);
        renderNearbyHubsCards('nearbyHubsCardsGrid', 'menu');
        renderNearbyHubsCards('cateringNearbyHubsCardsGrid', 'catering');
        updateCateringFulfillmentBarUI();
        return;
      }
    }
  } catch (e) {}

  // 2. Default active branch so all pages have an active nearest outlet
  const defaultBranch = branchesData.find(b => b.id === 'rbx-chn-tnagar') || branchesData[0];
  if (defaultBranch) {
    userFulfillment = {
      ...userFulfillment,
      isVerified: true,
      localityName: `${defaultBranch.area || defaultBranch.name}, ${defaultBranch.city}`,
      fullAddress: defaultBranch.address || `${defaultBranch.area}, ${defaultBranch.city}`,
      latitude: defaultBranch.latitude,
      longitude: defaultBranch.longitude,
      nearestBranch: defaultBranch,
      distanceKm: 2.2,
      isOutOfZone: false,
      isTakeawayOnly: false
    };
    updateGlobalDeliveryLinks(defaultBranch);
    renderNearbyHubsCards('nearbyHubsCardsGrid', 'menu');
    renderNearbyHubsCards('cateringNearbyHubsCardsGrid', 'catering');
    updateCateringFulfillmentBarUI();
  }
}

// Initialize pipeline on menu page load
function initMenuLocationPipeline() {
  const fulfillmentBar = document.getElementById('menuFulfillmentBar');
  if (!fulfillmentBar) return;

  // 1. Check for URL branch param (?branch=...)
  const params = new URLSearchParams(window.location.search);
  const branchParam = params.get('branch');
  if (branchParam && branchesData && branchesData.length > 0) {
    const matched = branchesData.find(b => b.id === branchParam || b.branch_code === branchParam);
    if (matched) {
      applyBranchLocation(matched, 1.2, `${matched.area || matched.name}, ${matched.city}`, matched.address);
      return;
    }
  }

  // 2. Check saved session in localStorage
  try {
    const saved = localStorage.getItem('redbox_fulfillment');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.isVerified && parsed.nearestBranch) {
        userFulfillment = { ...userFulfillment, ...parsed };
        if (!userFulfillment.fullAddress && userFulfillment.nearestBranch) {
          userFulfillment.fullAddress = userFulfillment.nearestBranch.address || userFulfillment.localityName;
        }
        updateFulfillmentBarUI();
        updateOutOfServiceBannerUI();
        renderMenuItems();
        updateGlobalDeliveryLinks(userFulfillment.nearestBranch);
        return;
      }
    }
  } catch (e) {
    console.warn('Could not read saved fulfillment state:', e);
  }

  // 3. Default to T. Nagar branch / address on first load so user immediately sees real delivery context
  if (branchesData && branchesData.length > 0) {
    const tnagarBranch = branchesData.find(b => b.id === 'rbx-chn-tnagar') || branchesData[0];
    setUserLocation(
      13.0418,
      80.2341,
      'T. Nagar, Chennai',
      tnagarBranch,
      2.2,
      '45, G.N. Chetty Road, T. Nagar, Chennai - 600017',
      12
    );
  }

  // 4. Prompt Geolocation if browser permits
  detectUserGPS(false);
}

// GPS Location Detector with High Accuracy & Reverse Geocoding
function detectUserGPS(isManualClick = false) {
  const statusMsg = document.getElementById('gpsStatusMessage');
  const btnDetect = document.getElementById('btnModalDetectGps');
  const btnDetectText = document.getElementById('btnModalDetectGpsText');

  if (statusMsg) statusMsg.textContent = 'Requesting high-accuracy GPS coordinates...';
  if (btnDetectText) btnDetectText.textContent = 'Locating...';
  if (btnDetect) btnDetect.disabled = true;

  if (!navigator.geolocation) {
    if (statusMsg) statusMsg.textContent = 'Geolocation not supported by your browser.';
    if (btnDetectText) btnDetectText.textContent = 'Unavailable';
    if (btnDetect) btnDetect.disabled = false;
    handleLocationDenied();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const accuracy = position.coords.accuracy || 15;
      
      // Calculate distance to all 57 branches
      const nearest = findNearestBranch(lat, lon);
      let locality = nearest.branch ? `${nearest.branch.area || nearest.branch.name}, ${nearest.branch.city}` : 'Your Neighborhood';
      let fullAddress = nearest.branch && nearest.branch.address ? nearest.branch.address : `${locality}`;

      // Reverse geocode via OpenStreetMap Nominatim for exact street address
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`, {
          signal: controller.signal,
          headers: { 'Accept-Language': 'en' }
        });
        clearTimeout(timeoutId);
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          const addr = geoData.address || {};
          const road = addr.road || addr.street || addr.pedestrian || addr.suburb || '';
          const houseNo = addr.house_number || '';
          const neighbourhood = addr.neighbourhood || addr.suburb || addr.residential || '';
          const city = addr.city || addr.town || addr.village || 'Chennai';
          const postcode = addr.postcode ? ` - ${addr.postcode}` : '';
          
          const streetPart = [houseNo, road].filter(Boolean).join(', ');
          const areaPart = neighbourhood || addr.city_district || '';
          
          if (streetPart && areaPart) {
            fullAddress = `${streetPart}, ${areaPart}, ${city}${postcode}`;
            locality = `${areaPart}, ${city}`;
          } else if (road) {
            fullAddress = `${road}, ${city}${postcode}`;
            locality = `${road}, ${city}`;
          } else if (geoData.display_name) {
            fullAddress = geoData.display_name.split(',').slice(0, 4).join(', ');
          }
        }
      } catch (err) {
        console.warn('Reverse geocoding timeout or error, using branch address fallback:', err);
      }
      
      setUserLocation(lat, lon, locality, nearest.branch, nearest.distance, fullAddress, accuracy);
      
      if (statusMsg) statusMsg.textContent = `Identified: ${fullAddress.slice(0, 45)}... (${nearest.distance.toFixed(1)} km to hub)`;
      if (btnDetectText) btnDetectText.textContent = 'Location Found!';
      if (btnDetect) btnDetect.disabled = false;

      // Close modal if manual click
      if (isManualClick) {
        setTimeout(() => {
          closeLocationSelectorModal();
        }, 500);
      }
    },
    (error) => {
      console.warn('Geolocation access error/denied:', error.message);
      if (statusMsg) {
        statusMsg.textContent = error.code === 1 ? 'Location permission denied by user.' : 'Unable to determine GPS location.';
      }
      if (btnDetectText) btnDetectText.textContent = 'Detect Location';
      if (btnDetect) btnDetect.disabled = false;

      handleLocationDenied();
    },
    { timeout: 8000, maximumAge: 0, enableHighAccuracy: true }
  );
}

function handleLocationDenied() {
  userFulfillment.isVerified = false;
  const statusChip = document.getElementById('serviceZoneStatusChip');
  const statusText = document.getElementById('serviceZoneStatusText');
  const localityDisplay = document.getElementById('currentLocalityDisplay');
  const branchInfoDisplay = document.getElementById('nearestBranchInfoDisplay');
  const btnRequest = document.getElementById('btnRequestLocationAccess');

  if (statusChip) {
    statusChip.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center gap-1';
  }
  if (statusText) statusText.textContent = 'Location Unverified';
  if (localityDisplay) localityDisplay.textContent = 'Share location to check availability';
  if (branchInfoDisplay) branchInfoDisplay.textContent = 'Viewing 270+ master recipes in catalog mode';
  if (btnRequest) btnRequest.classList.remove('hidden');

  updateOutOfServiceBannerUI();
  renderMenuItems();
}

// Distance Calculation Helpers
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function findNearestBranch(lat, lon) {
  if (!branchesData || branchesData.length === 0) return { branch: null, distance: 9999 };
  let minDistance = Infinity;
  let nearestBranch = null;

  branchesData.forEach(branch => {
    const dist = calculateDistanceKm(lat, lon, branch.latitude, branch.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      nearestBranch = branch;
    }
  });

  return { branch: nearestBranch, distance: minDistance };
}

// Find N nearest branches from coordinate (sorted by distance)
function findNearestBranches(lat, lon, count = 3) {
  if (!branchesData || branchesData.length === 0) return [];
  const list = branchesData.map(b => {
    const dist = calculateDistanceKm(lat, lon, b.latitude, b.longitude);
    return { branch: b, distance: Math.round(dist * 10) / 10 };
  });
  list.sort((a, b) => a.distance - b.distance);
  return list.slice(0, count);
}

// Set user location state with complete fullAddress
function setUserLocation(lat, lon, localityName, branch, distanceKm, fullAddress = null, accuracy = null) {
  const isOutOfZone = distanceKm > 25;
  const isTakeawayOnly = distanceKm > 12 && distanceKm <= 25;

  const resolvedAddress = fullAddress || (branch && branch.address ? branch.address : localityName);

  userFulfillment = {
    isVerified: true,
    mode: (isTakeawayOnly || isOutOfZone) ? 'takeaway' : userFulfillment.mode,
    localityName: localityName,
    fullAddress: resolvedAddress,
    accuracyMeters: accuracy,
    latitude: lat,
    longitude: lon,
    nearestBranch: branch,
    distanceKm: Math.round(distanceKm * 10) / 10,
    isOutOfZone: isOutOfZone,
    isTakeawayOnly: isTakeawayOnly,
    pendingDishId: userFulfillment.pendingDishId
  };

  try {
    localStorage.setItem('redbox_fulfillment', JSON.stringify(userFulfillment));
  } catch (e) {}

  updateFulfillmentBarUI();
  updateOutOfServiceBannerUI();
  renderMenuItems();
  updateGlobalDeliveryLinks(branch);
  renderNearbyHubsCards('nearbyHubsCardsGrid', 'menu');
  renderNearbyHubsCards('cateringNearbyHubsCardsGrid', 'catering');
  updateCateringFulfillmentBarUI();

  // If there was a pending dish order waiting for location verification, execute it
  if (userFulfillment.pendingDishId) {
    const dishId = userFulfillment.pendingDishId;
    userFulfillment.pendingDishId = null;
    setTimeout(() => {
      handleDishOrderClick(dishId);
    }, 400);
  }
}

// Manual delivery address save handler
function saveManualDeliveryAddress() {
  const flatEl = document.getElementById('manualAddressFlat');
  const streetEl = document.getElementById('manualAddressStreet');
  const areaEl = document.getElementById('manualAddressArea');
  const pincodeEl = document.getElementById('manualAddressPincode');

  const flat = flatEl ? flatEl.value.trim() : '';
  const street = streetEl ? streetEl.value.trim() : '';
  const area = areaEl ? areaEl.value.trim() : '';
  const pincode = pincodeEl ? pincodeEl.value.trim() : '';

  if (!street && !area && !flat) {
    alert('Please enter at least a street or area name.');
    return;
  }

  // Combine full address
  const parts = [];
  if (flat) parts.push(flat);
  if (street) parts.push(street);
  if (area) parts.push(area);
  let fullAddr = parts.join(', ');
  if (pincode) fullAddr += (fullAddr ? ` - ${pincode}` : pincode);

  // Match nearest branch based on area text or fallback to T. Nagar/Anna Nagar
  let matchedBranch = null;
  if (branchesData && branchesData.length > 0) {
    const searchStr = `${area} ${street}`.toLowerCase();
    matchedBranch = branchesData.find(b => {
      const bStr = `${b.area} ${b.name} ${b.address}`.toLowerCase();
      return bStr.includes(area.toLowerCase()) || (street && bStr.includes(street.toLowerCase()));
    });
    if (!matchedBranch) {
      matchedBranch = branchesData.find(b => b.id === 'rbx-chn-tnagar') || branchesData[0];
    }
  }

  const distanceKm = 1.8; // default in-zone distance for manually specified address
  setUserLocation(
    matchedBranch ? matchedBranch.latitude : 13.0418,
    matchedBranch ? matchedBranch.longitude : 80.2341,
    area || (matchedBranch ? matchedBranch.area : 'Chennai'),
    matchedBranch,
    distanceKm,
    fullAddr,
    null
  );

  closeLocationSelectorModal();
  if (typeof showToast === 'function') {
    showToast('✓ Delivery address saved: ' + fullAddr);
  }
}

// Apply manual branch selection
function applyBranchLocation(branch, mockDistance = 1.5, customLocality = null, customAddress = null) {
  setUserLocation(
    branch.latitude || 13.085,
    branch.longitude || 80.2101,
    customLocality || `${branch.area || branch.name}, ${branch.city}`,
    branch,
    mockDistance,
    customAddress || branch.address || `${branch.area || branch.name}, ${branch.city}`
  );
}

// Update Fulfillment Bar UI
function updateFulfillmentBarUI() {
  const localityDisplay = document.getElementById('currentLocalityDisplay');
  const branchInfoDisplay = document.getElementById('nearestBranchInfoDisplay');
  const statusChip = document.getElementById('serviceZoneStatusChip');
  const statusText = document.getElementById('serviceZoneStatusText');
  const modeLabel = document.getElementById('fulfillmentModeLabel');
  const btnDelivery = document.getElementById('toggleBtnDelivery');
  const btnTakeaway = document.getElementById('toggleBtnTakeaway');
  const btnRequest = document.getElementById('btnRequestLocationAccess');
  const iconContainer = document.getElementById('locationPinIconContainer');
  const accBadge = document.getElementById('gpsAccuracyBadge');

  if (!localityDisplay) return;

  if (btnRequest) btnRequest.classList.add('hidden');

  // Toggle active styling
  if (btnDelivery && btnTakeaway) {
    if (userFulfillment.mode === 'delivery') {
      btnDelivery.className = 'fulfillment-toggle-pill active px-3.5 sm:px-4 py-2 rounded-xl text-xs font-heading font-extrabold flex items-center gap-1.5 cursor-pointer';
      btnTakeaway.className = 'fulfillment-toggle-pill inactive px-3.5 sm:px-4 py-2 rounded-xl text-xs font-heading font-extrabold flex items-center gap-1.5 cursor-pointer';
      if (modeLabel) modeLabel.textContent = 'Delivering To';
    } else {
      btnTakeaway.className = 'fulfillment-toggle-pill active px-3.5 sm:px-4 py-2 rounded-xl text-xs font-heading font-extrabold flex items-center gap-1.5 cursor-pointer';
      btnDelivery.className = 'fulfillment-toggle-pill inactive px-3.5 sm:px-4 py-2 rounded-xl text-xs font-heading font-extrabold flex items-center gap-1.5 cursor-pointer';
      if (modeLabel) modeLabel.textContent = 'Takeaway Pickup At';
    }
  }

  if (userFulfillment.isVerified) {
    // Put the detailed address where the image is
    localityDisplay.textContent = userFulfillment.fullAddress || userFulfillment.localityName;
    localityDisplay.title = userFulfillment.fullAddress || userFulfillment.localityName;

    if (accBadge) {
      if (userFulfillment.accuracyMeters) {
        accBadge.textContent = `GPS ±${Math.round(userFulfillment.accuracyMeters)}m`;
        accBadge.classList.remove('hidden');
      } else {
        accBadge.classList.add('hidden');
      }
    }

    if (userFulfillment.isOutOfZone) {
      if (statusChip) {
        statusChip.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-300/80 flex items-center gap-1';
      }
      if (statusText) statusText.textContent = 'Beyond Delivery Radius · Showcase';
      if (branchInfoDisplay) {
        branchInfoDisplay.textContent = `Nearest Hub: ${userFulfillment.nearestBranch ? userFulfillment.nearestBranch.name : 'RedBox Hub'} (${userFulfillment.distanceKm} km away) · Delivery unavailable`;
      }
      if (iconContainer) {
        iconContainer.className = 'w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 text-amber-600 shadow-xs';
      }
    } else if (userFulfillment.isTakeawayOnly) {
      if (statusChip) {
        statusChip.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1';
      }
      if (statusText) statusText.textContent = 'Takeaway Radius Active (12-25 km)';
      if (branchInfoDisplay) {
        branchInfoDisplay.textContent = `Served by ${userFulfillment.nearestBranch ? userFulfillment.nearestBranch.name : 'RedBox'} (${userFulfillment.distanceKm} km) · Takeaway Ready in 15m`;
      }
      if (iconContainer) {
        iconContainer.className = 'w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 text-amber-600 shadow-xs';
      }
    } else {
      if (statusChip) {
        statusChip.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1';
      }
      if (statusText) statusText.textContent = 'In Hot Delivery Radius (<12 km)';
      if (branchInfoDisplay) {
        branchInfoDisplay.textContent = `Served by ${userFulfillment.nearestBranch ? userFulfillment.nearestBranch.name : 'RedBox Hub'} (${userFulfillment.distanceKm} km) · ~35 mins`;
      }
      if (iconContainer) {
        iconContainer.className = 'w-11 h-11 rounded-2xl bg-red-50 border border-red-200/60 flex items-center justify-center flex-shrink-0 text-brand-red shadow-xs';
      }
    }
  }

  if (window.lucide) window.lucide.createIcons();
}

// Update Out of Service Zone Banner UI
function updateOutOfServiceBannerUI() {
  const banner = document.getElementById('outOfServiceNoticeBanner');
  if (!banner) return;

  if (userFulfillment.isVerified && userFulfillment.isOutOfZone) {
    banner.classList.remove('hidden');
    const locName = document.getElementById('outOfServiceLocalityName');
    const distEl = document.getElementById('outOfServiceDistanceKm');
    const branchName = document.getElementById('outOfServiceNearestBranchName');
    if (locName) locName.textContent = userFulfillment.localityName || 'your area';
    if (distEl) distEl.textContent = `${userFulfillment.distanceKm || 320} km`;
    if (branchName) branchName.textContent = userFulfillment.nearestBranch ? userFulfillment.nearestBranch.name : 'RedBox Anna Nagar Hub';
  } else {
    banner.classList.add('hidden');
  }

  if (window.lucide) window.lucide.createIcons();
}

// Toggle delivery vs takeaway mode
function setFulfillmentMode(mode) {
  if (mode === 'delivery' && (userFulfillment.isOutOfZone || userFulfillment.isTakeawayOnly)) {
    alert(`Delivery is unavailable for locations beyond 12 km. Your nearest RedBox branch is ${userFulfillment.distanceKm} km away. Please choose Takeaway or select another delivery address.`);
    return;
  }
  userFulfillment.mode = mode;
  try {
    localStorage.setItem('redbox_fulfillment', JSON.stringify(userFulfillment));
  } catch (e) {}
  updateFulfillmentBarUI();
  renderMenuItems();
}

// Preset Quick Address Handler
function setTestPresetLocation(preset) {
  if (preset === 'in-zone' || preset === 'tnagar') {
    // 45, G.N. Chetty Road, T. Nagar, Chennai - 600017
    const b = branchesData.find(x => x.id === 'rbx-chn-tnagar') || branchesData[0];
    setUserLocation(
      13.0418,
      80.2341,
      'T. Nagar, Chennai',
      b,
      2.2,
      '45, G.N. Chetty Road, T. Nagar, Chennai - 600017',
      12
    );
  } else if (preset === 'annanagar') {
    // Plot 104, 2nd Avenue, Anna Nagar East, Chennai - 600040
    const b = branchesData.find(x => x.id === 'rbx-chn-annanagar') || branchesData[0];
    setUserLocation(
      13.085,
      80.2101,
      'Anna Nagar, Chennai',
      b,
      1.8,
      'Plot 104, 2nd Avenue, Anna Nagar East, Chennai - 600040',
      10
    );
  } else if (preset === 'takeaway-zone') {
    // Plot 15, Kundrathur Main Road, Kundrathur, Chennai - 600069 (~17.6 km)
    const b = branchesData.find(x => x.id === 'rbx-chn-kundrathur') || branchesData[0];
    setUserLocation(
      12.9675,
      79.9406,
      'Kundrathur / Outer Corridor',
      b,
      17.6,
      'Plot 15, Kundrathur Main Road, Near Bus Terminus, Chennai - 600069',
      25
    );
  } else if (preset === 'out-of-zone') {
    // Flat 102, Connaught Circus, New Delhi - 110001 (> 300km)
    const nearest = findNearestBranch(28.6139, 77.2090);
    setUserLocation(
      28.6139,
      77.2090,
      'Connaught Place, New Delhi',
      nearest.branch,
      nearest.distance,
      'Flat 102, Block B, Connaught Circus, New Delhi - 110001',
      50
    );
  }
  closeLocationSelectorModal();
}


// Location Selector Modal Controls
function openLocationSelectorModal(dishId = null) {
  if (dishId) userFulfillment.pendingDishId = dishId;
  const modal = document.getElementById('locationSelectorModal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    populateModalBranches();
    if (window.lucide) window.lucide.createIcons();
  }
}

function closeLocationSelectorModal() {
  const modal = document.getElementById('locationSelectorModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

// Render 57 branches in modal list
function populateModalBranches(filterText = '') {
  const container = document.getElementById('modalBranchListContainer');
  if (!container || !branchesData) return;

  const query = (filterText || '').toLowerCase().trim();
  const filtered = branchesData.filter(b => {
    if (!query) return true;
    const s = `${b.name} ${b.city} ${b.area} ${b.state} ${b.branch_code}`.toLowerCase();
    return s.includes(query);
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="p-4 text-center text-xs text-zinc-400">
        No branches match "${filterText}". Try searching Chennai, Bangalore, Hyderabad, or Dubai.
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(b => {
    return `
      <div onclick="selectBranchFromModal('${b.id}')" class="p-3 rounded-2xl border border-zinc-200/80 hover:border-brand-red/40 hover:bg-red-50/40 transition cursor-pointer flex items-center justify-between group">
        <div class="min-w-0 pr-2">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="font-heading font-extrabold text-xs text-zinc-900 group-hover:text-brand-red transition truncate">${b.name}</span>
            <span class="text-[9px] px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600 font-bold">${b.city}</span>
          </div>
          <p class="text-[11px] text-zinc-500 truncate mt-0.5">${b.address}</p>
        </div>
        <div class="flex items-center gap-1 text-[11px] font-bold text-brand-red flex-shrink-0">
          <span>Select</span>
          <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

function filterModalBranches(val) {
  populateModalBranches(val);
}

function selectBranchFromModal(branchId) {
  const b = branchesData.find(x => x.id === branchId);
  if (b) {
    applyBranchLocation(b, 2.1, `${b.area || b.name}, ${b.city}`);
  }
  closeLocationSelectorModal();
}

// Handle clicking "Order" on any dish card
function handleDishOrderClick(dishId, dishName = null) {
  // If location is unverified, prompt location access first and save target dish
  if (typeof userFulfillment !== 'undefined' && !userFulfillment.isVerified) {
    const locModal = document.getElementById('locationSelectorModal');
    if (locModal) {
      userFulfillment.pendingDishId = dishId || dishName;
      openLocationSelectorModal(dishId);
      return;
    } else {
      // Auto verify with default branch if on page without selector modal
      const defaultBranch = (typeof branchesData !== 'undefined' && branchesData.length > 0)
        ? (branchesData.find(b => b.id === 'rbx-chn-tnagar') || branchesData[0])
        : null;
      if (defaultBranch) {
        userFulfillment.isVerified = true;
        userFulfillment.nearestBranch = defaultBranch;
        updateGlobalDeliveryLinks(defaultBranch);
      }
    }
  }

  // If user is out of service zone
  if (typeof userFulfillment !== 'undefined' && userFulfillment.isOutOfZone) {
    const banner = document.getElementById('outOfServiceZoneBanner');
    if (banner) {
      banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
      banner.classList.add('ring-4', 'ring-amber-400/50');
      setTimeout(() => banner.classList.remove('ring-4', 'ring-amber-400/50'), 2000);
    }
    const proceed = confirm(`We haven't launched hot delivery in ${userFulfillment.localityName} yet (>25 km from nearest hub).\n\nWould you like to pre-order takeaway from ${userFulfillment.nearestBranch ? userFulfillment.nearestBranch.name : 'our nearest hub'} or vote for your city?`);
    if (proceed) {
      openOrderModal(dishId || dishName);
    } else {
      openCityNotifyModal();
    }
    return;
  }

  // Verified & within service or takeaway zone
  openOrderModal(dishId || dishName);
}

// City Notification Modal Controls
function openCityNotifyModal() {
  const modal = document.getElementById('cityNotifyModal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    const input = document.getElementById('cityNotifyCityInput');
    if (input && userFulfillment.localityName && userFulfillment.localityName !== 'Location not verified') {
      input.value = userFulfillment.localityName;
    }
    if (window.lucide) window.lucide.createIcons();
  }
}

function closeCityNotifyModal() {
  const modal = document.getElementById('cityNotifyModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

function submitCityNotify(event) {
  event.preventDefault();
  const city = document.getElementById('cityNotifyCityInput').value;
  const phone = document.getElementById('cityNotifyPhoneInput').value;
  const email = document.getElementById('cityNotifyEmailInput').value;

  const form = document.getElementById('cityNotifyForm');
  const success = document.getElementById('cityNotifySuccess');
  const confirmed = document.getElementById('cityNotifyConfirmedCity');

  if (confirmed) confirmed.textContent = city;
  if (form) form.classList.add('hidden');
  if (success) success.classList.remove('hidden');

  // Save to localStorage enquiries
  try {
    const list = JSON.parse(localStorage.getItem('redbox_city_requests') || '[]');
    list.push({ city, phone, email, date: new Date().toISOString() });
    localStorage.setItem('redbox_city_requests', JSON.stringify(list));
  } catch (e) {}

  if (window.lucide) window.lucide.createIcons();
}

// ================= MODAL CONTROLLERS =================
let currentModalDish = null;

function resolveDishObject(dishOrDishId) {
  if (!dishOrDishId) return null;
  if (typeof dishOrDishId === 'object') return dishOrDishId;

  // Search by id in menuItemsData
  if (typeof menuItemsData !== 'undefined' && Array.isArray(menuItemsData)) {
    const found = menuItemsData.find(d => d.id === dishOrDishId || (d.name && d.name.toLowerCase() === dishOrDishId.toLowerCase()));
    if (found) return found;
  }

  // Search in homepageContent featuredSignatures or newReleases
  if (typeof homepageContent !== 'undefined' && homepageContent) {
    const fsItems = homepageContent.featuredSignatures?.items || [];
    const nrItems = homepageContent.newReleases?.items || [];
    const found = [...fsItems, ...nrItems].find(d => d.id === dishOrDishId || (d.name && d.name.toLowerCase() === dishOrDishId.toLowerCase()));
    if (found) return found;
  }

  return {
    id: 'custom-' + toSlug(dishOrDishId),
    name: dishOrDishId,
    price: 249,
    category: 'Signature Bestseller',
    image: 'assets/images/img-08.png'
  };
}

function openOrderModal(dishOrDishId = null, overrideBranch = null) {
  const modal = document.getElementById('orderModal');
  if (!modal) return;

  currentModalDish = resolveDishObject(dishOrDishId);
  const dish = currentModalDish;
  const b = overrideBranch || (typeof userFulfillment !== 'undefined' && userFulfillment.nearestBranch) || (typeof branchesData !== 'undefined' && branchesData[0]);

  const heading = document.getElementById('orderModalHeading') || modal.querySelector('h3');
  const subtitle = document.getElementById('orderModalSubtitle') || modal.querySelector('p.text-xs');
  const swiggyBranch = document.getElementById('orderModalSwiggyNote');
  const zomatoBranch = document.getElementById('orderModalZomatoNote');
  const whatsappBranch = document.getElementById('orderModalWhatsappNote');
  const swiggyLink = document.getElementById('orderModalSwiggyLink') || modal.querySelector('a[href*="swiggy"]');
  const zomatoLink = document.getElementById('orderModalZomatoLink') || modal.querySelector('a[href*="zomato"]');
  const whatsappLink = document.getElementById('orderModalWhatsappLink') || modal.querySelector('a[href*="wa.me"]');

  if (b) {
    if (heading) {
      if (dish) {
        heading.textContent = `Order ${dish.name}`;
      } else {
        heading.textContent = (typeof userFulfillment !== 'undefined' && userFulfillment.mode === 'takeaway') 
          ? `Takeaway Pre-Order: ${b.name}` 
          : `Order from ${b.name}`;
      }
    }

    if (subtitle) {
      if (dish) {
        subtitle.textContent = `Fulfilling from ${b.name} (${b.area || b.city}) · Active Offer REDWOK20 Ready`;
      } else {
        subtitle.textContent = (typeof userFulfillment !== 'undefined' && userFulfillment.mode === 'takeaway')
          ? `Ready for curbside pickup in 15-20 min · ${b.address}`
          : `Hot delivery within ${b.deliveryTime || '30-40 min'} · ${b.area || b.name}, ${b.city}`;
      }
    }

    if (swiggyBranch) swiggyBranch.textContent = `Fulfill via ${b.name} · Code REDWOK20 Auto-Copied`;
    if (zomatoBranch) zomatoBranch.textContent = `Direct dispatch from ${b.name} · Code REDWOK20 Auto-Copied`;
    if (whatsappBranch) whatsappBranch.textContent = `Call/Chat Store Manager: ${b.phone || '044 4353 3333'}`;

    const swiggyUrl = buildPartnerDeliveryUrl('swiggy', b, dish ? dish.name : null);
    const zomatoUrl = buildPartnerDeliveryUrl('zomato', b, dish ? dish.name : null);
    const whatsappUrl = buildPartnerDeliveryUrl('whatsapp', b, dish ? dish.name : null);

    if (swiggyLink) {
      swiggyLink.href = swiggyUrl;
      swiggyLink.onclick = (e) => {
        e.preventDefault();
        handleSmartPartnerOrder('swiggy', dish ? dish.name : null, 'REDWOK20', b);
        return false;
      };
    }
    if (zomatoLink) {
      zomatoLink.href = zomatoUrl;
      zomatoLink.onclick = (e) => {
        e.preventDefault();
        handleSmartPartnerOrder('zomato', dish ? dish.name : null, 'REDWOK20', b);
        return false;
      };
    }
    if (whatsappLink) {
      whatsappLink.href = whatsappUrl;
      whatsappLink.onclick = (e) => {
        e.preventDefault();
        handleSmartPartnerOrder('whatsapp', dish ? dish.name : null, 'REDWOK20', b);
        return false;
      };
    }
  }

  // Ensure dish preview block inside order modal
  let dishPreview = document.getElementById('orderModalDishPreview');
  if (!dishPreview) {
    dishPreview = document.createElement('div');
    dishPreview.id = 'orderModalDishPreview';
    const linkContainer = modal.querySelector('.space-y-3') || modal.querySelector('.space-y-4');
    if (linkContainer && linkContainer.parentNode) {
      linkContainer.parentNode.insertBefore(dishPreview, linkContainer);
    }
  }

  if (dishPreview) {
    if (dish) {
      dishPreview.className = 'mb-4 p-3 bg-gradient-to-r from-red-50 to-amber-50 border border-red-200/80 rounded-2xl flex items-center justify-between gap-3 shadow-xs';
      const imgUrl = dish.image || (dish.food_type === 'veg' ? 'assets/images/img-03.png' : 'assets/images/img-08.png');
      const priceVal = dish.price ? `₹ ${dish.price}` : '';
      dishPreview.innerHTML = `
        <div class="flex items-center gap-2.5 min-w-0">
          <img src="${imgUrl}" alt="${dish.name}" class="w-12 h-12 rounded-xl object-cover border border-red-200 shadow-xs flex-shrink-0">
          <div class="min-w-0">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="text-[9px] font-heading font-extrabold uppercase px-1.5 py-0.5 rounded bg-brand-red text-white">Selected Item</span>
              <span class="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">⚡ Code REDWOK20 (20% OFF) Ready</span>
            </div>
            <h4 class="font-heading font-extrabold text-xs sm:text-sm text-zinc-900 truncate mt-0.5">${dish.name}</h4>
            <p class="font-mono text-xs font-bold text-brand-red">${priceVal}</p>
          </div>
        </div>
        <div class="hidden sm:flex flex-col items-end text-right flex-shrink-0">
          <span class="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider bg-amber-100/90 px-2 py-0.5 rounded">Auto Copy</span>
          <span class="text-[10px] text-zinc-500 mt-0.5">Paste at Checkout</span>
        </div>
      `;
      dishPreview.classList.remove('hidden');
    } else {
      dishPreview.className = 'mb-4 p-2.5 bg-zinc-50 border border-zinc-200/80 rounded-2xl flex items-center justify-between gap-2 text-xs';
      dishPreview.innerHTML = `
        <div class="flex items-center gap-2 text-zinc-700 min-w-0">
          <span class="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 animate-ping"></span>
          <span class="font-bold truncate text-[11px] sm:text-xs">Nearest Hub: ${b ? b.name : 'Red Box'}</span>
        </div>
        <span class="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex-shrink-0">Code: REDWOK20 (20% OFF)</span>
      `;
      dishPreview.classList.remove('hidden');
    }
  }

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
  if (window.lucide) window.lucide.createIcons();
}

function closeOrderModal() {
  const modal = document.getElementById('orderModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

// Open order prompt specifically for a chosen branch (Swiggy / Zomato / WhatsApp)
function openBranchOrderPrompt(branchId, dishOrDishId = null) {
  let branch = null;
  if (typeof branchesData !== 'undefined' && branchesData.length > 0) {
    branch = branchesData.find(b => b.id === branchId || String(b.id) === String(branchId));
  }
  if (!branch && typeof userFulfillment !== 'undefined') {
    branch = userFulfillment.nearestBranch;
  }
  openOrderModal(dishOrDishId, branch);
}

function openWhatsAppModal() {
  window.open('https://wa.me/918939444411?text=Hi%20Red%20Box%2C%20I%20would%20like%20to%20order%20takeaway', '_blank');
}

function openFranchiseModal() {
  const modal = document.getElementById('franchiseModal');
  if (modal) modal.classList.remove('hidden');
}

function closeFranchiseModal() {
  const modal = document.getElementById('franchiseModal');
  if (modal) modal.classList.add('hidden');
}

async function handleFranchiseSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('button');
  const originalBtnText = submitBtn ? submitBtn.innerHTML : '';

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="inline-flex items-center gap-2"><svg class="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg> Submitting to Admin...</span>';
  }

  // Safe input extraction
  const nameInput = form.querySelector('input[placeholder*="Name"], input[type="text"]');
  const phoneInput = form.querySelector('input[type="tel"]');
  const emailInput = form.querySelector('input[type="email"]');
  const cityInput = form.querySelector('input[placeholder*="City"], input[placeholder*="Location"]');
  const budgetInput = form.querySelector('select');
  const messageInput = form.querySelector('textarea');

  const payload = {
    name: nameInput ? nameInput.value : 'Franchise Applicant',
    phone: phoneInput ? phoneInput.value : '',
    email: emailInput ? emailInput.value : '',
    city: cityInput ? cityInput.value : 'India',
    state: 'South India Hub',
    investment_capacity: budgetInput ? budgetInput.value : '₹ 20 - 25 Lakhs (Express Kiosk)',
    experience: 'Restaurant / Retail Experience',
    message: messageInput ? messageInput.value : 'Interested in The Red Box franchise partnership',
    source: 'Website Franchise Portal'
  };

  try {
    const res = await fetch(REDBOX_API.FRANCHISE_ENQUIRY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    console.log('Franchise lead submitted to backend:', res.status);
  } catch (err) {
    console.warn('Backend submission network note (using client fallback):', err.message);
  }

  showRedBoxToast(
    'Application Received!',
    'Your franchise application has been submitted to RedBox Admin. Our business development team will contact you within 24 hours with the Franchise Kit.',
    'success'
  );

  form.reset();
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
  closeFranchiseModal();
}

function populateCateringBranchSelect(selectedBranchId = null) {
  const select = document.getElementById('cateringModalHubSelect');
  if (!select) return;

  const currentActive = selectedBranchId 
    || (typeof userFulfillment !== 'undefined' && userFulfillment.nearestBranch && userFulfillment.nearestBranch.id)
    || 'rbx-chn-tnagar';

  if (typeof branchesData !== 'undefined' && branchesData.length > 0) {
    select.innerHTML = branchesData.map(b => {
      const isSel = (b.id === currentActive || String(b.id) === String(currentActive)) ? 'selected' : '';
      return `<option value="${b.id}" ${isSel}>${b.name} (${b.city})</option>`;
    }).join('');
  }
}

function openCateringModal(packageName = 'Live Wok Counter', branchId = null) {
  const modal = document.getElementById('cateringModal');
  const pkgInput = document.getElementById('cateringModalPackage');
  if (pkgInput) pkgInput.value = packageName || 'Live Wok Counter';
  populateCateringBranchSelect(branchId);
  if (modal) {
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    if (window.lucide) window.lucide.createIcons();
  }
}

function openCateringModalForBranch(branchId, packageName = 'Live Wok Counter') {
  openCateringModal(packageName, branchId);
}

function openCateringModalWithEstimate() {
  const pkgSelect = document.getElementById('calcPackage');
  const slider = document.getElementById('guestSlider');
  const selectedText = pkgSelect ? pkgSelect.options[pkgSelect.selectedIndex].text : 'Live Wok Station';
  const guests = slider ? slider.value : 100;

  const modal = document.getElementById('cateringModal');
  const pkgInput = document.getElementById('cateringModalPackage');
  const guestsInput = document.getElementById('cateringModalGuests');

  if (pkgInput) pkgInput.value = selectedText;
  if (guestsInput) guestsInput.value = guests;
  populateCateringBranchSelect();
  if (modal) {
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    if (window.lucide) window.lucide.createIcons();
  }
}

function closeCateringModal() {
  const modal = document.getElementById('cateringModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

async function handleCateringSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('button');
  const originalBtnText = submitBtn ? submitBtn.innerHTML : '';

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="inline-flex items-center gap-2"><svg class="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg> Submitting...</span>';
  }

  const nameInput = form.querySelector('input[placeholder*="Name"], input[type="text"]');
  const phoneInput = form.querySelector('input[type="tel"]');
  const emailInput = form.querySelector('input[type="email"]');
  const dateInput = form.querySelector('input[type="date"]');
  const messageInput = form.querySelector('textarea');

  const pkgValue = document.getElementById('cateringModalPackage')?.value || 'Live Wok Station';
  const guestValue = document.getElementById('cateringModalGuests')?.value || 100;
  const hubSelect = document.getElementById('cateringModalHubSelect');
  const selectedHub = hubSelect ? hubSelect.options[hubSelect.selectedIndex]?.text : 'Chennai Central Hub';

  const payload = {
    name: nameInput ? nameInput.value : 'Catering Client',
    phone: phoneInput ? phoneInput.value : '',
    email: emailInput ? emailInput.value : '',
    event_type: pkgValue,
    event_date: dateInput ? dateInput.value : new Date().toISOString().split('T')[0],
    guest_count: parseInt(guestValue, 10) || 100,
    dispatch_hub: selectedHub,
    location: (typeof userFulfillment !== 'undefined' && userFulfillment.fullAddress) ? userFulfillment.fullAddress : 'Chennai / Regional Hub',
    food_preference: 'Indo-Chinese Party Box Menu',
    message: messageInput ? messageInput.value : `Bulk party catering request for ${guestValue} guests via ${selectedHub}`,
    source: 'Website Catering Calculator'
  };

  try {
    const res = await fetch(REDBOX_API.CATERING_REQUEST, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    console.log('Catering request submitted to backend:', res.status);
  } catch (err) {
    console.warn('Backend submission network note (using client fallback):', err.message);
  }

  showRedBoxToast(
    'Catering Inquiry Received!',
    `Your bulk catering request has been assigned to ${selectedHub}. An event coordinator will call you shortly to confirm menu details and logistics.`,
    'success'
  );

  form.reset();
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
  closeCateringModal();
}

// Responsive Navigation & Mobile Menu Functions
function toggleMobileNav() {
  const dropdown = document.getElementById('mobileDropdown') || document.getElementById('mobileMenuDropdown');
  const icon = document.getElementById('mobileMenuIcon');
  if (dropdown) {
    dropdown.classList.toggle('hidden');
    if (icon) {
      if (dropdown.classList.contains('hidden')) {
        icon.setAttribute('data-lucide', 'menu');
      } else {
        icon.setAttribute('data-lucide', 'x');
      }
      if (window.lucide) window.lucide.createIcons();
    }
  }
}

function toggleNavDrawer() {
  toggleMobileNav();
}

function closeNavDrawer() {
  const dropdown = document.getElementById('mobileDropdown') || document.getElementById('mobileMenuDropdown');
  const icon = document.getElementById('mobileMenuIcon');
  if (dropdown && !dropdown.classList.contains('hidden')) {
    dropdown.classList.add('hidden');
    if (icon) {
      icon.setAttribute('data-lucide', 'menu');
      if (window.lucide) window.lucide.createIcons();
    }
  }
  // also close any legacy modal if present
  const drawer = document.getElementById('navDrawerModal');
  if (drawer && !drawer.classList.contains('hidden')) {
    drawer.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeNavDrawer();
    closeOrderModal();
  }
});


// Load Full Homepage Content (Hero Slider, New Releases, Featured Signatures)
async function loadHomepageContent() {
  try {
    let res = await fetch('/api/homepage').catch(() => null);
    if (!res || !res.ok) res = await fetch('data/homepage_content.json').catch(() => null);
    if (res && res.ok) {
      homepageContent = await res.json();
    }
  } catch (err) {
    console.warn('Could not fetch homepage content:', err);
  }

  if (!homepageContent) {
    try {
      const cached = localStorage.getItem('redbox_homepage_content');
      if (cached) {
        homepageContent = JSON.parse(cached);
      }
    } catch (e) {
      console.warn('Could not parse redbox_homepage_content from localStorage:', e);
    }
  }

  if (homepageContent?.featuredSignatures?.items) {
    homepageContent.featuredSignatures.items.forEach(dish => {
      if (dish.image && dish.image.includes('FO')) {
        dish.image = (dish.foodType === 'veg' || dish.isVeg) ? 'assets/images/img-03.png' : 'assets/images/img-08.png';
      }
    });
  }

  if (homepageContent) {
    if (Array.isArray(homepageContent.heroSlider) && homepageContent.heroSlider.length > 0) {
      heroSlides = homepageContent.heroSlider.filter(s => s.active !== false);
      if (document.getElementById('heroSliderSection') || document.getElementById('heroBannerImg')) {
        updateHeroDisplay();
      }
    }

    if (document.getElementById('newReleasesGrid')) {
      renderNewReleases();
    }

    if (document.getElementById('featuredDishesGrid')) {
      renderFeaturedDishes();
    }
  }
}

// Render New Releases 3-Column Grid on Homepage
function renderNewReleases() {
  const container = document.getElementById('newReleasesGrid');
  if (!container || !homepageContent || !homepageContent.newReleases) return;

  const nr = homepageContent.newReleases;

  const tagEl = document.getElementById('newReleasesTag');
  if (tagEl && nr.sectionTag) {
    tagEl.innerHTML = `<span>${nr.sectionTag}</span>`;
  }
  const titleEl = document.getElementById('newReleasesTitle');
  if (titleEl && nr.sectionTitle) titleEl.textContent = nr.sectionTitle;
  const subEl = document.getElementById('newReleasesSubtitle');
  if (subEl && nr.sectionSubtitle) subEl.textContent = nr.sectionSubtitle;

  const items = (nr.items || []).filter(item => item.active !== false);
  if (items.length === 0) {
    container.innerHTML = '<p class="col-span-3 text-center text-zinc-400 py-6">No new releases currently active.</p>';
    return;
  }

  container.innerHTML = items.map(dish => {
    const isVeg = (dish.foodType && dish.foodType.toLowerCase() === 'veg') || (dish.isVeg === true);
    const imgUrl = dish.image || 'assets/images/FO1.jpg';
    const badgeText = dish.tag || dish.badge || 'NEW RELEASE';

    return `
      <div class="food-card bg-white rounded-2xl overflow-hidden border border-zinc-200/80 shadow-sm hover:shadow-xl hover:border-brand-red/30 transition-all duration-300 flex flex-col group">
        <!-- Dish Thumbnail with badge -->
        <div class="relative h-48 sm:h-52 w-full overflow-hidden bg-zinc-900">
          <img src="${imgUrl}" alt="${dish.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          
          <div class="absolute top-3 left-3">
            <span class="px-2.5 py-1 text-[10px] font-heading font-extrabold uppercase tracking-wider bg-brand-red text-white rounded-md shadow-md">
              ${badgeText}
            </span>
          </div>

          <div class="absolute top-3 right-3">
            <span class="${isVeg ? 'badge-veg' : 'badge-nonveg'} shadow-md" title="${isVeg ? 'Vegetarian' : 'Non-Vegetarian'}"></span>
          </div>

          <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
            <span class="text-xs font-semibold text-zinc-300">${dish.category || 'Chef Special'}</span>
            <span class="font-mono font-bold text-lg text-amber-400 price-val">₹ ${dish.price}</span>
          </div>
        </div>

        <!-- Dish Content Body -->
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h4 class="font-heading font-extrabold text-lg text-zinc-900 tracking-wide group-hover:text-brand-red transition-colors line-clamp-1 mb-2">
              ${dish.name}
            </h4>
            <p class="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
              ${dish.desc || dish.description || ''}
            </p>
          </div>

          <div class="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between">
            <span class="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
              <i data-lucide="check-circle-2" class="w-3.5 h-3.5"></i>
              Fresh Wok Prepped
            </span>
            <button onclick="handleDishOrderClick('${dish.id || ''}', '${(dish.name || '').replace(/'/g, "\\'")}')" class="px-4 py-2 bg-brand-red hover:bg-brand-red-dark text-white text-xs font-heading font-extrabold uppercase tracking-wider rounded-full shadow hover:scale-102 transition-all cursor-pointer">
              Order Now
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

function renderFeaturedDishes() {
  const container = document.getElementById('featuredDishesGrid');
  if (!container) return;

  if (homepageContent && homepageContent.featuredSignatures) {
    const fs = homepageContent.featuredSignatures;

    const tagEl = document.getElementById('bestsellersTag');
    if (tagEl && fs.sectionTag) tagEl.textContent = fs.sectionTag;
    const titleEl = document.getElementById('bestsellersTitle');
    if (titleEl && fs.sectionTitle) titleEl.textContent = fs.sectionTitle;
    const subEl = document.getElementById('bestsellersSubtitle');
    if (subEl && fs.sectionSubtitle) subEl.textContent = fs.sectionSubtitle;

    const items = (fs.items || []).filter(item => item.active !== false);
    if (items.length > 0) {
      container.innerHTML = items.map(dish => {
        const isVeg = (dish.foodType && dish.foodType.toLowerCase() === 'veg') || (dish.isVeg === true);
        const imgUrl = dish.image || getCategoryDishImage(dish.category, dish.foodType);
        const rating = (dish.rating || '4.9').replace(/[★☆]/g, '').trim();
        const tagText = dish.tag || 'Bestseller';
        const hasDiscount = (dish.discountPercent && dish.discountPercent > 0) || (dish.originalPrice && dish.originalPrice > dish.price);
        const savingsAmount = (dish.originalPrice && dish.originalPrice > dish.price) ? (dish.originalPrice - dish.price) : 0;
        const discountLabel = dish.discountPercent ? `${dish.discountPercent}% OFF` : (savingsAmount > 0 ? `SAVE ₹${savingsAmount}` : tagText);

        return `
          <div class="food-card bg-white rounded-3xl overflow-hidden border border-zinc-200/80 shadow-sm hover:shadow-xl hover:border-brand-red/30 transition-all duration-300 group flex flex-col justify-between">
            <div>
              <!-- Prominent Top Product Image (Full, Uncut Food Photo) -->
              <div class="relative h-48 sm:h-52 w-full overflow-hidden bg-zinc-900 border-b border-zinc-100">
                <img src="${imgUrl}" alt="${dish.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                <!-- Top Badges Overlay -->
                <div class="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                  <span class="${isVeg ? 'badge-veg' : 'badge-nonveg'}" title="${isVeg ? 'Vegetarian' : 'Non-Vegetarian'}"></span>
                  <span class="px-2.5 py-0.5 text-[10px] font-bold bg-white/95 text-amber-700 border border-amber-200/80 rounded-full shadow-xs">
                    ${rating}
                  </span>
                </div>

                <div class="absolute top-3 right-3 flex items-center gap-1">
                  ${hasDiscount ? `
                    <span class="px-2.5 py-1 text-[10px] font-heading font-extrabold bg-red-600 text-white rounded-full uppercase tracking-wider shadow-sm animate-pulse">
                      ${discountLabel}
                    </span>
                  ` : `
                    <span class="px-2.5 py-1 text-[10px] font-heading font-bold bg-white/95 text-zinc-700 rounded-full uppercase tracking-wider shadow-xs border border-zinc-200">
                      ${tagText}
                    </span>
                  `}
                </div>

                <!-- Price Badge on Image -->
                <div class="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs shadow-md border border-zinc-200 flex items-baseline gap-1.5">
                  <span class="font-mono font-bold text-brand-red text-base sm:text-lg tracking-tight price-val">₹ ${dish.price}</span>
                  ${dish.originalPrice && dish.originalPrice > dish.price ? `
                    <span class="line-through text-xs font-bold text-zinc-400 font-mono">₹ ${dish.originalPrice}</span>
                  ` : ''}
                </div>
              </div>

              <!-- Product Details Below Image -->
              <div class="p-5 space-y-2">
                <div class="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
                  <span class="uppercase tracking-wider">${dish.category || 'Specialty'}</span>
                  ${savingsAmount > 0 ? `
                    <span class="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      Save ₹${savingsAmount}
                    </span>
                  ` : ''}
                </div>

                <h4 class="font-heading font-extrabold text-base sm:text-lg text-zinc-900 tracking-wide group-hover:text-brand-red transition-colors leading-snug line-clamp-1">
                  ${dish.name}
                </h4>

                <p class="text-xs text-zinc-600 font-sans leading-relaxed line-clamp-2">
                  ${dish.desc || dish.description || ''}
                </p>
              </div>
            </div>

            <!-- Card Action Footer -->
            <div class="px-5 pb-5 pt-3 border-t border-zinc-100 flex items-center justify-between">
              <span class="text-[10px] font-bold text-brand-gold uppercase tracking-wider flex items-center gap-1">
                <i data-lucide="award" class="w-3.5 h-3.5 text-amber-500"></i>
                ${tagText}
              </span>
              <button onclick="handleDishOrderClick('${dish.id || ''}', '${(dish.name || '').replace(/'/g, "\\'")}')" class="px-5 py-2 bg-brand-red hover:bg-brand-red-dark text-white text-xs font-heading font-extrabold uppercase tracking-wider rounded-full shadow hover:scale-102 transition-all cursor-pointer">
                Add to Box
              </button>
            </div>
          </div>
        `;
      }).join('');

      if (window.lucide) window.lucide.createIcons();
      return;
    }
  }

  // Fallback
  const popularKeywords = ['Dragon Chicken', 'Hakka Noodle', 'Fried Rice', 'Momo', 'Schezwan', 'Manchurian'];
  let featured = [];
  
  for (let kw of popularKeywords) {
    const match = menuData.find(d => d.name.toLowerCase().includes(kw.toLowerCase()));
    if (match && !featured.some(f => f.id === match.id)) {
      featured.push(match);
    }
  }

  if (featured.length < 6) {
    featured = menuData.slice(0, 6);
  }

  container.innerHTML = featured.map(dish => {
    const isVeg = (dish.food_type && dish.food_type.toLowerCase() === 'veg');
    const dishImg = getCategoryDishImage(dish.category, dish.food_type);

    return `
      <div class="food-card bg-white rounded-3xl overflow-hidden border border-zinc-200/80 shadow-sm hover:shadow-xl hover:border-brand-red/30 transition-all duration-300 group flex flex-col justify-between">
        <div>
          <!-- Prominent Top Product Image (Full, Uncut Food Photo) -->
          <div class="relative h-48 sm:h-52 w-full overflow-hidden bg-zinc-900 border-b border-zinc-100">
            <img src="${dishImg}" alt="${dish.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            <!-- Top Badges Overlay -->
            <div class="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
              <span class="${isVeg ? 'badge-veg' : 'badge-nonveg'}" title="${isVeg ? 'Vegetarian' : 'Non-Vegetarian'}"></span>
              <span class="px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-brand-red text-[10px] font-heading font-extrabold uppercase tracking-wider shadow-xs border border-red-100">
                ${dish.category || 'Specialty'}
              </span>
            </div>

            <!-- Price Badge on Image -->
            <div class="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs shadow-md border border-zinc-200 flex items-baseline gap-1.5">
              <span class="font-mono font-bold text-brand-red text-base sm:text-lg tracking-tight price-val">₹ ${dish.price}</span>
            </div>
          </div>

          <!-- Product Details Below Image -->
          <div class="p-5 space-y-2">
            <div class="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
              <span class="uppercase tracking-wider">${dish.category || 'Specialty'}</span>
              <span class="text-brand-gold font-bold uppercase tracking-wider flex items-center gap-1">
                Fresh Wok Toss
              </span>
            </div>

            <h4 class="font-heading font-extrabold text-base sm:text-lg text-zinc-900 tracking-wide group-hover:text-brand-red transition-colors leading-snug line-clamp-1">
              ${dish.name}
            </h4>

            <p class="text-xs text-zinc-600 font-sans leading-relaxed line-clamp-2">
              ${dish.description || 'Authentic Indo-Chinese tossed hot in our signature 45-min thermal fold box.'}
            </p>
          </div>
        </div>

        <!-- Card Action Footer -->
        <div class="px-5 pb-5 pt-3 border-t border-zinc-100 flex items-center justify-between">
          <span class="text-[10px] font-bold text-brand-gold uppercase tracking-wider">Bestseller</span>
          <button onclick="handleDishOrderClick('${dish.id || ''}', '${(dish.name || '').replace(/'/g, "\\'")}')" class="px-5 py-2 bg-brand-red hover:bg-brand-red-dark text-white text-xs font-heading font-extrabold uppercase tracking-wider rounded-full shadow hover:scale-102 transition-all cursor-pointer">
            Add to Box
          </button>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

// ========================================================
// PROMOTIONS & ANNOUNCEMENT BAR ENGINE
// ========================================================
async function initPromotionsBanner() {
  try {
    let res = await fetch('/api/promotions').catch(() => null);
    if (!res || !res.ok) res = await fetch('data/promotions.json').catch(() => null);
    if (!res || !res.ok) return;
    const data = await res.json();
    const ab = data.announcementBar;
    if (!ab || ab.active === false || !ab.text) return;

    if (document.getElementById('redboxPromoBar')) {
      document.getElementById('redboxPromoBar').remove();
    }

    const bar = document.createElement('div');
    bar.id = 'redboxPromoBar';
    bar.className = 'w-full py-1.5 sm:py-2 px-3 sm:px-4 text-center text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 sm:gap-2 relative z-50 shadow-xs transition-all';
    bar.style.backgroundColor = ab.bgColor || '#991B1B';
    bar.style.color = ab.textColor || '#FFFFFF';
    bar.innerHTML = `
      <span class="px-2 py-0.5 rounded-full bg-white/20 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">${ab.badge || 'PROMO'}</span>
      <span class="truncate sm:overflow-visible">${ab.text}</span>
      ${ab.link ? `<a href="${ab.link}" class="underline hover:opacity-80 ml-1.5 font-bold text-[10px] sm:text-[11px] whitespace-nowrap">Explore ↗</a>` : ''}
      <button onclick="document.getElementById('redboxPromoBar').remove()" class="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 opacity-75 hover:opacity-100 p-1 cursor-pointer text-sm font-bold leading-none" aria-label="Dismiss Announcement">&times;</button>
    `;

    const targetContainer = document.getElementById('promoAnnouncementBar');
    if (targetContainer) {
      targetContainer.appendChild(bar);
    } else {
      const header = document.getElementById('mainHeader') || document.querySelector('header');
      if (header) {
        header.prepend(bar);
      } else {
        document.body.prepend(bar);
      }
    }
  } catch(e) {
    console.warn("Could not load promotions banner:", e);
  }
}

// ========================================================
// DYNAMIC CMS TESTIMONIALS ENGINE
// ========================================================
async function initDynamicTestimonials() {
  const container = document.getElementById('testimonialsCardsGrid');
  if (!container) return;
  try {
    let res = await fetch('/api/testimonials').catch(() => null);
    if (!res || !res.ok) res = await fetch('data/testimonials.json').catch(() => null);
    if (!res || !res.ok) return;
    const testimonials = await res.json();
    const live = (testimonials || []).filter(t => t.active !== false);
    if (live.length === 0) return;

    container.innerHTML = live.map(t => `
      <div class="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 text-xs leading-relaxed shadow-sm hover:shadow-md transition flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-1 text-amber-500 mb-3 text-sm">
            <span class="font-bold text-amber-600">Rating: ${t.rating || 5.0} / 5.0</span>
          </div>
          <p class="text-zinc-700 italic text-xs leading-relaxed mb-4">"${t.text || t.comment || t.quote || ""}"</p>
        </div>
        <div class="flex items-center gap-3 pt-3 border-t border-zinc-200/60">
          <img src="${t.avatar || 'assets/images/testimonial-1.jpg'}" onerror="this.src='assets/images/testimonial-1.jpg'" class="w-9 h-9 rounded-full object-cover border border-zinc-200 shadow-2xs">
          <div>
            <div class="font-bold text-zinc-900 text-xs">${t.name}</div>
            <div class="text-[10px] text-zinc-500">${t.role || 'Verified Diner'} · <span class="text-brand-red font-semibold">${t.branch || 'Egmore'}</span></div>
          </div>
        </div>
      </div>
    `).join('');
  } catch(e) {
    console.warn("Could not load dynamic testimonials:", e);
  }
}

// ========================================================
// TRANSPARENT ADAPTIVE NAVBAR & LOCATION-BASED SWIGGY/ZOMATO QUICK ROUTING
// ========================================================
const CITY_SLUG_MAP = {
  'chennai': 'chennai',
  'bengaluru': 'bangalore',
  'bangalore': 'bangalore',
  'hyderabad': 'hyderabad',
  'coimbatore': 'coimbatore',
  'madurai': 'madurai',
  'puducherry': 'pondicherry',
  'pondicherry': 'pondicherry',
  'visakhapatnam': 'visakhapatnam',
  'vizag': 'visakhapatnam',
  'vijayawada': 'vijayawada',
  'rajahmundry': 'rajahmundry',
  'vellore': 'vellore',
  'kancheepuram': 'kanchipuram',
  'kanchipuram': 'kanchipuram',
  'thiruvananthapuram': 'thiruvananthapuram',
  'trivandrum': 'thiruvananthapuram',
  'kochi': 'kochi',
  'nagpur': 'nagpur',
  'all': 'chennai'
};

function toSlug(text) {
  if (!text) return '';
  return text.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// Build accurate city and outlet URL with optional dish query (canonical chain routes avoid 404 dead-ends)
function buildPartnerDeliveryUrl(platform, branch = null, dishName = null) {
  const b = branch || (typeof userFulfillment !== 'undefined' && userFulfillment.nearestBranch) || (typeof branchesData !== 'undefined' && branchesData[0]);
  const cityRaw = (b && b.city) ? b.city.toLowerCase().trim() : 'chennai';
  const swiggyCity = CITY_SLUG_MAP[cityRaw] || toSlug(cityRaw) || 'chennai';
  const zomatoCity = (cityRaw === 'bengaluru' || cityRaw === 'bangalore') ? 'bangalore' : (CITY_SLUG_MAP[cityRaw] || toSlug(cityRaw) || 'chennai');

  if (platform === 'swiggy') {
    // If international branch
    if (b && b.country && b.country.toLowerCase() !== 'india' && b.deliveryLinks && b.deliveryLinks.swiggy) {
      let url = b.deliveryLinks.swiggy;
      if (dishName) url += (url.includes('?') ? '&' : '?') + `search=${encodeURIComponent(dishName)}`;
      return url;
    }

    // If branch has a specific swiggy URL configured in deliveryLinks
    if (b && b.deliveryLinks && b.deliveryLinks.swiggy && !b.deliveryLinks.swiggy.includes('swiggy-direct')) {
      let url = b.deliveryLinks.swiggy;
      // Strip fragile synthetic area sub-slugs like /the-red-box-t-nagar that 404 on Swiggy
      if (url.includes('/the-red-box-') && !url.includes('/the-red-box?')) {
        url = `https://www.swiggy.com/city/${swiggyCity}/the-red-box`;
      }
      if (dishName) url += (url.includes('?') ? '&' : '?') + `search=${encodeURIComponent(dishName)}`;
      return url;
    }

    // Canonical City Brand Route (Swiggy auto-routes via user GPS/IP to nearest operational kitchen)
    let url = `https://www.swiggy.com/city/${swiggyCity}/the-red-box`;
    if (dishName) {
      url += `?search=${encodeURIComponent(dishName)}`;
    }
    return url;
  }

  if (platform === 'zomato') {
    // If international branch
    if (b && b.country && b.country.toLowerCase() !== 'india' && b.deliveryLinks && b.deliveryLinks.zomato) {
      let url = b.deliveryLinks.zomato;
      if (dishName) url += (url.includes('?') ? '&' : '?') + `query=${encodeURIComponent(dishName)}`;
      return url;
    }

    // If branch has a specific zomato URL configured
    if (b && b.deliveryLinks && b.deliveryLinks.zomato && !b.deliveryLinks.zomato.includes('query=RedBox')) {
      let url = b.deliveryLinks.zomato;
      if (url.includes('/the-red-box-')) {
        url = `https://www.zomato.com/${zomatoCity}/restaurants/the-red-box`;
      }
      if (dishName) url += (url.includes('?') ? '&' : '?') + `query=${encodeURIComponent(dishName)}`;
      return url;
    }

    // Canonical Zomato Chain Route
    let url = `https://www.zomato.com/${zomatoCity}/restaurants/the-red-box`;
    if (dishName) {
      url += (url.includes('?') ? '&' : '?') + `query=${encodeURIComponent(dishName)}`;
    }
    return url;
  }

  if (platform === 'whatsapp') {
    const phone = (b && (b.managerPhone || b.phone)) ? (b.managerPhone || b.phone).replace(/\D/g, '') : '918939444411';
    const bName = b ? b.name : 'The Red Box';
    const loc = (typeof userFulfillment !== 'undefined' && userFulfillment.fullAddress) 
      ? userFulfillment.fullAddress 
      : (typeof userFulfillment !== 'undefined' && userFulfillment.localityName ? userFulfillment.localityName : 'Chennai');
    let text = `Hi ${bName}! I would like to place an order`;
    if (dishName) {
      text += ` for *${dishName}*`;
    }
    text += ` with offer code *REDWOK20* (Flat 20% OFF).\n\n📍 Delivery Location: ${loc}`;
    return `https://wa.me/${phone.length >= 10 ? phone : '918939444411'}?text=${encodeURIComponent(text)}`;
  }

  return '#';
}

// Global smart delivery toast notification with copy feedback & countdown bar
function showSmartDeliveryToast(title, message, durationMs = 4500) {
  let toast = document.getElementById('smartDeliveryToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'smartDeliveryToast';
    toast.className = 'fixed bottom-6 right-6 z-[99999] max-w-sm w-[calc(100vw-3rem)] sm:w-96 bg-zinc-950/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-red-500/40 transition-all duration-300 transform translate-y-12 opacity-0 pointer-events-none flex flex-col gap-2.5';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-start gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-brand-red flex items-center justify-center flex-shrink-0 shadow-md">
          <i data-lucide="check" class="w-4 h-4 text-white stroke-[3]"></i>
        </div>
        <div>
          <h4 class="font-heading font-extrabold text-xs sm:text-sm text-white tracking-wide flex items-center gap-1.5">
            ${title}
          </h4>
          <p class="text-[11px] text-zinc-300 mt-0.5 leading-relaxed">
            ${message}
          </p>
        </div>
      </div>
      <button onclick="dismissSmartDeliveryToast()" class="text-zinc-400 hover:text-white transition-colors cursor-pointer text-base leading-none p-1" aria-label="Close Toast">&times;</button>
    </div>
    <div class="w-full bg-zinc-800/80 h-1 rounded-full overflow-hidden">
      <div id="smartToastProgress" class="bg-gradient-to-r from-brand-red via-amber-400 to-emerald-400 h-full w-full origin-left"></div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  toast.classList.remove('translate-y-12', 'opacity-0', 'pointer-events-none');
  toast.classList.add('translate-y-0', 'opacity-100');

  const prog = document.getElementById('smartToastProgress');
  if (prog) {
    prog.style.transition = `transform ${durationMs}ms linear`;
    prog.style.transform = 'scaleX(1)';
    requestAnimationFrame(() => {
      prog.style.transform = 'scaleX(0)';
    });
  }

  if (window._smartToastTimer) clearTimeout(window._smartToastTimer);
  window._smartToastTimer = setTimeout(() => {
    dismissSmartDeliveryToast();
  }, durationMs);
}

function dismissSmartDeliveryToast() {
  const toast = document.getElementById('smartDeliveryToast');
  if (toast) {
    toast.classList.add('translate-y-12', 'opacity-0', 'pointer-events-none');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }
}

function showToast(msg) {
  showSmartDeliveryToast('Notification', msg, 3500);
}

// Handle Smart Partner Order: copies promo code, toasts, and opens nearest branch outlet
function handleSmartPartnerOrder(platform, dishName = null, promoCode = 'REDWOK20', branch = null) {
  const b = branch || (typeof userFulfillment !== 'undefined' && userFulfillment.nearestBranch) || (typeof branchesData !== 'undefined' && branchesData[0]);
  const bName = b ? b.name : 'Nearest Red Box Hub';
  const url = buildPartnerDeliveryUrl(platform, b, dishName);

  // Auto-copy promo code to clipboard
  const codeToCopy = promoCode || 'REDWOK20';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(codeToCopy).catch(() => {});
  }

  // Display Toast Notification
  const platformName = platform === 'swiggy' ? 'Swiggy' : (platform === 'zomato' ? 'Zomato' : 'WhatsApp');
  const dishInfo = dishName ? `"${dishName}"` : 'signature menu';
  showSmartDeliveryToast(
    `📋 Code ${codeToCopy} copied! (20% OFF)`,
    `Opening nearest ${bName} on ${platformName} with ${dishInfo}... Ready to paste discount code at checkout!`
  );

  // Close order modal smoothly if open
  closeOrderModal();

  // Open the resolved outlet URL in a new window/tab
  setTimeout(() => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, 350);
}

// Update all navbar pills and ordering buttons across the page
function updateGlobalDeliveryLinks(branchOrCity = null, dishName = null) {
  let b = null;
  if (typeof branchOrCity === 'string') {
    const cityKey = branchOrCity.toLowerCase().trim();
    if (typeof branchesData !== 'undefined') {
      b = branchesData.find(x => (x.city || '').toLowerCase().trim() === cityKey) || branchesData[0];
    }
  } else if (branchOrCity && typeof branchOrCity === 'object') {
    b = branchOrCity;
  } else {
    b = (typeof userFulfillment !== 'undefined' && userFulfillment.nearestBranch) || (typeof branchesData !== 'undefined' && branchesData[0]);
  }

  const swiggyUrl = buildPartnerDeliveryUrl('swiggy', b, dishName);
  const zomatoUrl = buildPartnerDeliveryUrl('zomato', b, dishName);
  const branchTitle = b ? `${b.name} (${b.city})` : 'Nearest Hub';

  document.querySelectorAll('.nav-order-pill-swiggy').forEach(el => {
    el.href = swiggyUrl;
    el.title = `Order The Red Box on Swiggy · ${branchTitle} (Code REDWOK20 Auto-Copied)`;
    el.onclick = (e) => {
      e.preventDefault();
      handleSmartPartnerOrder('swiggy', dishName, 'REDWOK20');
      return false;
    };
  });

  document.querySelectorAll('.nav-order-pill-zomato').forEach(el => {
    el.href = zomatoUrl;
    el.title = `Order The Red Box on Zomato · ${branchTitle} (Code REDWOK20 Auto-Copied)`;
    el.onclick = (e) => {
      e.preventDefault();
      handleSmartPartnerOrder('zomato', dishName, 'REDWOK20');
      return false;
    };
  });
}

function updateOrderPlatformLinks(cityName = 'chennai') {
  updateGlobalDeliveryLinks(cityName);
}

function initAdaptiveNavbar() {
  const header = document.getElementById('mainHeader');
  if (!header) return;

  const logoImg = document.getElementById('navBrandLogoImg');
  const heroSection = document.getElementById('heroSliderSection');

  // If there is no hero section on page (e.g. content pages), default to frosted glass light mode
  if (!heroSection) {
    header.classList.remove('nav-state-dark');
    header.classList.add('nav-state-light');
    if (logoImg) logoImg.src = 'assets/images/logo.png';
    updateOrderPlatformLinks('chennai');
    return;
  }

  // On page with dark hero section (e.g. index.html)
  function handleNavScroll() {
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const heroH = heroSection.offsetHeight || 440;
    const threshold = Math.max(70, heroH - 80);

    if (scrollY < threshold) {
      // Over Dark Hero: transparent background, crisp white text, white logo
      if (!header.classList.contains('nav-state-dark') || header.classList.contains('nav-state-light')) {
        header.classList.add('nav-state-dark');
        header.classList.remove('nav-state-light');
        if (logoImg) logoImg.src = 'assets/images/logo-white-text.png';
      }
    } else {
      // Over Light Content: modern glassmorphism blur, dark slate text, standard RedBox logo
      if (!header.classList.contains('nav-state-light') || header.classList.contains('nav-state-dark')) {
        header.classList.add('nav-state-light');
        header.classList.remove('nav-state-dark');
        if (logoImg) logoImg.src = 'assets/images/logo.png';
      }
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  window.addEventListener('resize', handleNavScroll, { passive: true });
  handleNavScroll(); // Immediate initial evaluation
  const initialBranch = (typeof userFulfillment !== 'undefined' && userFulfillment.nearestBranch) ? userFulfillment.nearestBranch : 'chennai';
  updateGlobalDeliveryLinks(initialBranch);
}

// ========================================================
// PROXIMITY KITCHEN HUBS DECK & TABLE RESERVATIONS ENGINE
// ========================================================

// Switch user active kitchen hub directly from 2-3 proximity cards deck
function selectActiveBranchFromDeck(branchId) {
  if (!branchesData || branchesData.length === 0) return;
  const b = branchesData.find(x => x.id === branchId || String(x.id) === String(branchId));
  if (!b) return;

  // Calculate distance from current user coords if available
  let dist = 1.8;
  if (userFulfillment && userFulfillment.latitude && userFulfillment.longitude) {
    dist = Math.round(calculateDistanceKm(userFulfillment.latitude, userFulfillment.longitude, b.latitude, b.longitude) * 10) / 10;
  }

  userFulfillment.nearestBranch = b;
  userFulfillment.distanceKm = dist;
  userFulfillment.isOutOfZone = dist > 25;
  userFulfillment.isTakeawayOnly = dist > 12 && dist <= 25;

  try {
    localStorage.setItem('redbox_fulfillment', JSON.stringify(userFulfillment));
  } catch (e) {}

  updateFulfillmentBarUI();
  updateOutOfServiceBannerUI();
  renderMenuItems();
  updateGlobalDeliveryLinks(b);
  renderNearbyHubsCards('nearbyHubsCardsGrid', 'menu');
  renderNearbyHubsCards('cateringNearbyHubsCardsGrid', 'catering');
  updateCateringFulfillmentBarUI();

  showSmartDeliveryToast(
    '📍 Active Kitchen Switched',
    `Fulfillment set to ${b.name} (${dist} km away). Ready for delivery or pickup!`
  );
}

// Render 2 or 3 closest operational kitchen hubs
function renderNearbyHubsCards(containerId = 'nearbyHubsCardsGrid', mode = 'menu') {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!branchesData || branchesData.length === 0) {
    container.innerHTML = `<div class="col-span-full py-8 text-center text-xs text-zinc-500">Locating nearest Red Box kitchens...</div>`;
    return;
  }

  const lat = (userFulfillment && userFulfillment.latitude) || 13.0418;
  const lon = (userFulfillment && userFulfillment.longitude) || 80.2341;
  const nearestList = findNearestBranches(lat, lon, 3);

  if (!nearestList || nearestList.length === 0) {
    container.innerHTML = `<div class="col-span-full py-8 text-center text-xs text-zinc-500">No operational hubs found in this zone.</div>`;
    return;
  }

  const activeBranchId = (userFulfillment && userFulfillment.nearestBranch) ? userFulfillment.nearestBranch.id : null;

  container.innerHTML = nearestList.map((item, idx) => {
    const b = item.branch;
    const dist = item.distance;
    const isActive = activeBranchId === b.id;

    // Visual distance pill status
    let distBadgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
    let distIcon = 'zap';
    if (dist > 12 && dist <= 25) {
      distBadgeClass = 'bg-amber-50 text-amber-800 border-amber-200/80';
      distIcon = 'clock';
    } else if (dist > 25) {
      distBadgeClass = 'bg-zinc-100 text-zinc-700 border-zinc-200';
      distIcon = 'map-pin';
    }

    if (mode === 'catering') {
      return `
        <div class="bg-white rounded-3xl p-5 sm:p-6 border ${isActive ? 'border-brand-red ring-2 ring-brand-red/10 shadow-md' : 'border-zinc-200 shadow-xs hover:shadow-md'} transition-all flex flex-col justify-between relative group">
          ${isActive ? `
            <div class="absolute -top-3 left-6 bg-brand-red text-white text-[10px] font-heading font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
              <i data-lucide="check" class="w-3 h-3 stroke-[3]"></i> Primary Event Base
            </div>
          ` : ''}

          <div>
            <div class="flex items-start justify-between gap-2 mb-2">
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold border ${distBadgeClass}">
                <i data-lucide="${distIcon}" class="w-3 h-3"></i>
                <span>${dist} km from event</span>
              </span>
              <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">${b.city}</span>
            </div>

            <h4 class="font-heading font-black text-base sm:text-lg text-zinc-900 group-hover:text-brand-red transition-colors line-clamp-1">
              ${b.name}
            </h4>
            <p class="text-xs text-zinc-500 line-clamp-2 mt-1 mb-3">
              ${b.address || `${b.area}, ${b.city}`}
            </p>

            <div class="flex flex-wrap items-center gap-1.5 mb-4 text-[10px] font-medium text-zinc-600">
              <span class="px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200 flex items-center gap-1">
                <i data-lucide="flame" class="w-3 h-3 text-brand-red"></i> Live Wok Fleet
              </span>
              <span class="px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200 flex items-center gap-1">
                <i data-lucide="package" class="w-3 h-3 text-amber-600"></i> 50-5,000 Boxes
              </span>
              <span class="px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200 flex items-center gap-1">
                <i data-lucide="utensils" class="w-3 h-3 text-emerald-600"></i> Dine-In Seating
              </span>
            </div>
          </div>

          <div class="space-y-2 pt-2 border-t border-zinc-100">
            <div class="grid grid-cols-2 gap-2">
              <button onclick="openCateringModalForBranch('${b.id}')" class="py-2.5 px-3 bg-brand-red hover:bg-brand-red-dark text-white rounded-xl text-xs font-heading font-extrabold uppercase tracking-wider shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                <i data-lucide="send" class="w-3.5 h-3.5"></i>
                <span>Request Quote</span>
              </button>
              <button onclick="openTableBookingModal('${b.id}')" class="py-2.5 px-3 bg-zinc-900 hover:bg-black text-white rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                <i data-lucide="calendar" class="w-3.5 h-3.5 text-amber-400"></i>
                <span>Book Table</span>
              </button>
            </div>
            <div class="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
              <span>Manager: <strong class="text-zinc-700">${b.managerPhone || b.phone || '044 4353 3333'}</strong></span>
              <a href="tel:${(b.managerPhone || b.phone || '0444353333').replace(/\D/g, '')}" class="text-brand-red font-bold hover:underline">Direct Call</a>
            </div>
          </div>
        </div>
      `;
    }

    // Default: Menu Page Mode
    return `
      <div class="bg-white rounded-3xl p-5 sm:p-6 border ${isActive ? 'border-brand-red ring-2 ring-brand-red/10 shadow-md' : 'border-zinc-200 shadow-xs hover:shadow-md'} transition-all flex flex-col justify-between relative group">
        ${isActive ? `
          <div class="absolute -top-3 left-6 bg-brand-red text-white text-[10px] font-heading font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
            <i data-lucide="check" class="w-3 h-3 stroke-[3]"></i> Active Serving Kitchen
          </div>
        ` : ''}

        <div>
          <div class="flex items-start justify-between gap-2 mb-2">
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold border ${distBadgeClass}">
              <i data-lucide="${distIcon}" class="w-3 h-3"></i>
              <span>${dist} km away</span>
            </span>
            <span class="text-[10px] font-bold text-zinc-500 flex items-center gap-1">
              <i data-lucide="clock" class="w-3 h-3 text-zinc-400"></i>
              <span>${b.deliveryTime || '25-35 mins'}</span>
            </span>
          </div>

          <h4 class="font-heading font-black text-base sm:text-lg text-zinc-900 group-hover:text-brand-red transition-colors line-clamp-1">
            ${b.name}
          </h4>
          <p class="text-xs text-zinc-500 line-clamp-2 mt-1 mb-3">
            ${b.address || `${b.area}, ${b.city}`}
          </p>

          <div class="flex flex-wrap items-center gap-1.5 mb-4 text-[10px] font-medium text-zinc-600">
            <span class="px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200 flex items-center gap-1">
              <i data-lucide="bike" class="w-3 h-3 text-brand-red"></i> Delivery
            </span>
            <span class="px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200 flex items-center gap-1">
              <i data-lucide="shopping-bag" class="w-3 h-3 text-amber-600"></i> Takeaway
            </span>
            <span class="px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200 flex items-center gap-1">
              <i data-lucide="utensils" class="w-3 h-3 text-emerald-600"></i> Dine-In
            </span>
          </div>
        </div>

        <div class="space-y-2 pt-2 border-t border-zinc-100">
          <div class="grid grid-cols-2 gap-2">
            <button onclick="openBranchOrderPrompt('${b.id}')" class="py-2.5 px-3 bg-brand-red hover:bg-brand-red-dark text-white rounded-xl text-xs font-heading font-extrabold uppercase tracking-wider shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer">
              <i data-lucide="shopping-bag" class="w-3.5 h-3.5"></i>
              <span>Order Online</span>
            </button>
            <button onclick="openTableBookingModal('${b.id}')" class="py-2.5 px-3 bg-zinc-900 hover:bg-black text-white rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer">
              <i data-lucide="utensils-crossed" class="w-3.5 h-3.5 text-amber-400"></i>
              <span>Book Table</span>
            </button>
          </div>

          <div>
            ${isActive ? `
              <div class="w-full py-1.5 text-center text-[11px] font-bold text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200/60 flex items-center justify-center gap-1">
                <i data-lucide="check-circle-2" class="w-3.5 h-3.5"></i>
                <span>Currently Active for Dishes Below</span>
              </div>
            ` : `
              <button onclick="selectActiveBranchFromDeck('${b.id}')" class="w-full py-1.5 text-[11px] font-bold text-zinc-600 hover:text-brand-red hover:bg-zinc-50 border border-zinc-200 rounded-lg transition flex items-center justify-center gap-1 cursor-pointer">
                <i data-lucide="refresh-cw" class="w-3 h-3"></i>
                <span>Switch Dishes To This Hub</span>
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

// Update Catering Top Location Bar UI
function updateCateringFulfillmentBarUI() {
  const localityDisplay = document.getElementById('cateringCurrentLocalityDisplay');
  const nearestHubDisplay = document.getElementById('cateringNearestHubDisplay');
  const statusChip = document.getElementById('cateringServiceZoneChip');
  const statusText = document.getElementById('cateringServiceZoneText');

  if (!localityDisplay) return;

  const addr = (typeof userFulfillment !== 'undefined' && (userFulfillment.fullAddress || userFulfillment.localityName)) || '45, G.N. Chetty Road, T. Nagar, Chennai - 600017';
  localityDisplay.textContent = addr;
  localityDisplay.title = addr;

  if (nearestHubDisplay) {
    if (userFulfillment && userFulfillment.nearestBranch) {
      nearestHubDisplay.textContent = `${userFulfillment.nearestBranch.name} (${userFulfillment.distanceKm} km)`;
    } else {
      nearestHubDisplay.textContent = 'Regional Central Hub (Chennai)';
    }
  }

  if (statusChip && statusText) {
    const dist = (userFulfillment && userFulfillment.distanceKm) || 2.2;
    if (dist <= 50) {
      statusChip.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1';
      statusText.textContent = `Direct Wok Fleet Dispatch (${dist} km)`;
    } else {
      statusChip.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60 flex items-center gap-1';
      statusText.textContent = `Regional Event Logistics (>50 km)`;
    }
  }
}

// Table Booking System Functions
function openTableBookingModal(branchId = null) {
  const modal = document.getElementById('tableBookingModal');
  if (!modal) return;

  populateTableBookingBranchSelect(branchId);

  // Default date to today
  const dateInput = document.getElementById('tableBookingDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    if (!dateInput.value) dateInput.value = today;
  }

  // Ensure form view is visible and success view hidden
  const formView = document.getElementById('tableBookingFormView');
  const successView = document.getElementById('tableBookingSuccessView');
  if (formView) formView.classList.remove('hidden');
  if (successView) successView.classList.add('hidden');

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
  if (window.lucide) window.lucide.createIcons();
}

function closeTableBookingModal() {
  const modal = document.getElementById('tableBookingModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

function populateTableBookingBranchSelect(selectedBranchId = null) {
  const select = document.getElementById('tableBookingBranchSelect');
  if (!select) return;

  const currentActive = selectedBranchId 
    || (typeof userFulfillment !== 'undefined' && userFulfillment.nearestBranch && userFulfillment.nearestBranch.id)
    || 'rbx-chn-tnagar';

  if (typeof branchesData !== 'undefined' && branchesData.length > 0) {
    select.innerHTML = branchesData.map(b => {
      const isSel = (b.id === currentActive || String(b.id) === String(currentActive)) ? 'selected' : '';
      return `<option value="${b.id}" ${isSel}>${b.name} (${b.city})</option>`;
    }).join('');
  }
}

function setTableGuests(count, btnElement) {
  const input = document.getElementById('tableBookingGuests');
  if (input) input.value = count;

  document.querySelectorAll('.table-guest-btn').forEach(btn => {
    btn.classList.remove('bg-brand-red', 'text-white', 'border-brand-red');
    btn.classList.add('bg-zinc-100', 'text-zinc-700', 'border-zinc-200');
  });
  if (btnElement) {
    btnElement.classList.remove('bg-zinc-100', 'text-zinc-700', 'border-zinc-200');
    btnElement.classList.add('bg-brand-red', 'text-white', 'border-brand-red');
  }
}

function handleTableBookingSubmit(e) {
  e.preventDefault();
  const branchSelect = document.getElementById('tableBookingBranchSelect');
  const branchId = branchSelect ? branchSelect.value : null;
  const branch = (typeof branchesData !== 'undefined') ? branchesData.find(b => b.id === branchId) : null;
  const branchName = branch ? branch.name : 'The Red Box';
  const branchPhone = (branch && (branch.managerPhone || branch.phone)) ? (branch.managerPhone || branch.phone).replace(/\D/g, '') : '918939444411';

  const name = document.getElementById('tableBookingName')?.value || 'Guest';
  const phone = document.getElementById('tableBookingPhone')?.value || '';
  const date = document.getElementById('tableBookingDate')?.value || '';
  const time = document.getElementById('tableBookingTimeSlot')?.value || '1:00 PM';
  const guests = document.getElementById('tableBookingGuests')?.value || '2';
  const notes = document.getElementById('tableBookingNotes')?.value || 'Standard Table';

  const bookingRef = 'RBX-' + Math.floor(100000 + Math.random() * 900000);

  const reservation = {
    bookingRef,
    branchId,
    branchName,
    name,
    phone,
    date,
    time,
    guests,
    notes,
    createdAt: new Date().toISOString()
  };

  try {
    const list = JSON.parse(localStorage.getItem('redbox_table_reservations') || '[]');
    list.unshift(reservation);
    localStorage.setItem('redbox_table_reservations', JSON.stringify(list));
  } catch (err) {}

  // Update success view
  const formView = document.getElementById('tableBookingFormView');
  const successView = document.getElementById('tableBookingSuccessView');
  const refDisplay = document.getElementById('tableSuccessBookingRef');
  const summaryDisplay = document.getElementById('tableSuccessSummary');
  const waBtn = document.getElementById('tableSuccessWhatsAppBtn');

  if (refDisplay) refDisplay.textContent = bookingRef;
  if (summaryDisplay) {
    summaryDisplay.innerHTML = `<strong>${guests} Guests</strong> at <strong>${branchName}</strong><br>📅 ${date} at ⏰ ${time}`;
  }

  if (waBtn) {
    const waText = `Hi ${branchName}! I have reserved a table for ${guests} guests on ${date} at ${time} under name ${name}. Booking Ref: ${bookingRef}. Please confirm reservation.`;
    waBtn.href = `https://wa.me/${branchPhone.length >= 10 ? branchPhone : '918939444411'}?text=${encodeURIComponent(waText)}`;
  }

  if (formView) formView.classList.add('hidden');
  if (successView) successView.classList.remove('hidden');

  showSmartDeliveryToast(
    '🎉 Table Reserved!',
    `Ref #${bookingRef} confirmed at ${branchName} for ${guests} guests.`
  );
}

// Global Aliases
window.openLocationModal = openLocationSelectorModal;

