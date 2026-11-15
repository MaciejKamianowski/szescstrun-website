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
NEXT_PUBLIC_SERVER_URL=https://szescstrun.pl

RESEND_API_KEY=...
CONTACT_EMAIL_TO=...              # skrzynka Jacka
EMAIL_FROM="Sześć Strun <noreply@twoja-domena.pl>"

S3_BUCKET=...
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_ENDPOINT=https://<accountid>.r2.cloudflarestorage.com
S3_REGION=auto
S3_FORCE_PATH_STYLE=true
S3_PUBLIC_URL=https://media.szescstrun.pl   # lub *.r2.dev
```

## Migracje

Lokalnie (dev) Payload używa `push` schematu do Postgres.

Na produkcji ustaw `NODE_ENV=production` (wyłącza push) i użyj migracji:

```bash
pnpm payload migrate:create
pnpm payload migrate
```

W CI / starcie kontenera:

```bash
pnpm ci   # migrate + build
```

## Storage mediów

1. Utwórz bucket R2.
2. Włącz publiczny dostęp (custom domain lub r2.dev).
3. Utwórz API token z uprawnieniami Object Read & Write.
4. Ustaw zmienne `S3_*` / `S3_PUBLIC_URL`.

Bez S3 media zapisują się lokalnie w `/media` — **nie nadaje się** do efemerycznych dysków PaaS.

## Domeny (Zenbox)

1. Zostaw domenę w Zenbox.
2. U hosta aplikacji dodaj custom domain `szescstrun.pl` (+ opcjonalnie `www`).
3. W Zenbox ustaw rekordy zgodnie z instrukcją hosta (A/AAAA lub CNAME).
4. Włącz HTTPS u hosta.
5. Ustaw `NEXT_PUBLIC_SERVER_URL=https://szescstrun.pl`.

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
