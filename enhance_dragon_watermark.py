import os
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

# 1. Load original
orig_path = r"assets/images/golden-dragon-watermark.png"
backup_path = r"assets/images/golden-dragon-watermark.orig.png"

if not os.path.exists(backup_path):
    import shutil
    shutil.copy2(orig_path, backup_path)
    print("Backed up original dragon watermark.")

img = Image.open(backup_path).convert("RGBA")
arr = np.array(img, dtype=np.float32)

# arr[:, :, 0] is R, arr[:, :, 1] is G, arr[:, :, 2] is B, arr[:, :, 3] is A
r = arr[:, :, 0]
g = arr[:, :, 1]
b = arr[:, :, 2]
a = arr[:, :, 3]

# Identify where the dragon exists
mask = a > 5.0

# Calculate luminance of the dragon strokes
lum = 0.299 * r + 0.587 * g + 0.114 * b

# Enhance contrast and golden highlights
# We want highlights to be rich, luminous 24K gold:
# Pure highlights: R ~ 255, G ~ 215, B ~ 80 (rich imperial gold)
# Midtones: R ~ 210, G ~ 160, B ~ 45
# Deep strokes: R ~ 160, G ~ 100, B ~ 20 (rich amber outline)

# Normalize luminance to 0..1 where dragon exists
lum_norm = np.zeros_like(lum)
if np.any(mask):
    min_l = np.percentile(lum[mask], 5)
    max_l = np.percentile(lum[mask], 98)
    lum_norm[mask] = np.clip((lum[mask] - min_l) / (max_l - min_l + 1e-5), 0.0, 1.0)

# Create rich metallic gold mapping
# Highlight: (255, 225, 95)
# Mid: (218, 165, 32)
# Low: (150, 95, 20)
target_r = 150.0 + 68.0 * lum_norm + 37.0 * (lum_norm ** 2)
target_g = 95.0 + 70.0 * lum_norm + 60.0 * (lum_norm ** 2)
target_b = 20.0 + 25.0 * lum_norm + 50.0 * (lum_norm ** 2)

new_r = np.where(mask, np.clip(target_r, 0, 255), r)
new_g = np.where(mask, np.clip(target_g, 0, 255), g)
new_b = np.where(mask, np.clip(target_b, 0, 255), b)

# Boost alpha curve so faint strokes become crisp and visible
new_a = np.zeros_like(a)
# Non-linear boost to lift faint highlights
new_a[mask] = np.clip(a[mask] * 1.5 + 40.0 * lum_norm[mask], 0, 255)

new_arr = np.stack([new_r, new_g, new_b, new_a], axis=-1).astype(np.uint8)
enhanced_img = Image.fromarray(new_arr, mode="RGBA")

# Optional: slight sharpening to make scales and whiskers crisp
enhancer = ImageEnhance.Sharpness(enhanced_img)
crisp_img = enhancer.enhance(1.4)

crisp_img.save("assets/images/golden-dragon-watermark.png", "PNG", optimize=True)
print("Saved enhanced golden dragon watermark to assets/images/golden-dragon-watermark.png")

# Now create a preview against pure white with 25% opacity
preview_white = Image.new("RGBA", crisp_img.size, (255, 255, 255, 255))
# Blend at 25% opacity
dragon_blend = crisp_img.copy()
d_arr = np.array(dragon_blend)
d_arr[:, :, 3] = (d_arr[:, :, 3].astype(np.float32) * 0.35).astype(np.uint8)
dragon_blend_35 = Image.fromarray(d_arr, mode="RGBA")
preview_white.alpha_composite(dragon_blend_35)
preview_white.convert("RGB").save("assets/images/dragon_preview_white_35.jpg", "JPEG", quality=90)
print("Saved preview to assets/images/dragon_preview_white_35.jpg")
