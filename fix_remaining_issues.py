import re, glob

# 1. Clean up index.html
with open('index.html', 'r', encoding='utf-8') as f:
    idx = f.read()

# Fix desktop nav branches link in index.html
old_nav_branches = '<a href="branches.html" class="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md hover:border-brand-red/40 transition-all flex flex-col justify-between group"><span>Branches</span></a>'
new_nav_branches = '<a href="branches.html" class="px-2.5 xl:px-3.5 py-1.5 text-xs xl:text-sm font-heading transition-all tracking-wider uppercase whitespace-nowrap text-zinc-700 hover:text-brand-red font-bold border-b-2 border-transparent hover:border-brand-red/40"><span>Branches</span></a>'
if old_nav_branches in idx:
    idx = idx.replace(old_nav_branches, new_nav_branches)
    print("Fixed broken branches link in index.html nav")

# Replace sparkle icon in index.html (Pillar 02) with authentic culinary icon (utensils)
if 'data-lucide="sparkles"' in idx:
    idx = idx.replace('data-lucide="sparkles"', 'data-lucide="utensils"')
    print("Replaced sparkles with utensils in index.html")

# Replace "Find 57 Outlets" with "Explore 57 Branches"
idx = idx.replace('Find 57 Outlets', 'Explore 57 Branches')
idx = idx.replace('57 Outlets & Map', '57 Global Branches & Map')
idx = idx.replace('Tile 1: 57 Outlets', 'Tile 1: 57 Branches')
idx = idx.replace('href="outlets.html"', 'href="branches.html"')
idx = idx.replace('Our Story', 'About Us')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(idx)

# 2. Check all html files for remaining outlets.html or "Outlets" in labels
for fn in ['about.html', 'branches.html', 'catering.html', 'franchise.html', 'menu.html', 'story.html', 'thebox.html', 'app.js']:
    with open(fn, 'r', encoding='utf-8') as f:
        content = f.read()
    
    changed = False
    if 'outlets.html' in content:
        content = content.replace('outlets.html', 'branches.html')
        changed = True
        print(f"Replaced outlets.html in {fn}")
        
    if 'data-lucide="sparkles"' in content:
        content = content.replace('data-lucide="sparkles"', 'data-lucide="utensils"')
        changed = True
        print(f"Replaced sparkles in {fn}")
        
    if changed:
        with open(fn, 'w', encoding='utf-8') as f:
            f.write(content)

print("Scan and fix complete.")
