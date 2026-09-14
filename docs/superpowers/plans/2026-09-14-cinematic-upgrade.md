# Cinematic Upgrade + Speed Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a faster, dark cinematic single-page portfolio with About, Services, and Reviews sections.

**Architecture:** Same 3 static files. Task 1 does the speed pass in `index.html` (preconnect, w320 thumbs, async decoding, thumbnail error fallback, 12-card paging). Task 2 rewrites `styles.css` as a dark theme with variables covering every existing class plus new sections. Task 3 adds nav, hero button, and the three sections to `index.html`, then verifies and pushes. `videos.js` is never touched.

**Tech Stack:** HTML5, CSS3 (custom properties), vanilla JS; no new dependencies.

## Global Constraints

- No new files, no framework, no backend, no npm, no build step.
- Work in `.worktrees/portfolio` on branch `feature/video-portfolio`; commit with `git -c user.name="opencode" -c user.email="opencode@localhost" commit`.
- `videos.js` must stay byte-identical (35 titles intact).
- Thumbnails must use `&sz=w320`, `loading="lazy"`, `decoding="async"`.
- Every placeholder string must contain the word `placeholder`.
- WhatsApp URL `https://wa.me/9929977487` must keep `target="_blank" rel="noopener"`.

---

### Task 1: Speed pass (preconnect, lighter thumbs, paging)

**Files:**
- Modify: `.worktrees/portfolio/index.html` (head links + render-loop JS only)
- Test: python3 string asserts + manual card-count check

**Interfaces:**
- Consumes: `VIDEOS` global (`{id, title, tag}[]`), `#work-grid`, `#filters` (all existing).
- Produces: `visibleCount` paging with `.load-more-btn` (styled in Task 2; unstyled but functional until then), `PAGE = 12` constant consumed by filter reset.

- [ ] **Step 1: Write the failing check**

Run: `python3 -c "html=open('.worktrees/portfolio/index.html',encoding='utf-8').read(); assert 'sz=w320' in html and 'visibleCount' in html; print('speed pass present')"`
Expected: FAIL with AssertionError

- [ ] **Step 2: Edit the `<head>` — insert after the stylesheet line**

Old:
```html
  <link rel="stylesheet" href="styles.css" />
```
New:
```html
  <link rel="stylesheet" href="styles.css" />
  <link rel="preconnect" href="https://drive.google.com" />
  <link rel="preconnect" href="https://lh3.googleusercontent.com" />
```

- [ ] **Step 3: Edit the thumbnail block — lighter + async + error tile**

Old:
```js
            var thumb = document.createElement("img");
            thumb.className = "thumb-img";
            thumb.src = "https://drive.google.com/thumbnail?id=" + v.id + "&sz=w640";
            thumb.setAttribute("loading", "lazy");
            thumb.setAttribute("alt", v.title);
            wrap.appendChild(thumb);
```
New:
```js
            var thumb = document.createElement("img");
            thumb.className = "thumb-img";
            thumb.src = "https://drive.google.com/thumbnail?id=" + v.id + "&sz=w320";
            thumb.setAttribute("loading", "lazy");
            thumb.setAttribute("decoding", "async");
            thumb.setAttribute("alt", v.title);
            thumb.onerror = function () {
              wrap.innerHTML = "";
              wrap.className = "frame-wrap";
              var tile = document.createElement("p");
              tile.className = "unavailable-note";
              tile.textContent = v.title;
              wrap.appendChild(tile);
            };
            wrap.appendChild(thumb);
```

- [ ] **Step 4: Add paging — replace the `buildCards` opener and wire the button**

Old:
```js
      function buildCards(filter) {
        grid.innerHTML = "";
        var items = filter === "All" ? data : data.filter(function (v) { return v.tag === filter; });
        items.forEach(function (v) {
```
New:
```js
      var PAGE = 12;
      var visibleCount = PAGE;
      var currentFilter = "All";
      var loadMoreBtn = document.createElement("button");
      loadMoreBtn.className = "load-more-btn";
      loadMoreBtn.textContent = "Load more";
      loadMoreBtn.onclick = function () { visibleCount += PAGE; buildCards(currentFilter); };
      grid.parentNode.insertBefore(loadMoreBtn, grid.nextSibling);

      function buildCards(filter) {
        grid.innerHTML = "";
        var items = filter === "All" ? data : data.filter(function (v) { return v.tag === filter; });
        var shown = items.slice(0, visibleCount);
        loadMoreBtn.style.display = items.length > visibleCount ? "" : "none";
        shown.forEach(function (v) {
```

