# inspect_about.py
import re

with open(r'd:\Antigravity\redbox\about.html', 'r', encoding='utf-8') as f:
    text = f.read()

sections = re.findall(r'<section.*?</section>', text, re.DOTALL)
print(f'Total sections: {len(sections)}')
for i, s in enumerate(sections):
    sec_id = re.search(r'id="([^"]+)"', s)
    h_tag = re.search(r'<h[1-3][^>]*>(.*?)</h[1-3]>', s, re.DOTALL)
    title = h_tag.group(0).replace('\n', ' ')[:80] if h_tag else "no header"
    print(f'Sec {i+1}: id={sec_id.group(1) if sec_id else "none"} | {title}')
