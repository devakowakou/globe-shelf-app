# 🔧 Documentation Technique - Glose Shelf Explorer

> Documentation technique complète du projet

---

## 📋 Table des Matières

1. [Architecture](#architecture)
2. [Composants](#composants)
3. [API & Data Fetching](#api--data-fetching)
4. [Types TypeScript](#types-typescript)
5. [Routing](#routing)
6. [Styling](#styling)
7. [Optimisations](#optimisations)

---

## 🏗️ Architecture

### Pattern Architectural

Le projet suit l'architecture **Next.js App Router** avec :

- **Server Components** par défaut (pas de "use client" sauf nécessaire)
- **Client Components** uniquement pour l'interactivité (recherche, pagination)
- **Separation of Concerns** : UI / Logic / Data séparés

### Structure des Dossiers

```
src/
├── app/              # Routing & Pages (Server Components)
├── components/       # Composants UI (Client & Server)
├── lib/             # Logique métier & utilitaires
└── hooks/           # Hooks React custom
```

---

## 🧩 Composants

### Pages (Server Components)

#### `src/app/page.tsx`
**Rôle :** Page d'accueil avec liste des étagères

**Fonctionnalités :**
- Récupération des étagères via API
- Pagination (10 étagères/page)
- Suspense pour loading states
- Error handling

**Code clé :**
```typescript
export default async function Home({ searchParams }) {
  const params = searchParams ? await searchParams : {};
  const currentPage = Number(params?.page) || 1;
  
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ShelvesDataFetcher currentPage={currentPage} />
    </Suspense>
  );
}
```

---

#### `src/app/shelves/[shelfId]/page.tsx`
**Rôle :** Page d'une étagère avec grille de livres

**Fonctionnalités :**
- Récupération des livres d'une étagère
- Hero header avec image de fond
- Pagination (12 livres/page)
- Recherche locale

**Code clé :**
```typescript
export default async function ShelfPage({ params, searchParams }) {
  const { shelfId } = await params;
  const search = searchParams ? await searchParams : {};
  
  const booksPromise = fetchBooksForShelf({
    shelfId,
    limit: 12,
    offset: (currentPage - 1) * 12
  });
  
  return <BooksDataFetcher booksPromise={booksPromise} />;
}
```

---

### Composants UI

#### `src/components/book-card.tsx`
**Type :** Server Component  
**Rôle :** Afficher un livre avec ses détails

**Props :**
```typescript
interface BookCardProps {
  book: Book;
}
```

**Fonctionnalités :**
- Image optimisée (Next.js Image)
- Affichage conditionnel (prix, note)
- Hover effects (shadow + translate)
- Truncate text (line-clamp)

**Détails d'implémentation :**
```typescript
// Étoiles de notation
const renderStars = () => {
  if (!book.averageRating) return null;
  const rating = Math.round(book.averageRating);
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={i < rating ? 'fill-amber-400' : 'text-gray-300'}
    />
  ));
};
```

---

#### `src/components/book-grid.tsx`
**Type :** Client Component ("use client")  
**Rôle :** Grille de livres + recherche

**Props :**
```typescript
interface BookGridProps {
  initialBooks: Book[];
  currentPage: number;
  totalPages: number;
}
```

**Fonctionnalités :**
- Recherche locale (titre + auteur)
- Filtrage en temps réel
- Badge de résultats
- État vide si aucun résultat

**State Management :**
```typescript
const [searchTerm, setSearchTerm] = useState('');
const [searchResults, setSearchResults] = useState<Book[] | null>(null);

const handleSearch = (term: string) => {
  const filtered = initialBooks.filter(book =>
    book.title.toLowerCase().includes(term) ||
    book.authors.some(a => a.name.toLowerCase().includes(term))
  );
  setSearchResults(filtered);
};
```

---

#### `src/components/pagination.tsx`
**Type :** Client Component  
**Rôle :** Navigation entre les pages

**Props :**
```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
}
```

**Fonctionnalités :**
- Smart pagination avec dots (1 ... 4 5 6 ... 10)
- Boutons Previous/Next
- Navigation via URL params (?page=2)

**Algorithme :**
```typescript
const getPaginationNumbers = () => {
  const delta = 1;
  const range = [];
  
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || 
        (i >= currentPage - delta && i < currentPage + delta + 1)) {
      range.push(i);
    }
  }
  
  // Ajouter '...' entre les sauts
  return addDotsToRange(range);
};
```

---

#### `src/components/search-input.tsx`
**Type :** Client Component  
**Rôle :** Champ de recherche avec icône

**Props :**
```typescript
interface SearchInputProps {
  onSearch: (term: string) => void;
  placeholder?: string;
  initialValue?: string;
}
```

**Fonctionnalités :**
- Icône Lucide (Search)
- Callback onChange
- Valeur initiale optionnelle

---

#### `src/components/bookshelf-item.tsx`
**Type :** Server Component  
**Rôle :** Carte d'une étagère

**Fonctionnalités :**
- Lien vers la page étagère
- Nombre de livres affiché
- Hover effect

---

#### `src/components/bookshelf-list.tsx`
**Type :** Server Component  
**Rôle :** Liste des étagères + pagination

**Fonctionnalités :**
- Grille 2 colonnes (desktop)
- Pagination en bas
- Animation stagger (optionnelle)

---

## 🔌 API & Data Fetching

### Fichier Principal

`src/lib/api.ts` - Toutes les fonctions d'appel API

### Fonctions Exportées

#### `fetchBookshelves()`
**Signature :**
```typescript
async function fetchBookshelves(params: {
  limit: number;
  offset: number;
}): Promise<{ shelves: Bookshelf[]; total: number }>
```

**Description :**  
Récupère la liste des étagères avec pagination.

**Endpoints utilisés :**
1. `GET /users/:id/shelves?limit=X&offset=Y` - Étagères paginées
2. `GET /users/:id/shelves` - Total (pour calculer pages)
3. `GET /shelves/:id/forms` - Compte de livres par étagère

**Optimisation :**  
Appels parallèles avec `Promise.all()` pour récupérer les comptes.

---

#### `fetchBooksForShelf()`
**Signature :**
```typescript
async function fetchBooksForShelf(params: {
  shelfId: string;
  limit: number;
  offset: number;
}): Promise<{ books: Book[]; total: number }>
```

**Description :**  
Récupère les livres d'une étagère avec pagination.

**Endpoints utilisés :**
1. `GET /shelves/:id/forms?limit=X&offset=Y` - IDs paginés
2. `GET /shelves/:id/forms` - Total
3. `GET /forms/:id` - Détails de chaque livre

**Transformation des données :**
```typescript
const books = formData.map(form => ({
  id: form.id,
  title: form.title,
  authors: form.authors || [],
  coverUrl: form.image || form.cover?.url,  // ⚠️ Important !
  price: form.price?.amount > 0 ? form.price : undefined,
  averageRating: form.statistics?.rating?.average,
}));
```

**Point critique :**  
Utilisation de `form.image` au lieu de `form.cover.url` (qui est toujours null).

---

#### `searchBooksInShelf()`
**Signature :**
```typescript
async function searchBooksInShelf(params: {
  shelfId: string;
  query: string;
}): Promise<{ books: Book[]; total: number }>
```

**Description :**  
Recherche locale dans tous les livres d'une étagère.

**Implémentation :**
1. Récupérer TOUS les livres de l'étagère
2. Filtrer côté client (titre + auteurs)
3. Retourner les résultats

---

#### `apiFetch()` (Helper)
**Signature :**
```typescript
async function apiFetch(url: string): Promise<any>
```

**Description :**  
Fonction helper pour tous les appels API.

**Fonctionnalités :**
- Headers JSON standardisés
- Error handling avec try/catch
- Logging des erreurs
- Cache: 'no-store' (pas de cache)

---

## 📊 Types TypeScript

### Fichier Principal

`src/lib/definitions.ts` - Tous les types du projet

### Types Exportés

#### `Bookshelf`
```typescript
export interface Bookshelf {
  id: string;
  title: string;
  formsCount: number;
}
```

---

#### `Book`
```typescript
export interface Book {
  id: string;
  title: string;
  authors: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  coverUrl: string;
  price?: {
    amount: number;
    currency: string;
  };
  averageRating?: number;
}
```

**Notes :**
- `authors` : Tableau (peut être vide)
- `price` : Optionnel (undefined si gratuit)
- `averageRating` : Optionnel (undefined si pas de note)

---

## 🛣️ Routing

### Routes Disponibles

| Route | Fichier | Params | SearchParams |
|-------|---------|--------|--------------|
| `/` | `app/page.tsx` | - | `?page=1` |
| `/shelves/[id]` | `app/shelves/[shelfId]/page.tsx` | `shelfId` | `?page=1&query=` |

### Navigation

**URL-based (SEO friendly) :**
```typescript
// Pagination
router.push(`/?page=2`);

// Recherche (future)
router.push(`/shelves/${id}?query=harry+potter`);
```

### Dynamic Routes

**Exemple :** `/shelves/[shelfId]/page.tsx`

```typescript
export default async function ShelfPage({
  params,
  searchParams
}: {
  params: Promise<{ shelfId: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const { shelfId } = await params;
  // ...
}
```

**Important :** Next.js 15 nécessite `await` pour `params` et `searchParams`.

---

## 🎨 Styling

### Tailwind CSS

**Configuration :** `tailwind.config.ts`

#### Couleurs Custom

```typescript
colors: {
  primary: 'hsl(203 70% 55%)',     // #A0CFEC
  background: 'hsl(205 67% 95%)',  // #EAF3FA
  accent: 'hsl(51 80% 77%)',       // #F2E394
}
```

#### Fonts

```typescript
fontFamily: {
  body: ['Inter', 'sans-serif'],
  headline: ['Inter', 'sans-serif'],
}
```

---

### CSS Variables

**Fichier :** `src/app/globals.css`

```css
:root {
  --background: 205 67% 95%;
  --primary: 203 70% 55%;
  --accent: 51 80% 77%;
}
```

---

### Utility Classes Courantes

```css
/* Layout */
.container           /* Max-width centré */
.space-y-8          /* Espacement vertical 2rem */
.gap-6              /* Gap 1.5rem */

/* Grid */
.grid-cols-1        /* 1 colonne (mobile) */
.md:grid-cols-2     /* 2 colonnes (desktop) */
.lg:grid-cols-4     /* 4 colonnes (large) */

/* Texte */
.line-clamp-2       /* 2 lignes max + ... */
.truncate           /* 1 ligne + ... */
.text-muted-foreground /* Couleur secondaire */

/* Effets */
.hover:shadow-xl    /* Shadow au hover */
.hover:-translate-y-1 /* Monte de 4px */
.transition-all     /* Transition fluide */
```

---

## ⚡ Optimisations

### 1. Images

#### Next.js Image Component

```typescript
<Image
  src={book.coverUrl}
  alt={book.title}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
  className="object-cover"
/>
```

**Bénéfices :**
- ✅ Lazy loading automatique
- ✅ Formats modernes (WebP, AVIF)
- ✅ Responsive (tailles adaptées)
- ✅ Priority pour les images above-the-fold

#### Configuration

`next.config.ts` :
```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'storage.googleapis.com',
      pathname: '/s4-bucket/**',
    },
  ],
}
```

---

### 2. Server Components

**Avantage :** Pas de JS envoyé au client pour les composants server.

**Composants Server :**
- `page.tsx` (toutes les pages)
- `book-card.tsx`
- `bookshelf-item.tsx`
- `bookshelf-list.tsx`
- `header.tsx`

**Composants Client :**
- `book-grid.tsx` (recherche interactive)
- `pagination.tsx` (navigation)
- `search-input.tsx` (input)

---

### 3. Suspense & Streaming

```typescript
<Suspense fallback={<LoadingSkeleton />}>
  <DataFetcher />
</Suspense>
```

**Bénéfice :** Affichage progressif (streamed HTML).

---

### 4. Turbopack

**Activation :** `next dev --turbopack`

**Bénéfices :**
- ✅ Build 10x plus rapide
- ✅ Hot reload instantané
- ✅ Fast Refresh optimisé

---

### 5. Pagination Côté Serveur

**Avantage :** Pas de chargement inutile.

```typescript
// Seulement 10 étagères récupérées
fetchBookshelves({ limit: 10, offset: 0 })

// Seulement 12 livres récupérés
fetchBooksForShelf({ shelfId, limit: 12, offset: 0 })
```

---

## 🔍 Debugging

### Logs Console

```typescript
// API errors
console.error(`❌ Failed to fetch: ${url}`, error);

// Data inspection
console.log('Books fetched:', books.length);
```

---

### TypeScript Strict Mode

`tsconfig.json` :
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

**Bénéfice :** Détection d'erreurs au build.

---

### Dev Tools

- **React DevTools** : Inspecter composants
- **Next.js DevTools** : Voir les Server Components
- **Network Tab** : Vérifier les appels API

---

## 📦 Build & Deploy

### Build de Production

```bash
pnpm build
```

**Outputs :**
- `.next/` - Build artifacts
- `.next/static/` - Assets statiques
- `.next/server/` - Server bundles

---

### Déploiement Vercel

```bash
vercel
```

**Automatique :**
- Build optimisé
- CDN global
- Edge caching
- Image optimization

---

## 🎓 Best Practices Appliquées

### 1. TypeScript Strict
✅ Tous les types explicites  
✅ Pas de `any`  
✅ Null checks

### 2. Separation of Concerns
✅ UI séparée de la logique  
✅ API dans `lib/`  
✅ Types dans `definitions.ts`

### 3. Performance
✅ Server Components par défaut  
✅ Lazy loading images  
✅ Pagination serveur

### 4. Accessibility
✅ Alt text sur images  
✅ Aria labels  
✅ Keyboard navigation

### 5. SEO
✅ Metadata dans layout  
✅ URL-based routing  
✅ Semantic HTML

---

## 🔗 Ressources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Glose API](https://api.glose.com)

---

**Documentation mise à jour :** 27 octobre 2025
