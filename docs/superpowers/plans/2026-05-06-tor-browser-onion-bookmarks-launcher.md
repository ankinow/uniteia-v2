# Tor Browser Onion Bookmarks and Launcher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a curated set of onion search bookmarks to the existing Tor Browser profile and make Tor Browser appear in the desktop apps menu.

**Architecture:** Treat the Tor Browser profile as the source of truth for bookmarks and keep launcher registration separate from bookmark editing. Use a backup-first workflow for `places.sqlite`, update bookmarks in a single transaction, then register the browser via a desktop entry that points at the extracted Tor Browser directory. Finish with direct validation of the profile contents and launcher visibility.

**Tech Stack:** Tor Browser 15.0.11, SQLite3, Bash, freedesktop `.desktop` entries, Linux desktop menu cache.

---

## Safety Rules

- Back up `places.sqlite` before any write.
- Do not delete the existing Tor Browser profile directory.
- Do not overwrite unrelated user application entries in `~/.local/share/applications`.
- Prefer verified onion URLs already observed in this session.
- Exclude Torch unless a trustworthy onion URL is confirmed later.

## File Map

- Modify: `/home/lermf/Downloads/tor-browser/Browser/TorBrowser/Data/Browser/profile.default/places.sqlite`
- Create or modify: `/home/lermf/.local/share/applications/tor-browser.desktop`
- Optional backup artifact: `/home/lermf/Downloads/tor-browser/Browser/TorBrowser/Data/Browser/profile.default/places.sqlite.bak`
- No repository source files are expected to change.

---

### Task 1: Lock the Bookmark Set

**Files:**
- No file changes
- Test: manual URL check against the sources already confirmed in this session

- [ ] **Step 1: Use the curated list below as the final bookmark set**

```text
DuckDuckGo Onion
https://duckduckgogg42xjoc72x3sjasowoarfbgcmvfimaftt6twagswzczad.onion/

Ahmia
http://juhanurmihxlp77nkq76byazcldy2hlmovfu2epvl5ankdibsot4csyd.onion/

Haystak
http://haystakvxad7wbk5.onion

Haystak Mirror
http://darknetlidvrsli6iso7my54rjayjursyw637aypb6qambkoepmyq2yd.onion

Candle
http://gjobqjj7wyczbqie.onion
```

- [ ] **Step 2: Keep Torch out for now**

Reason: no trustworthy Torch onion URL was confirmed during research.

---

### Task 2: Update the Tor Profile Bookmarks

**Files:**
- Modify: `/home/lermf/Downloads/tor-browser/Browser/TorBrowser/Data/Browser/profile.default/places.sqlite`
- Create: `/home/lermf/Downloads/tor-browser/Browser/TorBrowser/Data/Browser/profile.default/places.sqlite.bak`
- Test: `sqlite3`

- [ ] **Step 1: Back up the current database**

Run:
```bash
cp /home/lermf/Downloads/tor-browser/Browser/TorBrowser/Data/Browser/profile.default/places.sqlite /home/lermf/Downloads/tor-browser/Browser/TorBrowser/Data/Browser/profile.default/places.sqlite.bak
```
Expected: backup file exists and has the same size as the live database.

- [ ] **Step 2: Insert the new bookmarks in one transaction**

Run a single idempotent Python script that updates the existing `Buscadores Onion` folder and adds only the missing bookmark rows. Keep the existing roots intact and reuse the current schema version 86 database layout.

```bash
python3 <<'PY'
import hashlib
import sqlite3
import time
import urllib.parse
from pathlib import Path

db = Path('/home/lermf/Downloads/tor-browser/Browser/TorBrowser/Data/Browser/profile.default/places.sqlite')
folder_title = 'Buscadores Onion'
bookmarks = [
    ('DuckDuckGo Onion', 'https://duckduckgogg42xjoc72x3sjasowoarfbgcmvfimaftt6twagswzczad.onion/'),
    ('Ahmia', 'http://juhanurmihxlp77nkq76byazcldy2hlmovfu2epvl5ankdibsot4csyd.onion/'),
    ('Haystak', 'http://haystakvxad7wbk5.onion'),
    ('Haystak Mirror', 'http://darknetlidvrsli6iso7my54rjayjursyw637aypb6qambkoepmyq2yd.onion'),
    ('Candle', 'http://gjobqjj7wyczbqie.onion'),
]

alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'

def stable_guid(seed: str) -> str:
    n = int.from_bytes(hashlib.sha256(seed.encode('utf-8')).digest()[:16], 'big')
    chars = []
    for _ in range(12):
        chars.append(alphabet[n % 64])
        n //= 64
    return ''.join(chars)

def url_hash(url: str) -> int:
    return int.from_bytes(hashlib.sha256(url.encode('utf-8')).digest()[:4], 'big')

def rev_host(url: str) -> str:
    host = urllib.parse.urlparse(url).hostname or ''
    return host[::-1] + '.'

conn = sqlite3.connect(db)
cur = conn.cursor()
cur.execute('PRAGMA foreign_keys=ON')

folder = cur.execute(
    'SELECT id FROM moz_bookmarks WHERE type = 2 AND title = ? ORDER BY id DESC LIMIT 1',
    (folder_title,)
).fetchone()
if folder is None:
    raise SystemExit(f'missing bookmark folder: {folder_title}')
folder_id = folder[0]

now = int(time.time() * 1_000_000)
next_id = cur.execute('SELECT COALESCE(MAX(id), 0) + 1 FROM moz_bookmarks').fetchone()[0]
next_place_id = cur.execute('SELECT COALESCE(MAX(id), 0) + 1 FROM moz_places').fetchone()[0]

for position, (title, url) in enumerate(bookmarks):
    existing = cur.execute('SELECT id FROM moz_places WHERE url = ?', (url,)).fetchone()
    if existing is None:
        place_id = next_place_id
        next_place_id += 1
        cur.execute(
            'INSERT INTO moz_places (id, url, title, rev_host, visit_count, hidden, typed, frecency, last_visit_date, guid, foreign_count, url_hash, description, preview_image_url, site_name, origin_id, recalc_frecency, alt_frecency, recalc_alt_frecency) VALUES (?, ?, ?, ?, 0, 0, 0, 100, NULL, ?, 1, ?, NULL, NULL, NULL, NULL, 0, NULL, 0)',
            (place_id, url, title, rev_host(url), stable_guid(f'place:{url}'), url_hash(url)),
        )
    else:
        place_id = existing[0]

    bookmark_exists = cur.execute(
        'SELECT 1 FROM moz_bookmarks WHERE fk = ? AND parent = ? LIMIT 1',
        (place_id, folder_id),
    ).fetchone()
    if bookmark_exists is None:
        cur.execute(
            'INSERT INTO moz_bookmarks (id, type, fk, parent, position, title, dateAdded, lastModified, guid, syncStatus, syncChangeCounter) VALUES (?, 1, ?, ?, ?, ?, ?, ?, ?, 0, 1)',
            (next_id, place_id, folder_id, position, title, now, now, stable_guid(f'bookmark:{url}')),
        )
        next_id += 1

conn.commit()
conn.close()
PY
```

