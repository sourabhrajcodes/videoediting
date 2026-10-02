// Saksham Raj — portfolio behaviour.
// One file drives the whole page: the filter chips and the two card grids, the
// video lightbox, the nav on a phone, the reply bar, and the contact form.
// It reads VIDEOS/PROJECTS/CATEGORIES/SHOWREEL from js/videos.js.

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const filterBar = document.getElementById("filterBar");
const galleryGrid = document.getElementById("galleryGrid");
const phoneSection = document.getElementById("phoneSection");
const phoneGrid = document.getElementById("phoneGrid");
const aboutStats = document.getElementById("aboutStats");
const contactForm = document.getElementById("contactForm");
const formStatus = document.querySelector(".form-status");
const yearEl = document.getElementById("year");
const lightbox = document.getElementById("lightbox");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxMedia = document.querySelector(".lightbox-media");
const lightboxTitle = document.querySelector(".lightbox-title");
const lightboxMeta = document.querySelector(".lightbox-meta");
const lightboxDesc = document.querySelector(".lightbox-desc");

let activeFilter = "all";
let lastFocused = null;

function categoryLabel(id) {
  const cat = CATEGORIES.find((c) => c.id === id);
  return cat ? cat.label : id;
}

function initials(title) {
  return title
    .split(/\s+/)
    .filter((w) => /[a-zA-Z0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function renderFilters() {
  const chips = [{ id: "all", label: "All" }, ...CATEGORIES];
  chips.forEach(({ id, label }) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip" + (id === activeFilter ? " active" : "");
    chip.textContent = label;
    chip.dataset.filter = id;
    chip.setAttribute("aria-pressed", String(id === activeFilter));
    chip.addEventListener("click", () => {
      activeFilter = id;
      filterBar.querySelectorAll(".chip").forEach((c) => {
        c.classList.remove("active");
        c.setAttribute("aria-pressed", "false");
      });
      chip.classList.add("active");
      chip.setAttribute("aria-pressed", "true");
      renderGallery(id);
    });
    filterBar.appendChild(chip);
  });
}

function makeCard(project, isPhone) {
  const card = document.createElement("article");
  card.className = "card reveal" + (isPhone ? " card-phone" : "");
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Play ${project.title}`);

  const thumb = document.createElement("div");
  thumb.className = "thumb";

  const fallback = document.createElement("span");
  fallback.className = "thumb-fallback";
  fallback.textContent = initials(project.title);

  const img = document.createElement("img");
  img.alt = project.title;
  // loading/decoding must be set BEFORE src, otherwise the browser starts the
  // fetch immediately and lazy-loading never kicks in.
  img.loading = "lazy";
  img.decoding = "async";
  img.src = isPhone ? project.thumbnailPhone : project.thumbnail;
  img.addEventListener("error", () => img.remove());

  const playBadge = document.createElement("span");
  playBadge.className = "play-badge";
  playBadge.textContent = "\u25B6";

  thumb.append(fallback, img);

  if (!isPhone) thumb.appendChild(playBadge);

  const body = document.createElement("div");
  body.className = "card-body";

  const tag = document.createElement("span");
  tag.className = "tag";
  tag.textContent = categoryLabel(project.category);

  const title = document.createElement("h3");
  title.className = "card-title";
  title.textContent = project.title;

  body.append(tag, title);

  if (project.client) {
    const client = document.createElement("p");
    client.className = "card-client";
    client.textContent = project.client;
    body.appendChild(client);
  }

  card.append(thumb, body);

  const open = () => openLightbox(project);
  card.addEventListener("click", open);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  });

  return card;
}

function renderGallery(filterId) {
  galleryGrid.innerHTML = "";
  phoneGrid.innerHTML = "";

  let landscape = [];
  let phones = [];

  if (filterId === "all") {
    phones = PROJECTS.filter((p) => p.category === "reel");
    landscape = PROJECTS.filter((p) => p.category !== "reel");
  } else if (filterId === "reel") {
    phones = PROJECTS.filter((p) => p.category === "reel");
  } else {
    landscape = PROJECTS.filter((p) => p.category === filterId);
  }

  phoneSection.hidden = phones.length === 0;

  landscape.forEach((project) => {
    const card = makeCard(project, false);
    galleryGrid.appendChild(card);
    observeReveal(card);
  });

  phones.forEach((project) => {
    const card = makeCard(project, true);
    phoneGrid.appendChild(card);
    observeReveal(card);
  });
}

function buildEmbedUrl(url) {
  if (url.includes("drive.google.com")) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}autoplay=1&rel=0`;
}

function isPortrait(item) {
  return item.category === "reel";
}

function fillLightbox(item) {
  const portrait = isPortrait(item);
  lightboxMedia.classList.toggle("portrait", portrait);

  const iframe = document.createElement("iframe");
  iframe.src = buildEmbedUrl(item.embedUrl);
  // allow already carries "fullscreen"; setting the legacy allowfullscreen as
  // well only earns a console warning about the two disagreeing.
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen";
  iframe.title = item.title;
  lightboxMedia.innerHTML = "";
  lightboxMedia.appendChild(iframe);

  const fsBtn = document.createElement("button");
  fsBtn.className = "lightbox-fs";
  fsBtn.setAttribute("aria-label", "Fullscreen");
  fsBtn.textContent = "\u26F6";
  fsBtn.addEventListener("click", () => {
    if (document.fullscreenElement === lightboxMedia) {
      document.exitFullscreen();
    } else {
      (lightboxMedia.requestFullscreen || lightboxMedia.webkitRequestFullscreen || (() => iframe.requestFullscreen())).call(lightboxMedia).catch(() => {
        if (iframe.requestFullscreen) iframe.requestFullscreen().catch(() => {});
      });
    }
  });
  lightboxMedia.appendChild(fsBtn);

  lightboxTitle.textContent = item.title;
  lightboxDesc.textContent = item.description || "";

  const metaParts = [item.client, item.year, item.duration].filter(Boolean);
  lightboxMeta.textContent = metaParts.join(" \u00B7 ");
  lightboxMeta.style.display = metaParts.length ? "" : "none";
}

// Registered once, not per open: a fresh listener on every lightbox open would
// accumulate forever, each one holding a detached button alive.
document.addEventListener("fullscreenchange", () => {
  const btn = lightboxMedia.querySelector(".lightbox-fs");
  if (btn) {
    btn.textContent = document.fullscreenElement === lightboxMedia ? "\u2715" : "\u26F6";
  }
});

let scrollY = 0;

function openLightbox(item) {
  lastFocused = document.activeElement;
  scrollY = window.scrollY;
  // Reveal before filling, and drop the overlay blur: the player needs real
  // layout to initialise against, and a backdrop blur behind it forces the
  // whole overlay to repaint at the video's framerate.
  lightbox.hidden = false;
  lightbox.classList.add("is-video");
  fillLightbox(item);
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = "100%";
  document.body.style.overflow = "hidden";
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  lightbox.classList.remove("is-video");
  lightboxMedia.innerHTML = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  document.body.style.overflow = "";
  window.scrollTo(0, scrollY);
  if (lastFocused) lastFocused.focus();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!lightbox.hidden) closeLightbox();
    else if (navLinks.classList.contains("open")) {
      navLinks.classList.remove("open");
      document.body.classList.remove("menu-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.focus();
    }
  }
});

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

