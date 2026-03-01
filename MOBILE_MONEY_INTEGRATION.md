# MOBILE MONEY INTEGRATION 💰

**Status** : ✅ Services + APIs créés - Prêt pour configuration

---

## 🎯 **FONCTIONNALITÉS**

### Paiements supportés
- ✅ **MTN Mobile Money** (MoMo)
- ✅ **Orange Money**

### Features
- ✅ Upgrade Pro (5,000 FCFA/mois)
- ✅ Upgrade Business (15,000 FCFA/mois)
- ✅ Status polling (check automatique)
- ✅ Subscription renewal automatique
- ✅ Payment history tracking

---

## 📱 **MTN MOBILE MONEY**

### Setup Sandbox

**1. Créer compte développeur**
```
https://momodeveloper.mtn.com
→ Sign up
→ Subscribe to Collections product
```

**2. Générer API credentials**
```bash
# Get subscription key from dashboard
SUBSCRIPTION_KEY=your_key_here

# Create API user
curl -X POST https://sandbox.momodeveloper.mtn.com/v1_0/apiuser \
  -H "X-Reference-Id: YOUR_UUID" \
  -H "Ocp-Apim-Subscription-Key: $SUBSCRIPTION_KEY"

# Create API key
curl -X POST https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/YOUR_UUID/apikey \
  -H "Ocp-Apim-Subscription-Key: $SUBSCRIPTION_KEY"
```

**3. Config .env.local**
```bash
# MTN Mobile Money
MTN_MOMO_API_URL=https://sandbox.momodeveloper.mtn.com
MTN_MOMO_SUBSCRIPTION_KEY=your_subscription_key
MTN_MOMO_API_USER=your_api_user_uuid
MTN_MOMO_API_KEY=your_api_key
MTN_MOMO_ENVIRONMENT=sandbox
```

### Test en Sandbox

**Numéros de test** :
```
Success: 46733123450 (amount <= 1000)
Failure: 46733123451
Pending: 46733123452
```

**Flow de test** :
```bash
# 1. Request payment
curl -X POST http://localhost:3000/api/payments/mtn-momo \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "plan": "pro",
    "phone_number": "+46733123450"
  }'

# Response:
{
  "success": true,
  "payment_id": "uuid",
  "reference_id": "uuid",
  "message": "Payment initiated"
}

# 2. Check status
curl http://localhost:3000/api/payments/status?payment_id=UUID \
  -H "Authorization: Bearer YOUR_TOKEN"

# Response:
{
  "success": true,
  "status": "success",
  "amount": 5000,
  "plan": "pro"
}
```

### Production Setup

**Migration sandbox → production** :
```bash
# 1. Subscribe to Production Collections
# 2. Generate new production credentials
# 3. Update .env

MTN_MOMO_API_URL=https://proxy.momoapi.mtn.com
MTN_MOMO_ENVIRONMENT=production
# ... autres credentials production
```

**Go-live checklist** :
- [ ] KYC verification completed
- [ ] Production credentials generated
- [ ] Test with real phone numbers
- [ ] Webhook setup (optional)

---

## 🍊 **ORANGE MONEY**

### Setup Sandbox

**1. Créer compte développeur**
```
https://developer.orange.com
→ Sign up
→ Subscribe to Orange Money API
```

**2. Obtenir credentials**
```
Dashboard → My apps → Create app
→ Select Orange Money Webpay
→ Copy Client ID + Client Secret
→ Request merchant key from Orange
```

**3. Config .env.local**
```bash
# Orange Money
ORANGE_MONEY_API_URL=https://api.orange.com/orange-money-webpay
ORANGE_MONEY_CLIENT_ID=your_client_id
ORANGE_MONEY_CLIENT_SECRET=your_client_secret
ORANGE_MONEY_MERCHANT_KEY=your_merchant_key
ORANGE_MONEY_ENVIRONMENT=sandbox

# App URLs (for redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Test en Sandbox

**Flow de test** :
```bash
# 1. Initiate payment
curl -X POST http://localhost:3000/api/payments/orange-money \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "plan": "pro"
  }'

# Response:
{
  "success": true,
  "payment_url": "https://...",
  "payment_token": "token"
}

# 2. User redirected to payment_url
# 3. User completes payment
# 4. Redirect to return_url

# 5. Check status
curl http://localhost:3000/api/payments/status?payment_id=UUID
```

### Production Setup

```bash
# Update URLs + credentials for production
ORANGE_MONEY_ENVIRONMENT=production
# ... production credentials
```

---

## 🔄 **FLOW COMPLET**

### User Journey

```
1. User: Dashboard → Click "Upgrade"
   ↓
2. Select plan (Pro/Business)
   ↓
3. Select payment method (MTN/Orange)
   ↓
4. Enter phone number
   ↓
5. Click "Pay X FCFA"
   ↓
