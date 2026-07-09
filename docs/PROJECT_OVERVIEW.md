# Project Overview

## Objectif

Fournir un **générateur de calendrier abonnable (ICS)** pour Google Calendar,
couvrant :

- les **événements culturels et nationaux** éthiopiens ;
- les **rites orthodoxes Tewahedo** (fêtes fixes, fêtes mobiles, jeûnes,
  commémorations) ;

avec une **conversion correcte du calendrier éthiopien vers le grégorien**,
recalculée pour chaque année.

## Problème résolu

Le calendrier éthiopien diffère du grégorien (13 mois, décalage de 7–8 ans,
règle de bissextilité propre). Les fêtes éthiopiennes sont définies dans **leur**
calendrier ; leur date grégorienne **change chaque année** et dépend des années
bissextiles des deux calendriers. Coder des dates grégoriennes en dur produit
des erreurs (typiquement ±1 jour autour des années bissextiles). Ce projet
stocke la **source de vérité** en date éthiopienne (ou en règle liturgique) et
**calcule** la date grégorienne.

## Utilisateurs cibles

- Membres de la diaspora éthiopienne souhaitant suivre fêtes et jeûnes.
- Paroisses et communautés orthodoxes Tewahedo.
- Toute personne intéressée par la culture éthiopienne.

## Périmètre (v1)

Inclus :

- Conversion éthiopien ↔ grégorien (fonctions pures, testées).
- Fêtes fixes culturelles/nationales/orthodoxes.
- Fêtes mobiles dérivées de Fasika.
- Périodes de jeûne majeures.
- Flux ICS multiples + API par année.
- Français et anglais.

Exclu (v1, voir ROADMAP) :

- Jeûnes hebdomadaires mercredi/vendredi.
- Fêtes régionales à date coutumière variable (ex. Irreecha).
- Interface de personnalisation avancée.
- Amharique complet (structure prête, contenu partiel).

## Principes directeurs

1. **Documentation d'abord** : aucune règle calendaire non documentée.
2. **Source de vérité = date éthiopienne / règle liturgique.**
3. **Fonctions pures** pour toute conversion (déterministes, testables).
4. **Séparation** fixe / mobile / culturel / national / jeûne.
5. **UID ICS stables.**
6. **i18n prévue** dès le modèle de données.
7. **Tests stricts** couvrant les cas limites (bissextiles, chevauchements).

## Critères de succès

- Un utilisateur peut s'abonner à une URL et voir les fêtes aux **bonnes dates
  grégoriennes**, année après année, sans intervention.
- La conversion passe les tests d'ancrage (Nouvel An, Genna, Timkat, Meskel,
  Fasika) sur plusieurs années, dont les années à décalage.
