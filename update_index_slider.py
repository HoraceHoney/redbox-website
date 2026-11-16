import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Locate slider section
old_slider_start = '<section class="relative w-full bg-zinc-950 overflow-hidden h-[340px] sm:h-[440px] lg:h-[540px]">'
old_slider_end = '</section>'
pos_start = html.find(old_slider_start)
if pos_start == -1:
    pos_start = html.find('heroBannerImg')
    pos_start = html.rfind('<section', 0, pos_start)

pos_end = html.find('</section>', pos_start) + len('</section>')

new_slider_html = '''<section id="heroSliderSection" class="relative w-full bg-zinc-950 overflow-hidden h-[340px] sm:h-[440px] lg:h-[540px] select-none group/slider">
      
      <!-- Slide Image (1922x772 px full width) -->
      <img id="heroBannerImg" src="assets/images/hdr-bnr-01.jpg" alt="The Red Box Hero Banner" class="w-full h-full object-cover transition-opacity duration-500 block">
      
      <!-- Slide Video (Plays to its full extent before auto-scrolling) -->
      <video id="heroBannerVideo" class="w-full h-full object-cover hidden" playsinline muted autoplay preload="auto">
        <source id="heroBannerVideoSrc" src="assets/videos/wok-cooking-flame.webm" type="video/webm">
      </video>

      <!-- Gradient Shade Overlay (Highlights bottom context & preserves video visibility) -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/15 pointer-events-none z-10"></div>

      <!-- Edge-Tap / Click Left Zone (Interactive Scroll Function for Left Side of Video) -->
      <div onclick="prevHeroSlide()" class="absolute left-0 top-0 bottom-0 w-1/4 sm:w-1/5 z-20 cursor-pointer flex items-center justify-start pl-3 sm:pl-6 transition-all duration-300 hover:bg-gradient-to-r hover:from-black/50 hover:to-transparent" title="Previous Slide (Tap or Click Left Side)" aria-label="Previous Slide">
        <div class="opacity-0 group-hover/slider:opacity-60 hover:!opacity-100 transition-opacity duration-300 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg">
          <i data-lucide="chevron-left" class="w-6 h-6 stroke-[2.5]"></i>
        </div>
      </div>

      <!-- Edge-Tap / Click Right Zone (Interactive Scroll Function for Right Side of Video) -->
      <div onclick="nextHeroSlide()" class="absolute right-0 top-0 bottom-0 w-1/4 sm:w-1/5 z-20 cursor-pointer flex items-center justify-end pr-3 sm:pr-6 transition-all duration-300 hover:bg-gradient-to-l hover:from-black/50 hover:to-transparent" title="Next Slide (Tap or Click Right Side)" aria-label="Next Slide">
        <div class="opacity-0 group-hover/slider:opacity-60 hover:!opacity-100 transition-opacity duration-300 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg">
          <i data-lucide="chevron-right" class="w-6 h-6 stroke-[2.5]"></i>
        </div>
      </div>

      <!-- Slide Content / Context Overlay (Anchored to Bottom Side of Video & Images) -->
      <div class="absolute bottom-6 sm:bottom-10 left-0 right-0 z-20 px-4 sm:px-8 pointer-events-none">
        <div class="max-w-7xl mx-auto">
          
          <div class="max-w-3xl space-y-2 sm:space-y-3 pointer-events-auto">
            <span id="heroBannerTag" class="inline-block px-3 py-1 bg-brand-red text-white text-[10px] sm:text-xs font-extrabold uppercase tracking-widest rounded-md shadow-md">
              SIGNATURE DIM SUMS
            </span>

            <h1 id="heroBannerTitle" class="text-2xl sm:text-4xl lg:text-5xl font-heading font-black text-white tracking-tight drop-shadow-lg leading-tight">
              Real Wok Craft. Iconic Red Box.
            </h1>

            <p id="heroBannerDesc" class="text-xs sm:text-base text-zinc-200 font-medium max-w-2xl drop-shadow leading-relaxed">
              Steaming, freshly tossed Indo-Chinese specialties packed hot in our 45-minute heat-retention fold box.
            </p>

            <!-- Quick Action Buttons On Slider -->
            <div id="heroBannerActions" class="flex items-center gap-3 pt-2">
              <a id="heroBannerPrimaryCta" href="menu.html" class="px-6 py-2.5 sm:px-8 sm:py-3 bg-brand-red hover:bg-brand-red-dark text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-brand-red/40 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                <i data-lucide="utensils" id="heroBannerPrimaryIcon" class="w-3.5 h-3.5"></i>
                <span id="heroBannerPrimaryText">Explore Full Menu</span>
              </a>
              <button id="heroBannerSecondaryCta" onclick="openOrderModal()" class="px-6 py-2.5 sm:px-8 sm:py-3 bg-white/90 hover:bg-white text-zinc-900 font-extrabold text-xs uppercase tracking-wider rounded-full shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
                <i data-lucide="shopping-bag" id="heroBannerSecondaryIcon" class="w-3.5 h-3.5 text-brand-red"></i>
                <span id="heroBannerSecondaryText">Order Online</span>
              </button>
            </div>
          </div>

        </div>
      </div>

    </section>'''

html = html[:pos_start] + new_slider_html + html[pos_end:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated index.html hero slider section successfully.")
