import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Calendrier éthiopien — Générateur ICS",
  description:
    "Flux ICS pour Google Calendar : événements culturels éthiopiens et rites orthodoxes Tewahedo.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          maxWidth: 760,
          margin: "0 auto",
          padding: "2rem 1.25rem",
          lineHeight: 1.6,
        }}
      >
        {children}
      </body>
    </html>
  );
}
