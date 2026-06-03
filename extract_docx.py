import os, sys, zipfile, re, json, xml.etree.ElementTree as ET

WNS = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'

def docx_to_text(path):
    try:
        with zipfile.ZipFile(path) as z:
            xml = z.read('word/document.xml')
    except Exception as e:
        return f"[ERR {e}]"
    root = ET.fromstring(xml)
    lines = []
    for p in root.iter(WNS + 'p'):
        texts = [t.text or '' for t in p.iter(WNS + 't')]
        line = ''.join(texts).strip()
        if line:
            lines.append(line)
    return '\n'.join(lines)

TR = str.maketrans('çğıöşüÇĞİÖŞÜ', 'cgiosuCGIOSU')
def slug(s):
    s = s.translate(TR)
    s = re.sub(r'[^A-Za-z0-9]+', '_', s).strip('_').lower()
    return s

root_dir = sys.argv[1]
out_dir = sys.argv[2]
os.makedirs(out_dir, exist_ok=True)
index = []
for dirpath, _, files in os.walk(root_dir):
    for f in sorted(files):
        if f.lower().endswith('.docx'):
            full = os.path.join(dirpath, f)
            # category = top folder under root_dir
            rel = os.path.relpath(full, root_dir)
            parts = rel.split(os.sep)
            cat = parts[0]
            cat = re.sub(r'-\d{8}T.*$', '', cat)  # strip google takeout suffix
            name = os.path.splitext(f)[0]
            outname = slug(cat) + '__' + slug(name) + '.txt'
            txt = docx_to_text(full)
            with open(os.path.join(out_dir, outname), 'w', encoding='utf-8') as fh:
                fh.write(txt)
            index.append({'category': cat, 'file': f, 'out': outname, 'chars': len(txt)})

with open(os.path.join(out_dir, '_index.json'), 'w', encoding='utf-8') as fh:
    json.dump(index, fh, ensure_ascii=False, indent=2)
print(f"{len(index)} files extracted")
