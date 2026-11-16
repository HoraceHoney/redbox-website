# update_all_about_and_box.py
import os, re

THE_BOX_SECTION = '''
    <!-- ---------------------------------------------------- -->
    <!-- SECTION: THE ANATOMY OF "THE BOX" (PROPRIETARY USP)   -->
    <!-- ---------------------------------------------------- -->
    <section id="the-box" class="relative py-20 px-4 sm:px-6 lg:px-8 border-b border-brand-gold/20 bg-gradient-to-b from-[#0B0D11] via-[#121620] to-[#0B0D11] overflow-hidden scroll-mt-20">
      
      <div class="max-w-7xl mx-auto relative z-10">
        
        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-16">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-heading font-bold tracking-widest uppercase mb-3 select-none">
            <i data-lucide="box" class="w-3.5 h-3.5 text-brand-red"></i>
            <span>盒工 · PROPRIETARY PACKAGING ENGINEERING</span>
          </div>
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
            The Anatomy of <span class="gold-foil-text font-cinzel">"The Box"</span>
          </h2>
          <p class="text-ivory/70 text-sm sm:text-base mt-4 font-sans leading-relaxed">
            Culinary mastery is futile if food arrives cold or soggy. Explore how our origami-folded, multi-layered virgin board container locks in authentic 1000°F wok hei heat for 45 minutes on the road.
          </p>
        </div>

        <!-- Interactive Hotspot Showcase Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
          
          <!-- Interactive Visual Center Left -->
          <div class="lg:col-span-6 relative">
            <div class="relative bg-gradient-to-br from-[#151924] via-[#0E1118] to-[#171B26] rounded-3xl p-8 sm:p-12 border border-brand-gold/30 flex items-center justify-center min-h-[420px] shadow-2xl overflow-hidden group">
              
              <!-- Subtle Radial Gold Glow in Center -->
              <div class="absolute inset-0 bg-radial-gradient from-brand-gold/10 via-transparent to-transparent pointer-events-none"></div>

              <!-- Packshot Image -->
              <img src="assets/images/redbox-logo.png" alt="The Red Box Packshot" class="w-72 max-w-full h-auto object-contain filter drop-shadow-[0_15px_35px_rgba(217,35,45,0.3)] transition-transform duration-500 group-hover:scale-105">

              <!-- Hotspot Interactive Pins -->
              <button onclick="activateBoxHotspot(1)" id="pin-1" class="hotspot-pin top-20 left-16 sm:left-20" title="Thermal Insulation">1</button>
              <button onclick="activateBoxHotspot(2)" id="pin-2" class="hotspot-pin top-24 right-16 sm:right-20" title="Origami Leak-Proofing">2</button>
              <button onclick="activateBoxHotspot(3)" id="pin-3" class="hotspot-pin bottom-24 left-16 sm:left-24" title="100% Virgin Eco-Board">3</button>
              <button onclick="activateBoxHotspot(4)" id="pin-4" class="hotspot-pin bottom-20 right-16 sm:right-24" title="Instant Dining Plate">4</button>

            </div>
            <p class="text-center text-xs text-brand-gold/70 mt-3 font-heading tracking-wider uppercase">
              • Click any numbered pin to inspect thermal engineering •
            </p>
          </div>

          <!-- Hotspot Explainer Cards Right -->
          <div class="lg:col-span-6 space-y-4">
            
            <div id="hotspotCard-1" onclick="activateBoxHotspot(1)" class="hotspot-card bg-[#161B26] border-2 border-brand-gold rounded-2xl p-5 transition-all shadow-lg shadow-brand-gold/10 cursor-pointer">
              <div class="flex items-center gap-3 mb-2">
                <span class="w-7 h-7 rounded-full bg-brand-red text-white flex items-center justify-center font-bold text-xs font-heading">1</span>
                <h4 class="font-heading font-bold text-base text-white">45-Minute Thermal Insulation</h4>
              </div>
              <p class="text-xs text-ivory/75 font-sans leading-relaxed">
                Internal multi-layer thermal reflective barriers keep steaming noodles and fried rice above 65°C for 45 minutes, ensuring your meal arrives at true wok-tossed temperature.
              </p>
            </div>

            <div id="hotspotCard-2" onclick="activateBoxHotspot(2)" class="hotspot-card bg-[#0F121A] border border-brand-gold/20 rounded-2xl p-5 hover:border-brand-gold/40 transition-all opacity-75 hover:opacity-100 cursor-pointer">
              <div class="flex items-center gap-3 mb-2">
                <span class="w-7 h-7 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold text-xs font-heading">2</span>
                <h4 class="font-heading font-bold text-base text-white">Spill-Proof Origami Locking Fold</h4>
              </div>
              <p class="text-xs text-ivory/75 font-sans leading-relaxed">
                Tightly interlocking tab folds eliminate clumsy plastic bags. Even rich Manchurian, Schezwan, and garlic chili gravies stay locked inside during rapid transit.
              </p>
            </div>

            <div id="hotspotCard-3" onclick="activateBoxHotspot(3)" class="hotspot-card bg-[#0F121A] border border-brand-gold/20 rounded-2xl p-5 hover:border-brand-gold/40 transition-all opacity-75 hover:opacity-100 cursor-pointer">
              <div class="flex items-center gap-3 mb-2">
                <span class="w-7 h-7 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold text-xs font-heading">3</span>
                <h4 class="font-heading font-bold text-base text-white">100% Food-Grade Virgin Eco-Board</h4>
              </div>
              <p class="text-xs text-ivory/75 font-sans leading-relaxed">
                Certified chlorine-free, unbleached, and microwave-safe paperboard. Zero harmful microplastics or petroleum liners ever come into contact with your hot food.
              </p>
            </div>

            <div id="hotspotCard-4" onclick="activateBoxHotspot(4)" class="hotspot-card bg-[#0F121A] border border-brand-gold/20 rounded-2xl p-5 hover:border-brand-gold/40 transition-all opacity-75 hover:opacity-100 cursor-pointer">
              <div class="flex items-center gap-3 mb-2">
                <span class="w-7 h-7 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold text-xs font-heading">4</span>
                <h4 class="font-heading font-bold text-base text-white">Unfolds Into An Instant Dining Plate</h4>
              </div>
              <p class="text-xs text-ivory/75 font-sans leading-relaxed">
                Simply tear along the side tab perforations and your Red Box unfolds flat into an instant, spill-proof dining plate at your work desk, home, or on the go.
              </p>
            </div>

          </div>

        </div>

        <!-- Sustainability & Purity Commitments -->
        <div class="bg-[#121620] border border-brand-gold/25 rounded-2xl p-6 sm:p-8 text-center max-w-4xl mx-auto shadow-xl">
          <div class="inline-flex items-center gap-2 text-brand-gold text-xs font-heading font-bold uppercase tracking-widest mb-2">
            <i data-lucide="leaf" class="w-4 h-4 text-emerald-400"></i>
            <span>Environmental & Food Safety Purity</span>
          </div>
          <h3 class="font-serif font-bold text-xl sm:text-2xl text-white mb-3">Our 100% Biodegradable Guarantee</h3>
          <p class="text-xs sm:text-sm text-ivory/70 max-w-2xl mx-auto mb-6 font-sans">
            While industry takeout relies on single-use plastic containers, every Red Box is engineered from sustainable FSC-certified forestry pulp that decomposes naturally within 90 days.
          </p>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-heading font-bold text-ivory/90">
            <div class="p-3 rounded-xl bg-white/5 border border-brand-gold/20 flex flex-col items-center gap-1.5">
              <i data-lucide="check-circle-2" class="w-5 h-5 text-emerald-400"></i>
              <span>FSC Certified Pulp</span>
            </div>
            <div class="p-3 rounded-xl bg-white/5 border border-brand-gold/20 flex flex-col items-center gap-1.5">
              <i data-lucide="shield-check" class="w-5 h-5 text-emerald-400"></i>
              <span>100% Plastic Free</span>
            </div>
            <div class="p-3 rounded-xl bg-white/5 border border-brand-gold/20 flex flex-col items-center gap-1.5">
              <i data-lucide="microwave" class="w-5 h-5 text-amber-400"></i>
              <span>Microwave Safe</span>
            </div>
            <div class="p-3 rounded-xl bg-white/5 border border-brand-gold/20 flex flex-col items-center gap-1.5">
              <i data-lucide="droplet" class="w-5 h-5 text-sky-400"></i>
              <span>Non-Toxic Soy Inks</span>
            </div>
          </div>
        </div>

      </div>
    </section>
'''