Expected: the script exits 0, existing bookmarks stay intact, and only missing search engines are added.

- [ ] **Step 3: Verify the inserted rows**

Run:
```bash
sqlite3 /home/lermf/Downloads/tor-browser/Browser/TorBrowser/Data/Browser/profile.default/places.sqlite "select title, url from moz_places order by id;"
sqlite3 /home/lermf/Downloads/tor-browser/Browser/TorBrowser/Data/Browser/profile.default/places.sqlite "select title, guid from moz_bookmarks where parent = 20 order by position;"
```
Expected: the bookmark list includes DuckDuckGo, Ahmia, Haystak, Haystak Mirror, and Candle under the curated folder, with no duplicate rows.

---

### Task 3: Register Tor Browser in the Apps Menu

**Files:**
- Create or modify: `/home/lermf/.local/share/applications/tor-browser.desktop`
- Test: desktop entry validation and menu lookup

- [ ] **Step 1: Register the app from the Tor Browser root**

Run:
```bash
cd /home/lermf/Downloads/tor-browser && ./start-tor-browser.desktop --register-app
```
Expected: the script writes a desktop entry or updates the existing one without touching the profile database.

- [ ] **Step 2: If registration does not create a menu entry, create a desktop file manually**

Expected desktop entry shape:
```ini
[Desktop Entry]
Type=Application
Name=Tor Browser
GenericName=Web Browser
Comment=Tor Browser is a privacy-focused web browser
Exec=/home/lermf/Downloads/tor-browser/Browser/start-tor-browser
Icon=/home/lermf/Downloads/tor-browser/Browser/browser/chrome/icons/default/default128.png
Categories=Network;WebBrowser;Security;
StartupNotify=true
StartupWMClass=Tor Browser
```

- [ ] **Step 3: Validate the desktop entry**

Run:
```bash
desktop-file-validate /home/lermf/.local/share/applications/tor-browser.desktop
grep -n "Name=Tor Browser\|Exec=/home/lermf/Downloads/tor-browser/Browser/start-tor-browser" /home/lermf/.local/share/applications/tor-browser.desktop
```
Expected: validation passes and the key fields are present.

---

### Task 4: Verify End-to-End Behavior

**Files:**
- No additional file changes expected
- Test: Tor Browser startup and desktop discovery

- [ ] **Step 1: Start Tor Browser once to confirm the profile still loads**

Run:
```bash
MOZ_HEADLESS=1 timeout 20s /home/lermf/Downloads/tor-browser/Browser/start-tor-browser --detach
```
Expected: Tor Browser starts without a profile corruption error.

- [ ] **Step 2: Check the bookmarks database after startup**

Run:
```bash
sqlite3 /home/lermf/Downloads/tor-browser/Browser/TorBrowser/Data/Browser/profile.default/places.sqlite "select count(*) from moz_bookmarks where parent = 20;"
```
Expected: the curated folder contains the expected bookmark count.

- [ ] **Step 3: Confirm the launcher is visible to the desktop shell**

Run:
```bash
grep -R "Tor Browser" /home/lermf/.local/share/applications /usr/share/applications 2>/dev/null
```
Expected: at least one desktop entry advertises Tor Browser.

- [ ] **Step 4: Stop any temporary browser process used for validation**

Run:
```bash
pkill -f "/home/lermf/Downloads/tor-browser/Browser/firefox.real" || true
```
Expected: validation process ends cleanly and no orphan browser remains.
