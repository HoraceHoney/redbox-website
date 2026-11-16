import os, shutil

src_dir = r"C:\Users\Thillai valavan\.gemini\antigravity\brain\d23b957d-0062-47e4-853f-ecdfc2f41dc5\browser_sandbox\screenshots"
dst_dir = r"C:\Users\Thillai valavan\.gemini\antigravity\brain\fbb98f9c-eb68-4a69-b475-7a04cccd5722\slider_evidence"

os.makedirs(dst_dir, exist_ok=True)

files_to_copy = [
    ("step_209_shot_1_step_301_index_slider_clean.png", "step_301_index_slider_clean.png"),
    ("step_209_shot_2_step_302_index_slider_scrolled.png", "step_302_index_slider_scrolled.png"),
    ("step_222_shot_1_step_303_admin_slider_manager.png", "step_303_admin_slider_manager.png"),
    ("step_222_shot_2_step_304_admin_slide_modal.png", "step_304_admin_slide_modal.png")
]

for src_name, dst_name in files_to_copy:
    src_path = os.path.join(src_dir, src_name)
    dst_path = os.path.join(dst_dir, dst_name)
    if os.path.exists(src_path):
        shutil.copy2(src_path, dst_path)
        print(f"Copied {src_name} -> {dst_name} ({os.path.getsize(dst_path)} bytes)")
    else:
        print(f"NOT FOUND: {src_path}")
