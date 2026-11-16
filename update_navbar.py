# update_navbar.py - Upgrade navbar across all Red Box HTML pages with About Us rename
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
