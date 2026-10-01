-- =====================================================================
-- The Branding Kitchen™ portaal — database
-- Plak dit in Supabase > SQL Editor en klik Run. Eén keer uitvoeren.
-- Kies bij het aanmaken van je project een EU-regio (bijv. Frankfurt).
-- =====================================================================

-- ---------- Rollen ----------------------------------------------------
create table public.profiles (
  id         uuid primary key references auth.users on delete cascade,
  role       text not null default 'klant' check (role in ('admin','klant')),
  created_at timestamptz not null default now()
);

-- Elke nieuwe login krijgt automatisch een profiel met rol 'klant'.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id);
  -- koppel het account aan de klant met hetzelfde e-mailadres
  update public.clients set user_id = new.id where lower(email) = lower(new.email) and user_id is null;
  return new;
end $$;

-- ---------- Klanten ---------------------------------------------------
create table public.clients (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid unique references auth.users on delete set null,
  naam        text not null,
  bedrijf     text,
  email       text not null unique,
  pakket      text not null check (pakket in ('dwy','audit','templates','identity','zelf')),
  extras      text[] not null default '{}',
  welkom      text,
  profiel     jsonb not null default '{}',   -- Brand Foundation-kaart en persoonlijke laag
  geheugen    jsonb not null default '{}',   -- merkgeheugen: stemvoorbeelden en kerninhoud per course
  merk        jsonb not null default '{}',   -- pagina Jouw merk: open, boodschap, kleuren, fonts, templates
  werkplek    jsonb not null default '{}',   -- focusblokken en energietype
  platformen  text[] not null default '{}',  -- kanalen waarop ze actief is: bepaalt welke tools ze ziet
  thema       jsonb not null default '{}',   -- haar eigen stijl: aan/uit, kleuren, lettertypen, foto's, uitsnede, logo
  plan90      jsonb not null default '{}',   -- 90-dagenplan: doel, aanbod, aannames, uren
  toegang_tot date,                           -- leeg = looptijd traject + 3 maanden (berekend bij aanmaken)
  verlengd    boolean not null default false, -- maandelijkse verlenging loopt (via Mollie)
  limiet      jsonb,                          -- eigen limiet voor deze klant (leeg = standaard)
  audit       jsonb,                          -- Brand Audit: scores, wat je ziet, eerste stappen, top 3, advies, status
  identiteit  jsonb,                          -- Craveable Identity: akkoord of feedback per onderdeel
  -- brand shoot (onderdeel van Positioning Cut en Plating): datum, locatie, voorbereiding, shotlist klaar,
  -- aanleveringen, Pixieset-link selectie, deadline, selectie klaar, Pixieset-link bewerkte foto's
  shoot       jsonb,
  checklist   jsonb not null default '{}',   -- jouw handmatige vinkjes
  uitgenodigd boolean not null default false,
  start       date not null default current_date,
  created_at  timestamptz not null default now()
);

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Hulpfuncties voor de beveiliging --------------------------
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Heeft de ingelogde klant nog toegang tot tools, sous-chef en werkplek?
create or replace function public.heeft_toegang() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select verlengd or toegang_tot is null or toegang_tot >= current_date from public.clients where user_id = auth.uid()), false);
$$;

create or replace function public.my_client_id() returns uuid
language sql stable security definer set search_path = public as $$
  select id from public.clients where user_id = auth.uid();
$$;

-- ---------- Traject ---------------------------------------------------
create table public.client_courses (
  id        uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients on delete cascade,
  course    text not null check (course in ('01','02','03','04','05','06','07','finale')),
  klaar_op  timestamptz,                         -- wanneer jij de gang afrondde (voor toegang tot 2 maanden na oplevering)
  status    text not null default 'dicht' check (status in ('dicht','open','bezig','klaar')),
  notitie   text,
  skills    text[] not null default '{}',
  volgorde  int not null default 0,
  unique (client_id, course)
);

create table public.files (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references public.clients on delete cascade,
  course       text not null,
  soort        text not null check (soort in ('klaargezet','opgediend','upload')),
  naam         text not null,
  storage_path text,                                    -- leeg als het alleen een Canva-link is
  canva_url    text check (canva_url is null or canva_url like 'https://%'),
  onderdeel  text,                           -- bij Craveable Identity: moodboard, logo, kleuren, visuals of brandbook
  grootte      bigint,
  notitie      text,
  downloads    int not null default 0,
  created_by   uuid references auth.users,
  created_at   timestamptz not null default now()
);

