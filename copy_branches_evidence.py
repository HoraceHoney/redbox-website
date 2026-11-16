import os, shutil

src_dir = r"C:\Users\Thillai valavan\.gemini\antigravity\brain\d23b957d-0062-47e4-853f-ecdfc2f41dc5\browser_sandbox\screenshots"
dst_dir = r"C:\Users\Thillai valavan\.gemini\antigravity\brain\fbb98f9c-eb68-4a69-b475-7a04cccd5722\branches_evidence"

os.makedirs(dst_dir, exist_ok=True)

files_to_copy = [
    ("step_142_shot_1_step_101_branches_initial.png", "step_101_branches_initial.png"),
    ("step_142_shot_2_step_102_branches_filtered_chennai.png", "step_102_branches_filtered_chennai.png"),
    ("step_159_shot_1_step_103_branch_modal.png", "step_103_branch_modal.png"),
    ("step_161_shot_1_step_104_menu_branch_header.png", "step_104_menu_branch_header.png"),
    ("step_169_shot_1_step_105_menu_catering_bottom.png", "step_105_menu_catering_bottom.png")
]

for src_name, dst_name in files_to_copy:
    src_path = os.path.join(src_dir, src_name)
    dst_path = os.path.join(dst_dir, dst_name)
    if os.path.exists(src_path):
        shutil.copy2(src_path, dst_path)
        print(f"Copied {src_name} -> {dst_name} ({os.path.getsize(dst_path)} bytes)")
    else:
        print(f"NOT FOUND: {src_path}")
