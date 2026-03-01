# LINKPRO - GUIDE D'INTÉGRATION FRONTEND → BACKEND 🔌

**Date** : 1er Mars 2026  
**Status** : ✅ SERVICES CRÉÉS - PRÊT POUR INTÉGRATION

---

## 📦 **SERVICES CRÉÉS (5 fichiers)**

### 1. ✅ **AuthService**
**Fichier** : `src/lib/services/auth.service.ts`

**Méthodes** :
```typescript
AuthService.sendOtp({ whatsapp_number, action })
AuthService.verifyOtp({ whatsapp_number, code, username?, full_name? })
AuthService.logout()
AuthService.getToken()
AuthService.getUser()
AuthService.isAuthenticated()
```

**Usage** :
```typescript
// Signup
const result = await AuthService.sendOtp({
  whatsapp_number: '+237671234567',
  action: 'signup'
});

if (result.success) {
  // Show OTP input
  console.log('Dev OTP:', result.dev_otp); // Dev only
}

// Verify
const verifyResult = await AuthService.verifyOtp({
  whatsapp_number: '+237671234567',
  code: '123456',
  username: 'marie_boutique',
  full_name: 'Marie Fotso'
});

if (verifyResult.success) {
  // Token stored in localStorage
  // Redirect to /dashboard
  window.location.href = '/dashboard';
}
```

---

### 2. ✅ **ProductsService**
**Fichier** : `src/lib/services/products.service.ts`

**Méthodes** :
```typescript
ProductsService.list({ page, limit, category, available })
ProductsService.create(data)
ProductsService.update(id, data)
ProductsService.delete(id)
```

**Usage** :
```typescript
// List products
const { success, products, pagination } = await ProductsService.list({
  page: 1,
  limit: 20,
  available: true
});

// Create product
const { success, product } = await ProductsService.create({
  name: "Robe d'été",
  price: 15000,
  description: "Belle robe...",
  image_url: "https://res.cloudinary.com/...",
  category: "mode",
  tags: ["femme", "été"]
});

// Update
await ProductsService.update(productId, {
  price: 18000,
  is_available: false
});

// Delete
await ProductsService.delete(productId);
```

---

### 3. ✅ **AnalyticsService**
**Fichier** : `src/lib/services/analytics.service.ts`

**Méthodes** :
```typescript
AnalyticsService.track(event_data)
AnalyticsService.getOverview({ period, compare })
AnalyticsService.getSessionId()
AnalyticsService.detectSource(referrer)
AnalyticsService.getUtmParams()
```

**Usage** :
```typescript
// Track page view (public vendor page)
await AnalyticsService.track({
  event: 'page_view',
  vendor_username: 'marie_boutique',
  session_id: AnalyticsService.getSessionId(),
  metadata: {
    source: AnalyticsService.detectSource(document.referrer),
    ...AnalyticsService.getUtmParams()
  }
});

// Track WhatsApp click
await AnalyticsService.track({
  event: 'whatsapp_click',
  vendor_username: 'marie_boutique',
  session_id: AnalyticsService.getSessionId(),
  product_id: productId
});

// Get dashboard stats
const { metrics, daily_stats } = await AnalyticsService.getOverview({
  period: '30d',
  compare: true
});
```

---

### 4. ✅ **VendorsService**
**Fichier** : `src/lib/services/vendors.service.ts`

**Méthodes** :
```typescript
VendorsService.getPublicPage(username)
```

**Usage** :
```typescript
// Fetch public vendor page
const { vendor, products } = await VendorsService.getPublicPage('marie_boutique');

// Render products...
```

---

### 5. ✅ **CloudinaryService**
**Fichier** : `src/lib/services/cloudinary.service.ts`

**Méthodes** :
```typescript
CloudinaryService.uploadImage(file)
CloudinaryService.getOptimizedUrl(url, options)
CloudinaryService.getThumbnailUrl(url, size)
```

**Usage** :
```typescript
// Upload image
const { success, url } = await CloudinaryService.uploadImage(fileInput.files[0]);

if (success) {
  // Use URL in product creation
  await ProductsService.create({
    name: "...",
    image_url: url
  });
}

// Get optimized URL
const optimized = CloudinaryService.getOptimizedUrl(originalUrl, {
  width: 800,
  height: 800,
  quality: 'auto'
});

// Get thumbnail
const thumb = CloudinaryService.getThumbnailUrl(originalUrl, 400);
```

---

## 🪝 **HOOK REACT CRÉÉ**

### ✅ **useAuth**
**Fichier** : `src/hooks/useAuth.ts`

**Usage** :
```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';

export default function MyComponent() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  if (loading) return <div>Chargement...</div>;

  if (!isAuthenticated) {
    return <div>Non connecté</div>;
  }

  return (
    <div>
      <p>Bonjour {user.full_name}</p>
      <p>Plan: {user.subscription_plan}</p>
      <button onClick={logout}>Déconnexion</button>
    </div>
  );
}
```

---

## 🛡️ **MIDDLEWARE CRÉÉ**

**Fichier** : `src/middleware.ts`

**Protection automatique** :
- Routes `/dashboard/*` → Redirect `/login` si non authentifié
- Routes `/login`, `/signup` → Redirect `/dashboard` si authentifié

---

## 🔧 **SETUP CLOUDINARY**

### Étape 1 : Créer compte
1. Aller sur https://cloudinary.com/users/register/free
2. Créer compte gratuit (25GB/mois)

