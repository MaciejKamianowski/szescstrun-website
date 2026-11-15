# PRODUCTION AUDIT — szescstrun.pl

**Data:** 2026-11-15  
**Środowisko audytu:** lokalne (macOS, Docker PostgreSQL 16, Node v22.23.4, pnpm 10.34.9)  
**Zakres:** kod, testy automatyczne, API, przeglądarka (375 / 768 / 1440 / 1920), bezpieczeństwo, gotowość produkcyjna  
**Deployment / DNS:** nie wykonywane (zgodnie z briefem)

---

## Werdykt

Projekt jest **blisko gotowości**, ale **nie jest jeszcze gotowy do produkcji** bez domknięcia kilku blokerów (Node ≥22.23.5, Resend, S3/R2, migracje na świeżej DB produkcyjnej, treści CMS, polityka prywatności).

W trakcie audytu naprawiono m.in.:
- access control (nieaktywne oferty / niezatwierdzone opinie / szkice),
- `overrideAccess: false` w zapytaniach publicznych,
- limit uploadu 5 MB,
- migrację początkową + dokumentację,
- upgrade **Next.js 15.4.11 → 16.4.1** (łatki krytycznych RCE),
- `revalidateTag` pod Next 16,
- ESLint flat config + lint menu mobilnego.

---

## 1. Środowisko i kompatybilność

| ID | Temat | Status | Istotność | Opis | Lokalizacja | Poprawka / rekomendacja |
| --- | --- | --- | --- | --- | --- | --- |
| ENV-01 | Node.js vs dokumentacja Payload | **FAIL** | High | Oficjalna dokumentacja Payload wymaga `^22.23.5 \|\| ^24.22.3 \|\| >=26.13.1`. Lokalnie: **v22.23.4**. | `package.json` engines, runtime | `nvm install 22.23.5 && nvm use` przed produkcją. `.nvmrc` ustawione na `22.23.5`. |
| ENV-02 | Next.js / React / Payload | **PASS** | High | Po audycie: `next@16.4.1`, `react@19.2.6`, `payload@3.93.0` + adaptery `@payloadcms/*@3.93.0`. Next 16.2.6+ jest w oficjalnym zakresie Payload. | `package.json` | Utrzymać zsynchronizowane wersje `@payloadcms/*`. |
| ENV-03 | Krytyczne CVE Next 15.4.11 | **PASS** (naprawione) | Critical | `pnpm audit` wskazywał RCE Image Optimization (AVIF/SVG) i inne dla Next 15.4.11. | wcześniej `package.json` | Upgrade do `next@16.4.1` + `eslint-config-next@16.4.1`. |
| ENV-04 | `.env.example` | **PASS** | Medium | Zawiera DB, `PAYLOAD_SECRET`, URL, Resend, Turnstile, S3/R2. | `.env.example` | Przed prod uzupełnić wszystkie wymagane wartości; nie commituj `.env`. |
| ENV-05 | Połączenie PostgreSQL | **PASS** | Critical | `docker compose ps` healthy; `\dt` pokazuje 21 tabel kolekcji Payload. | `docker-compose.yml` | Na prod użyć managed Postgres + backupy. |
| ENV-06 | Migracje DB | **PASS** (z zastrzeżeniem) | Critical | Brakowało katalogu migracji — utworzono `src/migrations/20261115_123647_initial.ts`. Auto `prodMigrations` usunięte (wieszało `next build` promptem). | `src/migrations/*`, `src/payload.config.ts` | Na prod **zawsze** `pnpm payload migrate` przed startem. Dev nadal używa `push`. |
| ENV-07 | Pozostałe podatności zależności | **FAIL** | Medium | Po upgrade: `pnpm audit --prod` → 13 issues (1 critical transitive **dompurify** via `@payloadcms/ui`/monaco, 7 high). | lockfile | Monitorować update Payload; critical dompurify jest transitive — nie patchować ręcznie bez testów UI. |

---

## 2. Testy automatyczne (wykonane)