lightboxClose.addEventListener("click", closeLightbox);

// Finishing a video is the strongest buying signal on the page, so the
// lightbox carries its own route back to the form.
const lightboxQuote = document.getElementById("lightboxQuote");
if (lightboxQuote) lightboxQuote.addEventListener("click", closeLightbox);

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  document.body.classList.toggle("menu-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    document.body.classList.remove("menu-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("click", (e) => {
  if (
    navLinks.classList.contains("open") &&
    !navLinks.contains(e.target) &&
    !navToggle.contains(e.target)
  ) {
    navLinks.classList.remove("open");
    document.body.classList.remove("menu-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900 && navLinks.classList.contains("open")) {
    navLinks.classList.remove("open");
    document.body.classList.remove("menu-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

let touchStartY = 0;
lightbox.addEventListener(
  "touchstart",
  (e) => {
    touchStartY = e.touches[0].clientY;
  },
  { passive: true }
);
lightbox.addEventListener(
  "touchmove",
  (e) => {
    const delta = e.touches[0].clientY - touchStartY;
    if (delta > 80 && e.target === lightbox) closeLightbox();
  },
  { passive: true }
);

const showreelBtn = document.getElementById("showreelBtn");
showreelBtn.addEventListener("click", () => openLightbox(SHOWREEL));

// The Apple design's floating hero card shows the showreel, so the biggest
// thing on the page is the work itself rather than a promise about it.
const hfReel = document.getElementById("hfReel");
if (hfReel) hfReel.addEventListener("click", () => openLightbox(SHOWREEL));

// The client band is a set of play buttons, not outbound links: each one opens
// the piece that was made for that brand, so the credit can be checked in one
// click. Cards carry the Drive file id, so retitling never breaks the wiring.
document.querySelectorAll("[data-play-id]").forEach((btn) => {
  const project = PROJECTS.find((p) => p.fileId === btn.dataset.playId);
  if (!project) return;
  btn.addEventListener("click", () => openLightbox(project));
});

// The reply bar keeps out of the way until the visitor has started browsing,
// and steps aside while the contact section is on screen so it never competes
// with the form it is pointing at.
const floatCta = document.getElementById("floatCta");
const heroSection = document.getElementById("home");
const contactSection = document.getElementById("contact");

if (floatCta && heroSection && contactSection) {
  // Measured against the viewport rather than observed: the contact section is
  // several screens tall, so any "percent visible" rule keeps the bar on screen
  // over the very form it is pointing at. Two rect reads per scroll event, run
  // straight away rather than on requestAnimationFrame, which browsers are free
  // to stop running — the bar must never get stuck on screen because of it.
  const syncFloatCta = () => {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const heroPassed = heroSection.getBoundingClientRect().bottom <= vh * 0.15;
    const atContact = contactSection.getBoundingClientRect().top <= vh * 0.45;
    floatCta.classList.toggle("is-in", heroPassed && !atContact);
  };

  window.addEventListener("scroll", syncFloatCta, { passive: true });
  window.addEventListener("resize", syncFloatCta);
  syncFloatCta();
}

let observer = null;

function observeReveal(el) {
  if (!observer) return;
  observer.observe(el);
}

if ("IntersectionObserver" in window) {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
}

document.querySelectorAll(".reveal").forEach(observeReveal);

// Counted from the portfolio itself, so these stay true as clips are added or
// retired: the number of edits and the number of formats are read straight from
// the data rather than typed in. The reel turnaround is the one quoted in the
// FAQ.
const STATS = [
  { value: String(VIDEOS.length), suffix: "", label: "Edits online" },
  { value: String(CATEGORIES.length), suffix: "", label: "Formats edited" },
  { value: "24\u201348", suffix: "h", label: "Reel turnaround" }
];

STATS.forEach(({ value, suffix, label }) => {
  const stat = document.createElement("div");
  stat.className = "stat";
  const b = document.createElement("b");
  b.append(value);
  if (suffix) {
    const em = document.createElement("em");
    em.textContent = suffix;
    b.appendChild(em);
  }
  const small = document.createElement("small");
  small.textContent = label;
  stat.append(b, small);
  aboutStats.appendChild(stat);
});

// Brief chips: one tap writes the opening line of the message and the subject,
// so replying costs the client nothing but their details.
const briefChips = document.getElementById("briefChips");
const briefMessage = document.getElementById("cf-message");
const briefSubject = contactForm.querySelector('input[name="_subject"]');
const GENERATED_BRIEF = /^Project: [^\n]*(\n\n?)?/;
const DEFAULT_SUBJECT = "New Saksham Raj inquiry";

function resetBrief() {
  if (!briefChips) return;
  briefChips.querySelectorAll(".brief-chip").forEach((chip) => {
    chip.classList.remove("is-on");
    chip.setAttribute("aria-pressed", "false");
  });
  if (briefSubject) briefSubject.value = DEFAULT_SUBJECT;
}

if (briefChips && briefMessage) {
  const chips = Array.prototype.slice.call(
    briefChips.querySelectorAll(".brief-chip")
  );

  const syncBrief = () => {
    const picked = chips
      .filter((chip) => chip.classList.contains("is-on"))
      .map((chip) => chip.dataset.brief);
    const typed = briefMessage.value.replace(GENERATED_BRIEF, "");
    briefMessage.value = picked.length
      ? `Project: ${picked.join(" + ")}\n\n${typed}`
      : typed;
    if (briefSubject) {
      briefSubject.value = picked.length
        ? `Saksham Raj inquiry — ${picked.join(", ")}`
        : DEFAULT_SUBJECT;
    }
  };

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chip.classList.toggle("is-on");
      chip.setAttribute("aria-pressed", String(chip.classList.contains("is-on")));
      syncBrief();
      briefMessage.focus();
    });
  });

  // An empty message is blocked by the browser before our submit handler ever
  // runs, so keep the chips reachable: point at them rather than just
  // refusing the click.
  briefMessage.addEventListener("invalid", () => {
    briefChips.classList.add("is-nudged");
    window.setTimeout(() => briefChips.classList.remove("is-nudged"), 1800);
  });
}

const FORM_INBOX = "sakshamraj730@gmail.com";

function setFormStatus(kind, text) {
  formStatus.className = "form-status " + kind;
  formStatus.textContent = text;
}

// Last resort when the form service is unusable: build the message they were
// already trying to send, so their typing is never dropped on the floor.
function offerMailtoDraft(payload, intro) {
  const lines = [];
  if (payload.name) lines.push("Name: " + payload.name);
  if (payload.email) lines.push("Email: " + payload.email);
  lines.push("", payload.message || "");

  const draft =
    "mailto:" +
    FORM_INBOX +
    "?subject=" +
    encodeURIComponent(payload._subject || DEFAULT_SUBJECT) +
    "&body=" +
    encodeURIComponent(lines.join("\n").trim());

  setFormStatus("err", intro + " ");
  const link = document.createElement("a");
  link.className = "form-draft";
  link.href = draft;
  link.textContent = "Open a ready-to-send email";
  formStatus.append(link);
  formStatus.append(
    document.createTextNode(" (your details are already filled in).")
  );
}

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const action = contactForm.getAttribute("action") || "";

  const payload = Object.fromEntries(new FormData(contactForm).entries());
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const submitLabel = submitBtn ? submitBtn.textContent : "";
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
  }

  try {
    const res = await fetch(action, {
      method: "POST",
      body: new FormData(contactForm),
      headers: { Accept: "application/json" }
    });

    // The service can answer 200 OK and still refuse to send - an inbox that
    // has not been activated is the usual reason - so res.ok on its own would
    // report "sent" for a message that never left. Read the body too.
    let data = null;
    try {
      data = await res.json();
    } catch (err) {
      data = null;
    }
    const refused =
      data && data.success !== undefined && String(data.success) !== "true";

    if (!res.ok || refused) {
      throw new Error((data && data.message) || "HTTP " + res.status);
    }

    setFormStatus("ok", "Message sent! I'll get back to you soon.");
    contactForm.reset();
    resetBrief();
  } catch (err) {
    // A visitor cannot fix an un-activated inbox, so keep the service's
    // internal wording out of their way: log it for the owner and route
    // around it with a draft they can send in one tap.
    console.warn("[Saksham Raj] form service refused:", err && err.message);
    offerMailtoDraft(payload, "That didn't go through.");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = submitLabel;
    }
  }
});

yearEl.textContent = new Date().getFullYear();

renderFilters();
renderGallery(activeFilter);
