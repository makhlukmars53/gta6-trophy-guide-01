// Leonida Trophy Guide entry for make.fun's gta6-trophy-guide-01 (Node 22, standard library
// only). The guide itself is plain static files in app/ (index.html, style.css, app.js and
// data/trophies.json), written to open in a desktop browser with the network off: it fetches
// nothing at runtime beyond its own data file. This program is only the hand-in step: it
// copies app/ and screenshots/ from beside this file into the output directory and writes
// dossier.json there with the vendored make.fun helper. Do not edit vendor/makefun-frontend.ts:
// the scorer requires dossier.json byte for byte as its own copy of buildDossier writes it.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// Caps from the scorer's own gate (reference/gate.json): text_max_bytes shapes the dossier
// bytes; the rest refuse an entry the scorer would refuse (more than 4 screenshots or one
// over 256 KiB; more than 993 files and directories in app/ or 48 MiB of app files, counted
// beside /output's own 1000-entry cap over app/, screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);
