import re

with open('about.html', 'r', encoding='utf-8') as f:
    text = f.read()

sections = re.findall(r'<section[^>]*id="([^"]+)"', text)
print("Section IDs in about.html:", sections)

# Also check for dragon in about.html
matches = [m.start() for m in re.finditer(r'golden-dragon-watermark', text)]
print(f"Found {len(matches)} dragon watermarks in about.html at indices: {matches}")
for idx in matches:
    print(text[max(0, idx-150):min(len(text), idx+200)])
    print("-" * 50)
