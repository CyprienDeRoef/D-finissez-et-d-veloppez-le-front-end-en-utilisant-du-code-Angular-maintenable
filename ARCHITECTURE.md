# Architecture de l'application Olympic Games

## Vue d'ensemble

Application Angular développée avec une architecture modulaire et maintenable, suivant les bonnes pratiques Angular et les principes de séparation des responsabilités.

## Arborescence des dossiers

```
src/app/
├── components/              # Composants réutilisables standalone
│   ├── line-chart/         # Graphique en ligne (Chart.js)
│   ├── pie-chart/          # Graphique camembert (Chart.js)
│   ├── page-header/        # En-tête de page
│   └── stat-card/          # Carte de statistique
│
├── pages/                   # Composants de pages (routing)
│   ├── home/               # Page d'accueil (dashboard)
│   ├── country/            # Page détail d'un pays
│   └── not-found/          # Page 404
│
├── services/                # Services métier
│   ├── data.service.ts     # Gestion des données et logique métier
│   └── chart.service.ts    # Service pour la création de charts
│
├── models/                  # Interfaces TypeScript
│   ├── Olympic.ts          # Modèle de données olympiques
│   └── Participation.ts    # Modèle de participation
│
├── constants/               # Constantes de l'application
│   └── chart-colors.ts     # Palettes de couleurs pour les graphiques
│
└── app.module.ts           # Module principal de l'application
```

## Composants et leurs rôles

### Composants Standalone Réutilisables

#### `PieChartComponent`

- **Rôle** : Affiche un graphique camembert avec Chart.js
- **Inputs** : `countries`, `medalsData`, `chartId`
- **Outputs** : `sliceClick` - Émission d'événement lors du clic sur une portion
- **Responsabilité** : Visualisation des médailles par pays
- **Autonomie** : Composant standalone importable dans n'importe quel module

#### `LineChartComponent`

- **Rôle** : Affiche un graphique en ligne avec Chart.js
- **Inputs** : `years`, `medalsData`, `chartId`
- **Responsabilité** : Visualisation de l'évolution des médailles par année
- **Autonomie** : Composant standalone importable dans n'importe quel module

#### `PageStatsHeaderComponent`

- **Rôle** : Composant unifié affichant le titre de page + statistiques sous forme de cartes
- **Inputs** : `title` (string), `statistics` (Statistic[])
- **Responsabilité** : Gestion cohérente de l'en-tête des pages avec leurs indicateurs
- **Autonomie** : Composant standalone importable dans n'importe quel module
- **Architecture** : Remplace et unifie `StatCardComponent` + `PageHeaderComponent`

### Composants de Pages (Routing)

#### `HomeComponent`

- **Rôle** : Page d'accueil / dashboard de l'application
- **Responsabilités** :
  - Charger les données olympiques via `DataService`
  - Calculer les statistiques globales (nombre de pays, nombre de JOs)
  - Afficher le graphique camembert des médailles par pays
  - Gérer la navigation vers la page de détail d'un pays
- **Services utilisés** : `DataService`, `Router`

#### `CountryComponent`

- **Rôle** : Page de détail d'un pays spécifique
- **Responsabilités** :
  - Récupérer les données d'un pays via son nom (paramètre de route)
  - Calculer les statistiques du pays (total médailles, athlètes, participations)
  - Afficher l'évolution des médailles par année (graphique ligne)
- **Services utilisés** : `DataService`, `ActivatedRoute`, `Router`

#### `NotFoundComponent`

- **Rôle** : Page 404 pour les routes non trouvées
- **Responsabilités** : Afficher un message d'erreur et permettre le retour à l'accueil

## Services et leurs rôles

### `DataService`

**Rôle principal** : Service central pour la gestion des données olympiques et la logique métier

**Responsabilités** :

1. **Gestion des données** :

   - Stockage des données olympiques dans un `BehaviorSubject<Olympic[]>`
   - Mise à disposition des données via des Observables
   - Filtrage par pays : `getOlympicByCountry(name: string)`

