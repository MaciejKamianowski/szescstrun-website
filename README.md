# Sześć Strun — szescstrun.pl

Strona internetowa nauczyciela gry na gitarze akustycznej **Jacka Krakowskiego** (marka **Sześć Strun**).

Stack: **Next.js App Router**, **Payload CMS 3**, **PostgreSQL**, **Tailwind CSS**, **TypeScript (strict)**, **Vitest**, **Playwright**.

## Wymagania

- Node.js `22.23.4+` (zalecane `.nvmrc`)
- pnpm `9+` / `10+`
- Docker (lokalne PostgreSQL)

## Szybki start

```bash
# 1. Node
nvm use

# 2. Zależności
pnpm install

# 3. Środowisko
cp .env.example .env
# ustaw PAYLOAD_SECRET (np. openssl rand -hex 32)

# 4. Baza
docker compose up -d

# 5. Dev
pnpm dev
```

- Strona: [http://localhost:3000](http://localhost:3000)
- Panel CMS: [http://localhost:3000/admin](http://localhost:3000/admin)

Przy pierwszym wejściu na `/admin` utwórz konto administratora (brak publicznej rejestracji).

### Opcjonalny seed strukturalny

```bash
pnpm seed
```

Tworzy przykładowe oferty zajęć oraz **nieaktywne** pozycje cennika (bez fikcyjnych opinii i bez haseł).

## Zdjęcie Jacka (Hero)

Umieść plik w:

```text
public/images/jacek-krakowski.jpg
```

Obecnie w repozytorium jest też `jacek-krakowski.jpeg` — komponent Hero obsługuje oba warianty. Alternatywnie dodaj zdjęcie w CMS → Ustawienia strony → Nauczyciel.

## Skrypty

| Skrypt | Opis |
| --- | --- |
| `pnpm dev` | Serwer deweloperski |
| `pnpm build` | Build produkcyjny |
| `pnpm start` | Start buildu |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript |
| `pnpm test` | Testy jednostkowe + integracyjne |
| `pnpm test:e2e` | Playwright |
| `pnpm generate:types` | Typy Payload |
| `pnpm seed` | Seed przykładowy |

## Struktura

```text
src/
  app/(frontend)/     # publiczne strony Next.js
  app/(payload)/      # admin + API Payload
  collections/        # kolekcje CMS
  globals/            # ustawienia strony
  components/         # UI, layout, sekcje
  lib/                # zapytania, SEO, utils
  access/             # uprawnienia
  validations/        # Zod
```

## CMS — co Jacek może edytować

- Aktualności / ogłoszenia (`posts`)
- Cennik i karnety (`pricing-plans`) — kwoty w **groszach**
- Oferta zajęć (`lesson-offers`)
- Nagrania YouTube (`videos`)
- Opinie (`testimonials`) — tylko zatwierdzone są publiczne
- Strony informacyjne (`pages`) — m.in. polityka prywatności
- Ustawienia globalne (`site-settings`)
- Media (`media`)

Role: `admin` (pełne uprawnienia), `editor` (treści).

## Formularz kontaktowy

Wymaga zmiennych:

- `RESEND_API_KEY`
- `CONTACT_EMAIL_TO` — skrzynka Jacka
- `EMAIL_FROM` — np. `Sześć Strun <formularz@mail.szescstrun.pl>` (domena `mail.szescstrun.pl` musi być Verified w Resend)

Bez nich API zwraca generyczny błąd 503 (bez fałszywego sukcesu i bez ujawniania szczegółów konfiguracji). Rate limit formularza korzysta z Postgres (`DATABASE_URL`) na Railway. Opcjonalnie Turnstile.

## SEO

- Metadata API, canonical, Open Graph, Twitter Cards
- `sitemap.xml`, `robots.txt` (blokada `/admin` i `/api`)
- JSON-LD: WebSite, Person, BlogPosting, BreadcrumbList

## Deployment

Zobacz [DEPLOYMENT.md](./DEPLOYMENT.md).

## Decyzje właściciela (do uzupełnienia w CMS)

- Realne ceny i karnety
- Biografia / doświadczenie
- E-mail, telefon, miasto, adres (jeśli dotyczy)
- Polityka prywatności przed produkcją
- Potwierdzenie oferty fingerstyle (jeśli ma się pojawić)
- Filmy YouTube do wyróżnienia

Nie wymyślamy tych danych w kodzie.
