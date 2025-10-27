# 🚀 Plan de Sprint - Performance & Features

> Optimisations prioritaires pour Glose Shelf Explorer

---

## ✅ État Actuel

### Conformité : 100% ✅

Toutes les exigences du test **Soft Vodooz** sont respectées :
- ✅ Bookshelf Listing (pagination)
- ✅ Bookshelf Contents (grid)
- ✅ Book Information (cover, title, authors, price, rating)
- ✅ Pagination intelligente
- ✅ Recherche locale
- ✅ Design conforme (couleurs, fonts, layout)

### Métriques Actuelles

| Métrique | Valeur | Objectif |
|----------|--------|----------|
| **LCP** | ~2.0s | <1.5s ⚡ |
| **Performance** | 85/100 | 95/100 ⚡ |
| **Bundle Size** | ~250KB | ~180KB ⚡ |

---

## 🎯 Sprint 1 - Performance (2h)

### Objectif
Améliorer la vitesse et l'expérience utilisateur de 50%

### Tâches

#### 1. React Query - Cache API (30 min) 🔥🔥🔥

**Impact :** Navigation 80% plus rapide

**Installation :**
```bash
# Déjà installé !
# @tanstack/react-query: 5.90.3
```

**Implémentation :**

**a) Setup Provider (`src/app/layout.tsx`)**
```tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// Dans RootLayout
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

**b) Hook pour les étagères (`src/hooks/use-shelves.ts` - NOUVEAU)**
```typescript
'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchBookshelves } from '@/lib/api';

export function useShelves(page: number) {
  return useQuery({
    queryKey: ['shelves', page],
    queryFn: () => fetchBookshelves({ 
      limit: 10, 
      offset: (page - 1) * 10 
    }),
    staleTime: 5 * 60 * 1000,
  });
}
```

**c) Hook pour les livres (`src/hooks/use-shelf-books.ts` - NOUVEAU)**
```typescript
'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchBooksForShelf } from '@/lib/api';

export function useShelfBooks(shelfId: string, page: number) {
  return useQuery({
    queryKey: ['books', shelfId, page],
    queryFn: () => fetchBooksForShelf({
      shelfId,
      limit: 12,
      offset: (page - 1) * 12
    }),
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true, // Garde les anciennes données pendant le fetch
  });
}
```

**Gains attendus :**
- ⚡ Pas de refetch si données en cache
- 🎯 Navigation instantanée
- 💾 Cache intelligent (5 min)

---

#### 2. Image Blur Placeholder (20 min) 🔥🔥

**Impact :** Pas de flash blanc, UX premium

**Option Rapide : Placeholder SVG**

**Créer `src/lib/image-placeholder.ts` :**
```typescript
export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#EAF3FA" offset="20%" />
      <stop stop-color="#A0CFEC" offset="50%" />
      <stop stop-color="#EAF3FA" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#EAF3FA" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

export const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);
```

**Modifier `src/components/book-card.tsx` :**
```tsx
import { shimmer, toBase64 } from '@/lib/image-placeholder';

<Image
  src={book.coverUrl || bookCoverPlaceholder?.imageUrl || ''}
  alt={`Cover of ${book.title}`}
  fill
  placeholder="blur"
  blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(400, 600))}`}
  className="object-cover"
/>
```

**Gains attendus :**
- 🎨 Pas de flash blanc
- ⚡ Impression de vitesse
- ✨ Loading progressif élégant

---

#### 3. Dark Mode Toggle (15 min) 🔥

**Impact :** Confort visuel, préférence utilisateur

**Installation :**
```bash
pnpm add next-themes
```

**a) Setup Provider (`src/app/layout.tsx`)**
```tsx
import { ThemeProvider } from 'next-themes';

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system">
          <Providers>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**b) Créer `src/components/theme-toggle.tsx` :**
```tsx
'use client';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
```

**c) Ajouter dans Header (`src/components/header.tsx`)**
```tsx
import { ThemeToggle } from './theme-toggle';

