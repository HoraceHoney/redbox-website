with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = """      <!-- ======================================================== -->
      <!-- VIEW: BRANCHES                                           -->
      <!-- ======================================================== -->"""

slider_view = """      <!-- ======================================================== -->
      <!-- VIEW: HERO SLIDER & WEBSITE CONTENT MANAGER             -->
      <!-- ======================================================== -->
      <section id="view-slider" class="space-y-6 hidden">
        
        <!-- Header Banner & Action Controls -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold tracking-wider uppercase mb-2">
              <svg class="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span>HOMEPAGE HERO SLIDER · CINEMATIC MEDIA ENGINE</span>
            </div>
            <h2 class="text-2xl font-black text-slate-900">Hero Slider & Video Content Manager</h2>
            <p class="text-sm text-slate-500 mt-1 max-w-2xl">
              Add short wok videos or photography slides, edit bottom context overlays (titles, descriptions, CTAs), configure playback duration, and control edge-scroll interactions.
            </p>
          </div>
          
          <div class="flex items-center gap-3 flex-wrap">
            <button onclick="resetSlideDefaults()" class="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-all flex items-center gap-2">
              <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              <span>Reset Defaults</span>
            </button>
            <a href="index.html" target="_blank" class="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2">
              <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              <span>Preview Live Slider</span>
            </a>
            <button onclick="openSlideModal()" class="px-5 py-2.5 bg-brand-red hover:bg-brand-red-dark text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-brand-red/25 hover:shadow-brand-red/40 transition-all flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              <span>+ Add Slide / Video</span>
            </button>
          </div>
        </div>

        <!-- Metric Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Total Carousel Items</p>
              <h3 id="stat-slider-total" class="text-2xl font-black text-slate-900 mt-1">6</h3>
            </div>
            <div class="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-black">
              🎠
            </div>
          </div>
          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Short Video Slides</p>
              <h3 id="stat-slider-videos" class="text-2xl font-black text-amber-600 mt-1">1</h3>
            </div>
            <div class="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-black">
              🎬
            </div>
          </div>
          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Image Slides</p>
              <h3 id="stat-slider-images" class="text-2xl font-black text-slate-900 mt-1">5</h3>
            </div>
            <div class="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
              🖼️
            </div>
          </div>
          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Playback Rule</p>
              <h3 class="text-xs font-bold text-slate-800 mt-1">Full Video Extent</h3>
              <p class="text-[10px] text-slate-500">Runs to end before scroll</p>
            </div>
            <div class="w-10 h-10 rounded-lg bg-red-50 text-brand-red flex items-center justify-center font-black">
              ⏱️
            </div>
          </div>
        </div>

        <!-- Slides List & Interactive Manager -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div>
              <h3 class="font-bold text-slate-800 text-base">Active Slider Queue</h3>
              <p class="text-xs text-slate-500">Slides appear in the order listed below. Click edit to modify captions, videos, or buttons.</p>
            </div>
            <span class="text-xs font-medium text-slate-500">Auto-persists to disk & browser cache</span>
          </div>

          <div id="adminSlidesContainer" class="divide-y divide-slate-100">
            <!-- Dynamic Slide Rows Rendered Here by JS -->
          </div>
        </div>

      </section>

"""

if target in html and 'id="view-slider"' not in html:
    html = html.replace(target, slider_view + target)
    with open('admin.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Successfully inserted view-slider into admin.html!")
else:
    print("Already present or target mismatch.")