| ID | Test | Status | Istotność | Opis | Poprawka |
| --- | --- | --- | --- | --- | --- |
| TEST-01 | `pnpm lint` | **PASS** | High | Po naprawie ESLint (Next 16 flat config) i headera — 0 errors. | `eslint.config.mjs`, `src/components/layout/header.tsx` |
| TEST-02 | `pnpm typecheck` | **PASS** | High | `tsc --noEmit` OK. | — |
| TEST-03 | Unit (`tests/unit`) | **PASS** | Medium | 5/5 (slugify, cena PLN, YouTube, formularz). | — |
| TEST-04 | Integration (`tests/int`) | **PASS** | High | 4/4: init Payload, brak tworzenia usera bez auth, slug/cennik, draft vs published. | — |
| TEST-05 | E2E Playwright | **PASS** | High | 5/5: home, nawigacja cennik/aktualności, menu mobilne, walidacja formularza, login admin + widoczność wpisu i ceny. | — |
| TEST-06 | `pnpm build` (produkcja) | **PASS** | Critical | Build **Next 16.4.1** zakończony sukcesem po usunięciu interaktywnych migracji i poprawce `revalidateTag`. | `src/hooks/revalidate.ts`, `src/payload.config.ts` |

> Wcześniejszy build na 15.4.11 **FAIL** — zawieszony na prompcie migracji Payload podczas SSG. Naprawione.

---

## 3. Panel administracyjny

| ID | Funkcja | Status | Istotność | Opis | Dowód |
| --- | --- | --- | --- | --- | --- |
| CMS-01 | Logowanie admina | **PASS** | Critical | E2E loguje użytkownika testowego i wchodzi w `/admin`. | `tests/e2e/admin.e2e.spec.ts` |
| CMS-02 | Rola `admin` | **PASS** | High | Tworzenie użytkownika / pełne CRUD w int + E2E seed. | `tests/int/cms.int.spec.ts` |
| CMS-03 | Rola `editor` | **BLOCKED** | High | Access control w kodzie (`admins` vs `adminsAndEditors`) jest zdefiniowany, ale **nie wykonano osobnego E2E jako editor** (ograniczenia UI użytkowników). | `src/collections/Users.ts`, `src/access/index.ts` |
| CMS-04 | Publikacja aktualności | **PASS** | Critical | E2E tworzy published post i widzi go na `/aktualnosci`. | E2E admin |
| CMS-05 | Szkice niedostępne publicznie | **PASS** | Critical | Int test: draft nie wraca przy `overrideAccess: false`. Access `publishedOrAuthenticated`. | `tests/int/cms.int.spec.ts`, `src/collections/Posts.ts` |
| CMS-06 | Edycja / ukrywanie wpisów | **PASS** (częściowo) | High | Ukrywanie przez status draft/unpublish pokryte int; pełna edycja UI nie klikana ręcznie. | int + access |
| CMS-07 | Upload zdjęć | **BLOCKED** | High | Media collection + limit 5 MB w kodzie; **brak E2E uploadu pliku**. | `src/collections/Media.ts` |
| CMS-08 | YouTube | **BLOCKED** | Medium | Walidacja URL/ID w kodzie + unit; **brak E2E dodania filmu**. | `src/collections/Videos.ts`, `tests/unit/utils.test.ts` |
| CMS-09 | Zmiana ceny lekcji | **PASS** | Critical | E2E tworzy plan 99,00 zł i weryfikuje na `/cennik`. | E2E admin |
| CMS-10 | Karnety (package) | **BLOCKED** | Medium | Pola `lessonCount` / `type=package` w CMS; **brak dedykowanego E2E karnetu**. | `src/collections/PricingPlans.ts` |
| CMS-11 | Publiczna aktualizacja po zapisie | **PASS** | High | E2E + `revalidatePath` / `revalidateTag` w hookach. | `src/hooks/revalidate.ts` |

---

## 4. Bezpieczeństwo

