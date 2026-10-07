"""Build synced circular video/audio loops. Requires ffmpeg, ffprobe, numpy, Pillow.

python scripts/build-hero-assets.py --input path/to/intro.mp4
Optional --crop WIDTH:HEIGHT:X:Y overrides conservative foreground detection.
No video is stretched in time. Circular overlap removes the first 0.5 seconds;
the outgoing final 0.5 seconds blends with those same first 0.5 seconds.
"""
import argparse
import json
import re
from pathlib import Path
import subprocess
import tempfile
import wave

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]

def run(*args):
    subprocess.run([str(x) for x in args], check=True)

def frame(source, time, w=None):
    args = ['ffmpeg', '-v', 'error', '-ss', str(time), '-i', str(source)]
    if w:
        args += ['-vf', f'scale={w}:-1']
    return subprocess.check_output(args + ['-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'ppm', '-'])

def main():
    import io
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input', required=True, type=Path)
    parser.add_argument('--crop', help='WIDTH:HEIGHT:X:Y (even pixel values)')
    parser.add_argument('--duration', type=float, default=10)
    parser.add_argument('--fade', type=float, default=.5)
    parser.add_argument('--portrait-time', type=float, default=3)
    args = parser.parse_args()
    probe = json.loads(subprocess.check_output(['ffprobe', '-v', 'quiet', '-show_streams', '-show_format', '-of', 'json', str(args.input)]))
    video = next(s for s in probe['streams'] if s['codec_type'] == 'video')
    width, height = video['width'], video['height']
    duration = min(args.duration, float(probe['format']['duration']))
    fade = args.fade
    if not 0 < fade < duration / 2:
        raise ValueError('Fade must be positive and less than half the clip duration.')
    if not any(s['codec_type'] == 'audio' for s in probe['streams']):
        raise ValueError('The intro must contain audio.')
    still = Image.open(io.BytesIO(frame(args.input, args.portrait_time))).convert('RGB')
    if args.crop:
        cw, ch, x, y = map(int, args.crop.split(':'))
    else:
        # Union foreground over five samples. Light-background threshold is conservative.
        bounds = []
        for t in np.linspace(.2, duration - .2, 5):
            small = np.asarray(Image.open(io.BytesIO(frame(args.input, t, 480))).convert('RGB'))
            mask = small.min(axis=2) < 155
            yy, xx = np.where(mask)
            if xx.size:
                bounds.append((xx.min(), yy.min(), xx.max(), yy.max()))
        if not bounds:
            raise ValueError('Foreground detection failed. Supply --crop WIDTH:HEIGHT:X:Y.')
        ratio = width / 480
        left, top = min(b[0] for b in bounds) * ratio, min(b[1] for b in bounds) * ratio
        right, bottom = max(b[2] for b in bounds) * ratio, max(b[3] for b in bounds) * ratio
        ch = min(height, int(bottom - top + 100)) // 2 * 2
        cw = min(width, max(int(ch * .8), int(right - left + 100))) // 2 * 2
        x = int(np.clip((left + right - cw) / 2, 0, width - cw)) // 2 * 2
        y = int(np.clip(top - 45, 0, height - ch)) // 2 * 2
    if min(cw, ch) <= 0 or x < 0 or y < 0 or x + cw > width or y + ch > height:
        raise ValueError('Crop is outside source bounds.')
    output = ROOT / 'public'
    (output / 'hero').mkdir(parents=True, exist_ok=True)
    print(f'Crop: {cw}:{ch}:{x}:{y}; duration: {duration-fade:.3f}s', flush=True)
    with tempfile.TemporaryDirectory() as td:
        td = Path(td)
        # Float PCM avoids clipping during the sample-accurate numpy crossfade.
        raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', str(args.input), '-t', str(duration), '-vn', '-ac', '2', '-ar', '48000', '-f', 'f32le', '-'])
        pcm = np.frombuffer(raw, np.float32).reshape(-1, 2)
        n, f = round(duration * 48000), round(fade * 48000)
        pcm = np.pad(pcm[:n], ((0, max(0, n-len(pcm))), (0, 0)))
        ramp = np.arange(f, dtype=np.float32)[:, None] / f
        mixed = pcm[n-f:n] * (1-ramp) + pcm[:f] * ramp
        loop = np.concatenate((pcm[f:n-f], mixed))
        with wave.open(str(td / 'loop.wav'), 'wb') as wav:
            wav.setparams((2, 2, 48000, 0, 'NONE', 'not compressed'))
            wav.writeframes((np.clip(loop, -1, 1) * 32767).astype('<i2').tobytes())
        # Rotate the loop's origin by fade seconds. Both branches retain native timing.
        filt = (f'[0:v]crop={cw}:{ch}:{x}:{y},scale=768:-2,'
                'colorlevels=rimax=0.98:gimax=0.98:bimax=0.98,setsar=1,split=2[a][b];'
                f'[a]trim=start={fade}:end={duration},setpts=PTS-STARTPTS[a1];'
                f'[b]trim=start=0:end={fade},setpts=PTS-STARTPTS[b1];'
                f'[a1][b1]xfade=transition=fade:duration={fade}:offset={duration-2*fade},format=yuv420p[v]')
        run('ffmpeg', '-y', '-v', 'error', '-i', args.input, '-filter_complex', filt, '-map', '[v]', '-an', '-t', duration-fade, '-c:v', 'ffv1', td / 'loop.mkv')
        for ext, opts in [('mp4', ['-c:v', 'libx264', '-crf', '24', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart']), ('webm', ['-c:v', 'libvpx-vp9', '-crf', '36', '-b:v', '0', '-row-mt', '1', '-cpu-used', '3', '-c:a', 'libopus', '-b:a', '80k'])]:
            run('ffmpeg', '-y', '-v', 'error', '-i', td / 'loop.mkv', '-i', td / 'loop.wav', '-map', '0:v:0', '-map', '1:a:0', *opts, '-t', duration-fade, output / 'hero' / f'hero.{ext}')
    person = still.crop((x, y, x+cw, y+ch))
    person.save(output / 'hero' / 'poster.webp', quality=88)
    # Tight upper body crop from the same supplied avatar (not a generated photograph).
    bust_w, bust_h = ch * .4, ch * .5
    bx = (cw - bust_w) / 2
    bust = person.crop((int(bx), 0, int(bx+bust_w), int(bust_h))).resize((480, 600), Image.Resampling.LANCZOS)
    bust.save(output / 'portrait-bust.webp', quality=90)
    # Read the same content source as the website; do not duplicate personal text.
    source_data = (ROOT / 'src/lib/data.ts').read_text(encoding='utf-8')
    profile = re.search(r'export const PROFILE = \{(.*?)\} as const', source_data, re.S).group(1)
    name = re.search(r'name:\s*[\"\']([^\"\']+)', profile).group(1)
    role = re.search(r'role:\s*[\"\']([^\"\']+)', profile).group(1)
    og = Image.new('RGB', (1200, 630), '#f4f2ee')
    avatar = person.resize((480, 600), Image.Resampling.LANCZOS)
    og.paste(avatar, (700, 30))
    draw = ImageDraw.Draw(og)
    def get_font(size):
        for path in [ROOT / 'tmp/og-font.ttf', 'arial.ttf', 'DejaVuSans.ttf']:
            try:
                return ImageFont.truetype(str(path), size)
            except OSError:
                pass
        return ImageFont.load_default(size=size)
    names = name.rsplit(' ', 1)
    draw.text((64, 185), '\n'.join(names), font=get_font(64), fill='#0d0d0d', spacing=8)
    draw.text((64, 380), role, font=get_font(26), fill='#3a3a3a')
    og.save(output / 'og.jpg', quality=90)
    (output / 'hero' / 'build-info.json').write_text(json.dumps({'source': args.input.name, 'crop': [cw,ch,x,y], 'duration': duration-fade, 'overlap': fade, 'sample_rate':48000}, indent=2))
    print('Hero, portrait, poster and OG assets built.', flush=True)

if __name__ == '__main__':
    main()
