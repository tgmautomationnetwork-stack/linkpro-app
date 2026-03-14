# 🚀 LINKPRO - DEPLOYMENT GUIDE

## Voraussetzungen

### 1. Accounts erstellen
- ✅ [Vercel Account](https://vercel.com) (kostenlos)
- ✅ [Supabase Account](https://supabase.com) (kostenlos)
- ✅ [Cloudinary Account](https://cloudinary.com) (kostenlos)

### 2. Supabase Setup

**Schritt 1: Neues Projekt erstellen**
```
1. Gehe zu https://app.supabase.com
2. Klicke "New Project"
3. Name: linkpro
4. Region: Frankfurt (eu-central-1) oder nächste Region
5. Database Password: [sicheres Passwort generieren]
```

**Schritt 2: SQL Schema ausführen**
```
1. In Supabase Dashboard → SQL Editor
2. Kopiere kompletten Inhalt von /database/schema.sql
3. Klicke "Run"
4. Warte auf "Success" Meldung
```

**Schritt 3: API Keys kopieren**
```
Settings → API →
- Project URL: https://xxx.supabase.co
- anon public key: eyJh...
- service_role key: eyJh... (⚠️ Geheim halten!)
```

### 3. Cloudinary Setup

**Schritt 1: Account Setup**
```
1. Gehe zu https://cloudinary.com/users/register/free
2. Registriere kostenlosen Account
3. Dashboard öffnen
```

**Schritt 2: Upload Preset erstellen**
```
1. Settings → Upload
2. Add upload preset
3. Upload preset name: linkpro_products
4. Signing Mode: Unsigned
5. Folder: linkpro
6. Transformations:
   - Limit: 2000x2000
   - Quality: auto:good
   - Format: auto
7. Save
```

**Schritt 3: Credentials kopieren**
```
Dashboard →
- Cloud name: dxxxxxx
- API Key: 123456789
- API Secret: xxx (⚠️ Geheim halten!)
```

### 4. WhatsApp Business API (Optional für MVP)

**Option A: Evolution API (Einfacher)**
```
1. Besuche https://evolution-api.com
2. Folge Setup-Anleitung
3. Kopiere API URL und Token
```

**Option B: WhatsApp Cloud API (Production)**
```
1. Facebook Business Manager Account
2. Meta for Developers
3. WhatsApp Business API Setup
4. Phone Number ID und Access Token kopieren
```

⚠️ **Für ersten Start:** Kann leer gelassen werden. WhatsApp ist optional.

### 5. Mobile Money (Optional für MVP)

**MTN MoMo Sandbox**
```
1. https://momodeveloper.mtn.com
2. Account erstellen
3. Sandbox API Keys generieren
```

**Orange Money Sandbox**
```
1. https://developer.orange.com
2. Account erstellen
3. Sandbox Credentials anfordern
```

⚠️ **Für ersten Start:** Kann leer gelassen werden.

---

## Deployment zu Vercel

### Variante 1: GitHub → Vercel (Empfohlen)

**Schritt 1: Code zu GitHub pushen**
```bash
cd /app
git init
git add .
git commit -m "Initial commit - LinkPro MVP"
git branch -M main
git remote add origin https://github.com/DEIN-USERNAME/linkpro.git
git push -u origin main
```

**Schritt 2: Vercel Import**
```
1. Gehe zu https://vercel.com/new
2. Klicke "Import Git Repository"
3. Wähle dein GitHub Repo: linkpro
4. Project Name: linkpro
5. Framework Preset: Next.js (Auto-detected)
6. Root Directory: ./
7. Klicke "Deploy" NICHT sofort!
```

**Schritt 3: Environment Variables setzen**

In Vercel → Environment Variables:

```env
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
SUPABASE_SERVICE_ROLE_KEY=eyJh...

# Cloudinary (REQUIRED)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxxxxxx
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=linkpro_products
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=xxx

# App Config (REQUIRED)
NEXT_PUBLIC_APP_URL=https://linkpro.vercel.app
NEXT_PUBLIC_APP_NAME=LinkPro

# WhatsApp (OPTIONAL - kann leer lassen)
WHATSAPP_API_URL=
WHATSAPP_API_TOKEN=

# Mobile Money (OPTIONAL - kann leer lassen)
MTN_MOMO_SUBSCRIPTION_KEY=
MTN_MOMO_API_USER=
MTN_MOMO_API_KEY=
MTN_MOMO_ENVIRONMENT=sandbox
ORANGE_MONEY_CLIENT_ID=
ORANGE_MONEY_CLIENT_SECRET=
ORANGE_MONEY_MERCHANT_KEY=
```

**Schritt 4: Deploy starten**
```
1. Klicke "Deploy"
2. Warte 2-3 Minuten
3. ✅ App läuft auf: https://linkpro.vercel.app
```

### Variante 2: Vercel CLI

```bash
# Vercel CLI installieren
npm i -g vercel

# In Projekt-Ordner
cd /app

# Login
vercel login

# Deploy
vercel

# Production Deploy
vercel --prod
```

---

## Custom Domain Setup (Optional)

### Domain bei Vercel hinzufügen

**Schritt 1: Domain kaufen**
```
- Namecheap.com
- GoDaddy.com
- Domain.cm (für .cm Domain)
```

**Schritt 2: In Vercel hinzufügen**
```
1. Vercel Dashboard → Settings → Domains
2. Add Domain: linkpro.cm
3. Vercel zeigt DNS Records
```

**Schritt 3: DNS konfigurieren**
```
Bei deinem Domain-Anbieter:

A Record:
@ → 76.76.21.21

CNAME Record:
www → cname.vercel-dns.com
```

**Schritt 4: Warten**
```
DNS Propagation: 1-48 Stunden
SSL Certificate: Automatisch (Let's Encrypt)
```

---

## Post-Deployment Checklist

### Testing
- [ ] Landing Page lädt korrekt
- [ ] Signup Flow funktioniert
- [ ] Login Flow funktioniert
- [ ] Dashboard lädt
- [ ] Produkt erstellen (Image Upload → Cloudinary)
- [ ] Produkt bearbeiten
- [ ] Produkt löschen
- [ ] Public Vendor Page lädt
- [ ] WhatsApp Button (wenn konfiguriert)
- [ ] Analytics zeigt Daten

### Supabase Row Level Security
- [ ] RLS Policies sind aktiv
- [ ] Vendors können nur eigene Daten sehen
- [ ] Products sind öffentlich lesbar
- [ ] Products nur von Owner editierbar

### Performance
- [ ] Lighthouse Score > 90
- [ ] Images werden via Cloudinary geladen
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s

### SEO
- [ ] robots.txt erreichbar
- [ ] sitemap.txt erreichbar
- [ ] Meta Tags korrekt (View Page Source)
- [ ] OpenGraph Tags für Social Sharing

---

## Monitoring & Analytics

### Vercel Analytics (Built-in)
```
Automatisch aktiv:
- Page Views
- Unique Visitors
- Top Pages
- Geographic Distribution
```

### Optional: External Tools
```
- Google Analytics 4
- Plausible Analytics (privacy-friendly)
- PostHog (product analytics)
- Sentry (error tracking)
```

---

## Troubleshooting

### Build Error: "Module not found"
```bash
# Lokal testen
cd /app
yarn install
yarn build

# Wenn erfolgreich → Push zu GitHub
git add .
git commit -m "Fix dependencies"
git push
```

### Runtime Error: "Supabase connection failed"
```
1. Check Environment Variables in Vercel
2. NEXT_PUBLIC_SUPABASE_URL muss public sein
3. NEXT_PUBLIC_SUPABASE_ANON_KEY muss public sein
4. Redeploy nach Änderungen
```

### Images not loading
```
1. Check Cloudinary Dashboard → Media Library
2. Verify Upload Preset: linkpro_products
3. Verify Signing Mode: Unsigned
4. Check NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
```

### "Application Error" on Vercel
```
1. Vercel Dashboard → Deployment → Logs
2. Check Runtime Logs
3. Look for error stack trace
4. Fix → Push → Auto-redeploy
```

---

## Backup & Rollback

### Vercel Rollback
```
1. Vercel Dashboard → Deployments
2. Finde letztes funktionierendes Deployment
3. "..." → "Promote to Production"
```

### Supabase Backup
```
1. Supabase Dashboard → Database → Backups
2. Daily automatic backups (7 days retention)
3. Manual backup: Database → Download SQL Dump
```

---

## Kosten Übersicht

| Service | Free Tier | Limite | Kosten danach |
|---------|-----------|--------|---------------|
| **Vercel** | 100GB bandwidth | ~10k visits/mo | $20/mo Pro |
| **Supabase** | 500MB DB + 2GB bandwidth | 50k queries/mo | $25/mo Pro |
| **Cloudinary** | 25GB storage | 25GB bandwidth | $89/mo Plus |
| **Domain** | - | - | ~$15/Jahr |

**Total für Start:** ~$15/Jahr (nur Domain)
**Bei 10,000 users:** Immer noch kostenlos!

---

## Support

- **Vercel:** https://vercel.com/support
- **Supabase:** https://supabase.com/support
- **Cloudinary:** https://support.cloudinary.com

---

## ✅ Deployment Complete!

Deine App ist jetzt live auf:
🌐 **https://linkpro.vercel.app**

Nächste Schritte:
1. ✅ Teste alle Features
2. ✅ Erstelle 3-5 Test-Accounts
3. ✅ Teile Link mit Beta-Testern
4. ✅ Sammle Feedback
5. ✅ Iteriere und verbessere

**Viel Erfolg! 🚀**
