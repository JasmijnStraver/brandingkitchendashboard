# Studio Crave · The Branding Kitchen — klantportaal

Dit pakket bevat alles om het portaal live te zetten. Open deze map in **Claude Code** en begin met:

> "Lees README-livegang.md en de map prototype. Bouw dit portaal live als Next.js-app met Supabase, volgens de stappen hieronder. Begin met stap 1 en vraag mij om akkoord voordat je iets online zet."

## Wat zit erin
| Map | Inhoud |
|---|---|
| `prototype/` | Het werkende voorbeeld (`tbk-portaal.html`) en alle bronbestanden. Dit is het ontwerp en de logica die live moet. Bouwen: `python3 build.py` |
| `supabase/` | Database (`01-schema.sql`), skills (`02-skills.sql`), vragenlijst (`03-vragenlijst.sql`), serverfuncties (`run-skill`, `platform-update`, `uitnodigen`) en de mailtemplates |
| `skills/` | Alle SKILL.md-bestanden: `plugins/` (je 25 skills) en `eigen/` (LinkedIn, Short Video Script) |
| `merk/` | Officiële logo's, monogram, banner en het lettertype Karumbi |

## Stappen naar live
1. **Supabase-project** aanmaken, regio **Frankfurt (EU)**.
2. In de SQL-editor, in deze volgorde: `01-schema.sql`, `02-skills.sql`, `03-vragenlijst.sql`.
3. **Jezelf admin maken**: registreer met je eigen e-mail, en zet in de tabel `profiles` je rol op `admin`.
4. **Geheimen** instellen (Supabase, Edge Functions, Secrets): `ANTHROPIC_API_KEY` (uit je account op platform.claude.com) en `PORTAAL_URL`.
5. **Serverfuncties** deployen: `run-skill`, `platform-update` (dagelijks via Cron) en `uitnodigen`.
6. **Mail**: plak `email-uitnodiging.html` en `email-wachtwoord.html` in Authentication, Email Templates, en koppel een eigen maildienst (bijvoorbeeld Resend) met afzender @studiocrave.nl.
7. **Opslag**: buckets `klanten` (privé) en `portaal` (openbaar), zoals in het schema.
8. **De app**: Claude Code bouwt de Next.js-app na op basis van `prototype/`, gekoppeld aan Supabase, en zet hem op **Vercel**.
9. **Domein**, bijvoorbeeld portaal.studiocrave.nl, koppelen in Vercel.
10. **Testen** met een testklant per pakket, en pas daarna je eerste echte klant uitnodigen.

## Nog te bouwen in de live versie
- Chat-serverfunctie voor de sous-chef (zelfde opzet als `run-skill`, met limieten en toegangscheck)
- Betalingen en verlengen via **Mollie** (abonnement €15/€20 per maand)
- Eigen stem voor de sous-chef (optioneel, bijvoorbeeld ElevenLabs)
- E-mailmeldingen (bijvoorbeeld herinnering als de vragenlijst blijft liggen)

## Juridisch
Laat je privacyverklaring en verwerkersovereenkomst checken: ze moeten Supabase (EU), Anthropic (Claude API) en de opslag van geboortegegevens (Human Design) benoemen.
