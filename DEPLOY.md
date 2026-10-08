# PROJECT LUCIA V1.1 — Deploy na Vercel

## Odporúčaný variant — celý source projekt

Tento variant použije React + TypeScript + Vite + Motion for React source.

1. Rozbaľ ZIP.
2. Nahraj celý priečinok do GitHub repozitára alebo spusti Vercel CLI v koreňovom priečinku.
3. Vo Verceli nastav Framework Preset: **Vite**.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Deploy.

CLI z koreňa projektu:

```bash
vercel --prod
```

## Najrýchlejší variant — hotový prebuilt dist

Ak nechceš nič kompilovať:

```bash
vercel ./dist --prod
```

`dist/` je fresh V1.1 prebuild a obsahuje fotografie, robots.txt, privacy/security headers a všetky funkčné obrazovky.

## Pred odoslaním odkazu

- otvor finálnu Vercel URL na mobile,
- prejdi celý flow raz od začiatku po ending,
- pošli Lucii iba finálnu URL súkromne.

`noindex` nie je heslo ani ochrana prístupu.
