"""Create authorized runtime derivatives; never modify portrait masters."""
import hashlib
from pathlib import Path
import re
from PIL import Image

root = Path(__file__).resolve().parents[1]
source = Path("/Users/westmanfamily/.codex/.chatgpt-projects/g-p-6a8f58dab41c8191b08f73a8f47e4f44/companion-portraits/final")
catalog = (root / "src/phase23-companion-catalog.js").read_text()
entries = re.findall(r"\['([a-z]+)','[^']*','[^']*',\d+,'([a-f0-9]{64})'", catalog)
assert len(entries) == 20
for name, expected in entries:
    original = source / (name + ".png")
    assert hashlib.sha256(original.read_bytes()).hexdigest() == expected, name
    with Image.open(original) as image:
        assert image.size == (1024,1536), name
        destination = root / "assets/portraits/companions" / name
        destination.mkdir(parents=True, exist_ok=True)
        for filename, size in [("portrait.webp",(1024,1536)),("thumb.webp",(320,480))]:
            image.convert("RGB").resize(size, Image.Resampling.LANCZOS).save(destination / filename, "WEBP", quality=88, method=6)
            with Image.open(destination / filename) as check:
                assert check.size == size
    print("Verified and built", name)