- [ ] **Step 5: Reset paging on filter change**

Old:
```js
      function setActive(tag) {
        activeFilter = tag;
```
New:
```js
      function setActive(tag) {
        activeFilter = tag;
        currentFilter = tag;
        visibleCount = PAGE;
```

- [ ] **Step 6: Run check to verify it passes**

Run: `python3 -c "html=open('.worktrees/portfolio/index.html',encoding='utf-8').read(); assert 'sz=w320' in html and 'sz=w640' not in html and 'visibleCount' in html and 'decoding' in html and 'preconnect' in html and 'load-more-btn' in html; js=open('.worktrees/portfolio/videos.js',encoding='utf-8').read(); assert js.count('title:')==35; print('PASS: speed pass done, 35 videos intact')"`
Expected: PASS: speed pass done, 35 videos intact

Manual: open page — 12 cards + Load more button; tap it → 24; filter change resets to 12.

- [ ] **Step 7: Commit**

```bash
git add .worktrees/portfolio/index.html
git -c user.name="opencode" -c user.email="opencode@localhost" commit -m "perf: preconnect, w320 thumbs, async decode, 12-card paging"
```

### Task 2: Dark cinematic theme

**Files:**
- Modify: `.worktrees/portfolio/styles.css` (full rewrite, same selectors + new ones)
- Test: python3 asserts for variables, selectors, and preserved classes

**Interfaces:**
- Consumes: class names from index.html — `.topnav`, `.brand`, `.nav-links`, `.nav-cta`, `.hero`, `.btn`, `.btn-ghost`, `.section`, `.section-title`, `.chips`, `.chip`, `.service-grid`, `.service-card`, `.quote-grid`, `.quote-card`, plus all existing (`.grid`, `.card`, `.frame-wrap`, `.facade`, `.thumb-img`, `.play-btn`, `.card-title`, `.card-tag`, `.filters`, `.filter-btn`, `.load-more-btn`, `.wa-float`, `.unavailable-note`, `.empty-id-note`).
- Produces: complete dark theme; Task 3 markup plugs into these selectors.

- [ ] **Step 1: Write the failing check**

Run: `python3 -c "css=open('.worktrees/portfolio/styles.css',encoding='utf-8').read(); assert '--bg' in css and '.topnav' in css; print('theme present')"`
Expected: FAIL with AssertionError

- [ ] **Step 2: Rewrite `.worktrees/portfolio/styles.css` with this exact content**

