"use client";

import { useEffect, useMemo, useState } from "react";
import { FEEDS, type FeedType } from "@/data/event-categories";
import { CATEGORY_LABELS } from "@/data/event-categories";
import type { Locale } from "@/types/event";

/** Métadonnées d'affichage (emoji + description courte) par flux. */
const FEED_META: Record<FeedType, { emoji: string; desc: Record<Locale, string> }> = {
  all: {
    emoji: "🇪🇹",
    desc: {
      fr: "Tout : fêtes, jeûnes majeurs, culturel et national.",
      en: "Everything: feasts, major fasts, cultural and national.",
      am: "ሁሉም፤ በዓላት፣ ዐበይት ጾሞች፣ ባህላዊ እና ብሔራዊ።",
    },
  },
  "ethiopian-orthodox": {
    emoji: "☦️",
    desc: {
      fr: "Fêtes orthodoxes fixes et mobiles (Genna, Timkat, Fasika…).",
      en: "Fixed and movable Orthodox feasts (Genna, Timkat, Fasika…).",
      am: "የኦርቶዶክስ በዓላት (ገና፣ ጥምቀት፣ ፋሲካ…)።",
    },
  },
  "ethiopian-cultural": {
    emoji: "🎉",
    desc: {
      fr: "Nouvel An, Adwa, Ashenda et jours fériés nationaux.",
      en: "New Year, Adwa, Ashenda and national holidays.",
      am: "እንቁጣጣሽ፣ ዐድዋ፣ አሸንዳ እና ብሔራዊ በዓላት።",
    },
  },
  "ethiopian-fasting": {
    emoji: "🙏",
    desc: {
      fr: "Grands jeûnes : Carême, Ninive, Filseta, Avent, Apôtres.",
      en: "Major fasts: Lent, Nineveh, Filseta, Advent, Apostles.",
      am: "ዐበይት ጾሞች፦ ዓቢይ ጾም፣ ነነዌ፣ ፍልሰታ…።",
    },
  },
  "ethiopian-weekly-fasts": {
    emoji: "📆",
    desc: {
      fr: "Jeûnes du mercredi et du vendredi (hors exceptions).",
      en: "Wednesday and Friday fasts (with exceptions).",
      am: "የረቡዕ እና የዓርብ ጾም።",
    },
  },
  "ethiopian-commemorations": {
    emoji: "🕯️",
    desc: {
      fr: "Commémorations mensuelles des saints (Michel, Gabriel, Mariam…).",
      en: "Monthly saint commemorations (Michael, Gabriel, Mary…).",
      am: "ወርኀዊ የቅዱሳን መታሰቢያ።",
    },
  },
};

const FEED_ORDER: FeedType[] = [
  "all",
  "ethiopian-orthodox",
  "ethiopian-cultural",
  "ethiopian-fasting",
  "ethiopian-weekly-fasts",
  "ethiopian-commemorations",
];

const UI = {
  fr: {
    tagline: "Générateur de calendrier ICS",
    intro:
      "Abonnez-vous aux événements culturels éthiopiens et aux rites orthodoxes Tewahedo dans Google Agenda, Apple Calendar ou tout client compatible. Les dates sont converties du calendrier éthiopien vers le grégorien, recalculées chaque année.",
    options: "Options",
    weekly: "Jeûnes hebdomadaires (mer./ven.)",
    monthly: "Commémorations mensuelles",
    language: "Langue",
    copy: "Copier le lien",
    copied: "Copié ✓",
    google: "Google Agenda",
    other: "Apple / autre",
    howTitle: "Comment s'abonner",
    how: [
      "Choisissez un flux et copiez son URL (bouton « Copier »).",
      "Google Agenda → « Autres agendas » → « À partir de l'URL » → collez.",
      "Ou cliquez « Google Agenda » / « Apple » pour ouvrir directement.",
      "Le calendrier se met à jour automatiquement, chaque année.",
    ],
    apiTitle: "API par année",
    apiNote:
      "Pour une seule année précise, utilisez l'API paramétrable :",
    subscribeUrl: "URL d'abonnement",
  },
  en: {
    tagline: "ICS calendar generator",
    intro:
      "Subscribe to Ethiopian cultural events and Orthodox Tewahedo rites in Google Calendar, Apple Calendar or any compatible client. Dates are converted from the Ethiopian to the Gregorian calendar, recomputed every year.",
    options: "Options",
    weekly: "Weekly fasts (Wed/Fri)",
    monthly: "Monthly commemorations",
    language: "Language",
    copy: "Copy link",
    copied: "Copied ✓",
    google: "Google Calendar",
    other: "Apple / other",
    howTitle: "How to subscribe",
    how: [
      "Pick a feed and copy its URL (the “Copy” button).",
      "Google Calendar → “Other calendars” → “From URL” → paste.",
      "Or click “Google Calendar” / “Apple” to open directly.",
      "The calendar updates automatically, every year.",
    ],
    apiTitle: "By-year API",
    apiNote: "For a single specific year, use the parameterized API:",
    subscribeUrl: "Subscription URL",
  },
  am: {
    tagline: "የ ICS ካላንደር ማመንጫ",
    intro:
      "የኢትዮጵያ ባህላዊ ዝግጅቶችን እና የኦርቶዶክስ ተዋሕዶ ሥርዓቶችን በGoogle ካላንደር ይመዝገቡ። ቀኖች ከኢትዮጵያ አቆጣጠር ወደ ግሪጎሪያን ይቀየራሉ።",
    options: "አማራጮች",
    weekly: "ሳምንታዊ ጾም (ረቡዕ/ዓርብ)",
    monthly: "ወርኀዊ መታሰቢያ",
    language: "ቋንቋ",
    copy: "ሊንክ ቅዳ",
    copied: "ተቀድቷል ✓",
    google: "Google ካላንደር",
    other: "Apple / ሌላ",
    howTitle: "እንዴት መመዝገብ",
    how: [
      "ፍሰት ይምረጡ እና URL ይቅዱ።",
      "Google ካላንደር → ሌሎች ካላንደሮች → ከURL → ይለጥፉ።",
      "ወይም “Google ካላንደር” ይጫኑ።",
      "ካላንደሩ በራሱ በየዓመቱ ይዘምናል።",
    ],
    apiTitle: "በዓመት API",
    apiNote: "ለአንድ ዓመት፦",
    subscribeUrl: "የመመዝገቢያ URL",
  },
};

