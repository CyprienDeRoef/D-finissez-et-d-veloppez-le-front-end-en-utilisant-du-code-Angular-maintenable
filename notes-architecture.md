# Notes d'Architecture - Audit du Code Angular

---

### 1. Appels HTTP directement dans les composants

- HttpClient injecté et utilisé directement dans les composants
- Code dupliqué : même URL `./assets/mock/olympic.json` dans les 2 composants
- Violation de la séparation des responsabilités

---

### 2. Absence de typage strict - Utilisation excessive de `any`

Exemples :

```typescript
this.http.get<any[]>(...)
data.map((i: any) => ...)
public totalEntries: any = 0
```

- Perte des avantages TypeScript malgré `"strict": true`
- Pas d'autocomplétion ni de détection d'erreurs
- Modèles manquants : `Olympic`, `Participation`

---

### 3. Logique métier dans les composants

- Calculs complexes et transformations de données dans `ngOnInit()`
- Composants surchargés de responsabilités
- Code non réutilisable et difficile à tester

Exemple :

```typescript
this.totalJOs = Array.from(new Set(data.map((i: any) => i.participations.map((f: any) => f.year)).flat())).length;
```

---

### 4. Mauvaise gestion des Observables

**Fichiers :** `home.component.ts` (L22), `country.component.ts` (L28)

- `.pipe()` vides et inutiles
- Pas de `unsubscribe` → fuites mémoire potentielles
- Souscriptions imbriquées dans `country.component.ts`

---

### 5. Console.log en production

**Fichier :** `home.component.ts` (L24, 35)

```typescript
console.log(`Liste des données : ${JSON.stringify(data)}`);
console.log(`erreur : ${error}`);
```

- Pollution des logs
- Performance dégradée

---

### 6. Code dupliqué

- URL API dupliquée dans les 2 composants
- Logique de récupération HTTP identique
- Gestion d'erreur dupliquée

---

### 7. Logique de présentation dans les composants

**Méthodes :** `buildPieChart()`, `buildChart()`

- Configuration Chart.js complète dans les composants
- Composants > 70 lignes
- Navigation Router dans le callback Chart.js

---

### 8. Absence de modèles de données

Aucune interface définie.

### 9. Absence de services

Aucun service dans `src/app/`. Services manquants :

- `OlympicService` (appels HTTP + logique métier)
- `ChartService` (graphiques)
- Intercepteur d'erreur HTTP

---

### 10. Structure de dossiers insuffisante

**Structure actuelle :** Seulement `pages/`

**Dossiers manquants :**

- `components/` (composants réutilisables)
- `service/` (services)
- `models/` ou `core/models/` (interfaces)

---

### 11. Gestion d'erreur basique

- Pas de retry ni d'intercepteur
- Messages techniques exposés (`error.message`)
- Pas de redirection en cas d'erreur

---

### 12. Autres problèmes

- Variables `public` non nécessaires
- Propriétés avec `!` (non-null assertion)
- Formatage incohérent (guillemets, espaces)
- Race condition dans `country.component.ts` (souscriptions imbriquées)

**Fin de l'audit**
