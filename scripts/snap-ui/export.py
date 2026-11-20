"""Export Texture2D, Sprite and Font objects from Addressables bundles.
usage: python -I export.py <bundle-dir> <out-dir> [skip-regex]"""
import sys, os, re, UnityPy
UnityPy.config.FALLBACK_UNITY_VERSION = "6000.0.58f2"
root, out = sys.argv[1], sys.argv[2]  # see scripts/snap-ui/README.md
skip = re.compile(sys.argv[3]) if len(sys.argv) > 3 else None
n = err = 0
safe = lambda s: re.sub(r'[^A-Za-z0-9._ -]+', '_', s)[:100]
for dirpath, _, files in os.walk(root):
    for f in files:
        if not f.endswith('.bundle') or (skip and skip.search(f)): continue
        short = f.split('_assets_')[0].replace('bundledinapp-', '').replace('duplicateassetisolation-local', 'dup') + '_' + f.split('_')[-1][:6]
        try: env = UnityPy.load(os.path.join(dirpath, f))
        except Exception as e: print('LOAD', f, e); continue
        for obj in env.objects:
            t = obj.type.name
            if t not in ('Texture2D', 'Sprite', 'Font'): continue
            try:
                d = obj.read(); name = safe(d.m_Name or str(obj.path_id))
                sub = os.path.join(out, short, 'sprites' if t == 'Sprite' else 'fonts' if t == 'Font' else 'textures')
                os.makedirs(sub, exist_ok=True)
                if t == 'Font':
                    data = bytes(d.m_FontData) if d.m_FontData else b''
                    if data:
                        ext = '.otf' if data[:4] == b'OTTO' else '.ttf'
                        open(os.path.join(sub, name + ext), 'wb').write(data); n += 1
                    continue
                if t == 'Texture2D' and (d.m_Width == 0 or d.m_Height == 0): continue
                img = d.image
                p = os.path.join(sub, name + '.png'); k = 1
                while os.path.exists(p): k += 1; p = os.path.join(sub, f'{name}~{k}.png')
                img.save(p); n += 1
            except Exception as e:
                err += 1
                if err < 15: print('ERR', f[:50], t, getattr(d, 'm_Name', '?') if 'd' in dir() else '?', str(e)[:80])
print('exported', n, 'errors', err)
