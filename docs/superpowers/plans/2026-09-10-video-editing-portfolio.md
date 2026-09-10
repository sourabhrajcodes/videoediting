# Video Editing Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reels-first static portfolio page that showcases PH real estate edits via Google Drive embeds.

**Architecture:** Three files with no build step — `videos.js` holds Drive IDs, `index.html` renders cards via vanilla JS, `styles.css` provides mobile-first 9:16 grid. Lazy-loaded HTTPS iframes for fast PH mobile data.

**Tech Stack:** HTML5, CSS3 (grid), vanilla JS (no framework), Google Drive `/preview` embeds, any static host.

## Global Constraints

- No framework, no backend, no npm, no CMS, no auth.
- All embeds must use HTTPS `https://drive.google.com/file/d/{id}/preview`.
- All iframes must include `loading="lazy"`.
- No autoplay.
- Each Drive file must be shared as Anyone with link can view (owner action, verified manually).
- Mobile-first: 1 col at 360px, no horizontal scroll; 2-3 col at desktop 1280px.
- Showcase only in v1: no pricing tiers, no WhatsApp CTA section, no extra pages.

---

### Task 1: Videos config

**Files:**
- Create: `videos.js`
- Test: manual `Test-Path` check + browser console check

**Interfaces:**
- Consumes: nothing (first task)
- Produces: `const VIDEOS` — array of `{id: string, title: string, tag: string}` consumed by Task 2 rendering code via global `VIDEOS`.

- [ ] **Step 1: Write the failing check**

Run: `Test-Path -LiteralPath "videos.js"`
Expected: FAIL (False — file does not exist yet)

- [ ] **Step 2: Create minimal videos.js**

```js
// Replace each id with your Google Drive file ID from the share link:
// https://drive.google.com/file/d/<FILE_ID>/view -> copy <FILE_ID>
const VIDEOS = [
  { id: "REPLACE_WITH_DRIVE_ID_1", title: "BGC Condo Tour", tag: "Condo Tour" },
  { id: "REPLACE_WITH_DRIVE_ID_2", title: "House & Lot Walkthrough", tag: "House Walkthrough" },
  { id: "REPLACE_WITH_DRIVE_ID_3", title: "Pre-selling Map Animation", tag: "Pre-selling" },
  { id: "REPLACE_WITH_DRIVE_ID_4", title: "Before / After Reel", tag: "Before / After" },
  { id: "REPLACE_WITH_DRIVE_ID_5", title: "Price-Pop Cut", tag: "Motion Graphics" },
  { id: "REPLACE_WITH_DRIVE_ID_6", title: "CTA End-Card", tag: "Motion Graphics" },
];
```

- [ ] **Step 3: Run check to verify it passes**

Run: `Test-Path -LiteralPath "videos.js"`
Expected: PASS (True)

- [ ] **Step 4: Commit**

```bash
git add videos.js
git commit -m "feat: add videos.js Drive config"
```

### Task 2: Page structure + rendering

**Files:**
- Create: `index.html`
- Test: open in browser, console shows 6 cards

**Interfaces:**
- Consumes: global `VIDEOS` from Task 1 (`{id: string, title: string, tag: string}[]`)
- Produces: DOM `#work-grid` cards with `iframe[src=https://drive.google.com/file/d/{id}/preview]` + `.card-title`, `.card-tag`, `.card-fallback-link[href=https://drive.google.com/file/d/{id}/view]`, `.unavailable-note` for placeholder IDs consumed by Task 3 styling and Task 4 fallback.

- [ ] **Step 1: Write the failing check**

Run: `Test-Path -LiteralPath "index.html"`
Expected: FAIL (False)

- [ ] **Step 2: Create minimal index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ReelCuts — Video Editing for PH Realtors</title>
  <meta name="description" content="Listing reels + motion graphics for PH realtors. You shoot on phone, we deliver in 48hrs." />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header class="hero">
    <h1>Video Editing for PH Realtors Only</h1>
    <p>Listing reels + motion graphics — you shoot on phone, we deliver in 48hrs.</p>
    <a class="btn" href="#work">View work</a>
  </header>

  <main id="work">
    <h2>Recent work</h2>
    <div id="work-grid" class="grid"></div>
  </main>

  <footer>
    <p>© 2026 ReelCuts for PH Realtors | IN Team</p>
  </footer>

  <script src="videos.js"></script>
  <script>
    (function () {
      var grid = document.getElementById("work-grid");
      (VIDEOS || []).forEach(function (v) {
        var card = document.createElement("article");
        card.className = "card";
        var wrap = document.createElement("div");
        wrap.className = "frame-wrap";
        if (v.id.indexOf("REPLACE_") === 0) {
          var note = document.createElement("p");
          note.className = "unavailable-note";
          note.textContent = "Video unavailable — replace Drive ID in videos.js (set sharing to Anyone with link).";
          wrap.appendChild(note);
        } else {
          var frame = document.createElement("iframe");
          frame.src = "https://drive.google.com/file/d/" + v.id + "/preview";
          frame.setAttribute("loading", "lazy");
          frame.setAttribute("allow", "autoplay; fullscreen");
          frame.setAttribute("title", v.title);
          wrap.appendChild(frame);
        }
        var title = document.createElement("h3");
        title.className = "card-title";
        title.textContent = v.title;
        var tag = document.createElement("span");
        tag.className = "card-tag";
        tag.textContent = v.tag;
        var link = document.createElement("a");
        link.className = "card-fallback-link";
        link.href = "https://drive.google.com/file/d/" + v.id + "/view";
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = "Open in Drive";
        card.appendChild(wrap);
        card.appendChild(title);
        card.appendChild(tag);
        card.appendChild(link);
        grid.appendChild(card);
      });
    })();
  </script>
