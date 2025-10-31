# Olympic Games Dashboard

Application Angular de visualisation des données des Jeux Olympiques.

## Prérequis

- Node.js (version recommandée : LTS)
- Angular CLI 18.0.6

## Installation

```bash
npm install
```

## Développement

Lancer le serveur de développement :

```bash
npm start
```

L'application sera accessible sur `http://localhost:4200/`

## Build

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `dist/`.

## Architecture

```
src/app/
├── components/              # Composants réutilisables standalone
│   ├── line-chart/         # Graphique linéaire (Chart.js)
│   ├── pie-chart/          # Graphique camembert (Chart.js)
│   ├── page-stats-header/  # En-tête de page avec statistiques
│   └── loading/            # Composant de chargement
│
├── pages/                   # Composants de pages (routing)
│   ├── home/               # Page d'accueil avec vue d'ensemble
│   ├── country/            # Page détail d'un pays
│   └── not-found/          # Page 404
│
├── services/                # Services métier
│   ├── data.service.ts     # Gestion des données olympiques
│   └── chart.service.ts    # Création et gestion des graphiques
│
├── models/                  # Interfaces TypeScript
│   ├── Olympic.ts          # Modèle de données olympiques
│   ├── Participation.ts    # Modèle de participation aux JO
│   └── Statistic.ts        # Modèle de statistique
│
└── constants/               # Constantes de l'application
    └── chart-colors.ts     # Palettes de couleurs pour les graphiques
```

**Principes appliqués** :

- Composants standalone réutilisables
- Typage TypeScript strict (sans `any`)
- Séparation présentation/logique métier
- Architecture prête pour une connexion API

## Technologies

- Angular 18
- TypeScript
- Chart.js
- RxJS