create table public.documents (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references public.clients on delete cascade,
  titel        text not null,
  type         text not null,
  tekenen      boolean not null default true,
  status       text not null default 'te-tekenen' check (status in ('te-tekenen','getekend','info')),
  storage_path text,
  getekend_op  timestamptz,
  getekend_ip  text,
  created_at   timestamptz not null default now()
);

create table public.quiz_results (
  client_id  uuid primary key references public.clients on delete cascade,
  antwoorden jsonb not null,
  uitslag    text not null check (uitslag in ('A','B','C','D')),
  created_at timestamptz not null default now()
);

create table public.intake (
  client_id  uuid primary key references public.clients on delete cascade,
  velden     jsonb not null default '{}',
  stap       int not null default 0,
  klaar      boolean not null default false,
  updated_at timestamptz not null default now()
);

create table public.offers (
  id         uuid primary key default gen_random_uuid(),
  client_id  uuid not null references public.clients on delete cascade,
  titel      text not null,
  tekst      text not null,
  knop       text not null default 'Vertel me meer',
  trigger    text not null default 'login',      -- 'login' of 'na-02' enz.
  actief     boolean not null default true,
  status     text not null default 'nieuw' check (status in ('nieuw','interesse','weggeklikt')),
  created_at timestamptz not null default now()
);

