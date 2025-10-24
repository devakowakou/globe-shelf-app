# 🔄 Guide de Migration NPM → PNPM

## ✅ Changements effectués

### 1. Installation de pnpm
```bash
npm install -g pnpm@10.19.0
```

### 2. Migration des dépendances
```bash
# Import du package-lock.json vers pnpm
pnpm import

# Installation avec pnpm
pnpm install

# Nettoyage des fichiers npm
rm -rf node_modules package-lock.json
```

### 3. Mise à jour de package.json
- ✅ Changement du nom : `nextn` → `globe-shelf-app`
- ✅ Ajout de `packageManager`: `"pnpm@10.19.0"`
- ✅ Ajout de `engines` pour spécifier Node >= 20
- ✅ Script `clean` ajouté
- ✅ Suppression de `firebase` (non utilisé)

### 4. Nettoyage Firebase Studio
- ❌ Supprimé : `apphosting.yaml`
- ❌ Supprimé : `.idx/` (configuration Firebase Studio)
- ❌ Supprimé : Dépendance `firebase`
- ✅ Conservé : Genkit AI (utilisé pour résumés)

### 5. Configuration des images
- ✅ Ajout des domaines Glose API dans `next.config.ts`
- ✅ Support des images de couvertures (CloudFront, S3)

---

## 🚀 Commandes

### Avant (npm)
```bash
npm install
npm run dev
npm run build
npm run start
```

### Maintenant (pnpm)
```bash
pnpm install      # ou juste: pnpm i
pnpm dev
pnpm build
pnpm start
```

---

## 📊 Avantages de pnpm

### 1. **Performance** ⚡
- Installation 2-3x plus rapide que npm
- Utilise des symlinks (pas de duplication)

### 2. **Espace disque** 💾
```
npm:  ~450 MB (node_modules dupliqués)
pnpm: ~150 MB (symlinks vers store central)
```

### 3. **Sécurité** 🔒
- Dépendances strictement isolées
- Pas d'accès fantôme aux dépendances non déclarées

### 4. **Monorepo-ready** 📦
- Gestion native des workspaces
- Partage des dépendances entre projets

---

## 🔧 Résolution de problèmes

### Erreur : "pnpm: command not found"
```bash
npm install -g pnpm
```

### Erreur de permissions
```bash
# Linux/Mac
sudo npm install -g pnpm

# Windows (admin)
npm install -g pnpm
```

### Cache corrompu
```bash
pnpm store prune
pnpm install --force
```

### Reconstruire depuis zéro
```bash
rm -rf node_modules .next pnpm-lock.yaml
pnpm install
```

---

## 📝 Fichiers modifiés

### Créés
- ✅ `pnpm-lock.yaml` (lockfile pnpm)
- ✅ `.nvmrc` (version Node)
- ✅ `IMPROVEMENTS.md` (documentation des corrections)
- ✅ `MIGRATION.md` (ce fichier)

### Modifiés
- ✅ `package.json` (packageManager, engines, scripts)
- ✅ `next.config.ts` (domaines images)
- ✅ `src/lib/api.ts` (appels API corrigés)
- ✅ `src/components/book-grid.tsx` (recherche améliorée)
- ✅ `.gitignore` (pnpm, nettoyage Firebase)
- ✅ `README.md` (documentation mise à jour)

### Supprimés
- ❌ `package-lock.json`
- ❌ `node_modules/` (réinstallé avec pnpm)
- ❌ `apphosting.yaml`
- ❌ `.idx/`
- ❌ Dépendance `firebase`

---

## 🎯 API Glose - Corrections

### ❌ Avant (incorrect)
```typescript
// Endpoint qui n'existe pas
GET /shelves/:id?expand=forms

// Headers bizarres
'Next-Router-State-Tree': '...',
'RSC': '1',
'Cookie': 'WorkstationJwtPartitioned=...'
```

### ✅ Après (correct)
```typescript
// Endpoints officiels Glose
GET https://api.glose.com/users/:userId/shelves
GET https://api.glose.com/shelves/:shelfId/forms
GET https://api.glose.com/forms/:formId

// Headers simples
{
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}
```

---

## 🧪 Tester les changements

### 1. Vérifier pnpm
```bash
pnpm --version  # Devrait afficher 10.19.0
```

### 2. Installer et démarrer
```bash
pnpm install
pnpm dev
```

### 3. Accéder à l'app
```
http://localhost:9002
```

### 4. Tester les fonctionnalités
- ✅ Liste des étagères affichée
- ✅ Clic sur une étagère → grille de livres
- ✅ Pagination fonctionne
- ✅ Recherche filtre les résultats
- ✅ Images de couvertures s'affichent

---

## 📚 Ressources

- [pnpm Documentation](https://pnpm.io)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [API Glose](https://api.glose.com)
- [shadcn/ui](https://ui.shadcn.com)

---

## ✨ Prochaines étapes recommandées

1. **Tests** 🧪
   ```bash
   pnpm add -D vitest @testing-library/react
   ```

2. **Linter/Formatter** 🎨
   ```bash
   pnpm add -D prettier eslint-config-prettier
   ```

3. **Commit hooks** 🪝
   ```bash
   pnpm add -D husky lint-staged
   ```

4. **Déploiement** 🚀
   ```bash
   # Vercel
   vercel

   # Ou autre plateforme
   pnpm build
   ```

---

**Migration effectuée le :** 24 octobre 2025
**Version pnpm :** 10.19.0
**Version Node :** 20.18.0
