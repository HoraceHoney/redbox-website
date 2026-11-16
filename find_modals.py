with open('admin.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'modal', text, re.IGNORECASE)]
print(f"Found {len(matches)} occurrences of 'modal' in admin.html:")
for m in matches[:10]:
    print(text[max(0, m-50):min(len(text), m+150)].replace('\n', ' '))
