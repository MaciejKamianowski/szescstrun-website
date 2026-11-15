# Deployment — szescstrun.pl

## Rekomendowana architektura

Domena jest u rejestratora **Zenbox.pl**. Nie zakładamy hostingu Node.js w Zenbox.

Stabilny, prosty układ produkcyjny:

| Warstwa | Rekomendacja | Alternatywa |
| --- | --- | --- |
| Aplikacja Next.js + Payload | **Railway**, **Render** lub **Fly.io** (kontener / Node) | Vercel (działa, ale Payload + Postgres wymaga uważnej konfiguracji serverless) |
| PostgreSQL | Managed Postgres u tego samego dostawcy lub **Neon** / **Supabase** | |
| Media | **Cloudflare R2** (S3-compatible) przez `@payloadcms/storage-s3` | Inny S3 |
| DNS / domena | Zostaje w Zenbox; wskazujesz A/CNAME na hosting aplikacji | |
| HTTPS | Certyfikat u hosta aplikacji (Let's Encrypt / managed TLS) | Cloudflare proxy (opcjonalnie) |

**Nie** wymuszamy Cloudflare Workers: adaptery Payload/Postgres nie są tu celem.

## Przed zmianą DNS

Sprawdź istniejące rekordy poczty i **nie usuwaj ich** bez potrzeby:

- MX
- SPF (`TXT`)
- DKIM
- DMARC

Zmiany DNS wykonuj dopiero po uzgodnieniu i po działającym deployu.

## Zmienne środowiskowe (produkcja)

Skopiuj z `.env.example` i uzupełnij:

```bash
DATABASE_URL=postgresql://...
PAYLOAD_SECRET=...                # unikalny, długi sekret
NEXT_PUBLIC_SERVER_URL=https://www.szescstrun.pl
# Opcjonalnie (runtime, bez rebuild): SERVER_URL=https://www.szescstrun.pl

# Resend — dopiero po statusie Verified dla domeny mail.szescstrun.pl
RESEND_API_KEY=...
CONTACT_EMAIL_TO=...              # skrzynka Jacka (odbiorca formularza)
EMAIL_FROM="Sześć Strun <formularz@mail.szescstrun.pl>"

# Cloudflare R2 — media (Payload @payloadcms/storage-s3)
R2_BUCKET=szescstrun-media
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
R2_REGION=auto
R2_FORCE_PATH_STYLE=true
# Publiczny odczyt (NIE endpoint API):
R2_PUBLIC_URL=https://pub-<id>.r2.dev
# albo później: https://media.szescstrun.pl
```

## Migracje

Lokalnie (dev) Payload używa `push` schematu do Postgres (`push: true` gdy `NODE_ENV !== 'production'`).

Na produkcji ustaw `NODE_ENV=production` (wyłącza push). Migracje **nie mogą** działać podczas `docker build` / `next build` — prywatny host Railway (`*.railway.internal`) jest niedostępny w fazie budowania obrazu.

### Railway (Docker)

1. `DATABASE_URL` zostaje prywatne: `${{Postgres.DATABASE_URL}}` (bez publicznego proxy).
2. Build obrazu (`Dockerfile`) uruchamia wyłącznie `pnpm build` — bez migracji i bez Postgresa.
3. **Pre-Deploy Command** (Config as Code: `railway.toml` / `railway.json`, albo ręcznie w UI):

```bash
sh ./scripts/run-migrations.sh
```

   W Railway UI (Settings → Deploy → Pre-deploy Command) wklej dokładnie tę komendę.
   W Config as Code musi być **tablica**, np.:

```toml
preDeployCommand = ["sh ./scripts/run-migrations.sh"]
```

   Równoważnie wewnątrz skryptu:

```bash
node ./node_modules/payload/bin.js migrate
```

   - działa po zbudowaniu obrazu,
   - ma dostęp do prywatnej sieci Railway,
   - **nie** pobiera zależności z internetu (używa `node_modules` z obrazu),
   - błąd migracji zatrzymuje deployment.
   - W logach deployu szukaj kroku **Pre-deploy** i linii `[migrate] Starting Payload migrations`.

4. Start aplikacji: `node server.js` (standalone).

> Nie używaj `pnpm exec payload migrate` w Pre-deploy — Corepack może próbować pobrać pnpm z npm registry.

### Lokalnie / ręcznie

```bash
pnpm payload migrate:create   # tylko gdy zmieniasz schemat (oficjalny generator)
pnpm migrate                  # lokalnie
# albo tak jak na Railway:
pnpm migrate:prod
pnpm build
pnpm start
```

Migracje w repo:

- `src/migrations/20261115_123647_initial.ts` — pełny schemat (kolekcje + `site_settings`)
- `src/migrations/20261115_125220_add_site_logos.ts` — pola logo w ustawieniach
- `src/migrations/20261115_144144_add_media_r2_storage_fields.ts` — kolumny R2/S3 w `media` (`prefix`, `_objectkey`)

Bezpieczeństwo: nigdy `migrate:fresh` / `migrate:reset` / `migrate:refresh` na produkcji.

## Storage mediów (Cloudflare R2)

Projekt używa oficjalnego `@payloadcms/storage-s3` (bez równoległego uploadera).

### Wymagane zmienne (serwerowe)

| Zmienna | Opis |
| --- | --- |
| `R2_BUCKET` | np. `szescstrun-media` |
| `R2_ACCESS_KEY_ID` | Access Key ID tokenu R2 |
| `R2_SECRET_ACCESS_KEY` | Secret Access Key |
| `R2_ENDPOINT` | `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` (tylko API S3) |
| `R2_REGION` | `auto` |
| `R2_FORCE_PATH_STYLE` | `true` (domyślnie) |
| `R2_PUBLIC_URL` | Publiczny CDN / `*.r2.dev` **bez** trailing slash |

Aliasy `S3_*` nadal działają jako fallback.

### Publiczny odczyt

1. W Cloudflare R2 włącz **Public access** (R2.dev subdomain) albo podłącz custom domain.
2. Ustaw `R2_PUBLIC_URL` na ten adres (np. `https://pub-xxxxx.r2.dev`).
3. **Nigdy** nie wstawiaj `R2_ENDPOINT` (`*.r2.cloudflarestorage.com`) jako URL obrazów.

Bez `R2_PUBLIC_URL` aplikacja działa w trybie **proxy**: przeglądarka bierze pliki z `/api/media/file/…`, a serwer pobiera je z R2 przy użyciu kluczy (bezpieczne, ale wolniejsze).

Logo i zdjęcie Jacka w `public/images/` pozostają plikami statycznymi — nie trzeba ich przenosić do R2.

Bez R2 media lokalne trafiają do `/media` na dysku — **nie** używaj tego na Railway (dysk efemeryczny).

## Domeny (Zenbox)

1. Zostaw domenę w Zenbox.
2. U hosta aplikacji dodaj custom domain `szescstrun.pl` (+ opcjonalnie `www`).
3. W Zenbox ustaw rekordy zgodnie z instrukcją hosta (A/AAAA lub CNAME).
4. Włącz HTTPS u hosta.
5. Ustaw `NEXT_PUBLIC_SERVER_URL=https://www.szescstrun.pl` (oraz opcjonalnie `SERVER_URL` na runtime).

## Pierwszy administrator

1. Wejdź na `https://szescstrun.pl/admin`.
2. Utwórz pierwsze konto (tylko gdy baza nie ma użytkowników).
3. Ustaw rolę `admin`.
4. Kolejne konta twórz wyłącznie z panelu (brak publicznej rejestracji).

## Checklist przed startem

- [ ] Polityka prywatności uzupełniona w CMS
- [ ] Dane kontaktowe w ustawieniach
- [ ] Realny cennik aktywowany
- [ ] Zdjęcie nauczyciela podpięte
- [ ] Resend zweryfikowany (domena nadawcy)
- [ ] Backup bazy i mediów zaplanowany
- [ ] DNS poczty nienaruszone

## Kopie zapasowe

- **Baza:** codzienne snapshoty managed Postgres + okazjonalny `pg_dump`
- **Media:** versioning / replikacja bucketa R2
- Przed aktualizacją aplikacji zawsze backup DB

## Aktualizacja aplikacji

```bash
git pull
pnpm install
pnpm payload migrate
pnpm build
# restart procesu / kontenera
```

## Zenbox — co zostaje lokalnie

- Rejestracja domeny
- Rekordy DNS (po wskazaniu na hosting aplikacji)
- Ewentualna poczta firmowa (MX/SPF/DKIM/DMARC)

Hosting aplikacji Node/Postgres — poza Zenbox, o ile Zenbox nie oferuje kompatybilnego Node + Postgres pod Payload.
