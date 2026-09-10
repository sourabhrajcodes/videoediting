#!/usr/bin/env python3
"""
Add Drive IDs to videos.js.
Run: python add_drive_ids.py
Paste a Google Drive share link or file ID for each video.
Press Enter to skip a video (leave blank).
"""
import re
import sys

FILE = "videos.js"

def extract_id(link):
    link = link.strip()
    if not link:
        return ""
    # Full URL: https://drive.google.com/file/d/FILE_ID/preview
    m = re.search(r'drive\.google\.com/file/d/([^/?]+)', link)
    if m:
        return m.group(1)
    # Short URL: https://drive.google.com/open?id=FILE_ID
    m = re.search(r'[?&]id=([^&]+)', link)
    if m:
        return m.group(1)
    # Already just an ID (alphanumeric, no spaces)
    if re.match(r'^[\w-]{10,}$', link):
        return link
    print(f"  Could not parse ID from: {link}")
    return ""

with open(FILE, encoding="utf-8") as f:
    content = f.read()

# Find all empty id: "" entries
entries = re.findall(r'\{ id: "([^"]*)", title: "([^"]*)", tag: "([^"]*)"', content)
empty = [(i, t, tag) for i, (did, t, tag) in enumerate(entries) if not did]

if not empty:
    print("All videos already have IDs!")
    sys.exit(0)

print(f"{len(empty)} videos need Drive IDs.\n")
print("For each video:")
print("  1. Right-click the file in Google Drive")
print("  2. Share -> Anyone with link -> Copy link")
print("  3. Paste the link below\n")

ids_added = 0
for idx, orig_idx, title, tag in empty:
    link = input(f"[{orig_idx+1}] {title} ({tag}): ").strip()
    if not link:
        print("  -> Skipped\n")
        continue
    file_id = extract_id(link)
    if file_id:
        # Replace the empty id for this specific title
        old = f'title: "{title}", tag: "{tag}"'
        new = f'id: "{file_id}", title: "{title}", tag: "{tag}"'
        content = content.replace(old, new, 1)
        print(f"  -> Saved: {file_id}\n")
        ids_added += 1
    else:
        print("  -> Skipped (could not parse ID)\n")

if ids_added:
    with open(FILE, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"\nDone! Updated {ids_added} videos in {FILE}")
else:
    print("\nNo IDs added.")