2. **Logique métier et calculs** :
   - `getTotalJOs(olympics: Olympic[])` : Calcule le nombre total de JOs (années uniques)
   - `getCountries(olympics: Olympic[])` : Extrait la liste des pays
   - `getTotalMedalsPerCountry(olympics: Olympic[])` : Calcule les médailles par pays
   - `getTotalMedals(olympic: Olympic)` : Somme des médailles d'un pays
   - `getTotalAthletes(olympic: Olympic)` : Somme des athlètes d'un pays
   - `getYears(olympic: Olympic)` : Extrait les années de participation
   - `getMedalsByYear(olympic: Olympic)` : Médailles par année
   - `getTotalEntries(olympic: Olympic)` : Nombre de participations

**Principe de responsabilité unique** : Toute la logique métier liée aux données olympiques est centralisée dans ce service.

### `ChartService`

**Rôle principal** : Service technique pour la création et gestion des graphiques Chart.js

**Responsabilités** :

1. **Création de charts typée** :

   - Méthode générique `createChart<T>(config: ChartOptions<T>)` avec typage fort
   - Récupération sécurisée du canvas DOM
   - Configuration du chart avec datasets et options
   - Gestion des événements onClick de manière typée

2. **Gestion du cycle de vie** :
   - `destroyChart(chart)` : Destruction sécurisée des instances Chart.js

**Avantages** :

- Code réutilisable pour tous les types de charts
- Typage TypeScript strict (pas de `any`)
- Gestion centralisée des erreurs (canvas non trouvé)
- Simplification du code dans les composants

## Modèles de données

### `Olympic`

```typescript
interface Olympic {
  id: number;
  country: string;
  participations: Participation[];
}
```

### `Participation`

```typescript
interface Participation {
  id: number;
  year: number;
  city: string;
  medalsCount: number;
  athleteCount: number;
}
```

**Typage strict** : Tous les types `any` ont été remplacés par ces interfaces typées.

## Préparation à une connexion back-end/API

L'architecture actuelle est conçue pour faciliter l'intégration d'une API REST future :

### 1. Séparation des responsabilités

- **Services isolés** : La logique métier est déjà dans `DataService`, prête à recevoir des données HTTP
- **Composants découplés** : Les composants ne connaissent que les services, pas la source des données

### 2. Migration vers HTTP facile

```typescript
// Actuellement : données en mémoire
private olympics$ = new BehaviorSubject<Olympic[]>([...]);

// Futur : HTTP + cache
loadInitialData(): Observable<Olympic[]> {
  return this.http.get<Olympic[]>('/api/olympics').pipe(
    tap(data => this.olympics$.next(data)),
    catchError(this.handleError)
  );
}
```

### 3. Patterns déjà en place

- **Observables** : Toute la communication utilise RxJS (async par défaut)
- **BehaviorSubject** : Cache client-side déjà implémenté
- **Gestion d'erreurs** : Structure `subscribe(success, error)` présente
- **Typage** : Modèles TypeScript prêts pour la validation des réponses API

### 4. Points d'extension futurs

- **Intercepteurs HTTP** : Gestion centralisée des tokens, erreurs, loading
- **Environment** : Configuration des URLs d'API par environnement
- **Error handling** : Service dédié aux erreurs HTTP
- **Loading states** : Service pour gérer les états de chargement global
- **Offline-first** : Le BehaviorSubject peut devenir un cache intelligent

## Bonnes pratiques appliquées

✅ **Composants standalone** : Réutilisables et testables indépendamment  
✅ **Typage strict** : Aucun `any`, interfaces TypeScript partout  
✅ **Séparation présentation/logique** : Composants = vue, Services = logique  
✅ **Reactive programming** : Utilisation d'Observables et RxJS  
✅ **DRY (Don't Repeat Yourself)** : Code mutualisé dans les services  
✅ **Single Responsibility** : Chaque composant/service a une responsabilité claire  
✅ **Encapsulation des styles** : SCSS scopé par composant  
✅ **Gestion mémoire** : Destruction des charts dans `ngOnDestroy()`  
✅ **Constantes typées** : Couleurs des charts centralisées

## Architecture modulaire

L'application est prête pour une évolution en architecture modulaire :

- Les composants standalone peuvent être regroupés en feature modules
- Les services sont déjà `providedIn: 'root'` (singletons)
- Le routing est séparé (`app-routing.module.ts`)
- Les modèles peuvent devenir une librairie partagée (`@shared/models`)

Cette architecture garantit la maintenabilité, la testabilité et l'évolutivité du code.