const LOCALES: { code: Locale; label: string }[] = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "am", label: "አማርኛ" },
];

function weeklyApplies(id: FeedType): boolean {
  const f = FEEDS[id];
  return f.categories.includes("fasting") && !f.weeklyFastsOnly;
}
function monthlyApplies(id: FeedType): boolean {
  const f = FEEDS[id];
  return (
    f.categories.includes("commemoration") && !f.includeMonthlyCommemorations
  );
}

export default function HomePage() {
  const [origin, setOrigin] = useState("");
  const [lang, setLang] = useState<Locale>("fr");
  const [weekly, setWeekly] = useState(false);
  const [monthly, setMonthly] = useState(false);
  const [copied, setCopied] = useState<FeedType | null>(null);

  useEffect(() => setOrigin(window.location.origin), []);

  const t = UI[lang];

  const feedUrl = useMemo(
    () => (id: FeedType) => {
      const params = new URLSearchParams();
      if (lang !== "fr") params.set("lang", lang);
      if (weekly && weeklyApplies(id)) params.set("weekly", "true");
      if (monthly && monthlyApplies(id)) params.set("monthly", "true");
      const qs = params.toString();
      return `${origin}/api/calendar/${id}.ics${qs ? `?${qs}` : ""}`;
    },
    [origin, lang, weekly, monthly],
  );

  const webcal = (url: string) => url.replace(/^https?:/, "webcal:");
  const googleUrl = (url: string) =>
    `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcal(url))}`;

  async function copy(id: FeedType) {
    try {
      await navigator.clipboard.writeText(feedUrl(id));
      setCopied(id);
      setTimeout(() => setCopied((c) => (c === id ? null : c)), 1800);
    } catch {
      /* clipboard indisponible — ignorer */
    }
  }

  const apiExample = `${origin}/api/calendar?year=2026&type=all&lang=${lang}`;

  return (
    <main className="wrap">
      <header className="hero">
        <div className="flag" aria-hidden>
          🇪🇹
        </div>
        <h1>
          Calendrier éthiopien <span className="amp">·</span>{" "}
          <span className="sub">{t.tagline}</span>
        </h1>
        <p className="intro">{t.intro}</p>

        <div className="controls">
          <label className="field">
            <span>{t.language}</span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Locale)}
            >
              {LOCALES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </label>
          <fieldset className="toggles">
            <legend>{t.options}</legend>
            <label>
              <input
                type="checkbox"
                checked={weekly}
                onChange={(e) => setWeekly(e.target.checked)}
              />
              {t.weekly}
            </label>
            <label>
              <input
                type="checkbox"
                checked={monthly}
                onChange={(e) => setMonthly(e.target.checked)}
              />
              {t.monthly}
            </label>
          </fieldset>
        </div>
      </header>

      <section className="grid">
        {FEED_ORDER.map((id) => {
          const feed = FEEDS[id];
          const meta = FEED_META[id];
          const url = feedUrl(id);
          const name = feed.name[lang] ?? feed.name.fr;
          return (
            <article key={id} className="card">
              <div className="card-head">
                <span className="emoji" aria-hidden>
                  {meta.emoji}
                </span>
                <h2>{name}</h2>
              </div>
              <p className="desc">{meta.desc[lang] ?? meta.desc.fr}</p>

              <div className="tags">
                {feed.categories.map((c) => (
                  <span key={c} className="tag">
                    {CATEGORY_LABELS[c][lang] ?? CATEGORY_LABELS[c].fr}
                  </span>
                ))}
              </div>

              <label className="urlbox">
                <span className="urllabel">{t.subscribeUrl}</span>
                <code>{url || `…/api/calendar/${id}.ics`}</code>
              </label>

              <div className="actions">
                <button className="btn primary" onClick={() => copy(id)}>
                  {copied === id ? t.copied : t.copy}
                </button>
                <a
                  className="btn"
                  href={googleUrl(url)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t.google}
                </a>
                <a className="btn" href={webcal(url)}>
                  {t.other}
                </a>
              </div>
            </article>
          );
        })}
      </section>

      <section className="how">
        <h2>{t.howTitle}</h2>
        <ol>
          {t.how.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <h3>{t.apiTitle}</h3>
        <p className="apinote">{t.apiNote}</p>
        <code className="api">{apiExample}</code>
      </section>

      <footer className="foot">
        <a
          href="https://github.com/naimboughattas/ethiopian-calendar-ics-converter"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <span>·</span>
        <span>Conversion éthiopien → grégorien · RFC 5545</span>
      </footer>

      <style jsx>{`
        .wrap {
          max-width: 1040px;
          margin: 0 auto;
          padding: clamp(1.25rem, 4vw, 3rem) 1.25rem 4rem;
        }
        .hero {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .flag {
          font-size: 2.75rem;
          line-height: 1;
        }
        h1 {
          font-size: clamp(1.6rem, 4.5vw, 2.5rem);
          margin: 0.4rem 0 0.2rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        h1 .sub {
          color: var(--accent);
          font-weight: 700;
        }
        h1 .amp {
          color: var(--gold);
        }
        .intro {
          max-width: 62ch;
          margin: 0.75rem auto 0;
          color: var(--muted);
        }
        .controls {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          align-items: flex-end;
          margin-top: 1.75rem;
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          font-size: 0.8rem;
          color: var(--muted);
          text-align: left;
        }
        select {
          padding: 0.5rem 0.75rem;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text);
          font-size: 0.95rem;
        }
        .toggles {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem 1rem;
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 0.55rem 0.9rem;
          background: var(--surface);
          margin: 0;
        }
        .toggles legend {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--muted);
          padding: 0 0.35rem;
        }
        .toggles label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.9rem;
          cursor: pointer;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }
        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.15rem 1.15rem 1rem;
          box-shadow: var(--shadow);
          display: flex;
          flex-direction: column;
        }
        .card-head {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .emoji {
          font-size: 1.5rem;
        }
        .card h2 {
          font-size: 1.05rem;
          margin: 0;
          font-weight: 700;
        }
        .desc {
          color: var(--muted);
          font-size: 0.9rem;
          margin: 0.6rem 0 0.75rem;
          min-height: 2.7em;
        }
        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-bottom: 0.85rem;
        }
        .tag {
          font-size: 0.7rem;
          padding: 0.15rem 0.5rem;
          border-radius: 999px;
          background: var(--surface-2);
          color: var(--muted);
          border: 1px solid var(--border);
        }
        .urlbox {
          display: block;
          margin-bottom: 0.85rem;
        }
        .urllabel {
          display: block;
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--muted);
          margin-bottom: 0.25rem;
        }
        .urlbox code {
          display: block;
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 9px;
          padding: 0.5rem 0.6rem;
          font-size: 0.76rem;
          word-break: break-all;
          color: var(--text);
        }
        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: auto;
        }
        .btn {
          appearance: none;
          border: 1px solid var(--border);
          background: var(--surface-2);
          color: var(--text);
          border-radius: 10px;
          padding: 0.5rem 0.8rem;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition:
            transform 0.06s ease,
            filter 0.15s ease;
        }
        .btn:hover {
          filter: brightness(1.05);
        }
        .btn:active {
          transform: translateY(1px);
        }
        .btn.primary {
          background: var(--accent);
          border-color: var(--accent);
          color: #fff;
        }
        .how {
          margin-top: 3rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.5rem 1.5rem 1.75rem;
        }
        .how h2 {
          margin-top: 0;
        }
        .how ol {
          padding-left: 1.2rem;
          color: var(--text);
        }
        .how li {
          margin: 0.25rem 0;
        }
        .apinote {
          color: var(--muted);
          margin-bottom: 0.5rem;
        }
        .api,
        code.api {
          display: block;
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 9px;
          padding: 0.6rem 0.7rem;
          font-size: 0.8rem;
          word-break: break-all;
        }
        .foot {
          margin-top: 2.5rem;
          text-align: center;
          color: var(--muted);
          font-size: 0.85rem;
          display: flex;
          gap: 0.6rem;
          justify-content: center;
          flex-wrap: wrap;
        }
      `}</style>
    </main>
  );
}
