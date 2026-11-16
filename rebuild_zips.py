import zipfile
import os

base_dir = r"d:\Antigravity\redbox"
zip_targets = [
    r"d:\Antigravity\RedBox_Localhost_Application.zip",
    r"d:\Antigravity\redbox\RedBox_Localhost_Application.zip",
    r"C:\Users\Thillai valavan\.gemini\antigravity\brain\fbb98f9c-eb68-4a69-b475-7a04cccd5722\RedBox_Localhost_Application.zip",
    r"C:\Users\Thillai valavan\.gemini\antigravity\brain\ae0227a5-b42c-43a4-985f-51617baa2df8\RedBox_Localhost_Application.zip"
]

include_extensions = (
    '.html', '.js', '.json', '.css', '.png', '.jpg', '.jpeg',
    '.svg', '.webp', '.webm', '.mp4', '.bat', '.ps1', '.sh', '.py', '.md', '.txt'
)

exclude_prefixes = ('scratch_', '.')
exclude_files = {'RedBox_Localhost_Application.zip'}

files_to_pack = []
for root, dirs, files in os.walk(base_dir):
    dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ('node_modules', '__pycache__')]
    for file in files:
        if file in exclude_files or file.endswith('.zip') or file.endswith('.docx') or file.endswith('.tmp'):
            continue
        if any(file.startswith(p) for p in exclude_prefixes):
            continue
        if any(file.endswith(ext) for ext in include_extensions):
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, base_dir).replace('\\', '/')
            files_to_pack.append((full_path, rel_path))

files_to_pack.sort(key=lambda x: x[1])

print(f"Total files to pack: {len(files_to_pack)}")

for target_zip in zip_targets:
    os.makedirs(os.path.dirname(target_zip), exist_ok=True)
    with zipfile.ZipFile(target_zip, 'w', compression=zipfile.ZIP_DEFLATED) as zf:
        for full_path, arcname in files_to_pack:
            zf.write(full_path, arcname)
    size_mb = os.path.getsize(target_zip) / (1024 * 1024)
    print(f"Created {target_zip}: {size_mb:.2f} MB")

print("Zip update complete.")
