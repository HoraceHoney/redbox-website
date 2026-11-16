with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = "<!-- MODAL: ADD / EDIT BRANCH"

modal_markup = """  <!-- ======================================================== -->
  <!-- HERO SLIDE EDIT/ADD MODAL                                -->
  <!-- ======================================================== -->
  <div id="slideModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 hidden">
    <div class="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
      <div class="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 id="slideModalHeading" class="text-xl font-bold text-slate-900">Edit Carousel Slide</h3>
          <p class="text-xs text-slate-500 mt-0.5">Configure media, bottom context copy, and video playback rules.</p>
        </div>
        <button type="button" onclick="closeSlideModal()" class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <form id="slideEditForm" onsubmit="saveSlideModal(event)" class="space-y-5">
        <input type="hidden" id="editSlideIndex" value="-1">

        <!-- Media Type Selection -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Media Format</label>
          <div class="grid grid-cols-2 gap-3">
            <label class="flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer hover:bg-slate-50 transition-all border-slate-200" id="labelMediaTypeVideo">
              <input type="radio" name="slideMediaType" value="video" id="mediaTypeVideo" onchange="onMediaTypeChange()" class="accent-brand-red">
              <div>
                <span class="block text-xs font-bold text-slate-800">Short Video (Wok / Food Reel)</span>
                <span class="block text-[11px] text-slate-500">Plays to full extent before scrolling</span>
              </div>
            </label>
            <label class="flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer hover:bg-slate-50 transition-all border-slate-200" id="labelMediaTypeImage">
              <input type="radio" name="slideMediaType" value="image" id="mediaTypeImage" onchange="onMediaTypeChange()" class="accent-brand-red">
              <div>
                <span class="block text-xs font-bold text-slate-800">Photography Banner</span>
                <span class="block text-[11px] text-slate-500">Standard timed slide (e.g. 6 seconds)</span>
              </div>
            </label>
          </div>
        </div>

        <!-- Media URL & Presets -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Media File Path or Video URL</label>
          <input type="text" id="slideMediaUrl" required placeholder="assets/videos/wok-cooking-flame.webm or assets/images/hdr-bnr-01.jpg" oninput="updateSlideLivePreview()" class="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-brand-red font-mono">
          
          <!-- Quick Select Presets -->
          <div class="mt-2 flex flex-wrap gap-1.5 items-center">
            <span class="text-[11px] text-slate-400 mr-1">Quick Presets:</span>
            <button type="button" onclick="setSlidePreset('video', 'assets/videos/wok-cooking-flame.webm', '1000°F FLAME CRAFT', 'Real Wok Hei. Sizzling Fresh.', 'Witness the intense high-heat wok tossing that seals in authentic smoky aroma and crisp vegetable crunch.')" class="px-2.5 py-1 text-[11px] bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-md border border-amber-200 font-medium">🎬 Wok Flame Video (WebM)</button>
            <button type="button" onclick="setSlidePreset('image', 'assets/images/hdr-bnr-01.jpg', 'SIGNATURE DIM SUMS', 'Real Wok Craft. Iconic Red Box.', 'Steaming, freshly tossed Indo-Chinese specialties packed hot in our 45-minute heat-retention fold box.')" class="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md">Banner 01</button>
            <button type="button" onclick="setSlidePreset('image', 'assets/images/hdr-bnr-02.jpg', '1000°F FLAME CRAFT', 'Sizzling Wok Hei Flavours', 'Intense high-heat wok tossing that seals in the authentic smoky aroma.')" class="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md">Banner 02</button>
            <button type="button" onclick="setSlidePreset('image', 'assets/images/hdr-bnr-03.jpg', 'ARTISANAL SPICE BLENDS', 'Legendary Dragon Chicken & Gravies', 'Crafted fresh daily with whole sun-dried chillies and crushed garlic.')" class="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md">Banner 03</button>
            <button type="button" onclick="setSlidePreset('image', 'assets/images/hdr-bnr-05.jpg', 'GLOBAL EXPANSION', '57+ Branches Across Global Hubs', 'India’s fastest growing organized Indo-Chinese quick service restaurant chain.')" class="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md">Banner 05</button>
          </div>
        </div>

        <!-- Bottom Context Copy Fields -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Category Tag / Badge</label>
            <input type="text" id="slideTag" placeholder="e.g. 1000°F FLAME CRAFT" oninput="updateSlideLivePreview()" class="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-brand-red font-semibold">
          </div>
          <div id="imageDurationContainer">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Slide Timer (Image only)</label>
            <div class="flex items-center gap-2">
              <input type="number" id="slideDuration" min="2" max="30" value="6" class="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-brand-red">
              <span class="text-xs text-slate-500 whitespace-nowrap">seconds</span>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Headline Title</label>
          <input type="text" id="slideTitle" required placeholder="e.g. Real Wok Hei. Sizzling Fresh." oninput="updateSlideLivePreview()" class="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-brand-red font-bold text-slate-900">
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Bottom Context Description</label>
          <textarea id="slideDesc" rows="2" placeholder="Context displayed at bottom side of video or image..." oninput="updateSlideLivePreview()" class="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-brand-red leading-relaxed"></textarea>
        </div>

        <!-- Action Buttons Config -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-slate-100">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Primary CTA Button</label>
            <div class="space-y-2">
              <input type="text" id="slidePrimaryText" placeholder="Button Text (e.g. Explore Full Menu)" class="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-brand-red">
              <input type="text" id="slidePrimaryLink" placeholder="Link / URL (e.g. menu.html)" class="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-brand-red font-mono text-[11px]">
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Secondary CTA Button</label>
            <div class="space-y-2">
              <input type="text" id="slideSecondaryText" placeholder="Button Text (e.g. Order Online)" class="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-brand-red">
              <input type="text" id="slideSecondaryAction" placeholder="Action (e.g. openOrderModal() or branches.html)" class="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-brand-red font-mono text-[11px]">
            </div>
          </div>
        </div>

        <!-- Live Preview Card Inside Modal -->
        <div class="pt-3 border-t border-slate-100">
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Live Slide Preview (Bottom Context Layout)</label>
          <div class="relative w-full h-44 rounded-xl bg-black overflow-hidden border border-slate-700 shadow-inner flex items-end p-4">
            <img id="modalPreviewImg" src="assets/images/hdr-bnr-01.jpg" class="absolute inset-0 w-full h-full object-cover">
            <video id="modalPreviewVid" src="assets/videos/wok-cooking-flame.webm" playsinline muted autoplay loop class="absolute inset-0 w-full h-full object-cover hidden"></video>
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div class="relative z-10 text-white space-y-1 max-w-lg">
              <span id="modalPreviewTag" class="px-2 py-0.5 bg-brand-red text-[9px] font-bold uppercase tracking-widest rounded">TAG</span>
              <h4 id="modalPreviewTitle" class="text-sm font-bold truncate">Title</h4>
              <p id="modalPreviewDesc" class="text-[11px] text-zinc-300 line-clamp-1">Description snippet</p>
            </div>
          </div>
        </div>

        <!-- Modal Footer Buttons -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button type="button" onclick="closeSlideModal()" class="px-5 py-2.5 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
          <button type="submit" class="px-6 py-2.5 bg-brand-red hover:bg-brand-red-dark text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all">Save Slide</button>
        </div>

      </form>
    </div>
  </div>

"""

if target in html and 'id="slideModal"' not in html:
    html = html.replace(target, modal_markup + target)
    with open('admin.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Successfully inserted #slideModal into admin.html!")
else:
    print("Already inserted or target not found.")
