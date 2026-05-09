# Digital Commonplacebook
Tracker and digital notebook to keep all your thoughts and stuff you consume like book, games, movies, etc in one place. Also helpful if you want to be more conscious of what you consume.

<br>
<img width="960" height="444" alt="image" src="https://github.com/user-attachments/assets/8b378c4c-783f-45a6-ab96-be654b7d712b" />
<br>

A personal digital commonplace book built with vanilla HTML, CSS and JavaScript. Vaporwave aesthetic, retro OS-inspired, JSON-driven. No frameworks, no build tools — just files.

How to use it? Basically you edit the .json that corresponds to certain "page" of the commonplace book. Also the commonplace book takes information externally with cjs scripts for goodreads recent books review and status from statuscafe (similar to twitter but is a lot better and retro). 

I tried to use a script to extract a .json from a backloggd account but it didn't work. If anyone would like to know how to implement it, i'll appreciate it.

**Live demo:** [starmoon.nekoweb.org/commonplace_book.html](https://starmoon.nekoweb.org/commonplace_book.html)

---

## What's inside

| Tab | Data source | Description |
|-----|-------------|-------------|
| 📊 Tracklist | `tracklist.json` | Everything you're currently consuming |
| 📝 Recent Books | Goodreads RSS | Auto-fetched from your Goodreads account |
| 📚 Biblioteca | `biblioteca.json` | Every book you've ever read, with full review |
| ✍️ Writings | `writings.json` | Poems, stories, thoughts |
| 💭 Microblogs | `microblogs.json` | Short status entries with mood bars |
| 🌟 Short Thoughts | `statusfeed.json` | Generated from status.cafe |
| 🎵 Songs | `songs.json` | Favorite songs with translations |
| 📓 Study Log | `studylog.json` | Language & course progress tracker |
| 🗾 日本語 | `studylog.json` | Filtered study log for Japanese |

---

## Setup

1. Clone or download the repo
2. Upload all files to your hosting (Nekoweb, Neocities, etc.)
3. Edit the JSON files with your own data (see below)
4. For Goodreads and status.cafe: run the generator scripts locally then upload the output JSON

---

## JSON Reference

### `tracklist.json`

What you're currently reading, playing, watching or listening to.

```json
[
  {
    "emoji": "📖",
    "title": "Book or game title",
    "subtitle": "Author or developer",
    "genres": ["fiction", "cozy"],
    "hook": "Why you're into it right now",
    "chapter": "Ch. 12 / Episode 3",
    "progress": 45,
    "status": "reading",
    "state": "ongoing",
    "link": "https://example.com"
  }
]
```

| Field | Required | Values |
|-------|----------|--------|
| `emoji` | no | any emoji |
| `title` | **yes** | string |
| `subtitle` | no | author, dev, artist |
| `genres` | no | array of strings |
| `hook` | no | short phrase, italic in table |
| `chapter` | no | current chapter/episode |
| `progress` | no | 0–100 (renders as bar) |
| `status` | no | `reading` `playing` `watching` `listening` `done` `paused` |
| `state` | no | `ongoing` `completed` |
| `link` | no | URL |

---

<img width="1916" height="884" alt="image" src="https://github.com/user-attachments/assets/b836fb41-474f-4a9b-b0e1-8f1556c97f1b" />

### `biblioteca.json`

Every book you've finished reading, with full review data.

```json
[
  {
    "slug": "the-midnight-library",
    "title": "The Midnight Library",
    "author": "Matt Haig",
    "genre": "Fiction",
    "year": 2020,
    "pages": 304,
    "format": "book",
    "emoji": "📚",
    "cover": "img/covers/midnight-library.jpg",
    "month": "Jan 2026",
    "ribbon": "favorite",
    "rating": 5,
    "startDate": "2026-01-03",
    "endDate": "2026-01-10",
    "wouldRead": "yes",
    "stars": {
      "overall": 5,
      "writing": 4,
      "emotional": 5,
      "spice": 0,
      "characters": 5,
      "cover": 4,
      "plot": 4,
      "intrigue": 4,
      "ending": 3
    },
    "summary": "Brief plot summary here.",
    "quote": "Your favorite quote from the book.",
    "quoteAuthor": "Matt Haig",
    "thoughts": "Your personal thoughts and feelings about the book."
  }
]
```

| Field | Required | Notes |
|-------|----------|-------|
| `slug` | no | URL-friendly ID for direct linking (auto-generated from title if missing) |
| `title` | **yes** | |
| `author` | no | |
| `genre` | no | |
| `format` | no | `book` `audio` `e-book` |
| `cover` | no | path to image — if missing shows emoji |
| `ribbon` | no | `favorite` (gold) or any string (magenta) |
| `rating` | no | 1–5, shows stars |
| `wouldRead` | no | `yes` `no` `have` |
| `stars` | no | all sub-fields optional, 0–5 |
| `summary` | no | shown on left page of review |
| `quote` | no | shown on right page |
| `thoughts` | no | shown on right page |

---

### `writings.json`

Your own poems, stories, reflections, essays.

```json
[
  {
    "id": "poem-001",
    "type": "writing",
    "writingType": "poem",
    "title": "Title of the poem",
    "date": "2026-03-15",
    "body": "Line one of your poem\nLine two\nLine three",
    "thoughts": "Why you wrote this, what it means to you.",
    "linked_titles": ["Another Writing Title"]
  }
]
```

| Field | Required | Notes |
|-------|----------|-------|
| `writingType` | no | `poem` `story` `essay` `reflection` — shown as label |
| `body` | no | the actual text content |
| `linked_titles` | no | array of other writing titles this connects to |

---

### `songs.json`

Songs you love, with translations and meaning.

```json
[
  {
    "type": "song",
    "title": "Song title in original language",
    "artist": "Artist name",
    "album": "Album name",
    "year": 2020,
    "language": "Japanese",
    "translation": "English translation of the title",
    "body": "A verse or fragment you love, with translation notes.",
    "thoughts": "Why this song means something to you.",
    "link": "https://youtube.com/..."
  }
]
```

---

### `microblogs.json`

Short diary-style entries with mood and activity bars.

```json
[
  {
    "date": "21/Apr/2026",
    "mood": { "value": 80, "label": "happy" },
    "stats": [
      { "icon": "🎮", "label": "GAMING", "value": 90, "text": "playing" },
      { "icon": "🌿", "label": "RELAX",  "value": 60, "text": "60%" }
    ],
    "thought": "Optional free text entry for the day."
  }
]
```

| Field | Required | Notes |
|-------|----------|-------|
| `mood.value` | no | 0–100, renders as progress bar |
| `mood.label` | no | any string |
| `stats` | no | array — each becomes a labeled bar |
| `stats[].value` | no | 0–100 |
| `stats[].text` | no | label shown at the end of the bar |
| `thought` | no | if empty, no text block is shown |

All fields are optional. An entry with just a `date` is valid.

---

<img width="1919" height="878" alt="image" src="https://github.com/user-attachments/assets/285c3674-7e5c-4c8e-86ea-7fcda5e003ae" />


### `studylog.json`

Log of study sessions for languages or any course.

```json
[
  {
    "id": "jp-001",
    "date": "21/Apr/2026",
    "subject": "日本語",
    "topic": "Grammar: て-form",
    "source": "Bunpro",
    "sourceType": "read",
    "emoji": "🗾",
    "images": ["img/study/session01.jpg"],
    "ratings": {
      "concentration": 4,
      "difficulty": 3,
      "learned": 5,
      "newThings": 4,
      "productive": 5,
      "enjoyed": 4
    },
    "summary": "Summary of what you studied.",
    "favorites": "The most interesting thing you learned.",
    "thoughts": "How you felt about the session."
  }
]
```

| Field | Required | Notes |
|-------|----------|-------|
| `subject` | no | entries with `"日本語"` auto-appear in the 日本語 tab |
| `sourceType` | no | `read` `listen` `video` — shows an icon |
| `images` | no | array of paths — renders as clickable square gallery |
| `ratings` | no | all sub-fields 0–5, show as dot ratings |

All fields optional. Missing fields show as N/A.

---

### `statusfeed.json` (generated)

Auto-generated from your status.cafe profile. **Do not edit manually** — run the generator instead.

```bash
node generate-statusfeed.cjs
```

Output format:
```json
[
  { "text": "Your status text", "mood": "😊", "date": "2026-04-21" }
]
```

To change to a different status.cafe account: open `generate-statusfeed.cjs` and change:
```js
const USERNAME = 'your_username_here';
```

---

## Goodreads setup

The Recent Books tab fetches from a public Goodreads RSS feed. To configure your own account:

1. Find your Goodreads user ID — go to your profile, the URL is `goodreads.com/user/show/XXXXXXX-yourname`. The number is your ID.
2. In `commonplace_book.html`, find:
```js
const GR_RSS = 'https://www.goodreads.com/review/list_rss/28477539?shelf=read...';
```
3. Replace `28477539` with your ID.

Your Goodreads shelf must be set to **public** in your account privacy settings.

---

## File structure

```
your-site/
├── commonplace_book.html     ← main file
├── tracklist.json
├── biblioteca.json
├── writings.json
├── songs.json
├── microblogs.json
├── studylog.json
├── statusfeed.json           ← generated, upload after running script
├── generate-statusfeed.cjs   ← run locally to update statusfeed.json
└── img/
    └── covers/               ← book cover images for biblioteca
```

---

## Customization

**Colors** — edit the CSS variables at the top of the file:
```css
:root {
  --cyan:    #00ffff;
  --magenta: #ff00ff;
  --bg:      #080818;
  --bg2:     #0d0d20;
  --bg3:     #0a0a1e;
}
```

**Adding a new tab** — duplicate an existing `content-panel` div, add a matching `tab-item` in the left nav, and create a fetch + render function in the script.

**Disabling a tab** — remove the `tab-item` from the nav and the corresponding `content-panel` div. The JSON file can stay, it just won't be loaded.

---

## License

Feel free to use this as a base for your own commonplace book. If you do, a link back to [starmoon.nekoweb.org](https://starmoon.nekoweb.org) is appreciated but not required. ★
