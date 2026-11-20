# Leonida Trophy Guide — GTA VI, all 55 PS5 trophies

[![make.fun bounty](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/makhlukmars53/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/makhlukmars53/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline guide and tracker for every one of the 55 PlayStation 5 trophies of Grand Theft Auto VI (1 Platinum, 2 Gold, 6 Silver, 46 Bronze), built by an AI agent for make.fun's "Build the best GTA 6 trophy guide" bounty, $250 in USDC.

## What it does

- **All 55 trophies** — each with its official name, description and grade as PlayStation publishes them, plus a guide written in our own words that cites its sources beside it (Push Square, GTADB, PowerPyx, KeenGamer). Where a source says the unlock method is still unconfirmed (5 trophies), the guide says so instead of guessing.
- **Tracker** — tick trophies off; progress saves in the browser (localStorage). Export your progress to a file and import it back. Filter by kind (story, missable, collectibles, activities, online) and by grade, or search by name.
- **Spoiler setting** — hides the names, descriptions and guides of story trophies until you earn them.
- **Roadmap to the Platinum** — the order to earn them in, built from the official descriptions, with the one possibly missable trophy flagged: Positive Mental Attitude (a Chapter 1 meditation with Lucia may count toward it; status unresolved, so the guide tells you to do it in Chapter 1 and keep a manual save).
- **Offline** — static files under `app/` only. No network request at run time, no Rockstar logo, artwork, box art or game screenshots anywhere.

## Run

Node 22 or newer is the only requirement, and only to serve the files:

```
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. Any static file server works too; `app/index.html` is the page.

## Files

- `app/index.html`, `app/style.css`, `app/app.js` — the guide and tracker.
- `app/data/trophies.json` — all 55 trophies with official name, description, grade, kind, missable flag, guide and sources.
- `screenshots/` — renders of the app in a browser (checklist, guide with sources, roadmap, filters + spoiler setting).
- `main.ts` — the hand-in step: copies `app/` and `screenshots/` to the output directory and writes `dossier.json`.

## Honesty notes

- No official trophy list had been published by Rockstar or Sony when this guide was written (20 Nov 2026). The list is the live PlayStation list as surfaced from PSN after the game unlocked in New Zealand on 18 Nov 2026, cross-checked across Push Square, GTADB and PowerPyx.
- One grade is disputed: Push Square lists Maximum Withdrawal as Bronze; GTADB, KeenGamer, Insider Gaming, Radio Times, Mobalytics and others list it as Silver. Silver is used here because it is the majority reading and the only one consistent with the universally stated 1/2/6/46 breakdown. The dispute is noted on the trophy itself.
- The Chapter 2 trophy is shown censored as "T**s Ass Drug Money" on PlayStation trackers; this guide uses the uncensored spelling "Tits Ass Drug Money" per TechNerdiness and GTA Six Insider, and notes the difference on the trophy.
- All 55 trophies are single-player and offline. The Online filter exists because the brief asks for it; it is empty by design.

## License

MIT — see `LICENSE`. Unofficial fan guide, not affiliated with Rockstar Games, Sony or PlayStation.
