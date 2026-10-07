# Sai Shashank Vakkalanka — portfolio

A light, monochrome, single-page portfolio built with Next.js 15, React 19,
TypeScript, Tailwind CSS 4, Lenis and a separately loaded GSAP hero ticker. No WebGL or externally hosted runtime scripts,
remote fonts, image CDNs, fabricated projects or social links.

## Run locally

Requires Node.js 20.9+ and npm. Node.js 22 LTS is suitable.

```sh
npm install
npm run dev
```

Open http://localhost:3000. For a production run:

```sh
npm run build
npm run start
```

`package-lock.json` pins the installed dependency tree. Use `npm ci` for repeatable
CI/deployment installs. No environment variables or account credentials are needed.

## Content and provenance

`src/lib/data.ts` is the only source of portfolio content: `PROFILE`, `NAV`,
`SKILL_GROUPS`, `EXPERIENCE`, `EDUCATION`, `PROJECTS`, `CERTIFICATIONS`,
`ACHIEVEMENTS`, and interface copy in `COPY`. All personal facts and links came
from both pages and PDF link annotations of `resume_2026_modmed.pdf`.

The source résumé is served unchanged at `/resume.pdf`. Its five embedded project
repository links, GitHub and LinkedIn links are preserved. Project prose retains
the résumé wording with spacing and line-break repairs; feature lists excerpt its
claims. Dates marked “Present” retain the résumé's wording.

The résumé has no professional role headline, summary paragraph, personal
location, paid employment/internship, ID number, coding-platform statistics or
certificate URLs. Those facts are not invented. The hero instead uses the supplied
academic discipline, and the timeline labels the positions as community roles.
The ID card uses the degree, CGPA and graduation year. The quote is explicitly a
paraphrase of the résumé's SIH award description. Interface headings, navigation,
button labels and the “Your team?” invitation are editorial UI copy, not new
biographical claims.

The provided video is an animated avatar, not a live-action photograph. The card
portrait is cropped from it. Project mini-UIs are original grayscale diagrams
labelled “Illustrative UI”; they are not project screenshots. Award glyphs are
generic original drawings, not unverified hackathon or coding-platform logos.

Skills include the résumé's Skills section **and** explicit project technologies.
“Fast APIs” is normalized to the project's spelling, “FastAPI”. The skill inspector
associates projects only where the résumé supports that relationship.

## Sections

| Order | Component | Content / interaction |
| --- | --- | --- |
| Hero | `hero/Hero.tsx` | Avatar loop; academic headline; download; sound and motion controls |
| 01 About | `sections/About.tsx` | Education, contact facts, pendulum lanyard, reversible ID card |
| 02 Skills | `sections/Skills.tsx` | 48 skill elements; family filters; keyboard/touch inspector |
| 03 Work | `sections/Work.tsx` | Five projects; expanding horizontal/vertical accordion; CSS diagrams |
| 04 Certifications | `sections/Certifications.tsx` | Three certifications; hover/focus/tap flips the matching preview card |
| 05 Experience | `sections/Experience.tsx` | Chronological education and community timeline; scroll-drawn spine |
| 06 Achievements | `sections/Achievements.tsx` | Two hackathon honours; sticky horizontal gallery; count-up numerals |
| 07 Contact | `sections/Contact.tsx` | Email copy, phone, social links, letter interaction, footer |

Navigation includes About, Skills, Work, Experience, Achievements and Contact.
Certificates without a URL are intentionally not fake clickable links.

## Hero assets

The source is `assets/source-intro.mp4` (copied from the supplied
`shashh_port_ani_vd.mp4`). Install Python 3.10+, FFmpeg/ffprobe on PATH, NumPy and
Pillow:

```sh
python -m pip install -r scripts/requirements.txt
python scripts/build-hero-assets.py --input assets/source-intro.mp4
```

To reproduce the detected crop exactly:

```sh
python scripts/build-hero-assets.py --input assets/source-intro.mp4 --crop 834:1044:534:34 --portrait-time 3
```

The crop detector takes the union of foreground bounds across five frames of a
light-background video, adds breathing room and centres the subject. It is a
conservative image heuristic, not a semantic person detector. For a different
video, visually check the output and supply `--crop WIDTH:HEIGHT:X:Y` as needed.
`--duration` defaults to 10 seconds and `--fade` to 0.5 seconds.

