import { useEffect, useMemo, useRef, useState } from "react";
import { findClient } from "./clients.js";

// ---------------------------------------------------------------------------
// COURSES — het menu van de 7-Course Brand Method + één bonus-gang met
// groei-tools. Elke Course is een gang, elke skill een kaart.
//
// Om een skill aan te sluiten: zet "wired: true" en voeg een system prompt
// toe aan SYSTEM_PROMPTS hieronder (key = skill id). Niet-aangesloten
// skills tonen automatisch een "binnenkort"-badge in plaats van "Open".
// ---------------------------------------------------------------------------
const COURSES = [
  {
    number: "01",
    id: "raw-ingredients",
    title: "Raw Ingredients",
    subtitle: "De rauwe basis: wie ben je écht, en voor wie doe je dit.",
    skills: [
      {
        id: "origin-story-reeks",
        name: "Origin Story Reeks",
        teaser: "Een Instagram-story-reeks over de hele reis van de klant — van waar ze nu staan, terug naar hoe het begon.",
        wired: false,
      },
    ],
  },
  {
    number: "02",
    id: "flavor-profile",
    title: "Flavor Profile",
    subtitle: "Hoe je merk klinkt: toon van stem en het fundament dat alle content hergebruikt.",
    skills: [
      {
        id: "brand-foundation",
        name: "Brand Foundation",
        teaser: "Een compact merk-kaartje (kernbelofte, doelgroep, toon-van-stem) dat alle content-skills direct kunnen hergebruiken.",
        wired: false,
      },
    ],
  },
  {
    number: "03",
    id: "signature-sauce",
    title: "Signature Sauce",
    subtitle: "Jouw methode en expertise — het ding dat alleen jij zo doet.",
    skills: [
      {
        id: "authority-carrousel",
        name: "Authority Carrousel",
        teaser: "Een carrousel die bewijst dat je weet waar je het over hebt — uit een klant-intake, geen natte-vinger-werk.",
        wired: false,
      },
    ],
  },
  {
    number: "04",
    id: "positioning-cut",
    title: "Positioning Cut",
    subtitle: "Waar je jezelf losnijdt van de massa: kernbelofte, niche en grenzen.",
    skills: [
      {
        id: "messaging-plan",
        name: "Messaging Plan",
        teaser: "Kernbelofte, content-pijlers, anti-positionering en toon-van-stem — het fundament waar alle latere content op terugvalt.",
        wired: true,
      },
      {
        id: "anti-positionering-carrousel",
        name: "Anti-Positionering Carrousel",
        teaser: "Een carrousel die scherp afzet tegen de markt-standaard: wat jij bewust niet doet.",
        wired: false,
      },
    ],
  },
  {
    number: "05",
    id: "plating",
    title: "Plating",
    subtitle: "Hoe je het serveert: captions, hooks, carrousels en stories die overtuigen.",
    skills: [
      {
        id: "caption-writer",
        name: "Caption Writer",
        teaser: "Instagram-captions met storytelling en het SPCL-framework — klinkt als jij, niet als een template.",
        wired: true,
      },
      {
        id: "funnel-hook-generator",
        name: "Funnel Hook Generator",
        teaser: "Een complete set hooks (Awareness, Nurture, Sell) voor Reels, carrousels en stories.",
        wired: false,
      },
      {
        id: "resultaat-carrousel",
        name: "Resultaat Carrousel",
        teaser: "Vision-cast hoe jij je klant naar hun doel brengt — jouw aanpak, zonder dat er al een concrete casus nodig is.",
        wired: false,
      },
      {
        id: "normal-story-week",
        name: "Normale Story-week",
        teaser: "Een hele reguliere week aan Instagram stories, van demand-test tot verkoopmoment.",
        wired: false,
      },
      {
        id: "lead-magnet-story-week",
        name: "Lead Magnet Story-week",
        teaser: "Een 6-daagse story-reeks naar een deadline toe, gericht op het promoten van één specifieke weggever.",
        wired: false,
      },
      {
        id: "stories-voor-leads",
        name: "Stories voor Leads",
        teaser: "Een lanceer-story-reeks (dag 3 t/m 10) die leads en aanmeldingen trekt richting een lancering.",
        wired: false,
      },
      {
        id: "launch-carrousel-story",
        name: "Launch Carrousel & Story",
        teaser: "Converterende lanceer-content als feed-carrousel én story-serie voor de dag van de launch zelf.",
        wired: false,
      },
      {
        id: "email-funnel-writer",
        name: "E-mail Funnel Writer",
        teaser: "Converterende e-mails en complete lanceer-mailseries.",
        wired: false,
      },
      {
        id: "masterclass-schrijver",
        name: "Masterclass Schrijver",
        teaser: "De volledige spreektekst voor een masterclass of webinar, opgebouwd naar een aanbod toe.",
        wired: false,
      },
      {
        id: "webinar-script-builder",
        name: "Webinar Script Builder",
        teaser: "Een compleet converterend webinar-script inclusief slide-structuur en timing.",
        wired: false,
      },
    ],
  },
  {
    number: "06",
    id: "pairing",
    title: "Pairing",
    subtitle: "Het aanbod erbij: verpakking, salespagina's en lanceringen.",
    skills: [
      {
        id: "offer-builder",
        name: "Offer Builder",
        teaser: "Een volledig verpakt, cold-traffic-klaar aanbod plus bijpassende weggever met een uniek onderscheidend element.",
        wired: false,
      },
      {
        id: "checkout-page",
        name: "Checkout Page",
        teaser: "Converterende checkout- en salespagina-tekst voor je aanbod.",
        wired: false,
      },
      {
        id: "onder-de-radar-pitch",
        name: "Onder-de-Radar Pitch",
        teaser: "Berichten voor een aanbod zonder publieke launch — invite-only, stille beschikbaarheid, DM-gestuurd.",
        wired: false,
      },
    ],
  },
  {
    number: "07",
    id: "the-experience",
    title: "The Experience",
    subtitle: "Het klantcontact: verkoopgesprekken en de resultaten die overtuigen.",
    skills: [
      {
        id: "dm-sales-coach",
        name: "DM Sales Coach",
        teaser: "Complete DM-sales-flows, of een screenshot van een lead-gesprek laten beoordelen op vervolgstappen.",
        wired: false,
      },
      {
        id: "client-result-carrousel",
        name: "Client Result Carrousel",
        teaser: "Een klanttransformatie als swipe-verhaal — case study of testimonial die overtuigt.",
        wired: false,
      },
    ],
  },
  {
    number: "08",
    id: "digestief",
    title: "Digestief",
    subtitle: "Geen gang uit de methode, maar groei- en planningstools voor je eigen business.",
    skills: [
      {
        id: "sprint-doel",
        name: "Sprint Doel",
        teaser: "Reken een 2-weken challenge- of sprintdoel terug naar leads, aanmeldingen of sales per dag/week.",
        wired: false,
      },
      {
        id: "jaardoel",
        name: "Jaardoel",
        teaser: "Reken een jaardoel terug naar maandomzet en rol het uit naar concrete mijlpalen.",
        wired: false,
      },
      {
        id: "perfecte-week-planner",
        name: "Perfecte Week Planner",
        teaser: "Bouw een werkbare week op basis van beschikbare uren, max. aantal klanten en vaste content-blokken.",
        wired: false,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// SYSTEM_PROMPTS — gecomprimeerde skill-instructies per skill id.
// Alleen skills met wired: true hoeven hier te staan.
// ---------------------------------------------------------------------------
const SYSTEM_PROMPTS = {
  "messaging-plan": `Je bent de Messaging Plan-skill van Studio Crave, onderdeel van Course 04 — Positioning Cut uit de 7-Course Brand Method. Je bouwt een compleet, bruikbaar messaging plan voor een coach/consultant/freelancer. Dit raakt ook kort Course 01 (Raw Ingredients — is dit echt van hén?) en Course 02 (Flavor Profile — toon van stem).

BELANGRIJK: de output is voor de eindklant en moet klinken als HÚN merk, in hún taal en vakgebied — gebruik GEEN culinaire kopjes als "Signature Sauce" of "Raw Ingredients" in de output-secties. De culinaire framing hoort alleen in je korte opening en afsluiting.

WERKWIJZE
Stap 0 — Open kort met waar dit onderdeel in het geheel past (1-2 zinnen, geen uitgebreide methode-uitleg).

Stap 1 — Verzamel input, toegespitst op déze business, als losse korte vragen (geen formulier-dump):
1. Voor wie is dit (specifieke doelgroep, geen "iedereen die...")
2. Wat is het resultaat/de transformatie die ze leveren
3. Wat maakt hun aanpak anders dan de standaard in hún markt (kern van de Positioning Cut)
4. Wat ergert hen aan hoe anderen in hún vakgebied het aanpakken (voedt de anti-positionering)
5. Raw Ingredients-check: is dit echt van hén, of een geleend frame?
6. Gewenste toon: laat kiezen of geef 2-3 opties passend bij hún vakgebied

Als er al merk-context is gedeeld, gebruik die en vul alleen de gaten aan.

Stap 2 — Bouw vier onderdelen, in de taal van de klant:
- Kernbelofte: één zin, resultaat + voor wie + zonder de standaard-aanpak. Test: zou een concurrent dit ook kunnen claimen? Zo ja, scherper.
- Content-pijlers: 3-4 terugkerende thema's, elk met naam, 1-2 zinnen uitleg, en passend content-type.
- Anti-positionering: 2-3 concrete dingen die de markt-standaard wél doet en dit merk bewust niet. Confronterend, niet aanvallend.
- Toon-van-stem regels: 4-6 concrete regels, elk met een "wel" en een "nooit" — geen abstracte bijvoeglijke naamwoorden.

Stap 3 — Lever op als overzichtelijk document, in deze volgorde: Kernbelofte → Content-pijlers → Anti-positionering → Toon-van-stem. Geen culinaire kopjes, wel geschreven in de gekozen toon. Sluit af met een korte, informatieve doorverwijzing naar Course 05 — Plating, en bied aan om er een Brand Foundation-kaartje van te maken.

STIJL: confronterend-maar-warm, kort, zonder hustle-taal.

RANDGEVALLEN: al een plan maar wil scherper — vraag eerst wat niet werkt voordat je herschrijft. Zeer brede doelgroep — stuur actief aan op versmalling voordat je de kernbelofte schrijft.`,

  "caption-writer": `Je bent de Caption Writer-skill van Studio Crave, onderdeel van Course 05 — Plating uit de 7-Course Brand Method. "Je kunt een sterrenmaaltijd hebben, maar als het eruitziet als chaos, verkoopt het niet" — jij schrijft de tekst die de post verkoopt.

OUTPUT-REGEL: de caption klinkt als de klant, in hún branche en toon. Check eerst of er een Brand Foundation (doelgroep, kernbelofte, toon-van-stem) beschikbaar is in het gesprek. Is die er niet, vraag kort naar doelgroep + 3 kernwoorden voor toon voordat je schrijft.

WERKWIJZE
1. Input verzamelen: waar gaat de post over, wat is het doel (engagement, sales, autoriteit, awareness), welke Brand Foundation hoort erbij.
2. Kies het frame — SPCL:
   - Setting: schets kort de situatie/scène — concreet, geen abstractie
   - Problem: de spanning/frustratie die leeft bij de doelgroep
   - Climax: het omslagpunt — inzicht, actie, resultaat
   - Lesson: wat de lezer hiermee kan, verwoord als iets dat henzelf raakt — geen morele preek
3. Schrijf drie varianten met verschillende openingszinnen (de hook is de eerste regel, moet los van de rest al spanning geven), zelfde SPCL-kern.
4. CTA: één duidelijke, passend bij het doel — geen "like en volg voor meer".

STIJLREGELS: korte ritmische zinnen; witregels tussen gedachten, niet tussen elke zin; concrete beelden boven abstracte claims; geen hustle-taal, geen overdreven emoji tenzij de toon dat vraagt.

OUTPUT: lever 3 caption-varianten, elk met korte typering van de opening (bijv. "vraag-hook", "statement-hook", "scene-hook"), plus de gekozen CTA per variant.

RANDGEVALLEN: puur informatief onderwerp zonder persoonlijk verhaal — laat Setting/Problem klein, leun op Climax en Lesson. Lanceer-context — meld dat de Launch Carrousel/Story-skill daar beter bij past; jij bent voor losse/reguliere captions.`,
};

const COURSE_ACCENTS = {
  "raw-ingredients": "bg-bordeaux-dark",
  "flavor-profile": "bg-bordeaux",
  "signature-sauce": "bg-bordeaux-light",
  "positioning-cut": "bg-crave-red",
  plating: "bg-bordeaux",
  pairing: "bg-bordeaux-dark",
  "the-experience": "bg-crave-red",
  digestief: "bg-crave-ink",
};

function LoginGate({ onLogin }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const client = findClient(name, code);
    if (!client) {
      setError("Naam of toegangscode klopt niet. Check je uitnodiging en probeer opnieuw.");
      return;
    }
    setError("");
    onLogin(client);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white/60 border border-bordeaux/15 rounded-2xl p-8 shadow-sm"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-bordeaux/70 font-medium mb-2">
          Studio Crave
        </p>
        <h1 className="text-4xl font-black text-bordeaux-dark leading-none mb-6">
          Skills Dashboard
        </h1>
        <label className="block text-sm font-medium text-crave-ink/80 mb-1" htmlFor="name">
          Naam
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 rounded-lg border border-bordeaux/20 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-crave-red"
          autoComplete="name"
          required
        />
        <label className="block text-sm font-medium text-crave-ink/80 mb-1" htmlFor="code">
          Toegangscode
        </label>
        <input
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full mb-4 rounded-lg border border-bordeaux/20 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-crave-red"
          autoComplete="off"
          required
        />
        {error && <p className="text-sm text-crave-red mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-lg bg-bordeaux-dark text-crave-cream font-display font-bold text-lg tracking-wide py-2.5 hover:bg-bordeaux transition-colors"
        >
          Aan tafel
        </button>
      </form>
    </div>
  );
}

function SkillCard({ skill, onOpen }) {
  return (
    <div className="bg-white/70 border border-bordeaux/10 rounded-xl p-5 flex flex-col justify-between gap-4">
      <div>
        <h4 className="font-display font-bold text-xl text-bordeaux-dark leading-tight mb-1.5">
          {skill.name}
        </h4>
        <p className="text-sm text-crave-ink/75 leading-relaxed">{skill.teaser}</p>
      </div>
      {skill.wired ? (
        <button
          onClick={() => onOpen(skill)}
          className="self-start text-sm font-semibold text-crave-cream bg-crave-red hover:bg-bordeaux-dark transition-colors rounded-full px-4 py-1.5"
        >
          Open →
        </button>
      ) : (
        <span className="self-start text-xs font-semibold uppercase tracking-wide text-bordeaux/50 border border-bordeaux/20 rounded-full px-3 py-1">
          Binnenkort
        </span>
      )}
    </div>
  );
}

function CourseSection({ course, onOpenSkill }) {
  const [open, setOpen] = useState(course.number === "04");

  return (
    <section className="border-b border-bordeaux/10 last:border-b-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-4 py-6 text-left group"
      >
        <span
          className={`shrink-0 w-11 h-11 rounded-full ${COURSE_ACCENTS[course.id]} text-crave-cream font-display font-bold flex items-center justify-center text-sm`}
        >
          {course.number}
        </span>
        <span className="flex-1">
          <h3 className="font-display font-bold text-2xl md:text-3xl text-bordeaux-dark leading-tight">
            {course.title}
          </h3>
          <p className="text-sm text-crave-ink/60">{course.subtitle}</p>
        </span>
        <span
          className={`shrink-0 text-bordeaux-dark text-xl transition-transform ${open ? "rotate-45" : ""}`}
        >
          +
        </span>
      </button>
      {open && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
          {course.skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} onOpen={onOpenSkill} />
          ))}
        </div>
      )}
    </section>
  );
}

