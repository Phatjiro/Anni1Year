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
    print("Starting conversion from PNG to WebP...")
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
                        print(f"[CONVERTED & REMOVED] {folder_key}/{file.name}")
                    else:
                        print(f"[WARN] Failed to create {webp_path.name}")
                except Exception as e:
                    print(f"[ERR] Error processing {file.name}: {e}")
                    
    print(f"\nDone converting: {converted_count} files converted to WebP, {deleted_count} PNG files deleted.")
    
    records = []
    for i in range(1, 13):
        folder_key = f"thang-{i:02d}"
        folder_path = IMAGES_DIR / folder_key
        month_label = MONTH_NAMES[folder_key]
        
        files = [f for f in sorted(folder_path.iterdir()) if f.is_file() and f.suffix.lower() in ('.webp', '.jpg', '.jpeg', '.png')]
                
        for f in files:
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
        
    print(f"[SUCCESS] Updated {OUTPUT_JS} with {len(records)} photos across 12 months.")

if __name__ == "__main__":
    main()
