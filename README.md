# 📚 Globe Shelf App

Application web moderne pour explorer des bibliothèques de livres via l'API publique Glose. Développée avec **Next.js 15**, **TypeScript**, **Redux Toolkit** et **Tailwind CSS**.

## 🎯 Caractéristiques

- ✅ **Liste des étagères** avec pagination serveur
- ✅ **Grille de livres** responsive avec détails (couverture, titre, auteur, prix, note)
- ✅ **Recherche** instantanée par titre et auteur
- ✅ **Pagination** optimisée côté serveur
- ✅ **Design moderne** inspiré de glose.com
- ✅ **Animations fluides** avec Framer Motion
- ✅ **State management** avec Redux Toolkit & Zustand
- ✅ **TypeScript** strict pour la qualité du code
- ✅ **Performances ultra-rapides** avec Next.js 15

## 🚀 Technologies

### Core
- **Framework:** Next.js 15.3 (App Router, React 18)
- **Langage:** TypeScript 5.7
- **Gestionnaire de paquets:** pnpm 10.19

### State Management
- **Redux Toolkit** 2.9 - Gestion d'état globale
- **Zustand** 5.0 - State management léger
- **React Query** 5.90 - Gestion du cache API

### UI/UX
- **Tailwind CSS** 3.4 - Styling moderne
- **shadcn/ui** - Composants React réutilisables
- **Framer Motion** 12.23 - Animations fluides
- **Lucide Icons** - Icônes modernes

### API & Data
- **Glose API** - API publique (https://api.glose.com)
- **Intersection Observer** - Lazy loading intelligent

## 📦 Installation

### Prérequis
- Node.js >= 20.0.0
- pnpm >= 10.0.0

### Installation des dépendances

```bash
# Installation de pnpm (si pas déjà installé)
npm install -g pnpm

# Clone du projet
git clone https://github.com/devakowakou/globe-shelf-app.git
cd globe-shelf-app

# Installation des dépendances
pnpm install
```

## 🛠️ Développement

```bash
# Lancer le serveur de développement
pnpm dev

# L'app sera accessible sur http://localhost:9002
```

## 🏗️ Build

```bash
# Build de production
pnpm build

# Lancer en production
pnpm start
```

## 📁 Structure du projet

```
src/
├── app/                      # Pages Next.js (App Router)
│   ├── page.tsx             # Liste des étagères
│   └── shelves/[shelfId]/   # Détails d'une étagère
├── components/              # Composants réutilisables
│   ├── book-card.tsx       # Carte de livre
│   ├── book-grid.tsx       # Grille + recherche
│   ├── bookshelf-list.tsx  # Liste d'étagères
│   └── ui/                 # Composants shadcn/ui
├── lib/
│   ├── api.ts              # ✅ Appels API Glose (corrigés)
│   └── definitions.ts      # Types TypeScript
└── ai/
    └── flows/              # Flows Genkit AI
```

## 🌐 API Endpoints utilisés

### Liste des étagères
```
GET https://api.glose.com/users/5a8411b53ed02c04187ff02a/shelves
Params: ?limit=10&offset=0
```

### Liste des livres d'une étagère
```
GET https://api.glose.com/shelves/:shelfId/forms
Params: ?limit=12&offset=0
```

### Détails d'un livre
```
GET https://api.glose.com/forms/:formId
```

## ✨ Fonctionnalités

### Page principale (/)
- Affiche les étagères avec pagination (10 par page)
- Indique le nombre de livres par étagère
- Design moderne avec cartes cliquables

### Page étagère (/shelves/[shelfId])
- Hero section avec image et résumé IA
- Grille de livres (12 par page)
- Recherche locale par titre/auteur
- Affichage des notes moyennes (étoiles)
- Prix si disponible

## 🎨 Design

- **Responsive:** Mobile-first, s'adapte à tous les écrans
- **Dark mode ready:** Thème personnalisable
- **Animations:** Hover effects, transitions fluides
- **Skeleton loaders:** Feedback visuel pendant le chargement
- **Accessibilité:** Labels ARIA, alt text, navigation clavier

## 📝 Scripts disponibles

```bash
pnpm dev          # Développement (port 9002)
pnpm build        # Build production
pnpm start        # Serveur production
pnpm lint         # Linter ESLint
pnpm typecheck    # Vérification TypeScript
pnpm clean        # Nettoyer .next et node_modules
```

## 🔧 Configuration

### next.config.ts
- Support images Glose API
- TypeScript/ESLint configurés
- Optimisations de production

### pnpm
- Plus rapide que npm/yarn
- Économie d'espace disque (symlinks)
- Meilleure gestion des dépendances

## 🚀 Déploiement

### Vercel (recommandé)
```bash
vercel
```

### Autres plateformes
- Railway
- Netlify
- AWS Amplify
- Docker

## 📊 Performances

- ⚡ Server Components par défaut
- ⚡ Pagination API (pas de sur-chargement)
- ⚡ Images optimisées (Next.js Image)
- ⚡ Parallel data fetching
- ⚡ Streaming avec Suspense

## 🐛 Debugging

### Erreurs d'images
Si les images ne s'affichent pas, vérifiez `next.config.ts` :
- Les domaines Glose sont bien autorisés
- Les URLs de couvertures sont valides

### Erreurs API
- Vérifiez que l'API Glose est accessible
- Consultez la console du navigateur
- Logs côté serveur dans le terminal

## 📄 Licence

Projet de test technique - Tous droits réservés

## 👨‍💻 Auteur

Test technique Frontend Developer - Soft Vodooz

---

**Date:** Octobre 2025
**Version:** 0.1.0

To get started, take a look at src/app/page.tsx.
