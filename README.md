# Niman — निमन्त्रण

Cinematic, mobile-first wedding invitation websites. One link on WhatsApp → a wax seal, palace gates, every function, maps, RSVPs and music.

**Stack:** Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS 4 · Motion (Framer Motion) · Lenis smooth scroll · React Three Fiber (WebGL lanterns & gold dust) · canvas-confetti.

## Run it

```bash
npm install
npm run dev
```

Open <http://localhost:3000> — it redirects to the demo invite at `/i/arjun-weds-meera`.

Try a personal guest link: `/i/arjun-weds-meera?to=Sharma%20Parivar`

## Deploy (Vercel, recommended)

1. Push this folder to a GitHub repo.
2. On [vercel.com](https://vercel.com) → **Add New Project** → import the repo → **Deploy**. No settings needed.
3. Optional environment variables (Project → Settings → Environment Variables):
   - `NEXT_PUBLIC_SITE_URL` — e.g. `https://niman.in` (used for link previews)
   - `RSVP_WEBHOOK_URL` — Google Sheets webhook (see below)
4. Add your domain under Project → Settings → Domains.

## Add a new couple

1. Copy `src/content/invites/arjun-weds-meera.ts` to e.g. `rohan-weds-priya.ts` and edit every field (names, parents, shloka, events, venue, family, FAQs, RSVP WhatsApp number…).
2. Register it in `src/content/invites/index.ts`.
3. Put their files in `public/invites/rohan-weds-priya/` (songs, photos).
4. Their invite is live at `/i/rohan-weds-priya`. Each guest family gets `/i/rohan-weds-priya?to=Family%20Name`.

Dates use the `+05:30` (IST) offset, and weekdays, countdown, calendar files and Google Calendar links are all generated from them.

## Music (entry song + background song)

```ts
music: {
  entry: { src: "/invites/<slug>/entry.mp3", title: "Din Shagna Da", start: 42, duration: 55 },
  background: { src: "/invites/<slug>/background.mp3", title: "Kudmayi", volume: 0.6 },
},
```

- **entry** plays the moment the guest taps the seal. `start` jumps straight to the hook (in seconds), `duration` is how long it plays (50–60 s works well) before it crossfades into the background song.
- **background** loops for the rest of the visit.
- If a file is missing, a synthesised tanpura + santoor plays instead, so the invite is never silent.
- Use songs you have the rights to use. Bollywood tracks are copyrighted, so for paid client work use the couple's own licensed copy or a licensed/royalty-free track.

## Cinematic entry artwork

The entry can play a rendered gate-opening video instead of the illustrated gate. Prompts, file names and sizes are in [ART-PROMPTS.md](ART-PROMPTS.md). Files go in `public/invites/<slug>/intro/`, and until they exist the illustrated gate is used automatically.

## Story photos

Each chapter in `story.chapters` can take `photo: "/invites/<slug>/story-1.jpg"` (landscape, ~1200×800). Without a photo, an illustrated postcard scene is drawn instead.

## RSVPs → Google Sheets

RSVPs `POST` to `/api/rsvp`, which validates them and forwards them to `RSVP_WEBHOOK_URL`. Guests can also send a copy on WhatsApp.

1. Create a Google Sheet → **Extensions → Apps Script**, paste:

   ```js
   function doPost(e) {
     const d = JSON.parse(e.postData.contents);
     const sheet = SpreadsheetApp.getActive().getSheetByName(d.invite) ||
       SpreadsheetApp.getActive().insertSheet(d.invite);
     if (sheet.getLastRow() === 0) sheet.appendRow(Object.keys(d));
     sheet.appendRow(Object.values(d));
     return ContentService.createTextOutput("ok");
   }
   ```

2. **Deploy → New deployment → Web app**, "Execute as: Me", "Who has access: Anyone". Copy the URL.
3. Set it as `RSVP_WEBHOOK_URL` in Vercel and redeploy. Each couple gets their own tab in the sheet.

Without the variable, RSVPs are only logged on the server, so set it before sending real invites.

## Project map

```
src/app/i/[slug]/         invitation route, metadata, WhatsApp preview image
src/app/api/rsvp/         RSVP endpoint
src/content/invites/      one data file per couple (+ types)
src/content/site.ts       Niman brand, WhatsApp, pricing
src/components/invite/    gate intro, hero, sections, music, RSVP
src/components/three/     WebGL lanterns & gold dust
src/components/ornaments  SVG mandalas, seal, toran, icons
```
