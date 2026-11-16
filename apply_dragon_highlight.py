import re

# 1. Update styles.css
with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Replace dragon watermark styles
old_dragon_css = """.dragon-watermark-right {
  position: absolute;
  top: 0;
  right: -30px;
  width: 580px;
  height: 580px;
  max-width: 55vw;
  max-height: 55vw;
  background-image: url('assets/images/golden-dragon-watermark.png');
  background-repeat: no-repeat;
  background-position: top right;
  background-size: contain;
  opacity: 0.09;
  pointer-events: none;
  z-index: 0;
}

.dragon-watermark-left {
  position: absolute;
  top: 5%;
  left: -50px;
  width: 520px;
  height: 520px;
  max-width: 45vw;
  max-height: 45vw;
  background-image: url('assets/images/golden-dragon-watermark.png');
  background-repeat: no-repeat;
  background-position: top left;
  background-size: contain;
  transform: scaleX(-1);
  opacity: 0.08;
  pointer-events: none;
  z-index: 0;
}

.dragon-watermark-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 650px;
  height: 650px;
  max-width: 65vw;
  max-height: 65vw;
  background-image: url('assets/images/golden-dragon-watermark.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  opacity: 0.07;
  pointer-events: none;
  z-index: 0;
}"""

new_dragon_css = """/* Golden Dragon Highlight Watermarks - High Visibility Imperial Gold */
.dragon-watermark-right {
  position: absolute;
  top: 0;
  right: -20px;
  width: 620px;
  height: 620px;
  max-width: 60vw;
  max-height: 60vw;
  background-image: url('assets/images/golden-dragon-watermark.png');
  background-repeat: no-repeat;
  background-position: top right;
  background-size: contain;
  opacity: 0.30;
  filter: drop-shadow(0 0 25px rgba(197, 160, 89, 0.5)) contrast(1.18) brightness(1.08);
  pointer-events: none;
  z-index: 0;
  transition: opacity 0.3s ease, filter 0.3s ease;
}

.dragon-watermark-left {
  position: absolute;
  top: 5%;
  left: -30px;
  width: 560px;
  height: 560px;
  max-width: 50vw;
  max-height: 50vw;
  background-image: url('assets/images/golden-dragon-watermark.png');
  background-repeat: no-repeat;
  background-position: top left;
  background-size: contain;
  transform: scaleX(-1);
  opacity: 0.28;
  filter: drop-shadow(0 0 25px rgba(197, 160, 89, 0.5)) contrast(1.18) brightness(1.08);
  pointer-events: none;
  z-index: 0;
  transition: opacity 0.3s ease, filter 0.3s ease;
}

.dragon-watermark-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 720px;
  height: 720px;
  max-width: 75vw;
  max-height: 75vw;
  background-image: url('assets/images/golden-dragon-watermark.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  opacity: 0.32;
  filter: drop-shadow(0 0 30px rgba(197, 160, 89, 0.55)) contrast(1.2) brightness(1.1);
  pointer-events: none;
  z-index: 0;
  transition: opacity 0.3s ease, filter 0.3s ease;
}"""

if old_dragon_css in css:
    css = css.replace(old_dragon_css, new_dragon_css)
    print("Replaced dragon watermark CSS in styles.css")
else:
    # Use regex replacement if whitespace differed
    pattern = r'\.dragon-watermark-right\s*\{.*?\.dragon-watermark-center\s*\{.*?\n\}'
    css = re.sub(pattern, new_dragon_css, css, flags=re.DOTALL)
    print("Regex replaced dragon watermark CSS in styles.css")

with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(css)

# 2. Update about.html and story.html
for fn in ['about.html', 'story.html']:
    with open(fn, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Update hero watermark opacity and styling
    old_hero_dragon = '<div class="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.06] z-0">\n        <img src="assets/images/golden-dragon-watermark.png" alt="Imperial Dragon" class="w-[620px] max-w-full object-contain filter drop-shadow">\n      </div>'
    new_hero_dragon = '<div class="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.35] z-0">\n        <img src="assets/images/golden-dragon-watermark.png" alt="Imperial Dragon" class="w-[720px] max-w-full object-contain filter drop-shadow-[0_0_30px_rgba(197,160,89,0.55)] brightness-105 contrast-115 animate-pulse-subtle">\n      </div>'
    
    if old_hero_dragon in html:
        html = html.replace(old_hero_dragon, new_hero_dragon)
        print(f"Updated hero dragon watermark in {fn}")
    else:
        # regex match
        html = re.sub(
            r'<div class="absolute inset-0 pointer-events-none flex items-center justify-center opacity-\[[^\]]+\] z-0">\s*<img src="assets/images/golden-dragon-watermark\.png"[^>]*>\s*</div>',
            new_hero_dragon,
            html
        )
        print(f"Regex updated hero dragon watermark in {fn}")
        
    # Also add golden dragon watermark to #the-box section if not present
    if 'id="the-box"' in html and 'dragon-watermark-right' not in html[html.find('id="the-box"'):html.find('id="the-box"')+500]:
        html = html.replace(
            'id="the-box" class="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-zinc-200/80 bg-stone-50/70 scroll-mt-20">',
            'id="the-box" class="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-zinc-200/80 bg-stone-50/70 scroll-mt-20 overflow-hidden">\n      <!-- Golden Dragon Watermark Highlight in The Box -->\n      <div class="dragon-watermark-right opacity-30"></div>'
        )
        print(f"Added dragon watermark to #the-box in {fn}")

    with open(fn, 'w', encoding='utf-8') as f:
        f.write(html)

# 3. Update branches.html to add dragon watermark in top banner
with open('branches.html', 'r', encoding='utf-8') as f:
    b_html = f.read()

banner_target = '<div class="bg-gradient-to-r from-stone-900 via-zinc-900 to-stone-900 rounded-3xl p-6 sm:p-8 md:p-10 mb-8 sm:mb-10 text-white relative overflow-hidden shadow-xl border border-zinc-800">'
banner_replacement = '<div class="bg-gradient-to-r from-stone-900 via-zinc-900 to-stone-900 rounded-3xl p-6 sm:p-8 md:p-10 mb-8 sm:mb-10 text-white relative overflow-hidden shadow-xl border border-zinc-800">\n      <!-- Golden Dragon Watermark Highlight -->\n      <div class="absolute -top-10 -right-10 w-96 h-96 opacity-35 pointer-events-none bg-[url(\'assets/images/golden-dragon-watermark.png\')] bg-contain bg-no-repeat bg-right-top filter drop-shadow-[0_0_25px_rgba(197,160,89,0.5)]"></div>'

if banner_target in b_html and 'golden-dragon-watermark.png' not in b_html:
    b_html = b_html.replace(banner_target, banner_replacement)
    with open('branches.html', 'w', encoding='utf-8') as f:
        f.write(b_html)
    print("Added highlighted dragon watermark to branches.html banner")

print("All dragon watermark updates applied.")
