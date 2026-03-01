# LinkPro - Bio Link Intelligent pour Vendeurs Camerounais

Transformez votre lien bio TikTok/Instagram en une machine à vendre avec catalogue produits, analytics temps réel et intégration WhatsApp native.

## 🚀 Fonctionnalités

### ✨ Pour les Vendeurs
- **Catalogue Mobile-First** : Ajoutez produits en 30 secondes depuis votre téléphone
- **Analytics Temps Réel** : Tracking automatique de CHAQUE visiteur et clic
- **WhatsApp Intégré** : Messages pré-remplis + notifications instantanées
- **Dashboard Live** : Métriques clés mises à jour en temps réel (WebSocket)
- **Optimisations Images** : Compression automatique via Cloudinary
- **Multi-plans** : FREE (10 produits), PRO (illimité), BUSINESS (équipes)

### 📱 Pour les Clients
- **Chargement Ultra-Rapide** : <2 secondes même avec 3G
- **Prix Transparents** : Affichage FCFA clair avant contact
- **Mobile-Optimisé** : Interface parfaite pour Android (Tecno, Infinix)
- **Commande 1-Clic** : Direct vers WhatsApp avec produit pré-sélectionné

## 🏗️ Architecture Technique

### Stack
- **Frontend** : Next.js 15.1.4 (App Router) + TypeScript
- **Styling** : Tailwind CSS + shadcn/ui
- **Database** : Supabase (PostgreSQL 15)
- **Auth** : Supabase Auth (WhatsApp OTP)
- **Storage** : Cloudinary (images optimisées)
- **Paiements** : MTN Mobile Money + Orange Money
- **Messaging** : WhatsApp Business API
- **Hosting** : Vercel (Edge Network)

### Coûts Infrastructure (jusqu'à 10k utilisateurs)
- ✅ Vercel: **0 FCFA** (100GB bandwidth)
- ✅ Supabase: **0 FCFA** (500MB DB + 2GB/jour)
- ✅ Cloudinary: **0 FCFA** (25GB storage)
- Total: **~420 FCFA/mois** (domaine uniquement)

## 📦 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Compte Supabase
- Compte Cloudinary
- WhatsApp Business API access

### Setup Local

1. **Cloner le repo**
```bash
git clone https://github.com/votre-org/linkpro.git
cd linkpro
```

2. **Installer dépendances**
```bash
npm install
```

3. **Configuration environnement**
```bash
cp .env.example .env.local
```

Remplir les variables dans `.env.local` :
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# WhatsApp API
WHATSAPP_API_URL=your_api_url
WHATSAPP_API_TOKEN=your_token

# MTN MoMo
MTN_MOMO_SUBSCRIPTION_KEY=your_key
MTN_MOMO_API_USER=your_user
MTN_MOMO_API_KEY=your_api_key
```

4. **Setup Base de Données**
```bash
# Exécuter migrations SQL (voir /database/schema.sql)
# Créer tables : vendors, products, visits, product_views, payments
```

5. **Lancer en dev**
```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 🗄️ Structure Projet

```
linkpro-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Landing page
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Global styles
│   │   ├── signup/            # Inscription vendeur
│   │   ├── login/             # Connexion
│   │   ├── dashboard/         # Dashboard vendeur
│   │   ├── [username]/        # Page publique vendeur
│   │   └── api/               # API Routes
│   │       ├── auth/          # Auth endpoints (OTP)
│   │       ├── products/      # CRUD produits
│   │       ├── analytics/     # Analytics data
│   │       └── payments/      # Mobile Money
│   ├── components/
│   │   ├── ui/                # Components shadcn/ui
│   │   ├── vendor/            # Components vendeur
│   │   └── public/            # Components pages publiques
│   ├── lib/
│   │   ├── supabase.ts        # Client Supabase
│   │   └── utils.ts           # Utilitaires
│   └── types/
│       └── index.ts           # Types TypeScript
├── public/                     # Assets statiques
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🔑 Variables d'Environnement

Voir `.env.example` pour la liste complète.

**Variables requises** :
- `NEXT_PUBLIC_SUPABASE_URL` : URL projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` : Clé publique Supabase
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` : Cloud name Cloudinary

**Optionnelles (pour production)** :
- WhatsApp API credentials
- MTN MoMo credentials
- Orange Money credentials

## 🚀 Déploiement

### Vercel (Recommandé)

1. **Push vers GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Importer dans Vercel**
- Aller sur [vercel.com](https://vercel.com)
- Import repository GitHub
- Configurer variables environnement
- Deploy !

3. **Configuration Domaine**
- Ajouter `linkpro.cm` dans Vercel
- Configurer DNS chez registrar

## 📊 Schéma Base de Données

### Tables Principales

#### `vendors`
Stocke informations vendeurs
- `id` (UUID, PK)
- `username` (VARCHAR, UNIQUE)
- `whatsapp_number` (VARCHAR, UNIQUE)
- `subscription_plan` (ENUM: free/pro/business)
- `subscription_expires_at` (TIMESTAMP)

#### `products`
Catalogue produits vendeurs
- `id` (UUID, PK)
- `vendor_id` (UUID, FK → vendors)
- `name`, `price`, `image_url`
- `is_available` (BOOLEAN)
- `view_count`, `click_count` (INTEGER)

#### `visits`
Tracking visiteurs (partitionné par mois)
- `id` (UUID, PK)
- `vendor_id` (UUID, FK)
- `session_id`, `source`, `device_type`
- `whatsapp_clicked`, `whatsapp_opened` (BOOLEAN)

Voir documentation complète dans `/docs/database-schema.md`

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests E2E
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📈 Métriques Succès (KPIs)

| Métrique | Objectif Mois 1 | Objectif Mois 3 | Objectif Mois 6 |
|----------|-----------------|-----------------|-----------------|
| Inscriptions | 500 | 5,000 | 20,000 |
| Conversion FREE→PRO | 2% | 5% | 8% |
| Revenue mensuel | 50k FCFA | 1.25M FCFA | 8M FCFA |
| Taux rétention 30j | 40% | 60% | 70% |

## 🤝 Contribution

Contributions bienvenues ! Voir [CONTRIBUTING.md](CONTRIBUTING.md)

1. Fork le repo
2. Créer feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push branch (`git push origin feature/amazing-feature`)
5. Ouvrir Pull Request

## 📝 Licence

Propriétaire - © 2025 LinkPro

## 🆘 Support

- **Email** : support@linkpro.cm
- **WhatsApp** : +237 XXX XXX XXX
- **Documentation** : [docs.linkpro.cm](https://docs.linkpro.cm)

## 🙏 Remerciements

Développé par [TGM Automation](https://tgm-automation.cm) pour la communauté des vendeurs camerounais.

---

**Fait avec 💜 au Cameroun**
