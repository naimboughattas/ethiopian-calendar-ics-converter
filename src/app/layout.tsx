import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Calendrier éthiopien — Générateur ICS",
  description:
    "Flux ICS pour Google Calendar : événements culturels éthiopiens et rites orthodoxes Tewahedo, avec conversion fiable éthiopien → grégorien.",
};

const GLOBAL_CSS = `
  :root {
    --bg: #faf9f7;
    --surface: #ffffff;
    --surface-2: #f3f1ec;
    --border: #e6e2da;
    --text: #1b1a17;
    --muted: #6b6459;
    --accent: #b8352c;
    --accent-2: #1f7a4d;
    --gold: #d9a441;
    --shadow: 0 1px 2px rgba(0,0,0,.05), 0 8px 24px rgba(0,0,0,.06);
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #16150f;
      --surface: #201e17;
      --surface-2: #2a2820;
      --border: #38352b;
      --text: #f2efe6;
      --muted: #a49a88;
      --accent: #e5675c;
      --accent-2: #4cc088;
      --gold: #e8bb5a;
      --shadow: 0 1px 2px rgba(0,0,0,.3), 0 10px 30px rgba(0,0,0,.4);
    }
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    background: var(--bg);
    color: var(--text);
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }
  a { color: var(--accent); }
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
