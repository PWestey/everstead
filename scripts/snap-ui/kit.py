"""Build Everstead's Snap UI kit from the exported APK textures.
usage: python -I prep.py <export-dir> <kit-dir>"""
import sys, os, glob, shutil
from PIL import Image
ex, kit = sys.argv[1], sys.argv[2]
os.makedirs(os.path.join(kit, 'fonts'), exist_ok=True)

def find(name, sub='textures'):
    hits = glob.glob(os.path.join(ex, '*', sub, name + '.png'))
    if not hits: hits = glob.glob(os.path.join(ex, '*', 'textures' if sub == 'sprites' else 'sprites', name + '.png'))
    if not hits: raise SystemExit('missing ' + name)
    return Image.open(hits[0]).convert('RGBA')

def trim(im, pad=0):
    bb = im.getchannel('A').point(lambda a: 255 if a > 8 else 0).getbbox()
    if not bb: return im
    l, t, r, b = bb
    return im.crop((max(0, l - pad), max(0, t - pad), min(im.width, r + pad), min(im.height, b + pad)))

from PIL import ImageChops
def unblack(im):
    """Textures drawn on opaque black: the brightest channel becomes the alpha."""
    r, g, b, _ = im.split(); a = ImageChops.lighter(ImageChops.lighter(r, g), b)
    return Image.merge('RGBA', (r, g, b, a))
def split_rows(im):
    """Row of least alpha between 30% and 70% of the height: where two stacked plates meet."""
    a = im.getchannel('A'); w, h = im.size; best = (1e18, h // 2)
    for y in range(int(h * .3), int(h * .7)):
        s = sum(a.crop((0, y, w, y + 1)).getdata())
        if s < best[0]: best = (s, y)
    return best[1]
def noblack(im):
    """Opaque pure-black fill outside a plate (the game masks it off): make it transparent."""
    r, g, b, a = im.split(); lum = ImageChops.lighter(ImageChops.lighter(r, g), b)
    keep = lum.point(lambda v: 255 if v > 10 else 0)
    return Image.merge('RGBA', (r, g, b, ImageChops.darker(a, keep)))
def nored(im):
    """The purple plate's crop catches the red plate's lower corner: drop red-dominant pixels."""
    r, g, b, a = im.split()
    red = ImageChops.subtract(r, b.point(lambda v: min(255, int(v * 1.6)))).point(lambda v: 0 if v > 30 else 255)
    return Image.merge('RGBA', (r, g, b, ImageChops.darker(a, red)))
def save(im, name, maxw=None, fmt='webp', q=88):
    if maxw and im.width > maxw: im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
    p = os.path.join(kit, name + '.' + fmt)
    im.save(p, quality=q, method=6) if fmt == 'webp' else im.save(p, optimize=True)
    print(f'{name}.{fmt} {im.width}x{im.height} {os.path.getsize(p)//1024}K')

# backgrounds
save(find('StarsAtmosphere_Portrait'), 'space', 512)
save(find('Nebula01'), 'nebula', 512)
save(trim(find('CosmicBoardNew_Portrait_BakeComplete')), 'board', 768)
# table chrome
save(trim(unblack(find('LocationFrame_01'))), 'locframe', 256, 'png')
save(trim(find('TurnBanner_Tile', 'sprites')), 'banner', 512)
save(trim(find('WinLoseTie_Tile_0')), 'result', 512, 'png')
save(trim(unblack(find('Avatar_Frame'))), 'hexframe', 192, 'png')
save(trim(unblack(find('img_hex'))), 'hexred', 192, 'png')
save(trim(find('Avatar_Nameplates_MatchMaking_V2_Player', 'sprites')), 'plate-me', 384, 'png')
save(trim(find('Avatar_Nameplates_MatchMaking_V2_Opponent', 'sprites')), 'plate-opp', 384, 'png')
save(trim(find('icn_Cube')), 'cube', 128, 'png')
save(trim(find('ModEntry_Energy')), 'energy', 160, 'png')
save(trim(find('ModEntry_Power')), 'power', 160, 'png')
save(trim(unblack(find('VS_Circle'))), 'vs-circle', 256, 'png')
save(trim(unblack(find('VS_Flare01'))), 'vs-flare', 256, 'png')
save(trim(find('icn_objective', 'sprites')), 'objective', 64, 'png')
save(trim(find('img_info_button_blue')), 'info', 96, 'png')
# the bottom buttons: the texture stacks the red plate above the purple one
bb = find('BottomButton_RetreatEndTurn')
h = split_rows(bb)
save(trim(noblack(bb.crop((0, 0, bb.width, h)))), 'btn-red', 512, 'png')
pur = bb.crop((0, h, bb.width, bb.height)); pur = pur.crop((0, int(pur.height * .27), pur.width, pur.height))
save(trim(nored(noblack(pur))), 'btn-purple', 512, 'png')
sr = find('BottomButton_ShowResults')
save(trim(noblack(sr.crop((0, 0, sr.width, split_rows(sr))))), 'btn-blue', 512, 'png')
save(trim(find('Navigator_Button_Play', 'sprites')), 'nav-play', 512, 'png')
save(trim(find('Navigator_Button_Collection', 'sprites')), 'nav-collect', 512, 'png')
# panels
save(trim(find('BlueBox_Tooltip_Base', 'sprites')), 'tooltip', 470, 'png')
save(trim(find('img_panel_NUE', 'sprites')), 'panel', 512, 'png')
save(trim(find('img_hexpanel')), 'hexpanel', 256, 'png')
# fonts
for src, dst in [('Comicraft - CCUltimatum Bold Italic.otf', 'CCUltimatum-BoldItalic.otf'), ('HELVETICANEUELTSTD-MDCN.otf', 'HelveticaNeueLTStd-MdCn.otf')]:
    hits = glob.glob(os.path.join(ex, '*', 'fonts', src))
    if not hits: raise SystemExit('missing font ' + src)
    shutil.copy(hits[0], os.path.join(kit, 'fonts', dst)); print('font', dst)
