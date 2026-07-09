import { FEEDS } from "@/data/event-categories";

/** Page d'accueil : présente les flux ICS et comment s'y abonner. */
export default function HomePage() {
  const feeds = Object.entries(FEEDS);
  return (
    <main>
      <h1>Calendrier éthiopien — Générateur ICS</h1>
      <p>
        Flux <code>.ics</code> abonnables pour Google Calendar : événements
        culturels éthiopiens et rites orthodoxes Tewahedo, avec conversion
        fiable du calendrier éthiopien vers le calendrier grégorien.
      </p>

      <h2>Flux disponibles</h2>
      <ul>
        {feeds.map(([key, feed]) => (
          <li key={key}>
            <strong>{feed.name.fr}</strong> —{" "}
            <code>/api/calendar/{key}.ics</code>
          </li>
        ))}
      </ul>

      <h2>S'abonner dans Google Calendar</h2>
      <ol>
        <li>Copiez l'URL publique d'un flux ci-dessus.</li>
        <li>
          Google Agenda → « Autres agendas » → « À partir de l'URL » → collez
          l'URL.
        </li>
        <li>Le calendrier se met à jour automatiquement.</li>
      </ol>

      <p>
        Paramètres : <code>?lang=fr|en|am</code> pour la langue. L'API par année
        est disponible sur{" "}
        <code>/api/calendar?year=2026&amp;type=all&amp;lang=fr</code>.
      </p>
    </main>
  );
}
