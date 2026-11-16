import re

with open('admin.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Find navigation items / sidebar links in admin.html
nav_items = re.findall(r'<button[^>]*onclick="([^"]+)"[^>]*>(.*?)</button>', text, re.DOTALL)
print("Admin Buttons:")
for oc, label in nav_items[:15]:
    clean = re.sub(r'<[^>]+>', ' ', label).strip()
    clean = ' '.join(clean.split())
    print(f"  {oc:30}: {clean}")

# Find section IDs
sections = re.findall(r'<section[^>]*id="([^"]+)"', text)
print("\nAdmin Section IDs:", sections)

# Find tabs/views
views = re.findall(r'id="([a-zA-Z0-9_-]*(?:view|tab|panel|section)[a-zA-Z0-9_-]*)"', text, re.IGNORECASE)
print("\nAdmin Views/Tabs:", views)
