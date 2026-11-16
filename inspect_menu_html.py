with open('menu.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"menu.html total lines: {len(lines)}")
for i, line in enumerate(lines):
    if any(k in line.lower() for k in ['filter', 'category', 'categories', 'grid', 'menu-items', 'menuitems', 'search']):
        print(f"{i+1}: {line.strip()[:100]}")
