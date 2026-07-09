# Roadmap

## Phases d'exécution

| Phase | Contenu | État |
|---|---|---|
| 1 | **Documentation** (README + 13 docs) | ✅ Fait |
| 2 | **Modèle de données** typé (`types/`) | ✅ Fait |
| 3 | **Conversion** éthiopien ↔ grégorien + tests | ✅ Fait |
| 4 | **Événements fixes** (dates éthiopiennes) | ✅ Fait |
| 5 | **Fêtes mobiles** orthodoxes (Fasika) | ✅ Fait |
| 6 | **Jeûnes** multi-jours | ✅ Fait |
| 7 | **Génération ICS** compatible Google | ✅ Fait |
| 8 | **API Next.js** (routes `.ics` publiques) | ✅ Fait |
| 9 | **Tests** (conversion, événements, bissextiles, ICS, jeûnes hebdo, commémorations) | ✅ Fait (67 tests) |
| 10 | **Documentation finale** (README complet) | ✅ Fait |

## Prochaines évolutions (post-v1)

### Contenu calendaire
- ✅ **Jeûnes hebdomadaires** mercredi/vendredi (fenêtre pascale + fêtes +
  anti-doublon) — via `?weekly=true`. Reste à affiner : exemptions coutumières
  mineures (semaine post-Genna, etc.).
- ✅ **Commémorations mensuelles** de saints (Michel, Gabriel, Mariam, Kidane
  Mihret…) — via `?monthly=true` et flux `ethiopian-commemorations.ics`. Reste
  à enrichir/valider la liste par paroisse.
- **Fêtes régionales** à date coutumière (Irreecha) — nécessite une règle
  dédiée et des sources.
- Enrichir les **noms amhariques** manquants.

### Qualité
- **Snapshots ICS** par flux/année.
- **Tests d'intégration HTTP** des routes (params, erreurs 400/404).
- **Property-based testing** (fast-check) sur la conversion.
- Validation par un **parseur iCalendar** tiers.

### Produit
- **Amharique** complet (contenu i18n).
- **Sélecteur de flux** et prévisualisation sur la page d'accueil.
- **Personnalisation** (choix des catégories, langue par abonnement).
- **Rappels** (VALARM) optionnels pour certaines fêtes.
- **Déploiement** documenté (Vercel) + URL publique stable.

### Fiabilité calendaire
- Étendre/valider la **fenêtre au-delà de 2099** (offset julien variable).
- Comparaison automatisée au **bâhre hasab** annuel officiel.

## Convention de livraison

Un commit par phase (voir MCP_SETUP `git`), la documentation mise à jour **dans
le même commit** que le code correspondant.
