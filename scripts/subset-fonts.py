"""Subset local webfonts to this portfolio's Latin text and punctuation.

The variable weight axes and essential text layout features are retained. Originals
remain in the Fontsource development dependencies; OFL licences are unchanged.
"""
from pathlib import Path
from fontTools import subset

ROOT = Path(__file__).resolve().parents[1]
SOURCES = {
    'inter-tight-latin-wght-normal.woff2': '@fontsource-variable/inter-tight',
    'jetbrains-mono-latin-wght-normal.woff2': '@fontsource-variable/jetbrains-mono',
    'instrument-serif-latin-400-normal.woff2': '@fontsource/instrument-serif',
    'instrument-serif-latin-400-italic.woff2': '@fontsource/instrument-serif',
}
content = (ROOT / 'src/lib/data.ts').read_text(encoding='utf-8')
content += ''.join(path.read_text(encoding='utf-8') for path in (ROOT / 'src/components').rglob('*.tsx'))
characters = set(range(0x20, 0x7F)) | {ord(char) for char in content + content.upper() if ord(char) > 127}

for filename, package in SOURCES.items():
    source = ROOT / 'node_modules' / package / 'files' / filename
    target = ROOT / 'src/fonts' / filename
    options = subset.Options()
    options.flavor = 'woff2'
    # The label font has no code blocks and does not need programming ligatures.
    options.layout_features = ['kern'] if filename.startswith('jetbrains') else ['kern', 'liga', 'clig', 'calt', 'locl']
    font = subset.load_font(str(source), options)
    sub = subset.Subsetter(options=options)
    sub.populate(unicodes=characters)
    sub.subset(font)
    subset.save_font(font, str(target), options)
    print(f'{filename}: {source.stat().st_size} -> {target.stat().st_size} bytes')