export function Header() {
  return (
    <header className="...">
      {/* Contenu existant */}
      <ThemeToggle />
    </header>
  );
}
```

**Gains attendus :**
- 🌙 Mode sombre élégant
- ⚙️ Préférence sauvegardée
- 🔋 Économie batterie (OLED)

---

#### 4. Tests & Validation (30 min)

**Checklist :**
- [ ] React Query fonctionne (pas de refetch inutile)
- [ ] Images avec blur placeholder (pas de flash)
- [ ] Dark mode toggle fonctionne
- [ ] Performance Lighthouse : >90
- [ ] Pas de régression UI

**Commandes :**
```bash
# Dev
pnpm dev

# Build test
pnpm build
pnpm start

# Lighthouse (Chrome DevTools)
# Ouvrir en navigation privée
# Lighthouse > Generate report
```

---

#### 5. Commit & Deploy (15 min)

```bash
git add -A
git commit -m "feat: ⚡ Sprint Performance - React Query + Blur + Dark Mode

✨ Optimisations
- React Query : Cache API intelligent (5 min staleTime)
- Image Blur Placeholder : Loading progressif élégant
- Dark Mode : Toggle light/dark avec next-themes

📈 Gains
- Navigation 80% plus rapide (pas de refetch)
- Pas de flash blanc sur images
- Expérience utilisateur premium

🎯 Performance : 85 → 95/100"

git push origin dev
```

---

## 📊 Résultats Attendus

### Avant Sprint

| Métrique | Valeur |
|----------|--------|
| LCP | 2.0s |
| Performance | 85/100 |
| Navigation | Refetch à chaque fois |
| Images | Flash blanc |
| Dark Mode | ❌ Non disponible |

### Après Sprint

| Métrique | Valeur | Amélioration |
|----------|--------|--------------|
| LCP | 1.2s | ⚡ -40% |
| Performance | 95/100 | ⚡ +10 points |
| Navigation | Cache (instantané) | ⚡ -80% |
| Images | Blur progressif | ✅ Premium |
| Dark Mode | ✅ Disponible | ✅ Nouveau |

---

## 🔮 Sprint 2 - Features (Optionnel, 1h30)

### Tâches

#### 1. Recherche Globale (45 min)
Chercher dans TOUTES les étagères au lieu d'une seule page.

#### 2. Bookmarks/Favoris (30 min)
Sauvegarder des livres favoris en localStorage avec Zustand.

#### 3. Tests (15 min)
Validation des nouvelles fonctionnalités.

---

## 🎯 Planning Recommandé

### Aujourd'hui (27 oct)
- ✅ Nettoyage projet (FAIT)
- ✅ Documentation (FAIT)
- 🚀 **Sprint 1 Performance** (2h)

### Demain (28 oct)
- 🧪 Tests intensifs
- 📊 Mesures de performance
- 📝 Documentation des gains

### J+2 (29 oct)
- 🚀 Sprint 2 Features (optionnel)
- 📦 Déploiement final

---

## ✅ Checklist Avant de Commencer

- [x] Projet propre (pas de fichiers inutiles)
- [x] Documentation complète (README + TECHNICAL)
- [x] Code committé
- [x] Serveur dev fonctionne
- [ ] Prêt pour React Query
- [ ] Prêt pour blur placeholder
- [ ] Prêt pour dark mode

---

## 📞 Support

### Si problème avec React Query
```bash
# Vérifier l'installation
pnpm list @tanstack/react-query

# Réinstaller si nécessaire
pnpm add @tanstack/react-query
```

### Si problème avec next-themes
```bash
pnpm add next-themes
```

---

## 🎉 Succès = Performance x2

**Avant :** 
- Navigation lente (refetch)
- Flash blanc sur images
- Pas de dark mode

**Après :**
- ⚡ Navigation instantanée
- 🎨 Loading élégant
- 🌙 Dark mode premium

---

**Date :** 27 octobre 2025  
**Status :** Prêt à démarrer  
**Temps estimé :** 2 heures  
**Gains attendus :** +50% performance
