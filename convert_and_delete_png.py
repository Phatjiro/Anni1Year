import os
import sys
from pathlib import Path
from PIL import Image

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = Path(__file__).resolve().parent
IMAGES_DIR = BASE_DIR / "assets" / "images"
OUTPUT_JS = BASE_DIR / "js" / "matrixPhotos.js"

MONTH_NAMES = {
    f"thang-{i:02d}": f"Tháng {i:02d}" for i in range(1, 13)
}

def main():
    print("Starting conversion and auto-numbering...")
    converted_count = 0
    deleted_count = 0
    
    for i in range(1, 13):
        folder_key = f"thang-{i:02d}"
        folder_path = IMAGES_DIR / folder_key
        if not folder_path.exists():
            folder_path.mkdir(parents=True, exist_ok=True)
            
        for file in list(folder_path.iterdir()):
            if file.is_file() and file.suffix.lower() == '.png':
                webp_path = file.with_suffix('.webp')
                try:
                    with Image.open(file) as im:
                        im.save(webp_path, 'WEBP', quality=92, method=6)
                    
                    if webp_path.exists() and webp_path.stat().st_size > 0:
                        converted_count += 1
                        os.remove(file)
                        deleted_count += 1
                except Exception as e:
                    print(f"[ERR] Error processing {file.name}: {e}")
                    
    records = []
    total_renamed = 0

    for i in range(1, 13):
        folder_key = f"thang-{i:02d}"
        folder_path = IMAGES_DIR / folder_key
        if not folder_path.exists():
            continue

        files = [f for f in folder_path.iterdir() if f.is_file() and f.suffix.lower() in ('.webp', '.png', '.jpg', '.jpeg')]
        if not files:
            continue

        files.sort(key=lambda x: x.name)

        temp_files = []
        for idx, f in enumerate(files, 1):
            temp_name = folder_path / f"__temp_{idx}{f.suffix.lower()}"
            f.rename(temp_name)
            temp_files.append((temp_name, f.suffix.lower()))

        final_files = []
        for idx, (temp_file, ext) in enumerate(temp_files, 1):
            target_name = folder_path / f"{idx}{ext}"
            temp_file.rename(target_name)
            final_files.append(target_name)
            total_renamed += 1

        month_label = MONTH_NAMES[folder_key]
        for f in final_files:
            rel_path = f"assets/images/{folder_key}/{f.name}".replace("\\", "/")
            records.append({
                "month": month_label,
                "image": rel_path,
                "title": f"Kỷ niệm {month_label}"
            })

    lines = ["export const matrixPhotos = ["]
    for r in records:
        lines.append(f'  {{ month: "{r["month"]}", image: "{r["image"]}", title: "{r["title"]}" }},')
    lines.append("];")
    lines.append("")

    with open(OUTPUT_JS, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"Done! {converted_count} files converted, {deleted_count} PNGs deleted, {total_renamed} files cleanly numbered.")
    print(f"Updated {OUTPUT_JS} with {len(records)} photos.")

if __name__ == "__main__":
    main()