### Étape 2 : Créer Upload Preset (Unsigned)
1. Dashboard → Settings → Upload
2. "Add upload preset"
3. Signing Mode : **Unsigned**
4. Preset name : `linkpro_products`
5. Folder : `linkpro-products`
6. Transformations :
   - Quality : Auto
   - Format : Auto
   - Allowed formats : jpg, png, webp
7. Save

### Étape 3 : Config .env
```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=linkpro_products
```

---

## 📋 **CHECKLIST INTÉGRATION PAGES**

### **Page Signup** (`src/app/signup/page.tsx`)
```typescript
// ✅ DÉJÀ FAIT - Les pages utilisent déjà fetch()
// Mais tu peux remplacer par le service:

import { AuthService } from '@/lib/services/auth.service';

const result = await AuthService.sendOtp({
  whatsapp_number: formData.whatsappNumber,
  action: 'signup'
});

if (result.dev_otp) {
  console.log('Code OTP (dev):', result.dev_otp);
}
```

### **Page Login** (`src/app/login/page.tsx`)
```typescript
// Similaire à signup
const result = await AuthService.sendOtp({
  whatsapp_number,
  action: 'login'
});
```

### **Dashboard Layout** (`src/app/dashboard/layout.tsx`)
```typescript
// Ajouter useAuth hook
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }) {
  const { loading, isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return null;

  return (
    // ... existing layout
    // Use {user.full_name}, {user.username}, etc.
  );
}
```

### **Dashboard Overview** (`src/app/dashboard/page.tsx`)
```typescript
'use client';

import { useEffect, useState } from 'react';
import { AnalyticsService } from '@/lib/services/analytics.service';
import { ProductsService } from '@/lib/services/products.service';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // Fetch analytics
      const analyticsData = await AnalyticsService.getOverview({
        period: '30d',
        compare: true
      });
      
      // Fetch products
      const productsData = await ProductsService.list({ limit: 10 });
      
      setStats(analyticsData);
      setProducts(productsData.products || []);
      setLoading(false);
    }
    
    loadData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    // Use stats.metrics, products
  );
}
```

### **Page Publique** (`src/app/[username]/page.tsx`)
```typescript
'use client';

import { useEffect, useState } from 'react';
import { VendorsService } from '@/lib/services/vendors.service';
import { AnalyticsService } from '@/lib/services/analytics.service';
import { useParams } from 'next/navigation';

export default function PublicVendorPage() {
  const params = useParams();
  const username = params.username as string;
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadPage() {
      // Fetch vendor data
      const result = await VendorsService.getPublicPage(username);
      setData(result);

      // Track page view
      await AnalyticsService.track({
        event: 'page_view',
        vendor_username: username,
        session_id: AnalyticsService.getSessionId(),
        metadata: {
          source: AnalyticsService.detectSource(document.referrer),
          ...AnalyticsService.getUtmParams()
        }
      });
    }

    loadPage();
  }, [username]);

  const handleProductClick = async (product) => {
    // Track product view
    await AnalyticsService.track({
      event: 'product_view',
      vendor_username: username,
      session_id: AnalyticsService.getSessionId(),
      product_id: product.id
    });

    setSelectedProduct(product);
  };

  const handleWhatsAppClick = async (product) => {
    // Track WhatsApp click
    await AnalyticsService.track({
      event: 'whatsapp_click',
      vendor_username: username,
      session_id: AnalyticsService.getSessionId(),
      product_id: product.id
    });

    // Open WhatsApp
    const url = generateWhatsAppUrl(data.vendor.whatsapp_number, product.name, product.price);
    window.open(url, '_blank');
  };

  // Render...
}
```

---

## ✅ **TESTS À FAIRE**

### 1. **Test Auth Flow**
```bash
# Terminal 1 - Start dev server
npm run dev

# Terminal 2 - Test API
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"whatsapp_number":"+237671234567","action":"signup"}'

# Copier le dev_otp de la réponse

curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "whatsapp_number":"+237671234567",
    "code":"123456",
    "username":"test_user",
    "full_name":"Test User"
  }'

# Copier le token
```

### 2. **Test Products**
```bash
# Avec le token
curl http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. **Test Analytics**
```bash
# Public tracking
curl -X POST http://localhost:3000/api/analytics/track \
  -H "Content-Type: application/json" \
  -d '{
    "event":"page_view",
    "vendor_username":"test_user",
    "session_id":"test_session_123"
  }'
```

---

## 🚀 **PROCHAINES ÉTAPES**

1. **Setup Supabase** ✅
   - Créer projet
   - Exécuter `database/schema.sql`
   - Copier URL + keys dans `.env.local`

2. **Setup Cloudinary** ⏳
   - Créer compte
   - Créer unsigned preset
   - Copier cloud_name + preset dans `.env.local`

3. **Tester Auth** ⏳
   - Signup flow complet
   - Login flow complet
   - Dashboard access

4. **Tester Products** ⏳
   - Upload image Cloudinary
   - Créer produit
   - Liste produits

5. **Tester Public Page** ⏳
   - Visiter /[username]
   - Vérifier tracking analytics
   - Tester WhatsApp click

6. **WhatsApp Integration** (Phase 2)
   - WhatsApp Business API
   - Remplacer console.log OTP

7. **Mobile Money** (Phase 3)
   - MTN MoMo endpoint
   - Orange Money endpoint
   - Webhook handlers

---

**RÉSUMÉ** : Tous les services sont créés et prêts ! Il suffit de :
1. Config Supabase
2. Config Cloudinary  
3. Tester les flows
4. Ça marche ! 🚀

**Temps estimé setup complet** : 30 minutes
