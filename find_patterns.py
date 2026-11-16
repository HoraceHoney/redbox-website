with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re

for pattern in ['sparkle', '57 OUTLET', 'OUR STORY', 'THE BOX']:
    matches = [m.start() for m in re.finditer(pattern, text, re.IGNORECASE)]
    print(f"=== Pattern '{pattern}': {len(matches)} matches ===")
    for m in matches[:5]:
        snippet = text[max(0, m-80):min(len(text), m+120)].replace('\n', ' ')
        print(f"[{m}]: {snippet}\n")