```css
:root { --bg: #0b0b0f; --panel: #14141c; --text: #f2f2f5; --muted: #a7a7b3; --accent: #25d366; --neon: 0 0 12px rgba(37, 211, 102, 0.55); }
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: var(--text); background: var(--bg); }
.topnav { position: sticky; top: 0; z-index: 40; display: flex; align-items: center; gap: 16px; padding: 12px 16px; background: rgba(11, 11, 15, 0.9); border-bottom: 1px solid #22222c; }
.brand { font-weight: 800; color: var(--text); text-decoration: none; }
.nav-links { display: flex; gap: 12px; margin-left: auto; }
.nav-links a { color: var(--muted); text-decoration: none; font-size: 14px; }
.nav-cta { background: var(--accent); color: #062b16; font-weight: 700; text-decoration: none; border-radius: 999px; padding: 8px 16px; font-size: 14px; }
.hero { padding: 72px 20px; text-align: center; background: radial-gradient(ellipse at center, #1a1a26 0%, #0b0b0f 70%); }
.hero h1 { margin: 0 0 12px; font-size: 44px; line-height: 1.1; text-shadow: 0 0 24px rgba(37, 211, 102, 0.35); }
.hero p { margin: 0 0 24px; color: var(--muted); }
.btn { display: inline-block; padding: 12px 22px; background: var(--accent); color: #062b16; font-weight: 700; text-decoration: none; border-radius: 8px; box-shadow: var(--neon); margin: 4px; }
.btn-ghost { background: transparent; color: var(--text); border: 1px solid #3a3a48; box-shadow: none; }
.section { padding: 48px 16px; max-width: 1100px; margin: 0 auto; }
.section-title { margin: 0 0 16px; font-size: 26px; }
.section p.lead { color: var(--muted); max-width: 640px; }
.chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.chip { font-size: 13px; background: var(--panel); border: 1px solid #2c2c38; border-radius: 999px; padding: 6px 14px; }
.service-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
.service-card { background: var(--panel); border: 1px solid #26262f; border-radius: 12px; padding: 20px; }
.service-card h3 { margin: 0 0 8px; }
.service-card p { margin: 0; color: var(--muted); font-size: 14px; }
.quote-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
.quote-card { background: var(--panel); border-left: 3px solid var(--accent); border-radius: 8px; padding: 16px 20px; font-style: italic; }
.quote-card span { display: block; margin-top: 8px; font-style: normal; color: var(--muted); font-size: 13px; }
#work { padding: 28px 16px 48px; max-width: 1200px; margin: 0 auto; }
#work h2 { margin: 0 0 12px; font-size: 26px; }
.filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
.filter-btn { padding: 8px 16px; border: 1px solid #2c2c38; background: var(--panel); border-radius: 999px; font-size: 13px; cursor: pointer; color: var(--muted); }
.filter-btn:hover { color: var(--text); }
.filter-btn.active { background: var(--accent); color: #062b16; border-color: var(--accent); }
.grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
.card { border: 1px solid #26262f; border-radius: 12px; overflow: hidden; background: var(--panel); }
.frame-wrap { aspect-ratio: 9 / 16; background: #000; }
.frame-wrap iframe { width: 100%; height: 100%; border: 0; display: block; }
.frame-wrap.facade { position: relative; cursor: pointer; }
.thumb-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.play-btn { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 56px; height: 56px; border-radius: 50%; border: 0; background: rgba(37, 211, 102, 0.85); color: #062b16; font-size: 20px; cursor: pointer; box-shadow: var(--neon); }
.card-title { margin: 12px 12px 4px; font-size: 16px; }
.card-tag { display: inline-block; margin: 0 12px 14px; font-size: 12px; background: #22222c; color: var(--muted); border-radius: 999px; padding: 4px 10px; }
.load-more-btn { display: block; margin: 24px auto 0; padding: 12px 28px; border-radius: 8px; border: 1px solid #3a3a48; background: transparent; color: var(--text); font-size: 15px; cursor: pointer; }
.unavailable-note { color: #fff; padding: 40px 16px; text-align: center; font-size: 14px; }
.empty-id-note { color: #fff; padding: 40px 16px; text-align: center; font-size: 14px; background: #1a1a1a; }
footer { text-align: center; padding: 20px; color: var(--muted); font-size: 13px; border-top: 1px solid #22222c; }
.wa-float { position: fixed; right: 16px; bottom: 16px; width: 56px; height: 56px; border-radius: 50%; background: #25d366; color: #fff; font-size: 26px; display: flex; align-items: center; justify-content: center; text-decoration: none; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 50; }
@media (min-width: 700px) { .grid { grid-template-columns: repeat(2, 1fr); } .service-grid { grid-template-columns: repeat(3, 1fr); } .quote-grid { grid-template-columns: repeat(3, 1fr); } .hero h1 { font-size: 56px; } }
@media (min-width: 1024px) { .grid { grid-template-columns: repeat(3, 1fr); } }
```

- [ ] **Step 3: Run check to verify it passes**

Run: `python3 -c "css=open('.worktrees/portfolio/styles.css',encoding='utf-8').read(); assert '--bg' in css and '.topnav' in css and '.service-card' in css and '.quote-card' in css and '.load-more-btn' in css and '.thumb-img' in css and '.wa-float' in css and 'aspect-ratio: 9 / 16' in css; print('PASS: dark theme complete')"`
Expected: PASS: dark theme complete

- [ ] **Step 4: Commit**

```bash
git add .worktrees/portfolio/styles.css
git -c user.name="opencode" -c user.email="opencode@localhost" commit -m "feat: dark cinematic theme with section styles"
```

### Task 3: Sections markup + verify + push

**Files:**
- Modify: `.worktrees/portfolio/index.html` (nav, hero button, 3 sections)
- Test: python3 asserts + manual pass

**Interfaces:**
- Consumes: selectors from Task 2 (`.topnav`, `.section`, `.chips`, `.service-grid`, `.quote-grid`).
- Produces: complete page; verified and pushed to origin feature + main.

- [ ] **Step 1: Write the failing check**

