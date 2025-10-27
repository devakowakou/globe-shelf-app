# 📚 Glose Shelf Explorer# 📚 Globe Shelf App



> Une application Next.js moderne pour explorer les étagères de livres via l'API publique Glose.Application web moderne pour explorer des bibliothèques de livres via l'API publique Glose. Développée avec **Next.js 15**, **TypeScript**, **Redux Toolkit** et **Tailwind CSS**.



![Next.js](https://img.shields.io/badge/Next.js-15.3-black?logo=next.js)## 🎯 Caractéristiques

![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)

![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)- ✅ **Liste des étagères** avec pagination serveur

![pnpm](https://img.shields.io/badge/pnpm-10.19-orange?logo=pnpm)- ✅ **Grille de livres** responsive avec détails (couverture, titre, auteur, prix, note)

- ✅ **Recherche** instantanée par titre et auteur

---- ✅ **Pagination** optimisée côté serveur

- ✅ **Design moderne** inspiré de glose.com

## 🎯 À Propos- ✅ **Animations fluides** avec Framer Motion

- ✅ **State management** avec Redux Toolkit & Zustand

**Glose Shelf Explorer** est une application web développée pour le test technique **Soft Vodooz**. Elle permet d'explorer une collection de livres organisée en étagères, avec pagination, recherche et affichage détaillé.- ✅ **TypeScript** strict pour la qualité du code

- ✅ **Performances ultra-rapides** avec Next.js 15

### ✨ Fonctionnalités

## 🚀 Technologies

- 📖 **Liste des étagères** avec pagination intelligente

- 📚 **Grille de livres** responsive (1/2/3/4 colonnes)### Core

- 🔍 **Recherche en temps réel** par titre ou auteur- **Framework:** Next.js 15.3 (App Router, React 18)

- 🎨 **Design moderne** avec Tailwind CSS + shadcn/ui- **Langage:** TypeScript 5.7

- ⭐ **Notes et prix** pour chaque livre- **Gestionnaire de paquets:** pnpm 10.19

- 📱 **Responsive** (mobile, tablette, desktop)

- ⚡ **Performance optimale** avec Next.js 15 + Turbopack### State Management

- **Redux Toolkit** 2.9 - Gestion d'état globale

---- **Zustand** 5.0 - State management léger

- **React Query** 5.90 - Gestion du cache API

## 🚀 Démarrage Rapide

### UI/UX

### Prérequis- **Tailwind CSS** 3.4 - Styling moderne

- **shadcn/ui** - Composants React réutilisables

- **Node.js** 18+ (recommandé: 20.x)- **Framer Motion** 12.23 - Animations fluides

- **pnpm** 9+ (installé automatiquement)- **Lucide Icons** - Icônes modernes



### Installation### API & Data

- **Glose API** - API publique (https://api.glose.com)

```bash- **Intersection Observer** - Lazy loading intelligent

# Cloner le dépôt

git clone https://github.com/devakowakou/globe-shelf-app.git## 📦 Installation

cd globe-shelf-app

### Prérequis

# Installer les dépendances- Node.js >= 20.0.0

pnpm install- pnpm >= 10.0.0



# Démarrer le serveur de développement### Installation des dépendances

pnpm dev

``````bash

# Installation de pnpm (si pas déjà installé)

L'application sera disponible sur **http://localhost:9002**npm install -g pnpm



### Commandes Disponibles# Clone du projet

git clone https://github.com/devakowakou/globe-shelf-app.git

```bashcd globe-shelf-app

pnpm dev          # Serveur de développement (port 9002)

pnpm build        # Build de production# Installation des dépendances

pnpm start        # Démarrer en mode productionpnpm install

pnpm lint         # Vérifier la qualité du code```

```

## 🛠️ Développement

---

```bash

## 📂 Structure du Projet# Lancer le serveur de développement

pnpm dev

```

globe-shelf-app/# L'app sera accessible sur http://localhost:9002

├── src/```

│   ├── app/                      # Pages Next.js (App Router)

│   │   ├── page.tsx             # 📖 Page d'accueil (liste des étagères)## 🏗️ Build

│   │   ├── layout.tsx           # Layout global

│   │   ├── globals.css          # Styles globaux```bash

│   │   └── shelves/# Build de production

│   │       └── [shelfId]/pnpm build

│   │           └── page.tsx     # 📚 Page d'une étagère (grille de livres)

│   │# Lancer en production

│   ├── components/               # Composants Reactpnpm start

│   │   ├── book-card.tsx        # Carte d'un livre```

│   │   ├── book-grid.tsx        # Grille de livres + recherche

│   │   ├── bookshelf-item.tsx   # Carte d'une étagère## 📁 Structure du projet

│   │   ├── bookshelf-list.tsx   # Liste des étagères

│   │   ├── header.tsx           # En-tête de l'application```

│   │   ├── pagination.tsx       # Composant de paginationsrc/

│   │   ├── search-input.tsx     # Champ de recherche├── app/                      # Pages Next.js (App Router)

│   │   └── ui/                  # Composants shadcn/ui│   ├── page.tsx             # Liste des étagères

│   ││   └── shelves/[shelfId]/   # Détails d'une étagère

│   ├── lib/                      # Logique métier├── components/              # Composants réutilisables

│   │   ├── api.ts               # API Glose (appels fetch)│   ├── book-card.tsx       # Carte de livre

│   │   ├── definitions.ts       # Types TypeScript│   ├── book-grid.tsx       # Grille + recherche

│   │   └── utils.ts             # Utilitaires│   ├── bookshelf-list.tsx  # Liste d'étagères

│   ││   └── ui/                 # Composants shadcn/ui

│   └── hooks/                    # Hooks React custom├── lib/

│       ├── use-mobile.tsx       # Détection mobile│   ├── api.ts              # ✅ Appels API Glose (corrigés)

│       └── use-toast.ts         # Gestion des toasts│   └── definitions.ts      # Types TypeScript

│└── ai/

├── docs/    └── flows/              # Flows Genkit AI

│   └── blueprint.md             # Spécifications du test```

│

├── next.config.ts               # Configuration Next.js## 🌐 API Endpoints utilisés

├── tailwind.config.ts           # Configuration Tailwind

├── tsconfig.json                # Configuration TypeScript### Liste des étagères

└── package.json                 # Dépendances```

```GET https://api.glose.com/users/5a8411b53ed02c04187ff02a/shelves

Params: ?limit=10&offset=0

---```



## 🎨 Design & Technologies### Liste des livres d'une étagère

```

### Stack TechniqueGET https://api.glose.com/shelves/:shelfId/forms

Params: ?limit=12&offset=0

| Technologie | Version | Usage |```

|------------|---------|-------|

| **Next.js** | 15.3 | Framework React (App Router) |### Détails d'un livre

| **TypeScript** | 5.7 | Typage statique |```

| **Tailwind CSS** | 3.4 | Styles utilitaires |GET https://api.glose.com/forms/:formId

| **shadcn/ui** | Latest | Composants UI (Radix) |```

| **Lucide React** | Latest | Icônes |

| **pnpm** | 10.19 | Gestionnaire de paquets |## ✨ Fonctionnalités



### Palette de Couleurs### Page principale (/)

- Affiche les étagères avec pagination (10 par page)

Conforme aux spécifications du test :- Indique le nombre de livres par étagère

- Design moderne avec cartes cliquables

```css

Primary:    #A0CFEC  /* Soft Blue - Boutons, liens */### Page étagère (/shelves/[shelfId])

Background: #EAF3FA  /* Light Blue - Fond */- Hero section avec image et résumé IA

Accent:     #F2E394  /* Pale Yellow - Highlights */- Grille de livres (12 par page)

```- Recherche locale par titre/auteur

- Affichage des notes moyennes (étoiles)

### Typographie- Prix si disponible



- **Font principale :** [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts)## 🎨 Design

- **Usage :** Corps de texte et titres

- **Responsive:** Mobile-first, s'adapte à tous les écrans

---- **Dark mode ready:** Thème personnalisable

- **Animations:** Hover effects, transitions fluides

## 📖 Guide d'Utilisation- **Skeleton loaders:** Feedback visuel pendant le chargement

- **Accessibilité:** Labels ARIA, alt text, navigation clavier

### Page d'Accueil

## 📝 Scripts disponibles

1. **Liste des étagères** : Affichage de 10 étagères par page

2. **Nombre de livres** : Affiché pour chaque étagère```bash

3. **Pagination** : Navigation intelligente avec dots (...)pnpm dev          # Développement (port 9002)

4. **Clic** : Accéder au contenu d'une étagèrepnpm build        # Build production

pnpm start        # Serveur production

### Page Étagèrepnpm lint         # Linter ESLint

pnpm typecheck    # Vérification TypeScript

1. **Hero Header** : Image de fond + titre + nombre de livrespnpm clean        # Nettoyer .next et node_modules

2. **Grille de livres** : 12 livres par page (responsive)```

3. **Recherche** : Filtrer par titre ou auteur en temps réel

4. **Pagination** : Naviguer entre les pages## 🔧 Configuration

5. **Retour** : Bouton "Back to Bookshelves"

### next.config.ts

### Informations Livre- Support images Glose API

- TypeScript/ESLint configurés

Chaque carte affiche :- Optimisations de production

- 🖼️ **Couverture** : Image optimisée

- 📖 **Titre** : 2 lignes maximum### pnpm

- ✍️ **Auteur(s)** : Liste séparée par virgules- Plus rapide que npm/yarn

- ⭐ **Note** : Étoiles (1-5) si disponible- Économie d'espace disque (symlinks)

- 💰 **Prix** : Montant + devise si disponible- Meilleure gestion des dépendances



---## 🚀 Déploiement



## 🔌 API Glose### Vercel (recommandé)

```bash

### Endpoints Utilisésvercel

```

```typescript

// Base URL### Autres plateformes

const API_ROOT = "https://api.glose.com";- Railway

- Netlify

// Liste des étagères d'un utilisateur- AWS Amplify

GET /users/:userId/shelves?limit=10&offset=0- Docker



// IDs des livres d'une étagère## 📊 Performances

GET /shelves/:shelfId/forms?limit=12&offset=0

- ⚡ Server Components par défaut

// Détails d'un livre- ⚡ Pagination API (pas de sur-chargement)

GET /forms/:formId- ⚡ Images optimisées (Next.js Image)

```- ⚡ Parallel data fetching

- ⚡ Streaming avec Suspense

### Structure des Données

## 🐛 Debugging

```typescript

// Étagère### Erreurs d'images

interface Bookshelf {Si les images ne s'affichent pas, vérifiez `next.config.ts` :

  id: string;- Les domaines Glose sont bien autorisés

  title: string;- Les URLs de couvertures sont valides

  formsCount: number;

}### Erreurs API

- Vérifiez que l'API Glose est accessible

// Livre- Consultez la console du navigateur

interface Book {- Logs côté serveur dans le terminal

  id: string;

  title: string;## 📄 Licence

  authors: Array<{ name: string }>;

  coverUrl: string;Projet de test technique - Tous droits réservés

  price?: {

    amount: number;## 👨‍💻 Auteur

    currency: string;

  };Test technique Frontend Developer - Soft Vodooz

  averageRating?: number;

}---

```

**Date:** Octobre 2025

---**Version:** 0.1.0



## ⚡ Optimisations AppliquéesTo get started, take a look at src/app/page.tsx.


### 1. Images

- ✅ **Optimisation Next.js** : Lazy loading, WebP, responsive
- ✅ **Google Cloud Storage** : Domaine autorisé dans `next.config.ts`
- ✅ **Champ correct** : Utilisation de `form.image` au lieu de `form.cover.url`

### 2. Performance

- ✅ **Turbopack** : Build ultra-rapide en dev
- ✅ **App Router** : Server Components par défaut
- ✅ **Suspense** : Loading states élégants
- ✅ **Pagination** : Limite de 10-12 items par page

### 3. UX

- ✅ **Hover Effects** : Shadow + translate sur les cartes
- ✅ **Transitions** : CSS transitions fluides
- ✅ **Recherche** : Filtrage instantané (local)
- ✅ **Error Handling** : Messages d'erreur clairs

---

## 🧪 Tests Manuels

### Checklist de Vérification

#### ✅ Page d'Accueil
- [ ] Liste des étagères s'affiche
- [ ] Pagination fonctionne
- [ ] Nombre de livres correct
- [ ] Navigation vers étagère

#### ✅ Page Étagère
- [ ] Hero header avec image
- [ ] Grille responsive
- [ ] Images uniques (pas de doublons)
- [ ] Prix et notes affichés si disponibles
- [ ] Recherche fonctionne
- [ ] Pagination fonctionne
- [ ] Bouton retour fonctionne

#### ✅ Responsive
- [ ] Mobile (320px+)
- [ ] Tablette (768px+)
- [ ] Desktop (1024px+)

---

## 🐛 Résolution de Problèmes

### Le serveur ne démarre pas

```bash
# Nettoyer et réinstaller
rm -rf .next node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

### Les images ne s'affichent pas

1. Vérifier `next.config.ts` → `storage.googleapis.com` présent
2. Vérifier `src/lib/api.ts` → utilisation de `form.image`

### Erreurs TypeScript

```bash
# Vérifier les types
pnpm tsc --noEmit
```

---

## 🚀 Déploiement

### Vercel (Recommandé)

```bash
# Installer Vercel CLI
pnpm add -g vercel

# Déployer
vercel
```

### Build Manuel

```bash
# Build de production
pnpm build

# Démarrer le serveur
pnpm start
```

---

## 🔮 Améliorations Futures

### Priorité Haute ⚡

1. **React Query** : Cache API pour navigation instantanée
2. **Image Blur Placeholder** : Progressive loading
3. **Recherche Globale** : Chercher dans toutes les étagères

### Priorité Moyenne 📚

4. **Dark Mode** : Toggle light/dark
5. **Bookmarks** : Sauvegarder des favoris (localStorage)
6. **PWA** : Application installable

### Priorité Basse ✨

7. **Animations** : Framer Motion pour transitions
8. **Share Button** : Partager un livre
9. **Book Details Modal** : Popup avec plus d'infos
10. **Infinite Scroll** : Alternative à la pagination

---

## 📄 Licence

Ce projet a été développé dans le cadre du test technique **Soft Vodooz**.

---

## 👨‍💻 Auteur

**Développeur Full Stack**  
GitHub: [@devakowakou](https://github.com/devakowakou)

---

## 🙏 Remerciements

- **Glose** pour l'API publique
- **shadcn/ui** pour les composants
- **Vercel** pour Next.js
- **Soft Vodooz** pour l'opportunité

---

**Développé avec ❤️ pour Soft Vodooz**
