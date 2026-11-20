import os
import glob
from PIL import Image

ARTIFACT_DIR = r"C:\Users\Thillai valavan\.gemini\antigravity\brain\ae0227a5-b42c-43a4-985f-51617baa2df8"
ASSETS_DIR = r"d:\Antigravity\redbox\assets\images"

ANIMALS = {
    "phoenix_watermark": "phoenix-watermark.png",
    "tiger_watermark": "tiger-watermark.png",
    "crane_watermark": "crane-watermark.png",
    "qilin_watermark": "qilin-watermark.png"
}

def make_transparent(im):
    """Convert white or off-white background to transparent RGBA."""
    im = im.convert("RGBA")
    datas = im.getdata()
    new_data = []
    for item in datas:
        # If pixel is close to pure white (background)
        r, g, b, a = item
        # Calculate brightness
        brightness = (r + g + b) / 3.0
        if r > 240 and g > 240 and b > 240:
            # Fully transparent
            new_data.append((r, g, b, 0))
        elif r > 220 and g > 220 and b > 220:
            # Feathered edge transparency
            alpha = int(255 * (255 - brightness) / 35.0)
            new_data.append((r, g, b, max(0, min(255, alpha))))
        else:
            new_data.append(item)
    im.putdata(new_data)
    return im

def process_all():
    for prefix, out_name in ANIMALS.items():
        pattern = os.path.join(ARTIFACT_DIR, f"{prefix}*.*")
        matches = glob.glob(pattern)
        if matches:
            latest = max(matches, key=os.path.getmtime)
            print(f"Processing {latest} -> {out_name}...")
            im = Image.open(latest)
            transparent_im = make_transparent(im)
            out_path = os.path.join(ASSETS_DIR, out_name)
            transparent_im.save(out_path, "PNG", optimize=True)
            print(f"  Saved: {out_path} ({transparent_im.size})")

if __name__ == "__main__":
    process_all()