| ID | Temat | Status | Istotność | Opis | Plik | Poprawka |
| --- | --- | --- | --- | --- | --- | --- |
| SEC-01 | Access: szkice | **PASS** | Critical | Publiczny read tylko published. | `src/access/index.ts`, `Posts.ts` | — |
| SEC-02 | Access: nieaktywny cennik / oferty / wideo | **PASS** (naprawione) | High | Wcześniej `read: anyone` — API mogło zwracać ukryte pozycje. | `PricingPlans.ts`, `LessonOffers.ts`, `Videos.ts` | `activeOrAuthenticated` |
| SEC-03 | Access: niezatwierdzone opinie | **PASS** (naprawione) | High | Wcześniej `read: anyone`. | `Testimonials.ts` | `approvedOrAuthenticated` |
| SEC-04 | Local API `overrideAccess` | **PASS** (naprawione) | High | Zapytania frontendu omijały ACL. | `src/lib/queries.ts` | `overrideAccess: false` wszędzie publicznie |
| SEC-05 | Draft preview `overrideAccess: true` | **PASS** (naprawione) | Critical | `getPostBySlug` mógłby ujawnić szkice przy samym draftMode. | `src/lib/queries.ts` ~122–149 | Usunięto bypass; preview wymaga właściwego auth flow (do dorobienia) |
| SEC-06 | Formularz kontaktowy | **PASS** | High | Zod FE+BE, honeypot, rate limit, brak fałszywego sukcesu bez Resend (503, generyczny komunikat). | `api/contact/route.ts`, `validations/contact.ts` | Curl: walidacja 400; brak Resend → 503 |
| SEC-07 | Rate limiting | **PASS** | Medium | Postgres (`contact_rate_limits`) gdy `DATABASE_URL`; fallback in-memory. | `src/lib/rate-limit.ts` | — |
| SEC-08 | Uploady | **PASS** | High | MIME whitelist + hook 5 MB + sharp. | `Media.ts` | S3 obowiązkowe na PaaS |
| SEC-09 | Sekrety | **PASS** | Critical | `.env` w `.gitignore`; przykład bez realnych sekretów. | `.gitignore`, `.env.example` | Silny `PAYLOAD_SECRET` na prod |
| SEC-10 | Brak publicznej rejestracji | **PASS** | Critical | `users.create: admins`; int test odrzuca create bez auth. | `Users.ts` | — |
| SEC-11 | Admin noindex | **PASS** | Low | `robots.txt` Disallow `/admin`; meta robots w admin. | `src/app/robots.ts`, `payload.config.ts` | — |
| SEC-12 | Turnstile UI | **FAIL** | Medium | Backend gotowy, brak widgetu na froncie formularza. | `contact-form.tsx` | Dodać Turnstile gdy `NEXT_PUBLIC_TURNSTILE_SITE_KEY` |

---

## 5. Frontend (viewporty)

Wykonane pomiary CDP + screenshoty (375, 768, 1440, 1920).

| ID | Temat | Status | Istotność | Opis |
| --- | --- | --- | --- | --- |
| FE-01 | 375 px — layout / overflow | **PASS** | High | `overflowX: false`, menu hamburger widoczne, CTA obecne. |
| FE-02 | 768 px | **PASS** | High | Brak overflow; hero `object-fit: contain`, ratio ~1.5 (= 2048/1365). |
| FE-03 | 1440 px | **PASS** | High | Siatka 2 kolumny; desktop nav; brak overflow. |
| FE-04 | 1920 px | **PASS** | Medium | `scrollWidth=1920`, nav + hero OK. |
| FE-05 | Pełny kadr Jacka | **PASS** | Critical | Usunięto `object-cover` / sztuczne aspect; `object-contain` + natywne proporcje. CSS parents `overflow: visible`. |
| FE-06 | Menu mobilne | **PASS** | High | E2E + lint fix zamykania na klik. |
| FE-07 | Typografia / PL | **PASS** | Medium | Nagłówek `NIESKOŃCZONE` poprawny; UI po polsku. |
| FE-08 | Formularz a11y | **PASS** | Medium | Labele, błędy, honeypot poza tab order. |
| FE-09 | CTA / linki | **PASS** | Medium | Snapshot: CTA Umów/Poznaj, footer FB/YT, polityka. |
| FE-10 | Sharp dual libvips warning | **FAIL** | Low | Ostrzeżenie o dwóch `sharp-libvips` w runtime E2E. | Dedup / align wersji sharp przy okazji update. |

---

## 6. Gotowość produkcyjna

