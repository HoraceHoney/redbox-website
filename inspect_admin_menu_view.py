with open('admin.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
idx = text.find('id="view-menu"')
print("view-menu found at:", idx)
if idx != -1:
    idx_next = text.find('id="view-', idx + 20)
    print("next view found at:", idx_next)
    print(text[idx:idx_next])