</body>
</html>
```

- [ ] **Step 3: Run check to verify it passes**

Run: `Test-Path -LiteralPath "index.html"; if ($?) { python3 -c "html=open('index.html',encoding='utf-8').read(); assert 'work-grid' in html and 'videos.js' in html and 'drive.google.com/file/d/' in html; print('PASS: index renders from VIDEOS')" }`
Expected: PASS: index renders from VIDEOS

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add portfolio page structure and Drive rendering"
```

### Task 3: Mobile-first styling

**Files:**
- Create: `styles.css`
- Test: open index.html at 360px and 1280px, no horizontal scroll

**Interfaces:**
- Consumes: `.hero`, `.btn`, `#work`, `.grid`, `.card`, `.frame-wrap`, `iframe`, `.card-title`, `.card-tag`, `.card-fallback-link`, `.unavailable-note` class names from Task 2.
- Produces: responsive layout (1 col mobile, 3 col desktop, 9:16 frames) verified visually in Task 4.

- [ ] **Step 1: Write the failing check**

Run: `Test-Path -LiteralPath "styles.css"`
Expected: FAIL (False)

- [ ] **Step 2: Create minimal styles.css**

```css
* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: #111; background: #fff; }
.hero { padding: 56px 20px; text-align: center; background: #0f0f0f; color: #fff; }
.hero h1 { margin: 0 0 12px; font-size: 28px; line-height: 1.2; }
.hero p { margin: 0 0 20px; opacity: 0.85; }
.btn { display: inline-block; padding: 12px 22px; background: #25d366; color: #062b16; font-weight: 700; text-decoration: none; border-radius: 8px; }
#work { padding: 28px 16px 48px; max-width: 1100px; margin: 0 auto; }
#work h2 { margin: 0 0 16px; font-size: 22px; }
.grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
.card { border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden; background: #fff; }
.frame-wrap { aspect-ratio: 9 / 16; background: #000; }
.frame-wrap iframe { width: 100%; height: 100%; border: 0; display: block; }
.card-title { margin: 12px 12px 4px; font-size: 16px; }
.card-tag { display: inline-block; margin: 0 12px 8px; font-size: 12px; background: #f1f1f1; border-radius: 999px; padding: 4px 10px; }
.card-fallback-link { display: inline-block; margin: 0 12px 14px; font-size: 13px; color: #0b57d0; }
.unavailable-note { color: #fff; padding: 40px 16px; text-align: center; font-size: 14px; }
footer { text-align: center; padding: 20px; color: #666; font-size: 13px; border-top: 1px solid #eee; }
@media (min-width: 700px) { .grid { grid-template-columns: repeat(2, 1fr); } .hero h1 { font-size: 36px; } }
@media (min-width: 1024px) { .grid { grid-template-columns: repeat(3, 1fr); } }
```

- [ ] **Step 3: Run check to verify it passes**

Run: `python3 -c "css=open('styles.css',encoding='utf-8').read(); assert '.grid' in css and 'aspect-ratio: 9 / 16' in css and '@media (min-width: 1024px)' in css; print('PASS: responsive grid styles present')"`
Expected: PASS: responsive grid styles present

- [ ] **Step 4: Commit**

```bash
git add styles.css
git commit -m "feat: add mobile-first reels grid styles"
```

### Task 4: Fallback + final verification

**Files:**
- Modify: `index.html:1-60` (add noscript + unavailable note — small inline edit only)
- Test: manual browser pass at 360px and 1280px

**Interfaces:**
- Consumes: full page from Tasks 1-3.
- Produces: verified deployable folder (`index.html`, `styles.css`, `videos.js`).

- [ ] **Step 1: Add noscript fallback inside index.html**

Edit `index.html`: immediately after `<div id="work-grid" class="grid"></div>` insert:

```html
<noscript><p>Enable JavaScript to view the work grid. Open videos directly in Google Drive.</p></noscript>
```

Full surrounding context after edit:

```html
<div id="work-grid" class="grid"></div>
<noscript><p>Enable JavaScript to view the work grid. Open videos directly in Google Drive.</p></noscript>
```

- [ ] **Step 2: Run final verification**

Run: `python3 -c "html=open('index.html',encoding='utf-8').read(); assert '<noscript>' in html; assert html.count('drive.google.com/file/d/')>=2; css=open('styles.css',encoding='utf-8').read(); assert 'loading' not in css; js=open('videos.js',encoding='utf-8').read(); assert 'VIDEOS' in js; print('PASS: fallback + embeds wired')"`
Expected: PASS: fallback + embeds wired

Manual (do not skip):
- Open `index.html` in Chrome mobile emulation 360px: 1 column, 9:16 cards, no horizontal scroll.
- Open at 1280px: 3 columns.
- Each Drive file sharing = Anyone with link; each preview plays; Open in Drive link works.
- Throttled Fast-3G first paint feels <3s with 6 videos (lazy iframes).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add noscript fallback and verify portfolio"
```
