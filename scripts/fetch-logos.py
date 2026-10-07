"""Development-only vendoring of official Devicon assets. No runtime network requests."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import urllib.request
ROOT = Path(__file__).resolve().parents[1] / 'public' / 'logos'
ICONS = ['java', 'c', 'python', 'dart', 'javascript', 'html5', 'css3', 'react', 'flutter', 'nextjs', 'firebase', 'fastapi', 'nodejs', 'supabase', 'cloudflare', 'postgresql', 'vscode', 'git', 'githubactions', 'canva', 'opencv', 'scikitlearn', 'plotly', 'streamlit']
BASE = 'https://raw.githubusercontent.com/devicons/devicon/v2.17.0/'
def fetch(name):
    url = BASE + f'icons/{name}/{name}-original.svg'
    try:
        ROOT.joinpath(name + '.svg').write_bytes(urllib.request.urlopen(url, timeout=30).read())
        return name
    except Exception as err:
        return f'{name}: {err}'
if __name__ == '__main__':
    ROOT.mkdir(parents=True, exist_ok=True)
    print('\n'.join(ThreadPoolExecutor(8).map(fetch, ICONS)))
    ROOT.joinpath('DEVICON-LICENSE.txt').write_bytes(urllib.request.urlopen(BASE+'LICENSE').read())
