# Cinematic Upgrade + Speed Pass — Design Spec
Date: 2026-09-14
Status: Approved

## 1. Purpose
Make Saksham Raj's portfolio faster and richer: bold dark creator theme,
About / Services / Testimonials sections (placeholder text, clearly editable),
and a measured speed pass on the 35-video grid.

Success criteria:
- First paint with thumbnails <2s on Fast-3G (12 initial w320 thumbs).
- New sections read as one cinematic dark brand; old Saksham Raj hero,
  WhatsApp entries, 35 videos, filters, tap-to-play all keep working.
- Every placeholder string is obviously editable by the owner.

Non-goals (YAGNI):
- No multi-page split, no framework, no build step, no analytics.
- No real bio/services/quotes — placeholders only.

## 2. Context
Static site (index.html 5KB + styles.css 2.6KB + videos.js 3KB), 35 Drive
videos with click-to-play thumbnail facades (w640), feature/video-portfolio
mirrored to main, GitHub Pages live.

## 3. Approaches Considered
A) Single-page cinematic upgrade (CHOSEN): dark theme + 3 sections + speed pass.
   Pro: both asks in one deploy, stays fast. Con: bigger diff than plain sections.
B) Speed-only + plain sections: perf tweaks, current look kept.
   Pro: smallest diff. Con: does not satisfy "more design".
C) Multi-page: separate About / Services / Work pages.
   Pro: roomy. Con: slower navigation, more files.

## 4. Architecture
- Same 3 files. index.html: sticky nav + About + Services + Reviews sections
  + Load-more button; styles.css: CSS variables (--bg #0b0b0f, --accent #25d366,
  --neon glow), dark cards; videos.js: untouched.
- Speed: thumbs w640 -> w320, `<link rel="preconnect">` to
  https://drive.google.com and https://lh3.googleusercontent.com,
  `decoding="async"` on thumbnails, initial render 12 cards + Load-more (+12).

## 5. Components
1. Sticky nav: Work / About / Services / Reviews links + WhatsApp button.
2. Hero: giant name, role line, View Work + Chat on WhatsApp buttons.
3. About: 2-sentence placeholder bio + tool chips (Premiere Pro, After Effects, DaVinci Resolve).
4. Services: 3 cards (Reels, Ads, Motion Graphics) each with delivery-note line.
5. Reviews: 3 placeholder quote cards, each labeled "(placeholder — replace with real client quote)".
6. Work: same 35-video grid, dark cards, glowing play buttons, Load-more after 12, resets on filter change.
7. Footer + floating WhatsApp bubble: unchanged behavior, restyled to theme.

## 6. Data Flow
Core unchanged: videos.js -> thumbnail facades -> iframe on tap.
New: `visibleCount` starts 12, Load-more adds 12, filter change resets to 12.
Sections/nav are static HTML, no JS.

## 7. Error Handling
Existing empty-id / REPLACE_ guards stay. New: thumbnail `onerror` swaps in a
dark tile with the video title (no broken-image icons). Load-more hides at end.

## 8. Testing
Manual: Fast-3G first paint <2s; Load-more counts (12/24/35) per filter;
tap-to-play; thumbnail 404 simulation shows title tile; 360px no overflow;
bubble never covers CTA; placeholders visibly labeled.