JS_BOX_HOTSPOT = '''
    function activateBoxHotspot(num) {
      for (let i = 1; i <= 4; i++) {
        const card = document.getElementById(`hotspotCard-${i}`);
        const pin = document.getElementById(`pin-${i}`);
        if (card && pin) {
          if (i === num) {
            card.className = 'hotspot-card bg-[#161B26] border-2 border-brand-gold rounded-2xl p-5 transition-all shadow-lg shadow-brand-gold/10 cursor-pointer';
            pin.style.transform = 'scale(1.25)';
          } else {
            card.className = 'hotspot-card bg-[#0F121A] border border-brand-gold/20 rounded-2xl p-5 hover:border-brand-gold/40 transition-all opacity-75 hover:opacity-100 cursor-pointer';
            pin.style.transform = 'scale(1)';
          }
        }
      }
    }
'''

# 1. Update story.html and about.html
for fn in ['story.html', 'about.html']:
    fpath = os.path.join(r'd:\Antigravity\redbox', fn)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Update Title
    content = re.sub(r'<title>.*?</title>', '<title>About Us · Culinary Heritage & The Box | The Red Box</title>', content)

    # Rename Hero Badge to ABOUT US
    content = content.replace('印 · A Legacy of Flame & Wok Hei · Since 2015', '印 · ABOUT US · A LEGACY OF FLAME & CRAFT · SINCE 2015')
    content = content.replace('A Legacy of Flame & Wok Hei · Since 2015', 'ABOUT US · A Legacy of Flame & Craft · Since 2015')

    # Insert Box Section if not present
    if 'id="the-box"' not in content:
        s4_idx = content.find('<!-- SECTION 4: THE 11-YEAR HERITAGE')
        if s4_idx != -1:
            content = content[:s4_idx] + THE_BOX_SECTION + '\n\n    ' + content[s4_idx:]

    # Add JS activateBoxHotspot if not present
    if 'function activateBoxHotspot' not in content:
        script_idx = content.rfind('</script>')
        if script_idx != -1:
            content = content[:script_idx] + JS_BOX_HOTSPOT + '\n  ' + content[script_idx:]

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Updated {fn} with The Box section and About Us naming!')

