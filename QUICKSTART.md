# 🚀 Démarrage Rapide - Globe Shelf App

## ⚡ Installation en 2 minutes

### 1. Cloner le projet
```bash
git clone https://github.com/devakowakou/globe-shelf-app.git
cd globe-shelf-app
```

### 2. Installer pnpm (si pas déjà fait)
```bash
npm install -g pnpm
```

### 3. Installer les dépendances
```bash
pnpm install
```

### 4. Lancer l'application
```bash
pnpm dev
```

🌐 **L'application est maintenant accessible sur :**
- Local: http://localhost:9002
- Network: http://YOUR_IP:9002

---

## 🎯 C'est tout !

✅ **Pas de configuration requise** - L'API Glose est publique
✅ **Pas d'auth** - Pas de tokens, pas de JWT
✅ **Pas de base de données** - Tout vient de l'API
✅ **Pas d'API key** - Fonctionne directement

---

## 🎨 Fonctionnalités disponibles

### Page d'accueil (/)
- ✅ Liste des étagères (10 par page)
- ✅ Nombre de livres par étagère
- ✅ Pagination
- ✅ Design moderne et responsive

### Page étagère (/shelves/[id])
- ✅ Hero section avec image
- ✅ Grille de livres (12 par page)
- ✅ Recherche locale (titre/auteur)
- ✅ Notes en étoiles ⭐
- ✅ Prix si disponible
- ✅ Pagination

---

## 🔧 Commandes disponibles

```bash
# Développement
pnpm dev          # Lance sur le port 9002

# Production
pnpm build        # Build optimisé
pnpm start        # Lance le build

# Qualité de code
pnpm lint         # ESLint
pnpm typecheck    # TypeScript check

# Nettoyage
pnpm clean        # Supprime .next et node_modules
```

---

## 🐛 Résolution de problèmes

### L'app ne démarre pas
```bash
# Nettoyer et réinstaller
pnpm clean
pnpm install
pnpm dev
```

### Images ne s'affichent pas
- Vérifiez `next.config.ts`
- Les domaines Glose sont autorisés par défaut

### Erreur de port (9002 déjà utilisé)
```bash
# Modifier le port dans package.json
"dev": "next dev --turbopack -p 3000"
```

---

## 📚 API Glose utilisée

```typescript
// Liste des étagères
GET https://api.glose.com/users/5a8411b53ed02c04187ff02a/shelves

// Liste des livres
GET https://api.glose.com/shelves/:shelfId/forms

// Détails d'un livre
GET https://api.glose.com/forms/:formId
```

**Aucune auth requise !** ✅

---

## 🎨 Stack technique

- **Framework:** Next.js 15.3 (App Router)
- **Language:** TypeScript 5.7
- **Styles:** Tailwind CSS + shadcn/ui
- **Package Manager:** pnpm 10.19
- **Runtime:** Node.js 20+

---

## 📱 Tester sur mobile

1. Lancez l'app : `pnpm dev`
2. Notez l'IP Network (ex: `http://192.168.150.122:9002`)
3. Sur votre téléphone (même WiFi), ouvrez cette URL
4. ✅ L'app est responsive !

---

## 🚀 Déploiement

### Vercel (recommandé - 1 clic)
```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer
vercel
```

### Autres options
- **Railway:** Auto-détecte Next.js
- **Netlify:** CI/CD automatique  
- **Docker:** Voir `DEPLOYMENT.md`

---

## 📖 Documentation complète

- `README.md` - Documentation générale
- `IMPROVEMENTS.md` - Corrections API détaillées
- `MIGRATION.md` - Guide migration npm→pnpm
- `SUMMARY.md` - Récapitulatif complet

---

## 💡 Tips

### Développement
- ⚡ Turbopack activé (Fast Refresh ultra-rapide)
- 🔥 Hot reload sur tous les fichiers
- 🎨 Tailwind CSS IntelliSense recommandé

### Performance
- Server Components par défaut (0 JS client)
- Images optimisées automatiquement
- Pagination API (pas de sur-chargement)

---

## 🎯 Prêt pour le test technique !

✅ **API corrigée** selon documentation Glose
✅ **Migration pnpm** réussie
✅ **Firebase Studio** supprimé
✅ **Code propre** et documenté
✅ **Fonctionnalités** validées
✅ **Performance** optimisée

**URL de test :** http://localhost:9002

---

## 🤝 Support

Des questions ? Consultez :
- `README.md` pour la doc complète
- `SUMMARY.md` pour le récapitulatif
- Issues GitHub pour reporter un bug

---

**Temps de setup :** ~2 minutes ⚡
**Dernière mise à jour :** 24 octobre 2025
