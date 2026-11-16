import re

# 1. Update branches.html
with open('branches.html', 'r', encoding='utf-8') as f:
    b_html = f.read()

old_b_banner = '<div class="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs mb-8">'
new_b_banner = '''<div class="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs mb-8 relative overflow-hidden">
        <!-- Golden Dragon Watermark Highlight -->
        <div class="dragon-watermark-right opacity-30"></div>
        <div class="relative z-10">'''

if old_b_banner in b_html:
    # Need to close the relative z-10 div before the end of banner
    # Let's find where the banner ends
    banner_start = b_html.find(old_b_banner)
    # Find the closing </div> of this banner
    # It has the inner flex, etc. Let's inspect where it ends
    # Better yet, let's insert <div class="dragon-watermark-right opacity-30"></div> directly inside!
    simple_replacement = '''<div class="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs mb-8 relative overflow-hidden">
        <!-- Golden Dragon Watermark Highlight -->
        <div class="dragon-watermark-right opacity-30"></div>'''
    b_html = b_html.replace(old_b_banner, simple_replacement)
    with open('branches.html', 'w', encoding='utf-8') as f:
        f.write(b_html)
    print("Added dragon watermark to branches.html banner")

# 2. Update about.html and story.html timeline section
for fn in ['about.html', 'story.html']:
    with open(fn, 'r', encoding='utf-8') as f:
        html = f.read()
    
    old_timeline_sec = '<section class="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-zinc-200/80 bg-white">'
    new_timeline_sec = '''<section class="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-zinc-200/80 bg-white relative overflow-hidden">
      <!-- Golden Dragon Watermark Highlight -->
      <div class="dragon-watermark-left opacity-25"></div>'''
    
    # Check if this section is right before "THE 11-YEAR ODYSSEY"
    pos = html.find('THE 11-YEAR ODYSSEY')
    if pos != -1:
        sec_start = html.rfind('<section class="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-zinc-200/80 bg-white">', 0, pos)
        if sec_start != -1:
            html = html[:sec_start] + new_timeline_sec + html[sec_start + len(old_timeline_sec):]
            with open(fn, 'w', encoding='utf-8') as f:
                f.write(html)
            print(f"Added dragon watermark to timeline section in {fn}")

print("Completed additions.")
