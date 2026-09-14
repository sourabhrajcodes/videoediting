# Saksham Raj Rebrand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand the videoediting site to Saksham Raj and add WhatsApp contact buttons.

**Architecture:** Two small edits in the existing static site — `index.html` (hero, footer, bubble markup) then `styles.css` (bubble style) — verified and pushed. `videos.js` untouched.

**Tech Stack:** HTML5, CSS3, vanilla JS (existing); no new dependencies.

## Global Constraints

- No new files, no framework, no backend, no npm.
- Hero H1 must read `Saksham Raj`, sub `Video Editor — reels, ads & motion graphics.`
- Both WhatsApp entries must link `https://wa.me/9929977487` with `target="_blank" rel="noopener"`.
- Footer must read `© 2026 Saksham Raj` (use `&copy;` entity as the file does).
- All 35 videos, filters, facades, click-to-play must keep working.
- Work in `.worktrees/portfolio` on branch `feature/video-portfolio`; commit with `git -c user.name="opencode" -c user.email="opencode@localhost" commit`.

---

### Task 1: Hero, footer, WhatsApp bubble markup

**Files:**
- Modify: `.worktrees/portfolio/index.html` (5 small edits, all in static markup)
- Test: python3 string asserts on index.html

**Interfaces:**
- Consumes: nothing (first task)
- Produces: `.btn` hero CTA pointing at wa.me, `.wa-float` anchor in DOM consumed by Task 2 styling.

- [ ] **Step 1: Write the failing check**

Run: `python3 -c "html=open('.worktrees/portfolio/index.html',encoding='utf-8').read(); assert 'Saksham Raj' in html; print('hero branded')"`
Expected: FAIL with AssertionError (name not present yet)

- [ ] **Step 2: Make the 5 edits in `.worktrees/portfolio/index.html`**

Edit 1 — title tag:
```html
<title>Saksham Raj — Video Editor</title>
```
replacing:
```html
<title>ReelCuts — Video Editing for PH Realtors</title>
```

Edit 2 — meta description:
```html
<meta name="description" content="Saksham Raj — video editor. Reels, ads and motion graphics." />
```
replacing:
```html
<meta name="description" content="Listing reels + motion graphics for PH realtors. You shoot on phone, we deliver in 48hrs." />
```

Edit 3 — hero block:
```html
  <header class="hero">
    <h1>Saksham Raj</h1>
    <p>Video Editor — reels, ads &amp; motion graphics.</p>
    <a class="btn" href="https://wa.me/9929977487" target="_blank" rel="noopener">Chat on WhatsApp</a>
  </header>
```
replacing:
```html
  <header class="hero">
    <h1>Video Editing for PH Realtors Only</h1>
    <p>Listing reels + motion graphics — you shoot on phone, we deliver in 48hrs.</p>
    <a class="btn" href="#work">View work</a>
  </header>
```

Edit 4 — footer:
```html
    <p>&copy; 2026 Saksham Raj</p>
```
replacing:
```html
    <p>&copy; 2026 ReelCuts for PH Realtors | IN Team</p>
```

Edit 5 — floating bubble, insert immediately after the closing `</footer>` line:
```html
  <a class="wa-float" href="https://wa.me/9929977487" target="_blank" rel="noopener" aria-label="Chat with Saksham Raj on WhatsApp">💬</a>
```

- [ ] **Step 3: Run check to verify it passes**

Run: `python3 -c "html=open('.worktrees/portfolio/index.html',encoding='utf-8').read(); assert '<h1>Saksham Raj</h1>' in html and html.count('https://wa.me/9929977487')==2 and 'wa-float' in html and 'ReelCuts' not in html and 'PH Realtors Only' not in html; print('PASS: rebrand markup done')"`
Expected: PASS: rebrand markup done

- [ ] **Step 4: Commit**

```bash
git add .worktrees/portfolio/index.html
git -c user.name="opencode" -c user.email="opencode@localhost" commit -m "feat: rebrand hero and footer to Saksham Raj with WhatsApp links"
```

### Task 2: Floating button style + verify + push

**Files:**
- Modify: `.worktrees/portfolio/styles.css` (append one rule)
- Test: python3 asserts + manual browser pass

**Interfaces:**
- Consumes: `.wa-float` anchor from Task 1.
- Produces: styled fixed bubble; verified deployable site pushed to origin.

- [ ] **Step 1: Write the failing check**

Run: `python3 -c "css=open('.worktrees/portfolio/styles.css',encoding='utf-8').read(); assert '.wa-float' in css; print('bubble styled')"`
Expected: FAIL with AssertionError

- [ ] **Step 2: Append to `.worktrees/portfolio/styles.css`**

```css
.wa-float { position: fixed; right: 16px; bottom: 16px; width: 56px; height: 56px; border-radius: 50%; background: #25d366; color: #fff; font-size: 26px; display: flex; align-items: center; justify-content: center; text-decoration: none; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 50; }
```

- [ ] **Step 3: Run checks to verify it passes**

Run: `python3 -c "css=open('.worktrees/portfolio/styles.css',encoding='utf-8').read(); assert '.wa-float' in css and 'position: fixed' in css; js=open('.worktrees/portfolio/videos.js',encoding='utf-8').read(); assert js.count('title:')==35; html=open('.worktrees/portfolio/index.html',encoding='utf-8').read(); assert 'Saksham Raj' in html and html.count('https://wa.me/9929977487')==2; print('PASS: bubble styled, 35 videos intact')"`
Expected: PASS: bubble styled, 35 videos intact

Manual (do not skip):
- Open `.worktrees/portfolio/index.html`: hero shows Saksham Raj, hero button + bubble open https://wa.me/9929977487 in a new tab.
- 35 cards render, filters switch, tapping a thumbnail plays video.
- 360px: no horizontal scroll, bubble does not cover card text.

- [ ] **Step 4: Commit and push**

```bash
git add .worktrees/portfolio/styles.css
git -c user.name="opencode" -c user.email="opencode@localhost" commit -m "feat: style floating WhatsApp button"
git push origin feature/video-portfolio
git fetch origin feature/video-portfolio
git merge origin/feature/video-portfolio --no-edit
git push origin main
```
(Run the merge/push from the main checkout; the worktree branch cannot checkout main.)