Pipeline:

1. Crop and scale to 768 pixels wide, maintaining the source aspect ratio.
2. Apply `colorlevels=rimax=0.98:gimax=0.98:bimax=0.98`.
3. Rotate the playback origin by 0.5 seconds and crossfade the final 0.5 seconds
   into the first 0.5 seconds using FFmpeg `xfade`. The result is 9.5 seconds long.
4. Decode stereo PCM at 48 kHz. NumPy makes the same sample-aligned circular
   overlap with linear gain ramps. FFmpeg `acrossfade` is not used. No retiming,
   speed changes or stretching are performed on either track.
5. Encode MP4 as H.264, yuv420p, CRF 24, slow preset, AAC 96 kbps and faststart;
   encode WebM as VP9, CRF 36 and Opus 80 kbps.
6. Extract the supplied avatar's upper body to 480×600 `portrait-bust.webp`, a
   hero poster and 1200×630 `og.jpg`. Crop/duration metadata goes into
   `public/hero/build-info.json`.

The hero renders WebM first and MP4 as fallback. A high-priority poster provides
an immediate image while the first video frame becomes ready. CSS uses grayscale, a small
brightness correction and multiply blending on the paper background. The exact
specified colorlevels filter alone does not make every shaded background pixel
white, hence the additional presentation correction.

Autoplay with sound is attempted; browser policy may initially allow only muted
playback. The first eligible pointer/key/touch gesture unlocks sound. The icon-only
sound button can always mute it. A separate accessible motion control lets a
visitor pause the animation. Playback pauses below 35% hero visibility and when
the tab is hidden, then resumes on return unless the visitor explicitly paused.
Reduced-motion visitors start with a still image and may choose playback.

The crossfade is continuous in time but speech content may overlap during the
0.5-second transition. It cannot manufacture a new spoken sentence boundary.

## Structure and styling

- `src/app/`: App Router entry, metadata, local font declarations and shared CSS.
- `src/components/`: navigation, hero, sections, reusable small UI components.
- `src/lib/hooks.ts`: intersection/reduced-motion/scroll helpers.
- `src/lib/scroll.tsx`: dynamically imported Lenis and anchor scrolling.
- `src/fonts/`: self-hosted WOFF2 files and OFL licence texts.
- `public/logos/`: vendored brand SVGs and upstream licences/source manifests.
- `scripts/`: reproducible media processing, asset vendoring and Lighthouse audit.
- `tests/`: Playwright checks and WCAG accessibility audit.
- `reports/`: screenshots and production Lighthouse HTML/JSON results.

Component styles are colocated in their `<style>` tags. Shared classes live in
`@layer components`; link and button resets live in `@layer base`, so Tailwind
utilities retain precedence. `.site-container` avoids a collision with Tailwind's
own `.container` utility. The small global stylesheet is inlined through Next.js's
`experimental.inlineCss` option to avoid a render-blocking CSS round trip.

The provided design tokens are preserved. Small secondary text uses an additional
`--muted-text: #65635d` token for sufficient contrast against paper and pale cards;
the specified `--mute: #77756f` remains available for large display accents.

## Accessibility and controls

- Semantic sections, a single H1, ordered headings, skip link and focus rings.
- Native modal dialog traps mobile-menu focus; Escape closes it; scrolling locks.
- Card flips on Enter/Space and touch, with matching `aria-pressed` state.
- All skill tiles work with keyboard focus and tap as well as hover.
- Collapsed project contents use `inert` so hidden links are not keyboard stops.
- The achievement gallery has keyboard buttons and focus reveals the selected card.
- Reduced motion disables Lenis, decorative CSS motion and horizontal pinning;
  all content remains readable in normal document flow.
- Logo imagery is decorative beside equivalent text. Video has a text alternative
  identifying the supplied avatar; personal information is available in the page.
- Clipboard success/failure is announced. The email remains an ordinary mailto link.

## Refinement pass

- More readable type across the project descriptions, timeline, certification
  rows, skill tiles, awards and contact links; larger touch targets throughout.
