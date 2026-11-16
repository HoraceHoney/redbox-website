import re

with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add slides to appState
old_app_state = "let appState = {\n      branches: [],\n      menu: [],"
new_app_state = """let appState = {
      slides: [],
      branches: [],
      menu: [],"""

if old_app_state in html:
    html = html.replace(old_app_state, new_app_state)
    print("Added slides: [] to appState")

# 2. Add slide loading into initAdmin()
old_init_admin_end = """      } catch(e) {
        console.warn("Could not load local menu, using fallback.", e);
      }

      renderAll();"""

new_init_admin_end = """      } catch(e) {
        console.warn("Could not load local menu, using fallback.", e);
      }

      // 3. Load Hero Carousel Slides
      await loadAdminSlides();

      renderAll();"""

if old_init_admin_end in html:
    html = html.replace(old_init_admin_end, new_init_admin_end)
    print("Added loadAdminSlides to initAdmin")

# 3. Add renderAdminSlides call into renderAll()
old_render_all = """      renderCareersCards();
      renderAuditTable();
      renderDashboardLeads();
    }"""

new_render_all = """      renderCareersCards();
      renderAuditTable();
      renderDashboardLeads();
      renderAdminSlides();
    }"""

if old_render_all in html:
    html = html.replace(old_render_all, new_render_all)
    print("Added renderAdminSlides to renderAll")