| ID | Temat | Status | Istotność | Opis | Rekomendacja |
| --- | --- | --- | --- | --- | --- |
| PROD-01 | PostgreSQL managed | **BLOCKED** | Critical | Lokalnie Docker OK; prod DB nieprovisionowana. | Neon/Supabase/Railway Postgres |
| PROD-02 | Trwałość mediów | **FAIL** | Critical | Bez `S3_*` pliki w `/media` (efemeryczne na PaaS). | Cloudflare R2 przed go-live |
| PROD-03 | Resend | **BLOCKED** | Critical | Integracja gotowa; wymaga Verified `mail.szescstrun.pl` + env na Railway. | `RESEND_API_KEY`, `CONTACT_EMAIL_TO`, `EMAIL_FROM` |
| PROD-04 | Cache revalidation | **PASS** | High | `revalidatePath` + `revalidateTag(..., { expire: 0 })` po zmianach CMS. | — |
| PROD-05 | Obsługa błędów | **PASS** | Medium | Formularz: czytelne 400/429/503; bez stacków po stronie klienta. | — |
| PROD-06 | sitemap / robots | **PASS** | High | `/robots.txt` i `/sitemap.xml` → 200; Disallow `/admin`, `/api`. | `NEXT_PUBLIC_SERVER_URL=https://www.szescstrun.pl` |
| PROD-07 | SEO metadata / JSON-LD | **PASS** | Medium | Metadata API + Person/WebSite na home. | Uzupełnić dane lokalizacji tylko gdy prawdziwe |
| PROD-08 | Backup / restore | **BLOCKED** | High | Opisane w `DEPLOYMENT.md`, nie przetestowane. | Snapshoty DB + R2 |
| PROD-09 | HTTPS | **BLOCKED** | Critical | Zależy od hosta; lokalnie HTTP. | TLS u providera |
| PROD-10 | Polityka prywatności | **FAIL** | High | Placeholder do uzupełnienia w CMS przed prod. | Wypełnić `pages` slug `polityka-prywatnosci` |
| PROD-11 | Treści biznesowe | **FAIL** | High | Brak aktywnych cen, telefonu, e-maila publicznego. | `OWNER_CHECKLIST.md` |

---

## 7. Zmiany wprowadzone podczas audytu

1. `src/access/index.ts` — `activeOrAuthenticated`, `approvedOrAuthenticated`
2. Kolekcje Pricing / Offers / Videos / Testimonials — zaostrzony `read`
3. `src/lib/queries.ts` — `overrideAccess: false`, bezpieczniejszy draft
4. `src/collections/Media.ts` — limit 5 MB
5. `src/migrations/20261115_123647_initial.*` — migracja początkowa
6. `package.json` — Next 16.4.1 / React 19.2.6; engines Node ≥22.23.5
7. `src/hooks/revalidate.ts` — `revalidateTag(tag, { expire: 0 })`
8. `eslint.config.mjs` — flat config Next 16
9. `src/components/layout/header.tsx` — lint React 19 hooks
10. `DEPLOYMENT.md` — procedura migracji bez auto-promptu

---

## Blokery uruchomienia produkcyjnego

1. **Critical:** skonfigurować **Resend** (inaczej formularz kontaktowy nie wysyła).
2. **Critical:** włączyć **S3/R2** dla mediów (trwałość uploadów).
3. **Critical:** produkcyjny **PostgreSQL** + `pnpm payload migrate` na czystej bazie.
4. **Critical:** **HTTPS** + `NEXT_PUBLIC_SERVER_URL=https://www.szescstrun.pl`.
5. **High:** Node runtime **≥ 22.23.5** (zgodnie z Payload).
6. **High:** uzupełnić **politykę prywatności** i dane kontaktowe / cennik w CMS.
7. **High (zalecane przed go-live):** E2E roli **editor**, upload mediów, dodanie YouTube, karnet package.
8. **Medium:** rate limit wieloinstancyjny + opcjonalny Turnstile UI.

---

## Podsumowanie liczbowe (wykonane sprawdzenia)

| Kategoria | PASS | FAIL | BLOCKED |
| --- | --- | --- | --- |
| Środowisko | 4 | 2 | 0 |
| Testy auto | 6 | 0 | 0 |
| CMS | 6 | 0 | 4 |
| Bezpieczeństwo | 10 | 1 | 0 |
| Frontend | 9 | 1 | 0 |
| Produkcja | 3 | 3 | 3 |

**Łącznie w raporcie:** ok. 32 PASS / 7 FAIL / 7 BLOCKED (pozycje tabel).

Status ogólny: **CONDITIONAL GO** — kod i testy są w dobrym stanie po poprawkach audytu; go-live wymaga domknięcia infrastruktury, sekretów i treści właściciela.
