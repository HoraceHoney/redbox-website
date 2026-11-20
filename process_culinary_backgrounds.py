import os
import glob
from PIL import Image

ARTIFACT_DIR = r"C:\Users\Thillai valavan\.gemini\antigravity\brain\ae0227a5-b42c-43a4-985f-51617baa2df8"
ASSETS_DIR = r"d:\Antigravity\redbox\assets\images"

# Mapping prefix or pattern in artifact dir to destination filename
IMAGE_MAP = {
    "bg_wok_fire_hero": "bg-wok-fire-hero.jpg",
    "bg_asian_spices": "bg-asian-spices.jpg",
    "bg_dimsum_steam": "bg-dimsum-steam.jpg",
    "bg_wok_stirfry": "bg-wok-stirfry.jpg"
}

def copy_and_process():
    found_any = False
    for prefix, target_name in IMAGE_MAP.items():
        pattern = os.path.join(ARTIFACT_DIR, f"{prefix}*.*")
        matches = glob.glob(pattern)
        if matches:
            latest = max(matches, key=os.path.getmtime)
            dest = os.path.join(ASSETS_DIR, target_name)
            
            # Read and copy
            im = Image.open(latest)
            im.convert("RGB").save(dest, "JPEG", quality=92, optimize=True)
            print(f"Copied {latest} -> {dest} ({im.size})")
            found_any = True
            
            # Generate responsive variants
            w, h = im.size
            aspect = h / w
            
            base_name = os.path.splitext(target_name)[0]
            
            # 1. Desktop (1920px max width)
            w_d = min(1920, w)
            h_d = int(w_d * aspect)
            d_im = im.resize((w_d, h_d), Image.Resampling.LANCZOS)
            d_im.save(os.path.join(ASSETS_DIR, f"{base_name}-desktop.jpg"), "JPEG", quality=88, optimize=True)
            d_im.save(os.path.join(ASSETS_DIR, f"{base_name}-desktop.webp"), "WEBP", quality=85)
            
            # 2. Tablet (1200px max width)
            w_t = min(1200, w)
            h_t = int(w_t * aspect)
            t_im = im.resize((w_t, h_t), Image.Resampling.LANCZOS)
            t_im.save(os.path.join(ASSETS_DIR, f"{base_name}-tablet.jpg"), "JPEG", quality=85, optimize=True)
            t_im.save(os.path.join(ASSETS_DIR, f"{base_name}-tablet.webp"), "WEBP", quality=82)

            # 3. Mobile (768px max width)
            w_m = min(768, w)
            h_m = int(w_m * aspect)
            m_im = im.resize((w_m, h_m), Image.Resampling.LANCZOS)
            m_im.save(os.path.join(ASSETS_DIR, f"{base_name}-mobile.jpg"), "JPEG", quality=82, optimize=True)
            m_im.save(os.path.join(ASSETS_DIR, f"{base_name}-mobile.webp"), "WEBP", quality=80)
            
            print(f"  Generated responsive variants for {base_name}: desktop ({w_d}x{h_d}), tablet ({w_t}x{h_t}), mobile ({w_m}x{h_m})")

    # Generate Chinese lattice pattern SVGs
    create_chinese_patterns()

def create_chinese_patterns():
    # 1. Subtle light gold lattice
    light_svg = '''<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">
  <path d="M0 0h60v60H0z" fill="none"/>
  <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="#C5A059" stroke-width="1" stroke-opacity="0.12"/>
  <path d="M30 10 L50 30 L30 50 L10 30 Z" fill="none" stroke="#C5A059" stroke-width="0.8" stroke-opacity="0.10"/>
  <rect x="25" y="25" width="10" height="10" fill="none" stroke="#D9232D" stroke-width="0.75" stroke-opacity="0.08"/>
  <line x1="0" y1="0" x2="60" y2="60" stroke="#C5A059" stroke-width="0.5" stroke-opacity="0.06"/>
  <line x1="60" y1="0" x2="0" y2="60" stroke="#C5A059" stroke-width="0.5" stroke-opacity="0.06"/>
</svg>'''
    with open(os.path.join(ASSETS_DIR, "bg-chinese-lattice-light.svg"), "w", encoding="utf-8") as f:
        f.write(light_svg)

    # 2. Dark luxury crimson/gold lattice
    dark_svg = '''<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">
  <path d="M0 0h60v60H0z" fill="none"/>
  <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="#C5A059" stroke-width="1.2" stroke-opacity="0.16"/>
  <path d="M30 10 L50 30 L30 50 L10 30 Z" fill="none" stroke="#D9232D" stroke-width="1" stroke-opacity="0.15"/>
  <rect x="25" y="25" width="10" height="10" fill="none" stroke="#C5A059" stroke-width="0.8" stroke-opacity="0.12"/>
  <circle cx="30" cy="30" r="3" fill="#C5A059" fill-opacity="0.18"/>
  <line x1="0" y1="0" x2="60" y2="60" stroke="#C5A059" stroke-width="0.6" stroke-opacity="0.08"/>
  <line x1="60" y1="0" x2="0" y2="60" stroke="#C5A059" stroke-width="0.6" stroke-opacity="0.08"/>
</svg>'''
    with open(os.path.join(ASSETS_DIR, "bg-chinese-lattice-dark.svg"), "w", encoding="utf-8") as f:
        f.write(dark_svg)

    print("Created bg-chinese-lattice-light.svg and bg-chinese-lattice-dark.svg")

if __name__ == "__main__":
    copy_and_process()