- The desktop hero includes direct entry points into three résumé projects.
- Skill filters display derived family counts and select a matching element.
  Arrow keys, Home and End navigate the skill grid with a single Tab entry point.
  On smaller screens a sticky selection bar provides a direct link to details.
- Project previous/next buttons supplement the hover, focus and touch accordion.
  Panel content has a restrained reveal, and typography adapts to tablet widths.
- Achievement scrolling caches card geometry instead of repeatedly measuring
  cards after transform writes. Scroll locking also survives a delayed Lenis load
  or a rapid reduced-motion preference change.
- Component CSS is formatted in its colocated style tags for easier maintenance.
- Self-hosted fonts are subset to the site's Latin text, punctuation and symbols;
  variable weight axes remain intact. Reproduce with
  `python scripts/subset-fonts.py` after installing the Python requirements and npm
  dependencies. The script reads the content and components to retain their
  characters; rerun it when adding new languages or symbols.

All personal content continues to come from the supplied résumé. Baseline
screenshots and audits are retained in `reports/baseline/`; current section
screenshots use the `reports/refined-` prefix.

## Verification

Start the **production** server, then:

```sh
npm run lint
npm run typecheck
npm run test:e2e
node scripts/audit.mjs
```

Playwright uses an installed Chrome (`channel: 'chrome'`). If Chrome is unavailable,
run `npx playwright install chromium` and remove the `channel` setting in
`playwright.config.ts`. Tests verify zero document overflow at 360, 390, 768,
1024, 1440 and 1920 pixels, runtime errors, video controls/loop/visibility, card
keyboard/touch behaviour, inspector, accordion, clipboard, gallery, mobile menu,
reduced motion and axe WCAG 2/2.1 AA rules. Screenshots are saved at 1440×900 and
390×844. Automated accessibility scans do not replace a full screen-reader audit.

`scripts/audit.mjs` runs Lighthouse mobile and desktop without concurrent browser
tests, saving reproducible reports. Performance scores vary with CPU, browser and
hosting. Read the checked-in reports for the measured run rather than assuming a
permanent score.

### Verified results

The final production build, lint and TypeScript checks pass. All fifteen Playwright
test groups pass. First-load page JavaScript reported by Next.js is **143 kB**.
The copied résumé is byte-identical to the supplied PDF.

| Lighthouse category | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | 94 | 100 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |

See `reports/verification-summary.json`, `reports/lighthouse-mobile.html`,
`reports/lighthouse-desktop.html`, `reports/hero-1440.png`,
`reports/hero-390.png` and the corresponding full-page screenshots.

## Credits and licences

