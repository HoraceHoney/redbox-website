import re, glob, os

files = ['index.html', 'about.html', 'branches.html', 'menu.html', 'catering.html', 'franchise.html', 'thebox.html', 'story.html']

for fn in files:
    if not os.path.exists(fn):
        continue
    with open(fn, 'r', encoding='utf-8') as f:
        html = f.read()
    
    print(f"\n=================== {fn} ===================")
    # Check desktop nav
    nav_match = re.search(r'<nav class="hidden md:flex[^>]*>(.*?)</nav>', html, re.DOTALL)
    if nav_match:
        print("--- DESKTOP NAV ---")
        links = re.findall(r'<a\s+href="([^"]+)"[^>]*>(.*?)</a>', nav_match.group(1), re.DOTALL)
        for href, inner in links:
            # clean inner
            clean_text = re.sub(r'<[^>]+>', '', inner).strip()
            print(f"  {clean_text:15} -> {href}")
    else:
        print("NO DESKTOP NAV FOUND!")
        
    # Check mobile menu
    mob_match = re.search(r'id="mobileMenu"[^>]*>(.*?)(?:</aside>|<!-- Mobile Menu End -->|id="mobileMenuOverlay")', html, re.DOTALL)
    if not mob_match:
        mob_match = re.search(r'id="mobileMenu"[^>]*>(.*?)</div>\s*</div>\s*</div>', html, re.DOTALL)
    if mob_match:
        print("--- MOBILE MENU ITEMS ---")
        mob_links = re.findall(r'<a\s+href="([^"]+)"[^>]*>(.*?)</a>', mob_match.group(1), re.DOTALL)
        for href, inner in mob_links:
            clean_text = re.sub(r'<[^>]+>', ' ', inner).strip()
            clean_text = ' '.join(clean_text.split())
            print(f"  {clean_text[:40]:40} -> {href}")
            if 'sparkle' in inner.lower() or 'lucide-sparkles' in inner:
                print("    ^ ALERT: HAS SPARKLE ICON!")
    else:
        print("NO MOBILE MENU FOUND!")
