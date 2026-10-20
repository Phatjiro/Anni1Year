import os
import sys
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

BASE_DIR = Path(__file__).resolve().parent
IMAGES_DIR = BASE_DIR / "assets" / "images"
OUTPUT_JS = BASE_DIR / "js" / "matrixPhotos.js"

MONTH_NAMES = {
    "thang-01": "Tháng 01",
    "thang-02": "Tháng 02",
    "thang-03": "Tháng 03",
    "thang-04": "Tháng 04",
    "thang-05": "Tháng 05",
    "thang-06": "Tháng 06",
    "thang-07": "Tháng 07",
    "thang-08": "Tháng 08",
    "thang-09": "Tháng 09",
    "thang-10": "Tháng 10",
    "thang-11": "Tháng 11",
    "thang-12": "Tháng 12"
}

def convert_to_webp(image_path: Path):
    if not HAS_PIL:
        return image_path
    
    webp_path = image_path.with_suffix(".webp")
    try:
        with Image.open(image_path) as im:
            rgb_im = im.convert("RGB") if im.mode in ("RGBA", "P") and im.format != "PNG" else im
            rgb_im.save(webp_path, "WEBP", quality=92, method=6)
        try:
            print(f"[OK] Converted: {image_path.name} -> {webp_path.name}")
        except Exception:
            print("[OK] Converted a photo to WebP")
        return webp_path
    except Exception as e:
        try:
            print(f"[ERR] Error converting {image_path.name}: {e}")
        except Exception:
            print(f"[ERR] Error converting photo")
        return image_path

def process_all_photos(convert_png=True):
    records = []
    
    for i in range(1, 13):
        folder_key = f"thang-{i:02d}"
        folder_path = IMAGES_DIR / folder_key
        if not folder_path.exists():
            folder_path.mkdir(parents=True, exist_ok=True)
            
        month_label = MONTH_NAMES.get(folder_key, f"Tháng {i:02d}")
        
        all_files = sorted(os.listdir(folder_path))
        
        webp_files = set()
        png_jpg_files = []
        
        for fname in all_files:
            lower = fname.lower()
            if lower.endswith(".webp"):
                webp_files.add(fname)
            elif lower.endswith((".png", ".jpg", ".jpeg")):
                png_jpg_files.append(fname)
                
        if convert_png and HAS_PIL:
            for fname in png_jpg_files:
                stem = Path(fname).stem
                expected_webp = f"{stem}.webp"
                converted_path = convert_to_webp(file_path)
                if converted_path.exists() and converted_path.stat().st_size > 0 and converted_path != file_path:
                    try:
                        os.remove(file_path)
                    except Exception:
                        pass
                webp_files.add(converted_path.name)
        
        final_files = []
        for fname in sorted(os.listdir(folder_path)):
            lower = fname.lower()
            if lower.endswith(".webp"):
                final_files.append(fname)
            elif lower.endswith((".png", ".jpg", ".jpeg")):
                stem = Path(fname).stem
                if f"{stem}.webp" not in webp_files:
                    final_files.append(fname)
                    
        for fname in final_files:
            rel_path = f"assets/images/{folder_key}/{fname}".replace("\\", "/")
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
        
    print(f"\n[DONE] Successfully synced {len(records)} photos into {OUTPUT_JS}")

if __name__ == "__main__":
    should_convert = "--no-convert" not in sys.argv
    process_all_photos(convert_png=should_convert)