Run: `python3 -c "html=open('.worktrees/portfolio/index.html',encoding='utf-8').read(); assert 'id=\"about\"' in html and 'id=\"services\"' in html and 'id=\"reviews\"' in html; print('sections present')"`
Expected: FAIL with AssertionError

- [ ] **Step 2: Add `id="top"` to `<body>` and insert nav**

Old:
```html
<body>
  <header class="hero">
```
New:
```html
<body id="top">
  <nav class="topnav">
    <a class="brand" href="#top">SR</a>
    <div class="nav-links">
      <a href="#work">Work</a>
      <a href="#about">About</a>
      <a href="#services">Services</a>
      <a href="#reviews">Reviews</a>
    </div>
    <a class="nav-cta" href="https://wa.me/9929977487" target="_blank" rel="noopener">WhatsApp</a>
  </nav>
  <header class="hero">
```

- [ ] **Step 3: Add View Work button to hero**

Old:
```html
    <a class="btn" href="https://wa.me/9929977487" target="_blank" rel="noopener">Chat on WhatsApp</a>
```
New:
```html
    <a class="btn" href="https://wa.me/9929977487" target="_blank" rel="noopener">Chat on WhatsApp</a>
    <a class="btn btn-ghost" href="#work">View Work</a>
```

- [ ] **Step 4: Insert sections between `</main>` and `<footer>`**

Old:
```html
  </main>

  <footer>
```
New:
```html
  </main>

  <section id="about" class="section">
    <h2 class="section-title">About Saksham</h2>
    <p class="lead">Saksham Raj is a video editor crafting scroll-stopping reels, ads and motion graphics. (placeholder — replace with your real bio.)</p>
    <div class="chips">
      <span class="chip">Premiere Pro</span>
      <span class="chip">After Effects</span>
      <span class="chip">DaVinci Resolve</span>
      <span class="chip">Photoshop</span>
    </div>
  </section>

  <section id="services" class="section">
    <h2 class="section-title">Services</h2>
    <div class="service-grid">
      <div class="service-card">
        <h3>Reels</h3>
        <p>Short-form edits built for retention. (placeholder — add your package and turnaround.)</p>
      </div>
      <div class="service-card">
        <h3>Ads</h3>
        <p>Direct-response video ads. (placeholder — add your package and turnaround.)</p>
      </div>
      <div class="service-card">
        <h3>Motion Graphics</h3>
        <p>Titles, logo animation and kinetic type. (placeholder — add your package and turnaround.)</p>
      </div>
    </div>
  </section>

  <section id="reviews" class="section">
    <h2 class="section-title">Client Reviews</h2>
    <div class="quote-grid">
      <div class="quote-card">"Saksham turned raw clips into a reel that doubled our inquiries."<span>— Client Name (placeholder — replace with a real client quote.)</span></div>
      <div class="quote-card">"Fast delivery and edits that actually convert."<span>— Client Name (placeholder — replace with a real client quote.)</span></div>
      <div class="quote-card">"Our best-performing ad this quarter came from Saksham."<span>— Client Name (placeholder — replace with a real client quote.)</span></div>
    </div>
  </section>

  <footer>
```

- [ ] **Step 5: Run checks to verify it passes**

Run: `python3 -c "html=open('.worktrees/portfolio/index.html',encoding='utf-8').read(); assert 'id=\"about\"' in html and 'id=\"services\"' in html and 'id=\"reviews\"' in html and html.count('placeholder')>=7 and html.count('https://wa.me/9929977487')==3 and 'btn-ghost' in html; js=open('.worktrees/portfolio/videos.js',encoding='utf-8').read(); assert js.count('title:')==35; print('PASS: sections done, 35 videos intact')"`
Expected: PASS: sections done, 35 videos intact

Manual (do not skip):
- Open page: dark theme everywhere, nav jumps to each section, 12 cards + Load more, filters reset paging, tap-to-play works, both WhatsApp entries open wa.me in new tab.
- 360px: no horizontal scroll, bubble clear of content.

- [ ] **Step 6: Commit and push**

```bash
git add .worktrees/portfolio/index.html
git -c user.name="opencode" -c user.email="opencode@localhost" commit -m "feat: add nav, about, services, reviews sections"
git push origin feature/video-portfolio
git fetch origin feature/video-portfolio
git merge origin/feature/video-portfolio --no-edit
git push origin main
```
(Run the merge/push from the main checkout; the worktree branch cannot checkout main. Use `-c user.name`/`-c user.email` flags on merge if identity is missing.)
