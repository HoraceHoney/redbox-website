import re

with open('app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Update heroSlides definition and add heroSlideTimer
old_state = """// Hero Carousel State
let heroIndex = 0;
const heroSlides = [
  {
    image: 'assets/images/hdr-bnr-01.jpg',
    tag: 'SIGNATURE DIM SUMS',
    title: 'Real Wok Craft. Iconic Red Box.',
    desc: 'Steaming, freshly tossed Indo-Chinese specialties packed hot in our 45-minute heat-retention fold box.'
  },
  {
    image: 'assets/images/hdr-bnr-02.jpg',
    tag: '1000°F FLAME CRAFT',
    title: 'Sizzling Wok Hei Flavours',
    desc: 'Intense high-heat wok tossing that seals in the authentic smoky aroma and crisp vegetable crunch.'
  },
  {
    image: 'assets/images/hdr-bnr-03.jpg',
    tag: 'ARTISANAL SPICE BLENDS',
    title: 'Legendary Dragon Chicken & Gravies',
    desc: 'Crafted fresh daily with whole sun-dried chillies, crushed garlic, and zero artificial preservatives.'
  },
  {
    image: 'assets/images/hdr-bnr-04.jpg',
    tag: 'PATENTED THERMAL PACKAGING',
    title: 'Piping Hot Comfort On The Go',
    desc: 'Virgin eco-board geometric fold keeps your meal above 65°C for 45 minutes on the road.'
  },
  {
    image: 'assets/images/hdr-bnr-05.jpg',
    tag: 'NATIONAL EXPANSION',
    title: '57+ Branches Across Global Hubs',
    desc: 'India’s fastest growing organized Indo-Chinese quick service restaurant chain, serving 100,000+ meals monthly.'
  },
  {
    image: 'assets/images/hdr-bnr-06.jpg',
    tag: 'GLOBAL HORIZONS',
    title: 'Chennai to Dubai & Beyond',
    desc: 'Taking authentic wok-charred street Indo-Chinese cuisine to international food capitals.'
  }
];"""

new_state = """// Hero Carousel State & Dynamic Media Storage
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
];"""

if old_state in js:
    js = js.replace(old_state, new_state)
    print("Replaced heroSlides state declaration")
else:
    # regex fallback
    js = re.sub(r'// Hero Carousel State.*?const heroSlides = \[.*?\];', new_state, js, flags=re.DOTALL)
    print("Regex replaced heroSlides state declaration")

# 2. Update initialization in DOMContentLoaded
old_init_interval = "if (document.getElementById('heroBannerImg')) {\n    setInterval(nextHeroSlide, 5000);\n  }"
new_init_call = """if (document.getElementById('heroSliderSection') || document.getElementById('heroBannerImg')) {
    initHeroCarousel();
  }"""
if old_init_interval in js:
    js = js.replace(old_init_interval, new_init_call)
    print("Replaced setInterval with initHeroCarousel")
else:
    js = re.sub(r"if \(document\.getElementById\('heroBannerImg'\)\) \{\s*setInterval\(nextHeroSlide,\s*5000\);\s*\}", new_init_call, js)
    print("Regex replaced setInterval with initHeroCarousel")

# 3. Update HERO CAROUSEL Functions
old_carousel_fns = """// ================= HERO CAROUSEL =================
function changeHeroSlide(index) {
  heroIndex = index;
  updateHeroDisplay();
}

function nextHeroSlide() {
  heroIndex = (heroIndex + 1) % heroSlides.length;
  updateHeroDisplay();
}

function prevHeroSlide() {
  heroIndex = (heroIndex - 1 + heroSlides.length) % heroSlides.length;
  updateHeroDisplay();
}

function updateHeroDisplay() {
  const img = document.getElementById('heroBannerImg');
  const tag = document.getElementById('heroBannerTag');
  const title = document.getElementById('heroBannerTitle');
  const desc = document.getElementById('heroBannerDesc');
  const dots = document.querySelectorAll('.hero-dot');

  const current = heroSlides[heroIndex];

  if (img) {
    img.style.opacity = '0.4';
    setTimeout(() => {
      img.src = current.image;
      if (tag) tag.textContent = current.tag;
      if (title) title.textContent = current.title;
      if (desc) desc.textContent = current.desc;
      img.style.opacity = '1';
    }, 180);
  }

  dots.forEach((dot, idx) => {
    if (idx === heroIndex) {
      dot.className = 'hero-dot w-8 h-2 rounded-full bg-brand-red transition-all';
    } else {
      dot.className = 'hero-dot w-2 h-2 rounded-full bg-white/70 hover:bg-white transition-all';
    }
  });
}"""

new_carousel_fns = """// ================= HERO CAROUSEL (IMAGES & FULL EXTENT VIDEOS) =================
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
    if (e.key === 'redbox_hero_slides') {
      loadHeroSlides().then(() => updateHeroDisplay());
    }
  });

  // Display initial slide
  updateHeroDisplay();
}

async function loadHeroSlides() {
  // 1. Try localStorage first (fastest and reflects live admin edits)
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

  // 2. Fetch from data/slides.json
  try {
    const res = await fetch('data/slides.json');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        heroSlides = data.filter(s => s.active !== false);
        return;
      }
    }
  } catch (err) {
    console.warn('Could not fetch data/slides.json:', err);
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
  const isVideo = current.type === 'video' || (current.media && (current.media.endsWith('.webm') || current.media.endsWith('.mp4')));

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
}"""

if old_carousel_fns in js:
    js = js.replace(old_carousel_fns, new_carousel_fns)
    print("Replaced old HERO CAROUSEL functions with video-supporting implementation")
else:
    js = re.sub(r'// ================= HERO CAROUSEL =================.*?function updateHeroDisplay\(\) \{.*?\n\}', new_carousel_fns, js, flags=re.DOTALL)
    print("Regex replaced old HERO CAROUSEL functions")

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Updated app.js successfully.")
