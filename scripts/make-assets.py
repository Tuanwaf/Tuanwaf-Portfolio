# Generates logo SVG, PWA icons and optimised photos from source assets.
import json
from PIL import Image, ImageDraw, ImageFilter
OLD = '../_old-portfolio'
pts = json.load(open('scripts/logo_poly.json'))[0]['pts']
xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
x0, y0, x1, y1 = min(xs), min(ys), max(xs), max(ys)
w, h = x1 - x0, y1 - y0
norm = [((x - x0) / w, (y - y0) / h) for x, y in pts]          # 0..1 box
json.dump({'aspect': w / h, 'pts': [[round(x, 4), round(y, 4)] for x, y in norm]}, open('src/logo-shape.json', 'w'))
d = 'M' + ' L'.join(f'{x - x0:.0f} {y - y0:.0f}' for x, y in pts) + 'Z'
open('public/icons/logo.svg', 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><path d="{d}" fill="currentColor"/></svg>')
open('src/logo-path.js', 'w').write(f'export const LOGO_VIEWBOX = "0 0 {w} {h}";\nexport const LOGO_PATH = "{d}";\n')

INK = (42, 34, 56)
STOPS = [(0, (205, 185, 255)), (0.5, (255, 205, 178)), (1, (189, 240, 213))]
def grad(size):
    im = Image.new('RGB', (size, size))
    px = im.load()
    for yy in range(size):
        for xx in range(size):
            t = (xx + yy) / (2 * size - 2)
            for (ta, ca), (tb, cb) in zip(STOPS, STOPS[1:]):
                if ta <= t <= tb:
                    f = (t - ta) / (tb - ta)
                    px[xx, yy] = tuple(int(ca[i] + (cb[i] - ca[i]) * f) for i in range(3)); break
    return im
def icon(size, scale, rounded=False, bg=True):
    S = size * 4
    base = grad(S).convert('RGBA') if bg else Image.new('RGBA', (S, S), (0, 0, 0, 0))
    # soft glow blob
    glow = Image.new('RGBA', (S, S), (0, 0, 0, 0)); gd = ImageDraw.Draw(glow)
    gd.ellipse((S * .18, S * .12, S * .82, S * .76), fill=(255, 255, 255, 110)); glow = glow.filter(ImageFilter.GaussianBlur(S * .08))
    if bg: base.alpha_composite(glow)
    lw = S * scale; lh = lw / (w / h)
    ox = (S - lw) / 2; oy = (S - lh) / 2 + S * 0.01
    poly = [(ox + x * lw, oy + y * lh) for x, y in norm]
    sh = Image.new('RGBA', (S, S), (0, 0, 0, 0)); ImageDraw.Draw(sh).polygon([(x + S * .012, y + S * .02) for x, y in poly], fill=(42, 34, 56, 70))
    base.alpha_composite(sh.filter(ImageFilter.GaussianBlur(S * .012)))
    ImageDraw.Draw(base).polygon(poly, fill=INK + (255,))
    if rounded:
        m = Image.new('L', (S, S), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, S - 1, S - 1), radius=S * .22, fill=255)
        base.putalpha(m)
    return base.resize((size, size), Image.LANCZOS)
icon(512, .62).save('public/icons/icon-512.png')
icon(192, .62).save('public/icons/icon-192.png')
icon(512, .46).save('public/icons/icon-maskable-512.png')
icon(180, .58).convert('RGB').save('public/icons/apple-touch-icon.png')
icon(64, .74, rounded=True).save('public/icons/favicon-64.png')
icon(32, .78, rounded=True).save('public/favicon.ico', sizes=[(32, 32), (16, 16)])
icon(1200, .5).convert('RGB').resize((1200, 1200)).crop((0, 285, 1200, 915)).save('public/img/og.jpg', quality=88)

# photos
p = Image.open(f'{OLD}/img/tuanwaf-min.png').convert('RGBA')
bb = p.getbbox(); p = p.crop(bb); p.thumbnail((900, 1600), Image.LANCZOS); p.save('public/img/wafiq-cutout.webp', quality=86); print('cutout', p.size)
f = Image.open(f'{OLD}/kc_7.png').convert('RGB'); f.save('public/img/wafiq-formal.webp', quality=88); print('formal', f.size)
