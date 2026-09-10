# Video Editing Portfolio — Design Spec
Date: 2026-09-10
Status: Approved

## 1. Purpose
Single-page static portfolio to win PH real estate (Manila / Cebu / Davao) retainer clients.
Supports the CTWA WhatsApp funnel from PH-Video-Editing-Meta-Ads-Report.pdf: link is pasted
inside WhatsApp auto-reply as visual proof. Goal is to show editing quality fast on mobile data,
not to close price in-page.

Success criteria:
- Loads <3s on mobile Chrome with 6 Drive embeds (PH data saver).
- Realtor understands in 10s: PH real estate only, reels + motion graphics.
- Owner can add a video by editing 1 line (Drive ID).

Non-goals (YAGNI, per user pick = showcase only):
- No pricing tiers page, no WhatsApp CTA section, no about/process page in v1.
- No framework, backend, CMS, or auth.

## 2. Context
Repo has no web code yet (python.py LIF neuron demo, empty teat.txt).
Business context from PH-Video-Editing-Meta-Ads-Report.pdf:
- Offer ladder: PHP 4,997 trial / PHP 27,997 core / PHP 35,000 premium.
- Traffic: Reels-first, mobile, Rs. 500/day → direct WhatsApp DM.
- User has videos ready, hosted on Google Drive (share links set to Anyone with link).

## 3. Approaches Considered
A) Reels-first single page (CHOSEN): mobile-first 9:16 Drive grid, lazy iframes, hero + grid + minimal footer.
   Pro: fastest, free host, ideal for WhatsApp link. Con: no filtering, no in-page close.
B) Filterable grid: A + tag filters (Condo / House & Lot / Pre-selling / Motion Graphics).
   Pro: better for 12+ videos. Con: extra JS, not needed for v1 count.
C) Showcase + closer: A + pricing + WhatsApp pre-fill CTA.
   Pro: higher close rate per report hybrid model. Con: bigger scope, user explicitly de-scoped.

## 4. Architecture
- Files: `index.html` + `styles.css` + `videos.js` (config array). No build, no npm, no framework.
- `videos.js`: `const VIDEOS = [{id: "<DRIVE_FILE_ID>", title: "BGC Condo Tour", tag: "Condo Tour"}, ...]`
- `index.html` renders cards from VIDEOS via <15 lines vanilla JS.
- Embed URL: `https://drive.google.com/file/d/{id}/preview`
- Hosting: any static host (GitHub Pages / Netlify / Vercel). Link used in WA auto-reply.

## 5. Components
1. Hero: H1 "Video Editing for PH Realtors Only", sub "Listing reels + motion graphics — you shoot on phone, we deliver in 48hrs", button "View work" (anchor to #work).
2. Work grid (`#work`): responsive CSS grid, 1 col mobile / 2-3 col desktop. Each card:
   - 9:16 wrapper with `<iframe loading="lazy" allow="autoplay; fullscreen">`
   - Title + tag badge below.
   - "Open in Drive" text link (fallback for blocked embeds).
   - Initial seed: 6 placeholders with titles: BGC Condo Tour, House & Lot Walkthrough, Pre-selling Map Animation, Before/After Reel, Price-Pop Cut, CTA End-Card.
3. Footer: single line "© 2026 ReelCuts for PH Realtors | IN Team". No nav.

Isolation: adding/removing a video touches only `videos.js`. Styling touches only `styles.css`. Layout touches only `index.html`.

## 6. Data Flow
Static only, no runtime state:
1. Browser loads index.html → styles.css → videos.js.
2. JS maps VIDEOS → DOM cards with preview iframe src.
3. User scrolls → iframes lazy-load. Tap card → native Drive player fullscreen.
4. "Open in Drive" → `https://drive.google.com/file/d/{id}/view` in new tab.
Owner workflow: paste Drive share link file ID into videos.js, redeploy (or just re-open file locally).

## 7. Error Handling
- Invalid/private ID: card shows "Video unavailable — set sharing to Anyone with link" + still shows Open-in-Drive link.
- Blocked iframe (adblock / offline): fallback link remains usable.
- Performance guard: `loading="lazy"`, max 6 embeds in v1, no autoplay.
- All embeds HTTPS.

## 8. Testing
Manual (no test framework for static v1):
- 360px Chrome mobile: no horizontal scroll, 9:16 cards full-width.
- All 6 previews play; each Drive file set to Anyone with link.
- Throttled Fast-3G: first paint <3s.
- Desktop 1280px: 3-col grid intact.
