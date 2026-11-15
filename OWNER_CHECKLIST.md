# Lista decyzji i uzupełnień właściciela

Przed startem produkcyjnym Jacek powinien uzupełnić w panelu `/admin`:

## Treści

- [ ] Biografia nauczyciela (Ustawienia strony → Nauczyciel)
- [ ] Zdjęcie w CMS (opcjonalnie, jeśli nie używasz `public/images/jacek-krakowski.jpg`)
- [ ] Realne ceny lekcji i karnetów (Cennik) — aktywuj oferty
- [ ] Potwierdzenie / edycja oferty zajęć (w tym ewentualny fingerstyle)
- [ ] Filmy YouTube do wyróżnienia (Nagrania)
- [ ] Polityka prywatności (Strony informacyjne, slug `polityka-prywatnosci`)
- [ ] Opinie uczniów — wyłącznie prawdziwe, po zatwierdzeniu

## Kontakt

- [ ] E-mail kontaktowy
- [ ] Telefon (jeśli ma być publiczny)
- [ ] Miasto / adres — tylko gdy potwierdzone
- [ ] Formy zajęć: online / stacjonarnie

## Techniczne (z programistą / hostingiem)

- [ ] Konto Resend + `RESEND_API_KEY`, `CONTACT_EMAIL_TO`, `EMAIL_FROM`
- [ ] Bucket Cloudflare R2 + zmienne `S3_*`
- [ ] Hosting Node (Railway / Render / Fly) + managed Postgres
- [ ] DNS w Zenbox bez naruszania MX/SPF/DKIM/DMARC
- [ ] Pierwszy administrator utworzony na `/admin`
- [ ] Opcjonalnie Cloudflare Turnstile

Nie uzupełniaj kodu fikcyjnymi danymi — wszystko edytowalne jest w CMS.