- [Inter Tight](https://github.com/google/fonts/tree/main/ofl/intertight),
  [Instrument Serif](https://github.com/google/fonts/tree/main/ofl/instrumentserif)
  and [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono): SIL Open Font
  License 1.1, distributed via Fontsource. Licence texts are in `src/fonts/`.
- [Devicon](https://github.com/devicons/devicon/tree/v2.17.0): vendored original
  colour SVGs from v2.17.0, MIT licence in `public/logos/DEVICON-LICENSE.txt`.
  Rebuild with `python scripts/fetch-logos.py`.
- [Simple Icons](https://simpleicons.org/): selected official brand-colour paths.
  Collection licence is in `public/logos/SIMPLE-ICONS-LICENSE.md`; per-icon source
  and licence references are recorded in `public/logos/simple-icons-sources.json`.
  Rebuild with `node scripts/vendor-simple-icons.mjs`.
- Product names and brand marks belong to their respective owners. Inclusion
  identifies résumé technologies and does not imply endorsement.
- Original thin-line concept and award glyphs, barcode, lanyard and illustrative
  mini-UIs are written directly in this source. They are not third-party imagery.
- Introduction video and résumé: supplied by the portfolio owner.

## Deployment

Deploy as a standard Next.js application on a Node.js host or Vercel. Run
`npm ci && npm run build` and `npm run start`. Set the canonical portfolio URL in
`PROFILE.website` only to a URL supplied/approved by the owner before changing
domains. The initial value is the existing portfolio URL embedded in the résumé.
Security response headers are defined in `next.config.ts`. There is no backend
contact form, analytics or external runtime API.

## Premium design pass

Every section has been refined with shared typography, hairlines and paper surfaces.
The hero adds editorial framing and a compact project directory; About uses an
arched lanyard display and a fact sheet. Skills pairs the periodic table with a
technical diagram inspector. Work adds a keyboard-accessible direct project index,
while keeping the expandable gallery and labelled illustrative interfaces.
Certifications gains a layered folio, the timeline has illuminated document cards
and an academic summary, and awards now show their résumé context. Contact finishes
with a correspondence card and the existing accessible copy control.

Section screenshots are in `reports/premium-*-390.png` and
`reports/premium-*-1440.png`. The sound control reads the actual video state so
clicking immediately after a visibility-driven resume reliably mutes it.

### Hero composition refinement

The name now leads the hero in a larger two-line treatment, with the academic
role beneath it. A fine arched frame grounds the portrait, and the project
index shows résumé-derived captions with animated underline details. Degree,
CGPA and graduation year sit in a compact footer strip. Each background letter
remains hidden until independently hovered; touch devices keep it hidden and
reduced motion removes the decorative transition. No animation dependency was
added. Screenshots: `reports/hero-1440.png` and `reports/hero-390.png`.

### Interactive certification folio

Hover a certificate row, focus its button, or tap it to flip the preview to that
certificate. The preview uses the résumé title, issuer, distinction and date;
it is a typographic summary, not a reproduction of a certificate. The last
selection remains visible. Rapid selections cancel pending swaps so the latest
choice wins. Reduced motion updates the preview without rotation. The card is
also displayed above the list on mobile, and changes are announced politely to
screen readers. Coverage is in `tests/certifications.spec.ts`.

### Animated education and community path

Section 05 now has a sticky chapter console: its progress ring, chapter number,
category and date follow the scroll position. Six accessible numbered links jump
to the corresponding résumé milestone. The timeline has a travelling marker,
pulsing current stop, animated rule, and card/icon emphasis. All descriptions
remain visible, and the console stacks above the path on narrow screens.
Reduced motion removes pulses, transforms and decorative entrances. The browser
checks in `tests/journey.spec.ts` cover forward/backward navigation, keyboard,
touch, progress synchronization, reduced motion, overflow and accessibility.

### Introduction identity-card refinement

About now combines a sculpted portrait frame, detailed strap and clip, a reverse
with résumé facts, and a lighter numbered fact list. Hover still flips the card;
Front/Reverse buttons make the face explicit for touch and keyboard users. Drag
the strap, use its Left/Right arrow keys, or press the swing button to nudge the
spring. Mobile swing is bounded so it stays within the viewport. The physics loop
pauses offscreen or in a hidden tab; reduced motion stops the sway and disables
the decorative swing control. Both card faces are checked for clipped content.
See `tests/about.spec.ts` and `reports/about-upgraded-desktop.png`.

The ID card uses a stationary hover area and an 850 ms eased rotation. Its sway pauses while hovered to keep the interaction stable. Edge-hover and rapid re-entry are covered by the About regression tests.

The mobile menu has a staggered entrance, a 420 ms closing reveal, and animated hover/focus rules. Its native dialog retains focus trapping and scroll lock until the exit completes; section navigation follows the restored layout. Reduced-motion users receive instant state changes. The two navigation tests cover repeated opening, Escape, focus restoration, destination scrolling, and touch/reduced-motion behavior.


### Hero highlights strip

`src/components/hero/HeroTicker.tsx` sits between Hero and About. Its content is defined in `HERO_TICKER` in `src/lib/data.ts`: four projects, two honours, and the Street Cause community role. The user explicitly approved GSAP for this feature as an exception to the original dependency constraint. GSAP is installed locally and dynamically imported, without a CDN or ScrollTrigger.

Two identical visual groups move at 42 pixels per second with linear easing. Their measured width determines the repeat distance, and a ResizeObserver rebuilds the tween when sizing changes while preserving its progress. Screen readers receive one semantic list. Hover, keyboard focus, the pause button, a hidden tab, and leaving the viewport pause playback. Reduced-motion preferences show a static wrapping list with no duplicates. The tween and observers are cleaned up on unmount.


### Toolkit refinement

The skills section now has a résumé-derived inventory count, a measured sliding family indicator, lighter raised tiles with official logo reveals, and a coordinated logo/ring/text inspector entrance. All 48 elements remain in their original positions when filtering. The inspector uses existing résumé-backed project associations and links directly to the matching project panel. Desktop pointer selection responds to movement so scrolling under a stationary cursor does not change the selected skill. Touch selection, arrow-key navigation, and the compact mobile selection bar remain available; reduced motion removes decorative transitions. No additional dependencies were added for this refinement.


### Skill documentation links

Each of the 48 toolkit elements has an external reference in `SKILL_DOCS` in `src/lib/data.ts`. The inspector shows a publisher-labelled documentation card; broader topics use “Learning resource” to distinguish curated learning material from a product manual. These links were explicitly authorized as additions beyond the résumé and make no additional claims about the portfolio owner. Links open in a new tab with `noopener noreferrer` and an accessible announcement.

`reports/skill-docs-link-check.json` records URL/title checks and web verification for destinations that block automated fetching. GNU, Canva, OpenCV and Eventbrite imposed timeout, bot-blocking or rate-limit restrictions during direct checks; their destinations were corroborated through the web tool. External destinations can change independently of this site.


### Pinned skill inspection

Hover previews remain available until a tile is clicked/tapped or activated with Enter/Space. Activation pins the selected inspector: crossing other tiles or moving keyboard focus cannot replace its documentation and project links. The tile receives a stronger outline and the inspector displays a pinned label with an animated pin/Unpin control. Clicking a different tile replaces the pin; Unpin restores previews. Choosing a category clears the pin and selects an appropriate skill when needed. Arrow-key focus is tracked separately from the pinned selection, so Tab can leave the grid for the inspector controls. Reduced-motion preferences disable decorative pin transitions.


### Project-index preview (removed)

This preview was removed at the user’s request. The hero now leads directly into About, with no intermediary component. The removed preview used `HeroProjectIndex.tsx`, replacing the continuous ticker and moving the three-project list out of the hero. Hover, focus or tap selects DevPool, Gen-Lib or PixelPulse. A GSAP underline and short text reveal accompany changes; there is no automatic cycling. The résumé descriptions and direct Work links are preserved. Arrow keys/Home/End navigate the tabs; reduced motion removes the animations. The original `HeroTicker.tsx` remains in the source but is not rendered.

The exact pre-change checkpoint is `.backups/before-project-index-2026-10-07/`, including 38 source/test/document/dependency files and their SHA-256 manifest. Follow its `RESTORE.md` to revert this feature without undoing unrelated later edits. No media assets or dependencies were changed for this preview.

Project-index validation: production build passed; both new component tests and all five portfolio regression tests passed, including accessibility and horizontal-overflow checks from 360 to 1920 pixels.

The removed project-index source and its former tests are archived under `.backups/removed-project-index-2026-10-07/`. The verified pre-index checkpoint remains intact.


### Skill detail popup

Click/tap or Enter/Space on a toolkit tile now pins its selection and opens `SkillDialog.tsx`. The original inspector remains in place and retains the selection after dismissal. The popup reads the same skill, documentation, and project mappings; project links close it before opening the matching Work panel. A native modal dialog provides focus containment and background inertness, with Escape, close-button and backdrop dismissal. Page/Lenis scrolling stays locked through the 260 ms exit, focus returns to the originating tile, and the popup body scrolls internally on short screens. Reduced motion removes entrance, exit, and stagger animations. This feature adds no dependencies.


### Selected Work refinement (reversible)

Work expands each panel as the mouse moves over it, with click/tap/keyboard activation also available. Pointer movement drives selection so shifting panel boundaries do not switch projects beneath a stationary cursor. The gallery retains a travelling index indicator, a wider reading panel, and coordinated text/visual entrances. Project descriptions, features, technologies and repositories are unchanged. The accordion becomes vertical at 1100 px; content height adapts instead of clipping long descriptions or hiding previews. Illustrations remain explicitly labelled and use short, finite project-specific sequences (network nodes, book spines, audio bars, leaf drawing, and room tiles). Reduced motion removes these sequences.

The exact checkpoint is `.backups/before-work-upgrade-2026-10-07/`: 39 copied files with verified SHA-256 checksums and scoped restoration instructions in `RESTORE.md`. Restoring the listed files reverts this upgrade while preserving unrelated future edits. No media or dependencies were changed.