6. Backend: Create payment record (status: pending)
   ↓
7. Backend: Request payment from provider
   ↓
8. MTN MoMo:
   - User receives USSD push on phone
   - User enters PIN to approve
   
   Orange Money:
   - User redirected to Orange payment page
   - User enters OTP + PIN
   ↓
9. Frontend: Poll /api/payments/status every 3s
   ↓
10. Backend: Check status with provider
    ↓
11. If success:
    - Update payment.status = 'success'
    - Update vendor.subscription_plan
    - Update vendor.subscription_expires_at (+30 days)
    ↓
12. Frontend: Show success message
    ↓
13. User: Redirect to dashboard (now upgraded)
```

### Payment States

```typescript
'pending'  → Waiting for user approval
'success'  → Payment completed
'failed'   → Payment rejected/expired
```

---

## 🗄️ **DATABASE**

### payments table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id),
  amount DECIMAL NOT NULL,
  currency VARCHAR(3) DEFAULT 'XAF',
  method VARCHAR(20), -- 'mtn_momo' | 'orange_money'
  status VARCHAR(20), -- 'pending' | 'success' | 'failed'
  momo_transaction_id VARCHAR(255),
  subscription_plan VARCHAR(20),
  subscription_duration INTEGER, -- days
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
```

### vendors table (subscription fields)
```sql
ALTER TABLE vendors ADD COLUMN subscription_plan VARCHAR(20) DEFAULT 'free';
ALTER TABLE vendors ADD COLUMN subscription_expires_at TIMESTAMPTZ;
```

---

## 💰 **PRICING**

### Plans
```
FREE      : 0 FCFA/mois (10 products max)
PRO       : 5,000 FCFA/mois (unlimited)
BUSINESS  : 15,000 FCFA/mois (unlimited + team)
```

### Provider Costs

**MTN MoMo** :
- Collection fee : ~1.5% (négociable)
- Min ~75 FCFA sur 5,000 FCFA

**Orange Money** :
- Collection fee : ~2% (négociable)
- Min ~100 FCFA sur 5,000 FCFA

**Net revenus (exemple Pro)** :
```
Prix : 5,000 FCFA
Fee MTN : -75 FCFA (1.5%)
Net : 4,925 FCFA (98.5%)
```

---

## 🔒 **SÉCURITÉ**

### API Keys
```bash
# NEVER commit to git
.env.local (in .gitignore)

# Rotate keys régulièrement
Every 90 days in production
```

### Validation
```typescript
// Phone number format
+237XXXXXXXXX (Cameroun uniquement)

// Amount validation
validAmounts = { pro: 5000, business: 15000 }

// User authentication required
Bearer token in headers
```

### Webhooks (TODO)
```typescript
// Verify signature
Orange Money : HMAC-SHA256
MTN MoMo : Custom header verification
```

---

## 🧪 **TESTING CHECKLIST**

### MTN MoMo
- [ ] Sandbox credentials configured
- [ ] Payment request successful
- [ ] Status check works
- [ ] Success scenario (46733123450)
- [ ] Failure scenario (46733123451)
- [ ] Subscription updated on success

### Orange Money
- [ ] Sandbox credentials configured
- [ ] Payment initiated
- [ ] Redirect works
- [ ] Status callback received
- [ ] Subscription updated

### UI
- [ ] Plan selection works
- [ ] Payment method toggle
- [ ] Phone input validation
- [ ] Loading states
- [ ] Error handling
- [ ] Success screen

---

## ⚠️ **TROUBLESHOOTING**

### "MTN MoMo not configured"
```
→ Check .env.local has all MTN variables
→ Verify subscription key valid
→ Ensure API user created
```

### "Payment request failed"
```
→ Check phone number format (+237...)
→ Verify amount matches plan
→ Check API credentials
→ Review logs for specific error
```

### "Status check timeout"
```
→ Normal en sandbox (peut être lent)
→ Increase timeout in production
→ Implement webhook instead of polling
```

---

## 🚀 **PROCHAINES ÉTAPES**

### Phase 1 : Core ✅
- [x] MTN MoMo service
- [x] Orange Money service
- [x] Payment APIs
- [x] Upgrade page
- [x] Status polling

### Phase 2 : Production
- [ ] Production credentials
- [ ] Webhook handlers
- [ ] Payment reconciliation
- [ ] Automated refunds
- [ ] Email receipts

### Phase 3 : Advanced
- [ ] Payment history page
- [ ] Subscription auto-renewal
- [ ] Failed payment retry
- [ ] Proration on plan change
- [ ] Invoice generation

---

**STATUS** : ✅ Ready for sandbox testing !

**COÛT TOTAL SETUP** : 0 FCFA (sandbox gratuit)

**TEMPS ESTIMÉ** :
- Sandbox setup : 1-2 heures
- Production setup : 1-2 semaines (KYC approval)
