# DESIGN REFONTE - PROGRESS 🎨

**Objectif** : Éliminer le "AI slop" - Design authentique style Notion/Linear

---

## ✅ **PAGES REFAITES (3/7)**

### 1. ✅ Landing Page (`page.tsx`)
**Changements** :
- ❌ Removed: Gradients purple→pink
- ❌ Removed: Emojis, sparkles icons
- ❌ Removed: Marketing fluff copy
- ✅ Added: Cal Sans display font
- ✅ Added: Neutral palette (grays + emerald accent)
- ✅ Added: Clean SVG browser mockup
- ✅ Added: Concise, direct copy

**Copie** :
```
Before: "Transformez votre présence sociale ! ✨"
After: "Turn your social feed into a mobile store"
```

---

### 2. ✅ Signup Page (`signup/page.tsx`)
**Changements** :
- ❌ Removed: Gradient cards, glassmorphism
- ❌ Removed: "Étape 1/2" badges with sparkles
- ❌ Removed: "Bonjour ! Commencez..." tone
- ✅ Added: Simple progress bars (2 lines)
- ✅ Added: Professional tone
- ✅ Added: Clean form inputs (h-10, border-neutral-200)

**Copie** :
```
Before: "Créez votre boutique ✨"
After: "Create your store"

Before: "Bonjour Marie ! 👋"
After: (removed - no greeting)
```

---

### 3. ✅ Login Page (`login/page.tsx`)
**Changements** :
- ❌ Removed: "Bon retour !" badge
- ❌ Removed: Benefits list with emojis
- ✅ Added: Minimal 2-step flow
- ✅ Added: Clean OTP input (6 boxes, centered)
- ✅ Added: "Sign in" → direct

**Copie** :
```
Before: "Connectez-vous à votre dashboard"
After: "Access your LinkPro dashboard."
```

---

## ⏳ **PAGES À REFAIRE (4/7)**

### 4. Dashboard Layout (`dashboard/layout.tsx`)
**À changer** :
- ❌ Remove: Gradient upgrade card with crown
- ❌ Remove: "Passer à PRO →" flashy CTA
- ❌ Remove: Avatar with gradient background
- ✅ Add: Simple sidebar (white bg, gray borders)
- ✅ Add: Minimal nav items (text only, no heavy icons)
- ✅ Add: Subtle active state (border-left 2px)

---

### 5. Dashboard Overview (`dashboard/page.tsx`)
**À changer** :
- ❌ Remove: "Bonjour Marie ! Voici vos statistiques..."
- ❌ Remove: Gradient text, sparkles icons
- ❌ Remove: Floating stats cards with animations
- ❌ Remove: "WhatsApp 📱" emojis
- ✅ Add: Simple grid stats (neutral cards)
- ✅ Add: Clean activity feed (no real-time badge with dot)
- ✅ Add: Professional tone

**Copie** :
```
Before: "Bonjour Marie ! Voici vos statistiques du jour"
After: "Dashboard" or just remove greeting entirely
```

---

### 6. Products Page (`dashboard/products/page.tsx`)
**À changer** :
- ❌ Remove: "Sparkles" icon + "Mes Produits ✨"
- ❌ Remove: Gradient buttons
- ❌ Remove: Purple/pink hover effects
- ✅ Add: Simple table/grid (neutral)
- ✅ Add: Minimal action buttons (edit/delete text only)
- ✅ Add: Clean search bar

---

### 7. Public Vendor Page (`[username]/page.tsx`)
**À changer** :
- ❌ Remove: Gradient placeholder images
- ❌ Remove: "Créé avec LinkPro 💜"
- ✅ Add: Clean product grid
- ✅ Add: Simple WhatsApp button (emerald, no animations)
- ✅ Add: Minimal footer

---

## 🎨 **DESIGN TOKENS APPLIQUÉS**

### Typography
```css
Display: Cal Sans (52px, 40px, 36px)
Body: System fonts (15px, 13px)
Weights: 400 (regular), 500 (medium), 600 (semibold)
```

### Colors
```css
Background: #FAFAFA
Text: #171717 (dark), #737373 (gray), #525252 (medium)
Borders: #E5E5E5
Accent: #10B981 (emerald)
Buttons: #171717 (neutral-900)
```

### Spacing
```css
Input height: 40px (h-10)
Button height: 40px (h-10)
Card padding: 20px
Section padding: 80px vertical
Gaps: 16px (gap-4)
```

### Components
```css
Buttons: rounded-md (6px)
Cards: rounded-lg (8px)
Inputs: border-neutral-200, focus:border-neutral-900
Transitions: 200ms
```

---

## ❌ **ÉLÉMENTS SUPPRIMÉS**

### Visuels
- ✅ Purple→pink gradients partout
- ✅ Glassmorphism (backdrop-blur)
- ✅ Sparkles, Crown, Trophy icons
- ✅ Animated gradient backgrounds
- ✅ Pulse animations
- ✅ Floating cards

### Copie
- ✅ "Bonjour Marie ! 👋"
- ✅ "✨ Étape 1/2"
- ✅ "Créé avec LinkPro 💜"
- ✅ Emojis dans UI text
- ✅ Exclamations multiples !!!

### Typographie
- ✅ Inter font (replaced with Cal Sans + System)
- ✅ Multiple font weights sans raison

---

## ✅ **CRITÈRES DE QUALITÉ**

Une page est **validée** si :

- [ ] Pas de gradient purple/pink
- [ ] Pas d'emojis dans UI
- [ ] Font = Cal Sans (display) + System (body)
- [ ] Palette = Neutral (gris) + 1 accent max
- [ ] Copie concise (pas marketing)
- [ ] Spacing cohérent (4px base)
- [ ] Transitions <300ms
- [ ] Borders subtils (#E5E5E5)
- [ ] Buttons height 40px
- [ ] Professional tone (no "Bonjour!")

---

## 🚀 **PROCHAINES ÉTAPES**

1. ✅ Landing refait
2. ✅ Signup refait
3. ✅ Login refait
4. ⏳ Dashboard Layout - EN COURS
5. ⏳ Dashboard Overview
6. ⏳ Products Page
7. ⏳ Public Vendor Page

---

**ETA** : 4 pages restantes × 15min = ~1h

**Veux-tu que je continue avec Dashboard Layout maintenant ?**
