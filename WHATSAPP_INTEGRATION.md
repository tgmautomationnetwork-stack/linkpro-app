# WHATSAPP BUSINESS API INTEGRATION 📱

**Status** : ✅ Service créé - Prêt pour configuration

---

## 🎯 **FONCTIONNALITÉS**

### 1. **Envoi OTP**
- Code de vérification envoyé automatiquement
- Format : "Votre code LinkPro : *123456*"
- Expiration : 5 minutes
- Fallback : dev_otp en développement

### 2. **Notifications vendeur** (TODO)
- Alerte sur nouveau clic WhatsApp
- Détails : produit + source (TikTok/Instagram)

---

## 🔧 **DEUX OPTIONS D'INTÉGRATION**

### **Option A : WhatsApp Cloud API** (Meta - Recommandé)

**Avantages** :
- ✅ Officiel Meta
- ✅ Gratuit (1000 messages/mois)
- ✅ Stable et fiable
- ✅ Support global

**Setup** :
```bash
# 1. Créer compte Meta Business
https://business.facebook.com

# 2. Créer app WhatsApp Business
https://developers.facebook.com/apps
→ Create App → Business → WhatsApp

# 3. Setup WhatsApp
→ Add phone number (verify via SMS)
→ Generate access token (permanent)
→ Copy Phone Number ID

# 4. Config .env.local
WHATSAPP_PROVIDER=cloud
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_permanent_token
```

**Coût** :
- Gratuit : 1000 conversations/mois
- Après : ~0.005 USD / message (Cameroun)

**Documentation** : https://developers.facebook.com/docs/whatsapp/cloud-api

---

### **Option B : Evolution API** (Self-hosted)

**Avantages** :
- ✅ 100% gratuit
- ✅ Self-hosted (contrôle total)
- ✅ Pas de limite Meta
- ✅ Multi-instances

**Setup** :
```bash
# 1. Deploy Evolution API (Docker)
git clone https://github.com/EvolutionAPI/evolution-api
cd evolution-api
docker-compose up -d

# 2. Create instance
curl -X POST http://your-server:8080/instance/create \
  -H "apikey: your-api-key" \
  -d '{
    "instanceName": "linkpro",
    "qrcode": true
  }'

# 3. Scan QR code (WhatsApp app)
# 4. Config .env.local
WHATSAPP_PROVIDER=evolution
WHATSAPP_API_URL=http://your-server:8080
WHATSAPP_API_TOKEN=your-api-key
WHATSAPP_INSTANCE_NAME=linkpro
```

**Coût** :
- Gratuit (self-hosted)
- Serveur : ~5-10 USD/mois (Hetzner/DigitalOcean)

**Documentation** : https://github.com/EvolutionAPI/evolution-api

---

## 📋 **CONFIGURATION .env.local**

### Cloud API
```bash
# WhatsApp Cloud API (Meta)
WHATSAPP_PROVIDER=cloud
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxx
```

### Evolution API
```bash
# Evolution API (Self-hosted)
WHATSAPP_PROVIDER=evolution
WHATSAPP_API_URL=https://your-server.com
WHATSAPP_API_TOKEN=your-secret-api-key
WHATSAPP_INSTANCE_NAME=linkpro
```

---

## 🧪 **TESTING**

### Test en développement
```bash
# 1. Start app
npm run dev

# 2. Signup avec ton numéro
http://localhost:3000/signup

# 3. Vérifier logs
Console: "📱 OTP for +237671234567: 123456"

# 4. Si WhatsApp configuré :
→ Message reçu sur WhatsApp
→ Code : 123456

# 5. Si WhatsApp PAS configuré :
→ Warning dans logs
→ dev_otp quand même retourné (development only)
```

### Test en production
```bash
# Avec WhatsApp configuré :
curl -X POST https://linkpro.cm/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "whatsapp_number": "+237671234567",
    "action": "signup"
  }'

# Réponse :
{
  "success": true,
  "message": "Code envoyé sur WhatsApp",
  "expires_in": 300
}

# dev_otp n'est PAS retourné en production
```

---

## 🔒 **SÉCURITÉ**

### Tokens
- ⚠️ **NEVER** commit tokens dans git
- ✅ Toujours dans .env.local
- ✅ .env.local dans .gitignore

### Rate Limiting
```typescript
// Déjà implémenté dans send-otp API
3 tentatives / heure / numéro
```

### Validation
```typescript
// Format Cameroun uniquement
+237XXXXXXXXX (9 chiffres après 237)
```

---

## 📊 **FLOW COMPLET**

```
User: Enter WhatsApp number → Click "Continue"
  ↓
Frontend: POST /api/auth/send-otp
  ↓
Backend:
  1. Validate phone format (+237XXXXXXXXX)
  2. Check rate limit (3/hour)
  3. Generate 6-digit OTP
  4. Store in Supabase (expires 5 min)
  5. Send via WhatsApp (Cloud API or Evolution)
  ↓
WhatsApp: User receives "Votre code LinkPro : 123456"
  ↓
User: Enter code → Click "Create account"
  ↓
Frontend: POST /api/auth/verify-otp
  ↓
Backend:
  1. Verify code valid + not expired
  2. Check max 3 attempts
  3. Create vendor account
  4. Generate session token
  5. Delete used OTP
  ↓
Frontend: Redirect /dashboard
```

---

## 🚀 **PROCHAINES ÉTAPES**

### Phase 1 : OTP ✅
- [x] Service WhatsApp créé
- [x] Integration dans send-otp API
- [x] Support Cloud API + Evolution
- [x] Dev fallback (dev_otp)

### Phase 2 : Notifications (TODO)
- [ ] Notify vendor on WhatsApp click
- [ ] Format : "Nouveau clic ! Produit: X, Source: Y"
- [ ] Appeler dans analytics/track API

### Phase 3 : Advanced (TODO)
- [ ] Message templates (Meta approval)
- [ ] Rich media (images, buttons)
- [ ] Broadcast messages
- [ ] Chatbot responses

---

## ⚠️ **TROUBLESHOOTING**

### "WhatsApp not configured"
```
→ Vérifier .env.local
→ WHATSAPP_PROVIDER doit être 'cloud' ou 'evolution'
→ Tokens/URLs doivent être valides
```

### "Failed to send message" (Cloud API)
```
→ Vérifier Phone Number ID
→ Vérifier Access Token (permanent, pas temporary)
→ Vérifier number format (+237XXXXXXXXX)
→ Check Meta Business verification status
```

### "Network error" (Evolution)
```
→ Vérifier WHATSAPP_API_URL accessible
→ Vérifier instance WhatsApp connected (scan QR)
→ Vérifier apikey valide
```

---

## 💰 **COÛTS ESTIMATION**

### Cloud API (Meta)
```
Gratuit : 1000 conversations/mois
Après : ~0.005 USD/message

Exemple (100 signups/jour) :
- 3000 OTP/mois
- Coût : (3000 - 1000) × 0.005 = 10 USD/mois
```

### Evolution API (Self-hosted)
```
Server : 5-10 USD/mois
WhatsApp : Gratuit (ton numéro)

Total : 5-10 USD/mois (illimité)
```

**Recommandation** :
- Start: Cloud API (simple, gratuit 1000/mois)
- Scale: Evolution API (si >3000 messages/mois)

---

**STATUS** : ✅ Prêt à configurer - Choisir Cloud ou Evolution !
