with open('admin.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'slideModal', text)]
print(f"Found {len(matches)} occurrences of 'slideModal' in admin.html:")
for m in matches:
    print(text[max(0, m-40):min(len(text), m+80)].replace('\n', ' '))
