# Saksham Raj Rebrand — Design Spec
Date: 2026-09-14
Status: Approved

## 1. Purpose
Rebrand the existing videoediting portfolio site to Saksham Raj (video editor)
and add a WhatsApp contact path. Same audience, same 35 videos, new name.

Success criteria:
- Hero reads "Saksham Raj — Video Editor", footer "© 2026 Saksham Raj".
- Two WhatsApp entry points (hero button + floating bubble) open
  https://wa.me/9929977487 in a new tab.
- All 35 videos, filters, thumbnail facades, click-to-play behave exactly as before.

Non-goals (YAGNI):
- No about/services/testimonials sections, no photo, no pricing.
- No changes to videos.js, grid logic, facades, or hosting.

## 2. Context
Site is static HTML (index.html + styles.css + videos.js) on branch
feature/video-portfolio, mirrored to main, live via GitHub Pages.
35 Drive videos wired with real IDs, click-to-play facades for fast load.

## 3. Approaches Considered
A) Light rebrand (CHOSEN): hero/footer text swap + 2 WhatsApp links + bubble style.
   Pro: tiny diff, zero risk. Con: no dedicated contact section.
B) Rebrand + contact strip: A + contact section with pre-filled text.
   Pro: better conversion. Con: unrequested scope.
C) Full personal makeover: photo, about, services.
   Pro: richer brand. Con: scope creep, assets missing.

## 4. Architecture
- Files: modify `index.html` (hero H1/sub/CTA, footer, floating bubble markup),
  modify `styles.css` (add `.wa-float` + `.wa-float a` rules).
- No new files. `videos.js` untouched. No build, no framework.

## 5. Components
1. Hero: H1 "Saksham Raj", sub "Video Editor — reels, ads & motion graphics",
   CTA button "Chat on WhatsApp" -> https://wa.me/9929977487 (target _blank, rel noopener).
2. Floating bubble: fixed bottom-right circular button (WhatsApp green, chat glyph
   "💬" text to avoid image assets), links same wa.me URL.
3. Footer: "© 2026 Saksham Raj".
4. Unchanged: filter bar, 35-card grid, facade thumbnails, click-to-play, noscript.

## 6. Data Flow
Unchanged from current site: videos.js -> cards -> thumbnail facade -> iframe on tap.
WhatsApp entries are plain external anchors, no JS involved.

## 7. Error Handling
Unchanged guards (empty-id / REPLACE_ notes) stay. New anchors carry
target="_blank" rel="noopener". No new failure modes.

## 8. Testing
Manual: hero shows Saksham Raj; both WhatsApp buttons open wa.me/9929977487;
35 cards render; filters switch counts; tapping a thumbnail plays video;
360px no overflow, bubble does not cover card content.