# 2. Update update_navbar.py to rename "Our Story" to "About Us" and remove standalone The Box from navbar
NAV_SCRIPT = '''# update_navbar.py - Upgrade navbar across all Red Box HTML pages with About Us rename
import os, re

PAGES = [
    {
        'file': 'story.html',
        'is_dark': True,
        'active': 'about'
    },
    {
        'file': 'about.html',
        'is_dark': True,
        'active': 'about'
    },
    {
        'file': 'index.html',
        'is_dark': False,
        'active': 'home'
    },
    {
        'file': 'menu.html',
        'is_dark': False,
        'active': 'menu'
    },
    {
        'file': 'outlets.html',
        'is_dark': False,
        'active': 'outlets'
    },
    {
        'file': 'thebox.html',
        'is_dark': False,
        'active': 'thebox'
    },
    {
        'file': 'catering.html',
        'is_dark': False,
        'active': 'catering'
    },
    {
        'file': 'franchise.html',
        'is_dark': False,
        'active': 'franchise'
    }
]

def build_header(is_dark, active):
    if is_dark:
        bg_header = "bg-[#0B0D11]/95 border-b border-brand-gold/25 shadow-lg backdrop-blur-md"
        active_cls = "text-brand-gold-bright font-bold border-b-2 border-brand-gold"
        inactive_cls = "text-ivory/80 hover:text-brand-gold-bright font-semibold border-b-2 border-transparent hover:border-brand-gold/40"
        wok_badge = """<div class="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/25 text-[#C5A059] font-heading font-bold text-xs tracking-wider uppercase select-none whitespace-nowrap">
          <i data-lucide="flame" class="w-3.5 h-3.5 text-brand-red animate-pulse"></i>
          <span>Wok Hei Fresh</span>
        </div>"""
        order_btn = """<button onclick="openOrderModal()" class="inline-flex items-center gap-1.5 bg-gradient-to-r from-brand-red to-brand-red-dark hover:from-red-600 hover:to-brand-red text-white text-xs font-heading font-extrabold uppercase tracking-wider px-3.5 sm:px-4 py-2 rounded-full shadow-md shadow-brand-red/30 hover:shadow-brand-red/50 hover:scale-102 active:scale-98 transition-all cursor-pointer whitespace-nowrap flex-shrink-0">
          <i data-lucide="shopping-bag" class="w-3.5 h-3.5"></i>
          <span>Order Online</span>
        </button>"""
        mobile_btn = """<button onclick="toggleMobileNav()" id="mobileMenuBtn" class="md:hidden p-1.5 rounded-lg text-brand-gold hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus:outline-none flex items-center justify-center" aria-label="Toggle Mobile Menu">
          <i data-lucide="menu" id="mobileMenuIcon" class="w-6 h-6 stroke-[2.2]"></i>
        </button>"""
        dropdown_bg = "border-t border-brand-gold/20 bg-[#0B0D11]/98 backdrop-blur-md px-4 py-3 shadow-2xl text-ivory/80"
        dropdown_link = "text-ivory/80 hover:text-brand-gold hover:bg-white/5"
        dropdown_active = "text-brand-gold-bright font-bold border-l-2 border-brand-gold pl-2 bg-brand-gold/10"
        border_col = "border-brand-gold/15"
        hotline_col = "text-ivory/70 hover:text-brand-gold"
    else:
        bg_header = "bg-white/95 border-b border-zinc-200 shadow-xs backdrop-blur-md"
        active_cls = "text-brand-red font-black border-b-2 border-brand-red"
        inactive_cls = "text-zinc-700 hover:text-brand-red font-bold border-b-2 border-transparent hover:border-brand-red/40"
        wok_badge = """<div class="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#C5A059] font-heading font-extrabold text-xs tracking-wider uppercase select-none whitespace-nowrap">
          <i data-lucide="flame" class="w-3.5 h-3.5 text-brand-red"></i>
          <span>WOK HEI FRESH</span>
        </div>"""
        order_btn = """<button onclick="openOrderModal()" class="inline-flex items-center gap-1.5 bg-brand-red hover:bg-brand-red-dark text-white text-xs font-heading font-extrabold uppercase tracking-wider px-3.5 sm:px-4 py-2 rounded-full shadow-md shadow-brand-red/25 hover:shadow-brand-red/40 hover:scale-102 active:scale-98 transition-all cursor-pointer whitespace-nowrap flex-shrink-0">
          <i data-lucide="shopping-bag" class="w-3.5 h-3.5"></i>
          <span>Order Online</span>
        </button>"""
        mobile_btn = """<button onclick="toggleMobileNav()" id="mobileMenuBtn" class="md:hidden p-1.5 rounded-lg text-zinc-800 hover:text-brand-red hover:bg-zinc-100 transition-colors cursor-pointer focus:outline-none flex items-center justify-center" aria-label="Toggle Mobile Menu">
          <i data-lucide="menu" id="mobileMenuIcon" class="w-6 h-6 stroke-[2.2]"></i>
        </button>"""
        dropdown_bg = "border-t border-zinc-200 bg-white/98 backdrop-blur-md px-4 py-3 shadow-lg text-zinc-700"
        dropdown_link = "text-zinc-700 hover:text-brand-red hover:bg-zinc-50"
        dropdown_active = "text-brand-red font-black border-l-2 border-brand-red pl-2 bg-red-50/80"
        border_col = "border-zinc-100"
        hotline_col = "text-zinc-600 hover:text-brand-red"

    def link(name, href, key):
        is_cur = (key == active)
        cls = active_cls if is_cur else inactive_cls
        return f'<a href="{href}" class="px-2.5 xl:px-3.5 py-1.5 text-xs xl:text-sm font-heading transition-all tracking-wider uppercase whitespace-nowrap {cls}"><span>{name}</span></a>'

    def mlink(name, href, key, badge=""):
        is_cur = (key == active)
        cls = dropdown_active if is_cur else dropdown_link
        badge_html = f'<span class="text-[9px] px-1.5 py-0.5 rounded font-bold {badge}</span>' if badge else ''
        return f'<a href="{href}" class="px-3 py-2 text-xs font-heading rounded-lg flex items-center justify-between {cls}"><span>{name}</span>{badge_html}</a>'

    return f"""<!-- ======================================================== -->
  <!-- RESPONSIVE NAVBAR: INLINE DESKTOP LINKS & COMPACT MOBILE -->
  <!-- ======================================================== -->
  <header class="sticky top-0 z-40 {bg_header}">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 lg:gap-4 xl:gap-6">
      
      <!-- Brand Logo Left -->
      <a href="index.html" class="inline-flex items-center py-0.5 flex-shrink-0 group">
        <img src="assets/images/logo.png" alt="The Red Box - Fresh Indo-Chinese Food On The Go" class="h-8 sm:h-10 md:h-11 w-auto object-contain transition-transform group-hover:scale-105 duration-200">
      </a>

      <!-- Desktop Nav: Inline Navigation Links (Visible on tablets and desktop: md and up) -->
      <nav class="hidden md:flex items-center gap-1.5 xl:gap-3">
        {link('Home', 'index.html', 'home')}
        {link('Menu', 'menu.html', 'menu')}
        {link('57 Outlets', 'outlets.html', 'outlets')}
        {link('About Us', 'about.html', 'about')}
        {link('Catering', 'catering.html', 'catering')}
        {link('Franchise', 'franchise.html', 'franchise')}
      </nav>

      <!-- Header Right: WOK HEI Badge & Order Online Button -->
      <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {wok_badge}
        {order_btn}
        {mobile_btn}
      </div>

    </div>

    <!-- Neat Compact Mobile Dropdown (Directly below navbar, NOT a screen-blocking modal) -->
    <div id="mobileDropdown" class="hidden md:hidden {dropdown_bg} transition-all duration-200">
      <div class="grid grid-cols-2 gap-1.5 pb-2 border-b {border_col} mb-2">
        {mlink('Home', 'index.html', 'home')}
        {mlink('Menu', 'menu.html', 'menu', 'bg-red-900/40 text-red-200' if is_dark else 'bg-red-50 text-brand-red')}
        {mlink('57 Outlets', 'outlets.html', 'outlets', 'bg-emerald-900/40 text-emerald-200' if is_dark else 'bg-emerald-50 text-emerald-700')}
        {mlink('About Us', 'about.html', 'about')}
        {mlink('The Box USP', 'about.html#the-box', 'thebox', 'bg-amber-900/40 text-amber-200' if is_dark else 'bg-amber-50 text-amber-800')}
        {mlink('Catering', 'catering.html', 'catering')}
        {mlink('Franchise', 'franchise.html', 'franchise')}
        <a href="admin.html" class="px-3 py-2 text-xs font-heading font-semibold rounded-lg flex items-center gap-1 {dropdown_link}">
          <i data-lucide="shield" class="w-3.5 h-3.5 text-amber-400"></i>
          <span>Admin Portal</span>
        </a>
      </div>
      <div class="flex items-center justify-between text-xs px-1 pt-1">
        <a href="tel:04443533333" class="flex items-center gap-1.5 font-bold {hotline_col}">
          <i data-lucide="phone" class="w-3.5 h-3.5 text-brand-red"></i>
          <span>044 4353 3333</span>
        </a>
        <button onclick="openOrderModal()" class="text-[11px] font-heading font-bold text-brand-red hover:underline cursor-pointer">Quick Order</button>
      </div>
    </div>
  </header>
"""

def update_file(cfg):
    fpath = os.path.join(r'd:\Antigravity\redbox', cfg['file'])
    if not os.path.exists(fpath):
        return

    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    hdr_start = content.find('<header')
    hdr_end = content.find('</header>', hdr_start) + len('</header>')

    new_header = build_header(cfg['is_dark'], cfg['active'])
    updated = content[:hdr_start] + new_header + content[hdr_end:]

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(updated)
    print(f"Updated header in {cfg['file']} with About Us nav!")

if __name__ == '__main__':
    for page in PAGES:
        update_file(page)
'''

with open(r'd:\Antigravity\redbox\update_navbar.py', 'w', encoding='utf-8') as f:
    f.write(NAV_SCRIPT)

print('Wrote updated update_navbar.py successfully!')