# 4. Add the full slides manager logic right before </script>
slides_manager_js = """
    // ========================================================
    // HERO SLIDER & SHORT VIDEO CONTENT MANAGER
    // ========================================================
    const defaultAdminSlides = [
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

    async function loadAdminSlides() {
      try {
        const cached = localStorage.getItem('redbox_hero_slides');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            appState.slides = parsed;
            return;
          }
        }
      } catch(e) {
        console.warn("Could not read slides from localStorage", e);
      }

      try {
        let res = await fetch('data/slides.json').catch(() => null);
        if (!res || !res.ok) res = await fetch('../data/slides.json').catch(() => null);
        if (!res || !res.ok) res = await fetch('/data/slides.json').catch(() => null);
        if (res && res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            appState.slides = data;
            localStorage.setItem('redbox_hero_slides', JSON.stringify(appState.slides));
            return;
          }
        }
      } catch(e) {
        console.warn("Could not fetch data/slides.json", e);
      }

      // Fallback
      appState.slides = JSON.parse(JSON.stringify(defaultAdminSlides));
      localStorage.setItem('redbox_hero_slides', JSON.stringify(appState.slides));
    }

    function renderAdminSlides() {
      const container = document.getElementById('adminSlidesContainer');
      if (!container) return;

      const slides = appState.slides || [];

      // Update counters
      const total = slides.length;
      const videos = slides.filter(s => s.type === 'video' || (s.media && (s.media.endsWith('.webm') || s.media.endsWith('.mp4')))).length;
      const images = total - videos;

      const elTotal = document.getElementById('stat-slider-total');
      const elVideos = document.getElementById('stat-slider-videos');
      const elImages = document.getElementById('stat-slider-images');
      const elBadge = document.getElementById('badge-slider-count');

      if (elTotal) elTotal.innerText = total;
      if (elVideos) elVideos.innerText = videos;
      if (elImages) elImages.innerText = images;
      if (elBadge) elBadge.innerText = `${total} Slides`;

      if (slides.length === 0) {
        container.innerHTML = `
          <div class="p-12 text-center text-slate-400">
            <p class="text-base font-semibold">No slides configured yet.</p>
            <p class="text-xs mt-1">Click "+ Add Slide / Video" or "Reset Defaults" above.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = slides.map((slide, idx) => {
        const isVideo = slide.type === 'video' || (slide.media && (slide.media.endsWith('.webm') || slide.media.endsWith('.mp4')));
        const mediaSrc = slide.media || slide.image || 'assets/images/hdr-bnr-01.jpg';
        const isFirst = idx === 0;
        const isLast = idx === slides.length - 1;

        return `
          <div class="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors group">
            
            <!-- Left Info & Preview -->
            <div class="flex items-start sm:items-center gap-4 flex-1">
              
              <!-- Order Pill -->
              <span class="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center flex-shrink-0 border border-slate-200 shadow-2xs">
                #${idx + 1}
              </span>

              <!-- Media Preview Box -->
              <div class="relative w-28 h-18 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 flex-shrink-0 shadow-xs">
                ${isVideo ? `
                  <video src="${mediaSrc}" muted playsinline class="w-full h-full object-cover"></video>
                  <div class="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <span class="px-1.5 py-0.5 rounded bg-amber-500 text-black text-[9px] font-black uppercase tracking-wider shadow">🎬 VIDEO</span>
                  </div>
                ` : `
                  <img src="${mediaSrc}" alt="${slide.title || 'Slide'}" class="w-full h-full object-cover">
                  <span class="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-bold uppercase tracking-wider">🖼️ IMG</span>
                `}
              </div>

              <!-- Context Details -->
              <div class="space-y-1 min-w-0 flex-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="px-2 py-0.5 rounded bg-red-50 text-brand-red text-[10px] font-extrabold uppercase tracking-wider border border-red-100">
                    ${slide.tag || 'SLIDE'}
                  </span>
                  <span class="text-[11px] font-medium text-slate-500">
                    ${isVideo ? '🎥 Full Video Extent (Auto-scrolls when ended)' : `⏱️ ${slide.duration || 6}s Timer`}
                  </span>
                  ${slide.active !== false ? 
                    '<span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Live</span>' : 
                    '<span class="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">Hidden</span>'}
                </div>

                <h4 class="font-bold text-slate-900 text-sm truncate">${slide.title || 'Untitled Slide'}</h4>
                <p class="text-xs text-slate-500 line-clamp-1">${slide.desc || 'No description'}</p>
                
                <div class="flex items-center gap-2 pt-0.5 text-[11px] text-slate-400">
                  <span>CTA 1: <strong class="text-slate-600">${slide.primaryCta ? slide.primaryCta.text : 'None'}</strong></span>
                  ${slide.secondaryCta && slide.secondaryCta.text ? `<span>• CTA 2: <strong class="text-slate-600">${slide.secondaryCta.text}</strong></span>` : ''}
                </div>
              </div>

            </div>

            <!-- Action Controls -->
            <div class="flex items-center gap-1.5 self-end lg:self-center flex-shrink-0">
              
              <!-- Move Up / Down -->
              <button onclick="moveSlideUp(${idx})" ${isFirst ? 'disabled' : ''} class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="Move Up in Slider Queue">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/></svg>
              </button>
              
              <button onclick="moveSlideDown(${idx})" ${isLast ? 'disabled' : ''} class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="Move Down in Slider Queue">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </button>

              <!-- Active Toggle -->
              <button onclick="toggleSlideActive(${idx})" class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors" title="${slide.active !== false ? 'Hide from Homepage' : 'Publish to Homepage'}">
                ${slide.active !== false ? 
                  '<svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>' :
                  '<svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>'}
              </button>

              <!-- Edit Button -->
              <button onclick="openSlideModal(${idx})" class="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-brand-red bg-slate-100 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                <span>Edit</span>
              </button>

              <!-- Delete Button -->
              <button onclick="deleteSlide(${idx})" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Slide">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>

            </div>

          </div>
        `;
      }).join('');
    }

    function openSlideModal(idx = -1) {
      document.getElementById('editSlideIndex').value = idx;
      const heading = document.getElementById('slideModalHeading');

      if (idx >= 0 && appState.slides[idx]) {
        const slide = appState.slides[idx];
        heading.innerText = `Edit Carousel Slide #${idx + 1}`;

        const isVideo = slide.type === 'video' || (slide.media && (slide.media.endsWith('.webm') || slide.media.endsWith('.mp4')));
        if (isVideo) {
          document.getElementById('mediaTypeVideo').checked = true;
        } else {
          document.getElementById('mediaTypeImage').checked = true;
        }

        document.getElementById('slideMediaUrl').value = slide.media || slide.image || '';
        document.getElementById('slideTag').value = slide.tag || '';
        document.getElementById('slideTitle').value = slide.title || '';
        document.getElementById('slideDesc').value = slide.desc || '';
        document.getElementById('slideDuration').value = slide.duration || 6;

        document.getElementById('slidePrimaryText').value = slide.primaryCta ? slide.primaryCta.text : 'Explore Full Menu';
        document.getElementById('slidePrimaryLink').value = slide.primaryCta ? slide.primaryCta.link : 'menu.html';
        document.getElementById('slideSecondaryText').value = slide.secondaryCta ? slide.secondaryCta.text : 'Order Online';
        document.getElementById('slideSecondaryAction').value = slide.secondaryCta ? (slide.secondaryCta.action || slide.secondaryCta.link || '') : 'openOrderModal()';
      } else {
        heading.innerText = '+ Add New Carousel Slide';
        document.getElementById('mediaTypeImage').checked = true;
        document.getElementById('slideMediaUrl').value = 'assets/images/hdr-bnr-01.jpg';
        document.getElementById('slideTag').value = 'NEW SPECIALTY';
        document.getElementById('slideTitle').value = 'Fresh Indo-Chinese Masterpieces';
        document.getElementById('slideDesc').value = 'Tossed in screaming 1000°F woks and packed steaming hot in our 45-min fold box.';
        document.getElementById('slideDuration').value = 6;
        document.getElementById('slidePrimaryText').value = 'Explore Full Menu';
        document.getElementById('slidePrimaryLink').value = 'menu.html';
        document.getElementById('slideSecondaryText').value = 'Order Online';
        document.getElementById('slideSecondaryAction').value = 'openOrderModal()';
      }

      onMediaTypeChange();
      updateSlideLivePreview();
      document.getElementById('slideModal').classList.remove('hidden');
    }

    function closeSlideModal() {
      const modal = document.getElementById('slideModal');
      if (modal) modal.classList.add('hidden');
    }

    function onMediaTypeChange() {
      const isVideo = document.getElementById('mediaTypeVideo').checked;
      const durationContainer = document.getElementById('imageDurationContainer');
      const labelVid = document.getElementById('labelMediaTypeVideo');
      const labelImg = document.getElementById('labelMediaTypeImage');

      if (isVideo) {
        if (durationContainer) durationContainer.style.display = 'none';
        if (labelVid) {
          labelVid.classList.add('border-brand-red', 'bg-red-50/40');
          labelVid.classList.remove('border-slate-200');
        }
        if (labelImg) {
          labelImg.classList.remove('border-brand-red', 'bg-red-50/40');
          labelImg.classList.add('border-slate-200');
        }
      } else {
        if (durationContainer) durationContainer.style.display = 'block';
        if (labelImg) {
          labelImg.classList.add('border-brand-red', 'bg-red-50/40');
          labelImg.classList.remove('border-slate-200');
        }
        if (labelVid) {
          labelVid.classList.remove('border-brand-red', 'bg-red-50/40');
          labelVid.classList.add('border-slate-200');
        }
      }
      updateSlideLivePreview();
    }

    function setSlidePreset(type, url, tag, title, desc) {
      if (type === 'video') {
        document.getElementById('mediaTypeVideo').checked = true;
      } else {
        document.getElementById('mediaTypeImage').checked = true;
      }
      document.getElementById('slideMediaUrl').value = url;
      document.getElementById('slideTag').value = tag;
      document.getElementById('slideTitle').value = title;
      document.getElementById('slideDesc').value = desc;
      onMediaTypeChange();
      updateSlideLivePreview();
    }

    function updateSlideLivePreview() {
      const isVideo = document.getElementById('mediaTypeVideo').checked;
      const url = document.getElementById('slideMediaUrl').value.trim();
      const tag = document.getElementById('slideTag').value.trim() || 'CATEGORY';
      const title = document.getElementById('slideTitle').value.trim() || 'Headline Title';
      const desc = document.getElementById('slideDesc').value.trim() || 'Bottom context snippet';

      const prevImg = document.getElementById('modalPreviewImg');
      const prevVid = document.getElementById('modalPreviewVid');
      const prevTag = document.getElementById('modalPreviewTag');
      const prevTitle = document.getElementById('modalPreviewTitle');
      const prevDesc = document.getElementById('modalPreviewDesc');

      if (prevTag) prevTag.innerText = tag;
      if (prevTitle) prevTitle.innerText = title;
      if (prevDesc) prevDesc.innerText = desc;

      if (isVideo && prevVid) {
        if (prevImg) prevImg.classList.add('hidden');
        prevVid.classList.remove('hidden');
        if (url && prevVid.getAttribute('data-loaded-src') !== url) {
          prevVid.setAttribute('data-loaded-src', url);
          prevVid.src = url;
          prevVid.load();
        }
      } else if (prevImg) {
        if (prevVid) {
          prevVid.pause();
          prevVid.classList.add('hidden');
        }
        prevImg.classList.remove('hidden');
        if (url) prevImg.src = url;
      }
    }

    async function saveSlideModal(e) {
      e.preventDefault();
      const idx = parseInt(document.getElementById('editSlideIndex').value, 10);
      const isVideo = document.getElementById('mediaTypeVideo').checked;
      const mediaUrl = document.getElementById('slideMediaUrl').value.trim();
      const tag = document.getElementById('slideTag').value.trim();
      const title = document.getElementById('slideTitle').value.trim();
      const desc = document.getElementById('slideDesc').value.trim();
      const duration = parseInt(document.getElementById('slideDuration').value, 10) || 6;
      const primaryText = document.getElementById('slidePrimaryText').value.trim();
      const primaryLink = document.getElementById('slidePrimaryLink').value.trim();
      const secondaryText = document.getElementById('slideSecondaryText').value.trim();
      const secondaryAction = document.getElementById('slideSecondaryAction').value.trim();

      const newSlide = {
        id: idx >= 0 && appState.slides[idx].id ? appState.slides[idx].id : `slide-${Date.now()}`,
        type: isVideo ? 'video' : 'image',
        media: mediaUrl,
        tag: tag,
        title: title,
        desc: desc,
        playToEnd: isVideo,
        duration: isVideo ? 0 : duration,
        primaryCta: primaryText ? { text: primaryText, link: primaryLink || 'menu.html', icon: 'utensils' } : null,
        secondaryCta: secondaryText ? { text: secondaryText, action: secondaryAction || 'openOrderModal()', icon: 'shopping-bag' } : null,
        active: idx >= 0 && appState.slides[idx].active !== undefined ? appState.slides[idx].active : true
      };

      if (idx >= 0) {
        appState.slides[idx] = newSlide;
      } else {
        appState.slides.push(newSlide);
      }

      await persistSlides();
      renderAdminSlides();
      closeSlideModal();
      showToast("Homepage hero slide saved and published live!");
    }

    async function persistSlides() {
      // 1. Save to localStorage
      try {
        localStorage.setItem('redbox_hero_slides', JSON.stringify(appState.slides));
      } catch(err) {
        console.warn("Failed saving slides to localStorage", err);
      }

      // 2. POST to server endpoint
      try {
        await fetch('/api/slides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appState.slides)
        });
      } catch(err) {
        console.warn("Server POST /api/slides not available, saved to localStorage", err);
      }
    }

    async function deleteSlide(idx) {
      if (confirm(`Are you sure you want to remove slide #${idx + 1} ("${appState.slides[idx].title}") from the homepage slider?`)) {
        appState.slides.splice(idx, 1);
        await persistSlides();
        renderAdminSlides();
        showToast("Slide removed from queue.");
      }
    }

    async function moveSlideUp(idx) {
      if (idx <= 0) return;
      const temp = appState.slides[idx];
      appState.slides[idx] = appState.slides[idx - 1];
      appState.slides[idx - 1] = temp;
      await persistSlides();
      renderAdminSlides();
    }

    async function moveSlideDown(idx) {
      if (idx >= appState.slides.length - 1) return;
      const temp = appState.slides[idx];
      appState.slides[idx] = appState.slides[idx + 1];
      appState.slides[idx + 1] = temp;
      await persistSlides();
      renderAdminSlides();
    }

    async function toggleSlideActive(idx) {
      const current = appState.slides[idx];
      current.active = current.active === false ? true : false;
      await persistSlides();
      renderAdminSlides();
      showToast(current.active ? "Slide is now LIVE on homepage" : "Slide is now HIDDEN");
    }

    async function resetSlideDefaults() {
      if (confirm("Reset homepage slider queue to default 6 items including the authentic wok flame video?")) {
        appState.slides = JSON.parse(JSON.stringify(defaultAdminSlides));
        await persistSlides();
        renderAdminSlides();
        showToast("Homepage slider reset to default queue.");
      }
    }

    function showToast(msg) {
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-bold flex items-center gap-2 animate-bounce-short';
      toast.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
        <span>${msg}</span>
      `;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.4s';
        setTimeout(() => toast.remove(), 400);
      }, 3000);
    }
"""

script_end_target = "  </script>\n</body>"
if 'function loadAdminSlides' not in html:
    html = html.replace(script_end_target, slides_manager_js + "\n" + script_end_target)
    print("Injected slides_manager_js before </script>")

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated admin.html JavaScript completely.")