create table public.activity (
  id         bigint generated always as identity primary key,
  client_id  uuid not null references public.clients on delete cascade,
  type       text not null,
  tekst      text not null,
  gelezen    boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- Skills ----------------------------------------------------
create table public.skills (
  id             text primary key,              -- bijv. 'caption-writer'
  naam           text not null,
  course         text not null,
  status         text not null default 'concept' check (status in ('live','concept')),
  wat            text,                          -- regel die de klant ziet
  voorbeeld      text,                          -- met {doelgroep}, {pijn} enz.
  kennis         text[] not null default '{}',  -- kennisdomeinen die meegaan: instagram, linkedin, email, verkoop, website, live, markt
  huidige_versie int not null default 1
);

-- De instructies zelf: alleen voor jou en de server, nooit voor klanten.
create table public.skill_versions (
  skill_id   text not null references public.skills on delete cascade,
  versie     int  not null,
  instructie text not null,
  created_at timestamptz not null default now(),
  primary key (skill_id, versie)
);

-- Het dashboard in de taal van de klant: concept (alleen jij) en live (wat zij ziet)
create table public.client_taal (
  client_id uuid primary key references public.clients on delete cascade,
  concept   jsonb,
  live      jsonb,
  live_op   timestamptz
);

create table public.skill_runs (
  id         uuid primary key default gen_random_uuid(),
  client_id  uuid not null references public.clients on delete cascade,
  skill_id   text not null references public.skills,
  versie     int  not null,
  input      text not null,
  output     text,
  tokens_in  int,
  tokens_out int,
  created_at timestamptz not null default now()
);

create table public.portal_settings (
  id               int primary key default 1 check (id = 1),
  welkom_kop       text not null default 'Ready to create some cravings?',
  quotes           text[] not null default '{}',
  foto_path        text,
  logo_licht_path  text,
  logo_donker_path text,
  vragenlijst      jsonb not null default '[]',  -- jouw vragenlijst, bewerkbaar in je keuken
  course_teksten   jsonb not null default '{}',  -- jouw menu-teksten per course (met variant bij een brand shoot)
  beelden          jsonb not null default '{}',  -- foto's en logo's per vak (pad in de opslag 'portaal')
  uitsnede         jsonb not null default '{}',  -- per foto: brandpunt x, y (0-1) en zoom
  kennis_auto      boolean not null default false, -- wekelijkse kennisvoorstellen na 2 dagen automatisch doorvoeren
  limieten         jsonb not null default '{"dag":25,"maand":150,"toolsDag":30}'  -- vragen aan de sous-chef en tools per klant
);
insert into public.portal_settings default values;


-- ---------- Eigen tools: agents die klanten zelf bouwen ----------
create table public.client_tools (
  id         uuid primary key default gen_random_uuid(),
  client_id  uuid not null references public.clients(id) on delete cascade,
  naam       text not null,
  doel       text not null,
  wanneer    text, invoer text, uitvoer text, voorbeeld text, niet_doen text,
  course     text,
  kanalen    text[] not null default '{}',
  created_at timestamptz not null default now()
);
create index on public.client_tools (client_id);

-- ---------- Platformkennis: wat nu werkt per platform ----------
-- 'live' gaat mee met elke tool van dat platform; 'concept' is het maandelijkse voorstel dat jij goedkeurt
create table public.platform_knowledge (
  platform     text primary key,                 -- 'linkedin', 'instagram'
  titel        text not null,
  live         text not null default '',
  bronnen      text[] not null default '{}',
  bijgewerkt   date,
  concept      text,
  concept_bronnen text[],
  concept_op   timestamptz
);
insert into public.platform_knowledge (platform, titel) values ('instagram','Instagram'), ('linkedin','LinkedIn'), ('facebook','Facebook'), ('tiktok','TikTok'),
  ('youtube','YouTube'), ('pinterest','Pinterest'), ('email','E-mail en nieuwsbrief'),
  ('verkoop','Verkoop en DM-gesprekken'), ('website','Salespagina en website'), ('live','Masterclass, webinar en live'), ('markt','Merk, aanbod en markt');

-- ---------- To-do's, aanvragen, sous-chef en kennisbank ----------
create table public.todos (
  id         uuid primary key default gen_random_uuid(),
  client_id  uuid not null references public.clients on delete cascade,
  titel      text not null,
  course     text,
  klaar      boolean not null default false,
  volgorde   int not null default 0,
  created_at timestamptz not null default now()
);

create table public.requests (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null references public.clients on delete cascade,
  soort       text not null,
  titel       text not null,
  toelichting text,
  periode     text,
  status      text not null default 'nieuw' check (status in ('nieuw','behandeling','afgerond')),
  created_at  timestamptz not null default now()
);

create table public.chat_messages (
  id         bigint generated always as identity primary key,
  client_id  uuid not null references public.clients on delete cascade,
  rol        text not null check (rol in ('user','assistant')),
  tekst      text not null,
  created_at timestamptz not null default now()
);

create table public.knowledge (
  id         uuid primary key default gen_random_uuid(),
  titel      text not null,
  tekst      text not null default '',
  volgorde   int not null default 0
);

-- Bestanden voor de pagina Jouw merk (logo's, beelden, merkboek)
alter table public.files drop constraint if exists files_soort_check;
alter table public.files add constraint files_soort_check check (soort in ('klaargezet','opgediend','upload','shoot','logo','beeld','overig'));  -- 'shoot' = aanlevering voor de brand shoot

-- =====================================================================
-- BEVEILIGING: Row Level Security
-- Zonder passende policy ziet niemand iets. Jij (admin) ziet alles,
-- een klant alleen haar eigen rijen.
-- =====================================================================
alter table public.profiles        enable row level security;
alter table public.clients         enable row level security;
alter table public.client_courses  enable row level security;
alter table public.files           enable row level security;
alter table public.documents       enable row level security;
alter table public.quiz_results    enable row level security;
alter table public.intake          enable row level security;
alter table public.offers          enable row level security;
alter table public.activity        enable row level security;
alter table public.skills          enable row level security;
alter table public.skill_versions  enable row level security;
alter table public.skill_runs      enable row level security;
alter table public.client_taal     enable row level security;
alter table public.todos           enable row level security;
alter table public.requests        enable row level security;
alter table public.chat_messages   enable row level security;
alter table public.knowledge       enable row level security;
alter table public.platform_knowledge enable row level security;
alter table public.client_tools enable row level security;
alter table public.portal_settings enable row level security;

-- Jij mag overal alles
create policy admin_all on public.profiles        for all using (public.is_admin()) with check (public.is_admin());
create policy admin_all on public.clients         for all using (public.is_admin()) with check (public.is_admin());
create policy admin_all on public.client_courses  for all using (public.is_admin()) with check (public.is_admin());
create policy admin_all on public.files           for all using (public.is_admin()) with check (public.is_admin());
create policy admin_all on public.documents       for all using (public.is_admin()) with check (public.is_admin());
create policy admin_all on public.quiz_results    for all using (public.is_admin()) with check (public.is_admin());
create policy admin_all on public.intake          for all using (public.is_admin()) with check (public.is_admin());
create policy admin_all on public.offers          for all using (public.is_admin()) with check (public.is_admin());
create policy admin_all on public.activity        for all using (public.is_admin()) with check (public.is_admin());
create policy admin_all on public.skills          for all using (public.is_admin()) with check (public.is_admin());
create policy admin_all on public.skill_versions  for all using (public.is_admin()) with check (public.is_admin());
create policy admin_all on public.skill_runs      for all using (public.is_admin()) with check (public.is_admin());
create policy admin_all on public.client_taal     for all using (public.is_admin()) with check (public.is_admin());
create policy admin_all on public.todos           for all using (public.is_admin()) with check (public.is_admin());
create policy admin_all on public.requests        for all using (public.is_admin()) with check (public.is_admin());
create policy admin_all on public.chat_messages   for all using (public.is_admin()) with check (public.is_admin());
create policy admin_all on public.knowledge       for all using (public.is_admin()) with check (public.is_admin());
create policy admin_all on public.platform_knowledge for all using (public.is_admin()) with check (public.is_admin());
create policy admin_all on public.client_tools for all using (public.is_admin()) with check (public.is_admin());
-- Klant beheert haar eigen tools (maximaal 12)
create policy eigen_tools on public.client_tools for all using (client_id = public.my_client_id())
  with check (client_id = public.my_client_id() and (select count(*) from public.client_tools t where t.client_id = public.my_client_id()) < 12);
-- Platformkennis leest alleen de server (tools en sous-chef); klanten hebben geen directe toegang
create policy admin_all on public.portal_settings for all using (public.is_admin()) with check (public.is_admin());

-- Klant: alleen lezen wat van haar is
create policy eigen_profiel on public.profiles       for select using (id = auth.uid());
create policy eigen_klant   on public.clients        for select using (user_id = auth.uid());
create policy eigen_courses on public.client_courses for select using (client_id = public.my_client_id());
create policy eigen_files   on public.files          for select using (client_id = public.my_client_id());
create policy eigen_docs    on public.documents      for select using (client_id = public.my_client_id());
create policy eigen_offers  on public.offers         for select using (client_id = public.my_client_id() and actief);
create policy eigen_runs    on public.skill_runs     for select using (client_id = public.my_client_id());
create policy iedereen_ingelogd on public.portal_settings for select to authenticated using (true);
-- Klant ziet naam en omschrijving van live skills, nooit de instructie (die staat in skill_versions)
create policy live_skills   on public.skills         for select to authenticated using (status = 'live');

create policy eigen_todos    on public.todos         for select using (client_id = public.my_client_id());
create policy eigen_requests on public.requests      for select using (client_id = public.my_client_id());
create policy eigen_chat     on public.chat_messages for select using (client_id = public.my_client_id());
-- Een aanvraag doen mag ze zelf; de status zet alleen jij
create policy eigen_request_insert on public.requests for insert
  with check (client_id = public.my_client_id() and status = 'nieuw');
-- Chatberichten en de kennisbank schrijft alleen de server (Edge Function 'chat')

-- Klant: zelf uploaden, alleen in open courses van haarzelf
create policy eigen_upload on public.files for insert with check (
  client_id = public.my_client_id() and soort = 'upload'
  and exists (select 1 from public.client_courses c where c.client_id = files.client_id and c.course = files.course and c.status <> 'dicht')
);

-- Klant: quiz en intake invullen
create policy eigen_quiz        on public.quiz_results for select using (client_id = public.my_client_id());
create policy eigen_quiz_insert on public.quiz_results for insert with check (client_id = public.my_client_id());
create policy eigen_intake        on public.intake for select using (client_id = public.my_client_id());
create policy eigen_intake_insert on public.intake for insert with check (client_id = public.my_client_id());
create policy eigen_intake_update on public.intake for update
  using (client_id = public.my_client_id() and not klaar) with check (client_id = public.my_client_id());

-- =====================================================================
-- ACTIES VAN DE KLANT (gecontroleerde functies i.p.v. vrije updates)
-- =====================================================================
create or replace function public.log_activity(p_client uuid, p_type text, p_tekst text) returns void
language sql security definer set search_path = public as $$
  insert into public.activity (client_id, type, tekst) values (p_client, p_type, p_tekst);
$$;
revoke execute on function public.log_activity(uuid, text, text) from public, anon, authenticated;

-- Akkoord geven op een document: legt datum, tijd en IP vast
create or replace function public.sign_document(p_doc uuid) returns void
language plpgsql security definer set search_path = public as $$
declare d public.documents;
begin
  select * into d from public.documents where id = p_doc and client_id = public.my_client_id() and status = 'te-tekenen';
  if not found then raise exception 'Document niet gevonden of al getekend'; end if;
  update public.documents
     set status = 'getekend', getekend_op = now(),
         getekend_ip = current_setting('request.headers', true)::json ->> 'x-forwarded-for'
   where id = p_doc;
  perform public.log_activity(d.client_id, 'getekend', 'gaf akkoord op ' || d.titel);
end $$;

-- Download registreren (de download zelf gaat via een tijdelijke link uit Storage)
create or replace function public.log_download(p_file uuid) returns void
language plpgsql security definer set search_path = public as $$
declare f public.files;
begin
  select * into f from public.files where id = p_file and client_id = public.my_client_id();
  if not found then raise exception 'Bestand niet gevonden'; end if;
  update public.files set downloads = downloads + 1 where id = p_file;
  perform public.log_activity(f.client_id, 'download', 'downloadde ' || f.naam);
end $$;

-- Reageren op een persoonlijke aanbieding
create or replace function public.respond_offer(p_offer uuid, p_interesse boolean) returns void
language plpgsql security definer set search_path = public as $$
declare o public.offers;
begin
  select * into o from public.offers where id = p_offer and client_id = public.my_client_id();
  if not found then raise exception 'Aanbieding niet gevonden'; end if;
  update public.offers set status = case when p_interesse then 'interesse' else 'weggeklikt' end where id = p_offer;
  if p_interesse then perform public.log_activity(o.client_id, 'aanbod', 'wil meer weten over: ' || o.titel); end if;
end $$;

-- De klant krijgt alleen de goedgekeurde versie van haar dashboardtaal, nooit het concept
create or replace function public.my_taal() returns jsonb
language sql stable security definer set search_path = public as $$
  select live from public.client_taal where client_id = public.my_client_id();
$$;

-- To-do afvinken
create or replace function public.toggle_todo(p_todo uuid, p_klaar boolean) returns void
language plpgsql security definer set search_path = public as $$
declare t public.todos;
begin
  select * into t from public.todos where id = p_todo and client_id = public.my_client_id();
  if not found then raise exception 'To-do niet gevonden'; end if;
  update public.todos set klaar = p_klaar where id = p_todo;
  if p_klaar then perform public.log_activity(t.client_id, 'todo', 'vinkte af: ' || t.titel); end if;
end $$;

-- Zelfstudie: zelf een course afronden
create or replace function public.complete_course(p_course text) returns void
language plpgsql security definer set search_path = public as $$
declare c public.clients;
begin
  select * into c from public.clients where id = public.my_client_id();
  if c.pakket <> 'zelf' then raise exception 'Alleen bij zelfstudie'; end if;
  update public.client_courses set status = 'klaar' where client_id = c.id and course = p_course and status <> 'dicht';
  perform public.log_activity(c.id, 'course', 'rondde course ' || p_course || ' af');
end $$;

-- Brand shoot: klant geeft door dat haar selectie in Pixieset klaar is
create or replace function public.selectie_klaar() returns void
language plpgsql security definer set search_path = public as $$
declare cid uuid := public.my_client_id();
begin
  update public.clients set shoot = shoot || jsonb_build_object('selectieKlaar', true, 'selectieOp', now())
   where id = cid and coalesce(shoot ->> 'selectie', '') <> '';
  if not found then raise exception 'Geen selectiegalerij gevonden'; end if;
  perform public.log_activity(cid, 'shoot', 'heeft haar fotoselectie gemaakt');
end $$;

-- Brand shoot: melding als ze een Pixieset-galerij opent
create or replace function public.log_pixieset(p_soort text) returns void
language plpgsql security definer set search_path = public as $$
begin
  perform public.log_activity(public.my_client_id(), 'shoot',
    case when p_soort = 'final' then 'opende haar bewerkte foto''s in Pixieset' else 'opende haar selectiegalerij in Pixieset' end);
end $$;

-- Kanalen kiezen (klant)
create or replace function public.set_platformen(p_platformen text[]) returns void
language plpgsql security definer set search_path = public as $$
begin
  update public.clients set platformen = (select coalesce(array_agg(x), '{}') from unnest(p_platformen) x where x in ('instagram','linkedin','facebook','tiktok','youtube','pinterest','email'))
   where id = public.my_client_id();
  perform public.log_activity(public.my_client_id(), 'kanalen', 'koos haar kanalen: ' || array_to_string(p_platformen, ', '));
end $$;

-- Werkplek: energietype en focusblokken
-- p_hd: geboortedatum, -tijd, -plaats, tijdzone en de berekende chart (type, autoriteit, profiel, definitie, kruis, poorten).
-- Geef 'null'::jsonb mee om de geboortegegevens te wissen.
create or replace function public.update_werkplek(p_energietype text, p_autoriteit text, p_focus_minuten int default 0, p_profiel text default null, p_hd jsonb default null, p_wis_hd boolean default false) returns void
language plpgsql security definer set search_path = public as $$
begin
  update public.clients set werkplek = (case when p_wis_hd then werkplek - 'hd' else werkplek end)
    || jsonb_build_object('energietype', p_energietype, 'autoriteit', p_autoriteit)
    || case when p_profiel is not null then jsonb_build_object('profiel', p_profiel) else '{}'::jsonb end
    || case when p_hd is not null then jsonb_build_object('hd', p_hd) else '{}'::jsonb end
    || case when p_focus_minuten > 0 then jsonb_build_object(
         'focus', coalesce((werkplek ->> 'focus')::int, 0) + 1,
         'minuten', coalesce((werkplek ->> 'minuten')::int, 0) + p_focus_minuten) else '{}'::jsonb end
  where id = public.my_client_id();
end $$;

-- Melding bij een nieuwe aanvraag
create or replace function public.trg_request() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  perform public.log_activity(new.client_id, 'aanvraag', 'vroeg aan: ' || new.titel);
  return new;
end $$;
create trigger na_aanvraag after insert on public.requests for each row execute function public.trg_request();

-- Automatische meldingen voor jou
create or replace function public.trg_upload() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.soort = 'upload' then perform public.log_activity(new.client_id, 'upload', 'uploadde ' || new.naam || ' bij course ' || new.course); end if;
  return new;
end $$;
create trigger na_upload after insert on public.files for each row execute function public.trg_upload();

create or replace function public.trg_quiz() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  perform public.log_activity(new.client_id, 'quiz', 'deed de quiz');
  update public.clients set profiel = profiel || jsonb_build_object('archetype', new.uitslag) where id = new.client_id;
  return new;
end $$;
create trigger na_quiz after insert on public.quiz_results for each row execute function public.trg_quiz();

-- Vragenlijst klaar: melding, persoonlijke laag vullen volgens jouw koppelingen, eerste course openen
create or replace function public.trg_intake() returns trigger
language plpgsql security definer set search_path = public as $$
declare laag jsonb := '{}'; vraag jsonb;
begin
  if new.klaar and not old.klaar then
    perform public.log_activity(new.client_id, 'intake', 'vulde de vragenlijst in');
    for vraag in
      select q from public.portal_settings ps,
        jsonb_array_elements(ps.vragenlijst) deel, jsonb_array_elements(deel -> 'vragen') q
      where ps.id = 1 and coalesce(q ->> 'tool', '') <> ''
    loop
      laag := laag || jsonb_build_object(vraag ->> 'tool', new.velden ->> (vraag ->> 'id'));
    end loop;
    update public.clients set profiel = profiel || laag where id = new.client_id;
    update public.client_courses set status = 'open' where client_id = new.client_id and course = '01' and status = 'dicht';
  end if;
  return new;
end $$;
create trigger na_intake after update on public.intake for each row execute function public.trg_intake();

create or replace function public.trg_skill_run() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  perform public.log_activity(new.client_id, 'skill', 'gebruikte ' || (select naam from public.skills where id = new.skill_id));
  return new;
end $$;
create trigger na_skill_run after insert on public.skill_runs for each row execute function public.trg_skill_run();

-- Nieuwe klant: meteen het traject aanmaken volgens het pakket
create or replace function public.trg_new_client() returns trigger
language plpgsql security definer set search_path = public as $$
declare c text; lijst text[]; i int := 0;
begin
  -- Brand shoot hoort bij Positioning Cut (voorbereiding) en Plating (shoot en foto's).
  -- In de 7-Course Brand Experience altijd inbegrepen (met templates); bij ander aanbod bij te boeken.
  -- Toegang: 7-Course looptijd + 3 maanden; Brand Audit 4 weken; Branded Templates en Craveable Identity 2 maanden na oplevering (zet je bij afronden)
  if new.toegang_tot is null and new.pakket in ('dwy','audit') then
    -- 7-Course: 8 weken + 3 maanden. Brand Audit: 4 weken.
    update public.clients set toegang_tot = (new.start + (case new.pakket when 'dwy' then interval '8 weeks' + interval '3 months' else interval '4 weeks' end))::date where id = new.id;
  end if;
  if (new.pakket = 'dwy' or 'Brand shoot' = any(new.extras)) and new.shoot is null then
    update public.clients set shoot = '{}'::jsonb where id = new.id;
  end if;
  -- Zeven gangen; de Signature Dish is het dessert erna en geen gang
  lijst := case new.pakket when 'audit' then array['01','02','04'] when 'templates' then array['05'] when 'identity' then array['01','02'] else array['01','02','03','04','05','06','07'] end;
  foreach c in array lijst loop
    i := i + 1;
    insert into public.client_courses (client_id, course, status, skills, volgorde)
    values (new.id, c, case when new.pakket = 'zelf' then 'open' else 'dicht' end,
            coalesce((select array_agg(id) from public.skills where course = c and status = 'live'), '{}'), i);
  end loop;
  -- Zelfstudie: standaard to-do's (pas de lijst hier of in je keuken aan)
  if new.pakket = 'zelf' then
    insert into public.todos (client_id, titel, course, volgorde) values
      (new.id, 'Doe de quiz: welk gerecht ben jij?', null, 1),
      (new.id, 'Vul de vragenlijst in over jou en je business', null, 2),
      (new.id, 'Schrijf je origin story met de Origin Story Reeks', '01', 3),
      (new.id, 'Leg je toon vast: drie woorden wél, drie woorden nooit', '02', 4),
      (new.id, 'Beschrijf je werkwijze in maximaal vijf stappen', '03', 5),
      (new.id, 'Maak je messaging plan en je Brand Foundation', '04', 6),
      (new.id, 'Plan één week content met de Normal Story Week', '05', 7),
      (new.id, 'Zet je aanbod op papier met de Offer Builder', '06', 8),
      (new.id, 'Beschrijf hoe een klant zich voelt na samenwerken met jou', '07', 9);
  end if;
  insert into public.intake (client_id) values (new.id);
  return new;
end $$;
create trigger na_nieuwe_klant after insert on public.clients for each row execute function public.trg_new_client();

-- =====================================================================
-- OPSLAG (Storage)
-- 'klanten'  = privé. Jouw bestanden: <client_id>/<course>/<bestand>
--              Uploads klant:  <client_id>/<course>/uploads/<bestand>
-- 'portaal'  = je foto en logo's (openbaar leesbaar, niet gevoelig)
-- =====================================================================
insert into storage.buckets (id, name, public) values ('klanten', 'klanten', false), ('portaal', 'portaal', true);

create policy admin_opslag on storage.objects for all
  using (bucket_id in ('klanten','portaal') and public.is_admin())
  with check (bucket_id in ('klanten','portaal') and public.is_admin());

create policy klant_leest_eigen on storage.objects for select
  using (bucket_id = 'klanten' and (storage.foldername(name))[1] = public.my_client_id()::text);

create policy klant_upload_eigen on storage.objects for insert
  with check (bucket_id = 'klanten' and (storage.foldername(name))[1] = public.my_client_id()::text
              and (storage.foldername(name))[3] = 'uploads');

-- Realtime: jouw keuken ziet nieuwe meldingen meteen verschijnen
alter publication supabase_realtime add table public.activity;
alter publication supabase_realtime add table public.files;
alter publication supabase_realtime add table public.requests;
alter publication supabase_realtime add table public.chat_messages;

-- =====================================================================
-- LAATSTE STAP (handmatig, na je eerste login):
-- update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'jouw@email.nl');
-- =====================================================================
