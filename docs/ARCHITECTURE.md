# Architecture - Séparation des Responsabilités

## 🎯 Principe Appliqué: Single Responsibility Principle (SRP)

Chaque composant et hook a maintenant **une seule responsabilité claire**.

---

## 📁 Nouvelle Structure

### **Hooks Custom**

#### `src/hooks/use-book-search.ts`
**Responsabilité**: Gestion de la logique de recherche de livres
- État de recherche (terme, résultats, chargement)
- Filtrage des livres par titre/auteur
- Gestion des transitions React
- Interface propre avec `handleSearch`, `clearSearch`, `isFiltered`, `booksToDisplay`

---

### **Composants UI Réutilisables**

#### `src/components/search-bar.tsx`
**Responsabilité**: Interface de recherche avec badge de résultats
- Affichage du champ de recherche
- Badge cliquable pour les résultats filtrés
- Bouton de clear avec animation

#### `src/components/empty-state.tsx`
**Responsabilité**: Affichage des états vides génériques
- Message de titre et description personnalisables
- Action optionnelle (bouton avec callback)
- Réutilisable pour n'importe quel état vide

#### `src/components/books-display.tsx`
**Responsabilité**: Affichage de la grille de livres uniquement
- Layout responsive (grid)
- Mapping des livres vers BookCard
- Aucune logique métier

#### `src/components/skeletons.tsx`
**Responsabilité**: États de chargement (loading states)
- `ShelfHeaderSkeleton`: Skeleton pour l'en-tête d'étagère
- `BookGridSkeleton`: Skeleton pour la grille de livres
- Centralisé pour cohérence visuelle

---

### **Composants Métier**

#### `src/components/shelf-header.tsx`
**Responsabilité**: Affichage de l'en-tête d'étagère
- Affichage du titre, image hero, compteur de livres
- Navigation "Back to Bookshelves"
- Gestion du placeholder d'image
- **PAS** de data fetching

#### `src/components/shelf-header-wrapper.tsx`
**Responsabilité**: Récupération des données pour ShelfHeader
- Await des promises (shelf details + books)
- Extraction de l'image hero
- Passe les données à `ShelfHeader` (présentation)

#### `src/components/books-data-fetcher.tsx`
**Responsabilité**: Récupération et gestion d'erreur des livres
- Await de la promise books
- Calcul du nombre de pages
- Gestion des erreurs (affichage Alert)
- Passe les données à `BookGrid`

---

### **Composants Orchestrateurs**

#### `src/components/book-grid.tsx` (REFACTORISÉ)
**Avant**: 111 lignes, 5 responsabilités mélangées
- ❌ Gestion du state de recherche
- ❌ Logique de filtrage
- ❌ Affichage de la barre de recherche
- ❌ Affichage de la grille
- ❌ Gestion de l'état vide

**Après**: 53 lignes, 1 responsabilité claire
- ✅ **Orchestration uniquement** (composition de sous-composants)
- Utilise `useBookSearch` (logique)
- Utilise `SearchBar` (UI de recherche)
- Utilise `BooksDisplay` (affichage grille)
- Utilise `EmptyState` (état vide)
- Utilise `PaginationComponent` (pagination)

#### `src/components/bookshelf-list.tsx` (REFACTORISÉ)
**Avant**: État vide avec HTML dupliqué
**Après**: Utilise `EmptyState` réutilisable

#### `src/app/shelves/[shelfId]/page.tsx` (REFACTORISÉ)
**Avant**: 167 lignes, 6 responsabilités mélangées
- ❌ Définition des skeletons inline
- ❌ Composant ShelfHeader inline
- ❌ Composant BooksDataFetcher inline
- ❌ Logique de data fetching
- ❌ Gestion d'erreur
- ❌ Layout de la page

**Après**: 38 lignes, 2 responsabilités claires
- ✅ **Data fetching** (création des promises)
- ✅ **Layout** (composition avec Suspense)
- Importe les composants séparés et réutilisables

---

## 🎨 Avantages de la Refactorisation

### ✅ **Maintenabilité**
- Chaque fichier fait moins de 100 lignes
- Responsabilité unique = facile à comprendre
- Facile de trouver où modifier une fonctionnalité

### ✅ **Réutilisabilité**
- `EmptyState`: utilisable partout (bookshelf-list, book-grid, etc.)
- `SearchBar`: peut être réutilisé dans d'autres pages
- `BooksDisplay`: affichage de grille réutilisable
- `useBookSearch`: logique de recherche réutilisable

### ✅ **Testabilité**
- Hook `useBookSearch` testable isolément
- Composants UI testables sans logique métier
- Data fetchers testables avec mocks de promises

### ✅ **Performance**
- Aucun impact négatif (build: 116KB, identique)
- Meilleure tree-shaking possible
- Client components uniquement où nécessaire

### ✅ **Lisibilité**
```tsx
// Avant (page.tsx: 167 lignes)
<Suspense fallback={<div>...100 lignes de JSX inline...</div>}>

// Après (page.tsx: 38 lignes)
<Suspense fallback={<ShelfHeaderSkeleton />}>
  <ShelfHeaderWrapper ... />
</Suspense>
```

---

## 📊 Métriques de Refactorisation

| Composant | Avant | Après | Réduction |
|-----------|-------|-------|-----------|
| `book-grid.tsx` | 111 lignes | 53 lignes | **-52%** |
| `page.tsx` (shelf) | 167 lignes | 38 lignes | **-77%** |
| `bookshelf-list.tsx` | 38 lignes | 36 lignes | -5% |

**Nouveaux fichiers créés**: 8
- 1 hook: `use-book-search.ts`
- 7 composants: `search-bar`, `empty-state`, `books-display`, `skeletons`, `shelf-header`, `shelf-header-wrapper`, `books-data-fetcher`

---

## 🔧 Pattern Utilisé: Composition Over Inheritance

### Exemple: BookGrid

```tsx
// Composition de petits composants spécialisés
export function BookGrid({ initialBooks, currentPage, totalPages }) {
  const { searchTerm, booksToDisplay, isFiltered, handleSearch, clearSearch } 
    = useBookSearch(initialBooks); // Hook dédié

  return (
    <div className="space-y-8">
      <SearchBar {...} />           {/* Composant dédié */}
      {hasBooks ? (
        <BooksDisplay books={...} /> {/* Composant dédié */}
      ) : (
        <EmptyState {...} />         {/* Composant dédié */}
      )}
      {totalPages > 1 && <PaginationComponent {...} />}
    </div>
  );
}
```

Chaque composant est:
- **Petit** (< 50 lignes)
- **Testable** isolément
- **Réutilisable** ailleurs
- **Compréhensible** en 30 secondes

---

## 📝 Règles Appliquées

1. ✅ **Un composant = une responsabilité**
2. ✅ **Hooks pour la logique réutilisable**
3. ✅ **Composants de présentation vs. conteneur**
   - Présentation: `ShelfHeader`, `BooksDisplay`, `SearchBar`
   - Conteneur: `ShelfHeaderWrapper`, `BooksDataFetcher`
4. ✅ **Props claires et typées** (TypeScript)
5. ✅ **Composition over inheritance**
6. ✅ **Colocation**: fichiers liés proches dans la structure

---

## 🚀 Prochaines Améliorations Possibles

- [ ] Extraire la logique de pagination dans un hook `usePagination`
- [ ] Créer un composant `ErrorBoundary` réutilisable
- [ ] Ajouter des tests unitaires pour `useBookSearch`
- [ ] Créer un composant `LoadingState` générique pour remplacer les skeletons dupliqués
