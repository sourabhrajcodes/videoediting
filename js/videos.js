// All 26 videos wired from the shared Drive folder "video edit" (Anyone with
// link). This list is the single source of truth for the portfolio: the page
// builds its filter chips and grids straight from it.
// Embed: https://drive.google.com/file/d/<id>/preview
// A clip belongs to exactly one tag, and the tag decides its box: "Reel" is the
// portrait tag (phone grid), everything else lands in the 16:9 card grid.
// Titles describe the cut rather than numbering it — they were written against
// the clip thumbnails, so a client can tell what they are about to watch.
const VIDEOS = [
  { id: "18kK1xF7hT64k7F0gd5TWLPKQQQ_TtX4Q", title: "Product Demo — UGC Reel", tag: "Reel" },
  { id: "13v-63Tu9HVm_dORtJN5PPe0NHBxeUZrU", title: "Interior Walk-Through — Brand Reel", tag: "Reel" },
  { id: "1embAbKycW_VT-vfSHCXRKGC_KFSsHKGr", title: "Finance Ad — 401(k)", tag: "Ad" },
  { id: "1pUm43wwx0lBLBLjzIwdPp3ZGz50nLeGq", title: "Brand Film — Story Cut", tag: "Branding" },
  { id: "1cvlFQK1PKGGFL06g-boMP7m9MOg8d-pL", title: "Selfie Hook — Close-Up Reel", tag: "Reel" },
  { id: "1QK_PrEUSKrx7rR1Uk3o80bqQQy41Vy5O", title: "Spokesperson Cut — Garden Set", tag: "Motion Graphics" },
  { id: "1HvlaWk3FGWopL1GKwlUnQ07VVVivEJrW", title: "Podcast Cutdown — Vertical Clip", tag: "Reel" },
  { id: "1Z5RHGECUIUvj35ZmnsBEbBmERkeW5_RR", title: "Low-Light Cut — Night Reel", tag: "Reel" },
  { id: "1ER7w5SV9R5bSw878LPv0nApvMMJSubqY", title: "Property Host — Estate Reel", tag: "Reel" },
  { id: "1w9uSVq5oh-Oq-r9y8NYqiBzeiFTP3aZy", title: "Profit Explainer — Captioned Reel", tag: "Reel" },
  { id: "1XzPwoUEj5JtVpwSlU34QM4cZ-_FeqctV", title: "Presenter Cut — Outdoor Reel", tag: "Motion Graphics" },
  { id: "1AIZ8f_fGdF9VfEYfiDLEL-AgyGtW4GnN", title: "Infotik Brand Ad", tag: "Ad" },
  { id: "1WmbIGOloiO3qKvyaftvvnDsxL7uKU6ad", title: "Moto Couple — Campaign Cut", tag: "Motion Graphics" },
  { id: "1WS8b0k1jY3Alvnhzb_PgSomC4GnaQCnf", title: "Quadratic Explainer", tag: "Explainer" },
  { id: "1LbFx-192OoH5HmylO7gQdYmyeYfAWr3B", title: "Signature Showreel", tag: "Reel" },
  { id: "1LiZ8CnNsagxwiHsEHiCZ-L9oMqOl2iDg", title: "Street Reaction — Reel", tag: "Reel" },
  { id: "1yVTzM35FJE9kjPYalfKl6GAQaBu4Swwx", title: "Founder Interview — Reel", tag: "Reel" },
  { id: "1yG-CRhTjZYlsXWjS6uXO3BXlmMmpxtUC", title: "Title Sequence 01", tag: "Motion Graphics" },
  { id: "15ECYxr3iam8oXnKUEQxgT7z-Dlc3iSor", title: "Vertical Cut — Short-Form Reel", tag: "Reel" },
  { id: "1Lduaz9C7ZcYTuuTHA39onSsYQl7LRTei", title: "Bike Ride — Lifestyle Reel", tag: "Reel" },
  { id: "1acvLPJaqp5WAEZluL6nfPTrhlJAE67cc", title: "Behind the Scenes BTS", tag: "Reel" },
  { id: "1P1zKlrcfLPLU6kIb74dmZfZcKmcqc4cO", title: "At-Home Host — Reel", tag: "Reel" },
  { id: "1YTTYknkowto8D9X_USfpd5gS04knId4x", title: "Estate Interiors — Reel", tag: "Reel" },
  { id: "1YT3jsp5WSzyc86Jq81e9iXW87LGPBtd3", title: "Driveway Piece — Reel", tag: "Reel" },
  { id: "18xJtwYxFMG044It3mRynTEZGITk1R-CN", title: "Presenter Piece — Reel", tag: "Reel" },
  { id: "1uShrZvloqXnfzR86Fu18nA_xTsi5D-A9", title: "Brick Wall Intro — Reel", tag: "Reel" },
];

// ── The gallery model the Apple design reads ────────────────────────────────
// Tag -> filter chip. The ids are what css and main.js switch on; "reel" is the
// portrait one, so it is also the only tag that feeds the phone grid.

const CATEGORIES = [
  { id: "reel", label: "Reels" },
  { id: "ad", label: "Ads" },
  { id: "motion", label: "Motion Graphics" },
  { id: "branding", label: "Brand Films" },
  { id: "explainer", label: "Explainers" }
];

const TAG_TO_CATEGORY = {
  "Reel": "reel",
  "Ad": "ad",
  "Motion Graphics": "motion",
  "Branding": "branding",
  "Explainer": "explainer"
};

const DRIVE = "https://drive.google.com";

const PROJECTS = VIDEOS.map((video, i) => {
  const category = TAG_TO_CATEGORY[video.tag] || "reel";
  // Hitting the CDN URL directly skips the drive.google.com ->
  // lh3.googleusercontent.com 302, saving a round trip per thumbnail. Every
  // still is pre-cropped to the box it renders in, so nothing is downloaded
  // that CSS would only throw away.
  const still = (spec) => `https://lh3.googleusercontent.com/d/${video.id}=${spec}`;

  return {
    id: `work-${i + 1}`,
    fileId: video.id,
    title: video.title,
    category,
    client: null,
    embedUrl: `${DRIVE}/file/d/${video.id}/preview`,
    thumbnail: still("w600-h338-c"), // gallery card, 16:9
    thumbnailPhone: still("w600-h1067-c") // phone card, 9:16
  };
});

// The showreel: the clip the hero card shows and the "Watch the showreel"
// button plays. It is the "Signature Showreel" entry, reached by file id so
// retitling the list never breaks it.
const REEL_FILE_ID = "1LbFx-192OoH5HmylO7gQdYmyeYfAWr3B";

const SHOWREEL = {
  title: "Signature Showreel",
  description:
    "One minute of short-form, ads and motion graphics — the cut I send first.",
  embedUrl: `${DRIVE}/file/d/${REEL_FILE_ID}/preview`
};
