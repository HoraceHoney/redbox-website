import re

with open('about.html', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'<nav class="hidden md:flex[^>]*>.*?</nav>', text, re.DOTALL)
if m:
    print(m.group(0))
else:
    print("No nav matched")

m2 = re.search(r'id="mobileDropdown".*?</div>\s*</div>\s*</div>', text, re.DOTALL)
if m2:
    print("\n--- MOBILE DROPDOWN ---")
    print(m2.group(0)[:1500])
else:
    print("No mobile dropdown matched")
