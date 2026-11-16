with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'mobile', text, re.IGNORECASE)]
print(f"Found {len(matches)} occurrences of 'mobile'")
for m in matches[:10]:
    snippet = text[max(0, m-50):min(len(text), m+200)].replace('\n', ' ')
    print(f"[{m}]: {snippet}\n")