function ChatPanel({ skill, client, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: SYSTEM_PROMPTS[skill.id],
          messages: nextMessages,
        }),
      });
      if (!res.ok) throw new Error(`API antwoordde met ${res.status}`);
      const data = await res.json();
      setMessages([...nextMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError("Kon geen antwoord ophalen. Check of de API-key is ingesteld en probeer opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-bordeaux-dark/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-6">
      <div className="bg-crave-cream w-full sm:max-w-2xl sm:rounded-2xl h-[85vh] sm:h-[80vh] flex flex-col shadow-xl overflow-hidden">
        <header className="flex items-center justify-between px-5 py-4 bg-bordeaux-dark text-crave-cream">
          <div>
            <p className="text-xs uppercase tracking-wide text-crave-cream/60">
              {client.name} · Studio Crave
            </p>
            <h3 className="font-display font-bold text-2xl leading-none">{skill.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-crave-cream/70 hover:text-crave-cream text-2xl leading-none px-2"
            aria-label="Sluiten"
          >
            ×
          </button>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4 space-y-4">
          {messages.length === 0 && (
            <p className="text-sm text-crave-ink/60">
              Vertel wat je nodig hebt — hoe meer context, hoe scherper de output.
            </p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-bordeaux text-crave-cream ml-auto"
                  : "bg-white text-crave-ink border border-bordeaux/10"
              }`}
            >
              {m.content}
            </div>
          ))}
          {loading && <p className="text-sm text-crave-ink/50 italic">Aan het schrijven…</p>}
          {error && <p className="text-sm text-crave-red">{error}</p>}
        </div>

        <form onSubmit={sendMessage} className="flex gap-2 p-4 border-t border-bordeaux/10">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Typ je bericht…"
            className="flex-1 rounded-full border border-bordeaux/20 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crave-red"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-crave-red text-crave-cream font-semibold px-5 py-2 text-sm disabled:opacity-50"
          >
            Stuur
          </button>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  const [client, setClient] = useState(() => {
    try {
      const stored = localStorage.getItem("crave_client");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [activeSkill, setActiveSkill] = useState(null);

  function handleLogin(c) {
    localStorage.setItem("crave_client", JSON.stringify(c));
    setClient(c);
  }

  function handleLogout() {
    localStorage.removeItem("crave_client");
    setClient(null);
  }

  const wiredCount = useMemo(
    () => COURSES.flatMap((c) => c.skills).filter((s) => s.wired).length,
    []
  );
  const totalCount = useMemo(() => COURSES.flatMap((c) => c.skills).length, []);

  if (!client) return <LoginGate onLogin={handleLogin} />;

  return (
    <div className="min-h-screen">
      <header className="border-b border-bordeaux/10 px-6 py-6 flex items-center justify-between max-w-5xl mx-auto">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-bordeaux/70 font-medium">
            Studio Crave · {client.name}
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-bordeaux-dark leading-none">
            7-Course Brand Method
          </h1>
          <p className="text-sm text-crave-ink/60 mt-1">
            {wiredCount} van de {totalCount} skills zijn nu live — de rest volgt.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-bordeaux/60 hover:text-bordeaux-dark shrink-0"
        >
          Uitloggen
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6">
        {COURSES.map((course) => (
          <CourseSection key={course.id} course={course} onOpenSkill={setActiveSkill} />
        ))}
      </main>

      {activeSkill && (
        <ChatPanel skill={activeSkill} client={client} onClose={() => setActiveSkill(null)} />
      )}
    </div>
  );
}
