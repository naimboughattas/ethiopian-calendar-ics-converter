# Déploiement (Vercel)

Le projet est un Next.js standard : déploiement **zéro configuration** sur
Vercel. Les routes `/api/calendar/*` deviennent des fonctions serverless ; les
flux `.ics` sont mis en cache au niveau du CDN (voir en-têtes plus bas).

## Prérequis

- Compte Vercel.
- Node ≥ 20 (fixé via `engines` dans `package.json`).
- Le dépôt Git initialisé (fait) — utile pour le déploiement continu via GitHub.

## Option A — Import GitHub (recommandé, déploiement continu)

1. Créer un dépôt GitHub et y pousser le code :
   ```bash
   git remote add origin git@github.com:<utilisateur>/ethiopian-calendar-converter.git
   git push -u origin main
   ```
2. Sur https://vercel.com → **Add New… → Project** → importer le dépôt.
3. Framework détecté : **Next.js**. Aucun réglage à changer.
4. **Deploy**. Chaque `git push` sur `main` redéploie automatiquement.

## Option B — CLI (déploiement manuel)

```bash
npm i -g vercel      # ou npx vercel
vercel login         # OAuth interactif (navigateur)
vercel               # déploiement de prévisualisation
vercel --prod        # déploiement en production
```

> En environnement non interactif (CI), utiliser un jeton :
> `vercel --prod --token "$VERCEL_TOKEN" --yes`.
> Créer le jeton sur https://vercel.com/account/tokens.

## Après déploiement — URLs d'abonnement

Remplacer `<app>` par le domaine attribué (ex. `ethiopian-calendar.vercel.app`) :

```
https://<app>/api/calendar/all.ics
https://<app>/api/calendar/ethiopian-orthodox.ics
https://<app>/api/calendar/ethiopian-cultural.ics
https://<app>/api/calendar/ethiopian-fasting.ics
https://<app>/api/calendar/ethiopian-weekly-fasts.ics
https://<app>/api/calendar/ethiopian-commemorations.ics
```

Paramètres : `?lang=fr|en|am`, `?weekly=true`, `?monthly=true`.

Ajout dans Google Agenda : **Autres agendas → À partir de l'URL** → coller l'URL.

## Cache CDN

Les réponses `.ics` envoient :

```
Cache-Control: public, max-age=3600, s-maxage=43200, stale-while-revalidate=86400
```

- `s-maxage=43200` : le CDN Vercel sert la réponse en cache **12 h** (les
  fonctions ne se réexécutent pas à chaque abonné).
- `stale-while-revalidate=86400` : sert l'ancienne version pendant la
  régénération, jusqu'à 24 h.

Ces durées conviennent à un calendrier (contenu quasi statique par année). Le
contenu étant recalculé sur une **fenêtre glissante** (année−1 → année+3), les
URLs n'expirent pas.

## Vérifications post-déploiement

```bash
curl -I https://<app>/api/calendar/all.ics          # 200, text/calendar
curl -s https://<app>/api/calendar/all.ics | head   # BEGIN:VCALENDAR …
```

## Notes

- Aucune variable d'environnement requise.
- Aucune base de données : tout est calculé à la volée (fonctions pures).
- Runtime Node (par défaut) — nécessaire car `TextEncoder`/`TextDecoder` et la
  logique de dates s'exécutent côté serveur ; ne pas forcer le runtime Edge.
