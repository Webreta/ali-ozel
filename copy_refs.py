import os, shutil, unicodedata

def fold(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
    return s

# anahtar kelime -> (slug, marka adi)
rules = [
    ('baticim',  ('baticim', 'Batıçim')),
    ('batisoke', ('batisoke', 'Batısöke')),
    ('chemiola', ('chemiola', 'Chemiola')),
    ('grundfos', ('grundfos', 'Grundfos')),
    ('ode',      ('ode', 'ODE')),
    ('base',     ('trio-mobil', 'Trio Mobil')),
    ('kopyasi',  ('batigoz', 'Batıgöz')),
    ('medtronic',('medtronic', 'Medtronic')),
    ('mondi',    ('mondi', 'Mondi')),
    ('telcoset', ('telcoset', 'Telcoset')),
    ('univera',  ('univera', 'Univera')),
    ('vestel',   ('vestel', 'Vestel')),
    ('yasar',    ('yasar-universitesi', 'Yaşar Üniversitesi')),
    ('bd',       ('bd', 'BD')),  # en sona; kisa anahtar
]

src_dir = 'referanslar'
out_dir = os.path.join('public', 'referanslar')
os.makedirs(out_dir, exist_ok=True)

results = []
for fn in os.listdir(src_dir):
    if not fn.lower().endswith(('.png', '.webp', '.jpg', '.jpeg', '.svg')):
        continue
    f = fold(fn)
    ext = os.path.splitext(fn)[1].lower()
    matched = None
    for key, (slug, name) in rules:
        if key in f:
            matched = (slug, name, ext)
            break
    if not matched:
        print('UNMATCHED:', fn)
        continue
    slug, name, ext = matched
    dst = os.path.join(out_dir, slug + ext)
    shutil.copy(os.path.join(src_dir, fn), dst)
    results.append((slug + ext, name))

for r in sorted(results):
    print(r)
print('total', len(results))
