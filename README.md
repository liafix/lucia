# PROJECT LUCIA V1.1 — Vercel Ready

Prémiová, mobile-first romantická interaktívna mini-hra. Zdrojová aplikácia zostáva React + TypeScript + Vite + Tailwind CSS + Motion for React + Lucide React.

## Čo je nové vo V1.1

- nový cinematic photo interlude medzi introm a Heart Collectorom
- použité obe dodané fotografie bez identifikovania osôb
- fotografie sú lokálne optimalizované do WebP a bez EXIF metadát
- layered editorial/polaroid kompozícia + jemný blurred photo backdrop
- Heart Collector V2: click/touch feedback, particle burst, animovaný counter a 5/5 reveal
- nová Srdcová bilancia: `100 % / 1 / ?`
- finálna otázka: „Lucia, pôjdeš so mnou niekedy na kávu?“
- opravený tvar `pokecem` → `pokecom` v source aj produkčnej verzii
- tri rešpektujúce endingy, copy-to-clipboard a restart
- noindex/nofollow, bez analytiky, cookies, backendu alebo ukladania odpovedí
- mobile layout overený aj pri 320 px šírke

## Flow

1. Ahoj, Lucia.
2. Trochu osobnejšie — dve cinematic photo cards.
3. Heart Collector — 5 srdiečok.
4. Srdcová bilancia.
5. Pozvánka s tromi férovými možnosťami.
6. Personalizovaný ending + pripravená odpoveď.

## Zdrojový stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Motion for React
- Lucide React
- Vitest + Testing Library

## Lokálny development

```bash
npm install
npm run dev
```

Testy:

```bash
npm test
```

Štandardný Vite production build:

```bash
npm run build
```

## Fresh prebuilt `dist/`

Balík obsahuje aj čerstvo vygenerovaný `dist/` pre okamžitý deploy. V tomto pracovnom runtime nie je dostupný npm registry, preto sa `dist/` generuje deterministickým dependency-free príkazom:

```bash
npm run build:offline
```

Tento prebuild vzniká z `src/runtime/*`, `public/*` a `vercel.json`; nie je to starý skopírovaný build. Source React/TypeScript verzia obsahuje Motion for React. Pri štandardnom Vercel/GitHub builde sa používa `npm run build` a teda Vite + Motion source.

## Fotografie

- `public/photos/moment-01.webp` — 900×1567, približne 57 KB
- `public/photos/moment-02.webp` — 820×1443, približne 59 KB

Fotografie nie sú použité ako OpenGraph/social preview. Stránka nemá tracking ani externý image hosting.

## Privacy

`robots.txt`, meta robots a `X-Robots-Tag` blokujú indexovanie. Toto však nie je access control: `.vercel.app` URL môže otvoriť každý, kto ju pozná. Odkaz preto zdieľaj súkromne a pri fotografiách ďalších osôb počítaj s tým, že nasadením na verejnú URL budú technicky dostupné cez odkaz.

Podrobný deploy je v `DEPLOY.md`; výsledky kontroly sú v `QA_REPORT.md`.
