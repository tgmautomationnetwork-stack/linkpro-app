# LINKPRO - DESIGN SYSTEM 🎨

**Style** : Refined Minimalism (Notion/Linear inspired)  
**Principe** : NO AI SLOP - Design authentique et professionnel

---

## ❌ **CE QU'ON ÉVITE (AI Slop)**

### Visuels
- ❌ Gradients purple→pink (cliché AI)
- ❌ Glassmorphism avec backdrop-blur partout
- ❌ Animations excessives et distractives
- ❌ Emojis dans le texte UI
- ❌ Sparkles/Crown icons
- ❌ Couleurs saturées (trop vives)

### Typographie
- ❌ Inter (trop utilisé)
- ❌ Roboto (générique)
- ❌ Space Grotesk (cliché)
- ❌ Font weights multiples sans raison

### Copie
- ❌ "Bonjour Marie ! 👋 Voici vos statistiques du jour ✨"
- ❌ Texte marketing cliché
- ❌ Phrases longues et fleuries
- ❌ Exclamations multiples !!!

---

## ✅ **NOTRE DIRECTION DESIGN**

### Aesthetic
**Refined Minimalism** - Propre, épuré, professionnel

### Philosophie
- Less is more
- Intentionnalité > Intensité
- Subtilité > Flash
- Fonctionnel > Décoratif

---

## 🎨 **PALETTE COULEURS**

### Primaire (Neutral)
```css
--neutral-50: #FAFAFA;   /* Background */
--neutral-100: #F5F5F5;  /* Cards alt */
--neutral-200: #E5E5E5;  /* Borders */
--neutral-300: #D4D4D4;  /* Borders hover */
--neutral-400: #A3A3A3;  /* Text disabled */
--neutral-500: #737373;  /* Text secondary */
--neutral-600: #525252;  /* Text primary */
--neutral-700: #404040;  /* Text dark */
--neutral-800: #262626;  /* Text darker */
--neutral-900: #171717;  /* Buttons, headings */
```

### Accent (Emerald - unique accent)
```css
--emerald-50: #ECFDF5;   /* Badge background */
--emerald-100: #D1FAE5;  /* Badge border */
--emerald-500: #10B981;  /* Dot, icons */
--emerald-600: #059669;  /* Hover */
```

### Semantic
```css
--red-500: #EF4444;      /* Error, delete */
--amber-500: #F59E0B;    /* Warning */
--green-500: #10B981;    /* Success */
--blue-500: #3B82F6;     /* Info */
```

### Usage
- Background principal : `#FAFAFA` (warm white)
- Text principal : `#171717` (quasi-noir)
- Borders : `#E5E5E5` (très subtil)
- Accent : Emerald (ONE color only)

---

## 📝 **TYPOGRAPHIE**

### Display Font
**Cal Sans** (titres seulement)
```css
font-family: 'Cal Sans', -apple-system, sans-serif;
letter-spacing: -0.02em;
```

### Body Font
**System Stack** (tout le reste)
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Helvetica Neue', Arial, sans-serif;
```

### Scales
```css
/* Headings */
h1: 52px (3.25rem)  font-display
h2: 40px (2.5rem)   font-display
h3: 36px (2.25rem)  font-display
h4: 24px (1.5rem)   font-semibold

/* Body */
Large: 17px (1.0625rem)
Base: 15px (0.9375rem)
Small: 13px (0.8125rem)
Tiny: 12px (0.75rem)
Micro: 11px (0.6875rem)
```

### Weights
```css
Regular: 400  /* Body text */
Medium: 500   /* Subtle emphasis */
Semibold: 600 /* Headings, buttons */
```

### Line Heights
```css
Tight: 1.05    /* Display titles */
Normal: 1.5    /* Body */
Relaxed: 1.625 /* Paragraphs */
```

---

## 📐 **SPACING SYSTEM**

### Scale (4px base)
```
1 = 4px
2 = 8px
3 = 12px
4 = 16px
5 = 20px
6 = 24px
8 = 32px
10 = 40px
12 = 48px
16 = 64px
20 = 80px
```

### Common Patterns
```css
/* Cards */
padding: 20px (5)  ou  24px (6)

/* Sections */
padding-y: 80px (20)

/* Buttons */
height: 32px (8)  Small
height: 36px (9)  Medium
height: 40px (10) Large
padding-x: 12px (3) ou 16px (4)

/* Gaps */
gap: 12px (3)  Tight
gap: 16px (4)  Normal
gap: 24px (6)  Loose
```

---

## 🔲 **COMPOSANTS**

### Buttons
```css
/* Primary */
bg: neutral-900
text: white
height: 40px
padding: 0 16px
border-radius: 6px (md)
font-size: 14px
font-weight: 500

/* Secondary */
bg: neutral-100
text: neutral-900
(same dimensions)

/* Ghost */
bg: transparent
text: neutral-700
hover:bg: neutral-100
```

### Cards
```css
bg: white
border: 1px solid neutral-200
border-radius: 8px (lg)
padding: 20px
hover:border: neutral-300
hover:shadow: sm
transition: all 200ms
```

### Inputs
```css
height: 40px
padding: 0 12px
border: 1px solid neutral-200
border-radius: 6px
focus:border: neutral-900
focus:outline: none
```

### Badges
```css
padding: 4px 10px
border-radius: 9999px (full)
font-size: 12px
font-weight: 500

/* Success */
bg: emerald-50
border: emerald-100
text: emerald-900
```

---

## 🎬 **ANIMATIONS**

### Principes
- **Subtle** > Flashy
- **Purposeful** > Decorative
- **Fast** (200-300ms max)

### Durées
```css
Instant: 100ms   /* Hover states */
Fast: 200ms      /* Transitions */
Normal: 300ms    /* Modal open */
Slow: 500ms      /* Page transitions */
```

### Easings
```css
Default: ease-out
Smooth: cubic-bezier(0.4, 0, 0.2, 1)
```

### Usage
```css
/* Buttons */
transition: all 200ms;

/* Cards */
transition: all 200ms;
hover:translate-y: -1px;

/* Navigation scroll */
transition: all 200ms;
backdrop-blur: md;
```

**PAS** de :
- Pulse animations partout
- Gradient animations
- Bounce effects
- Rotate/spin (sauf loading)

---

## 📱 **RESPONSIVE**

### Breakpoints
```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

### Mobile First
Toujours coder mobile d'abord, puis desktop.

```css
/* Mobile (default) */
text-[14px]

/* Desktop */
md:text-[16px]
```

---

## ✍️ **COPYWRITING**

### Principes
- **Concis** > Verbeux
- **Direct** > Fleuri
- **Factuel** > Marketing
- **Simple** > Complexe

### Bon
```
"Turn your social feed into a mobile store"
"See who visits. Track what sells."
"Start for free"
```

### Mauvais
```
"Transformez votre présence sur les réseaux sociaux en une boutique mobile ultra-performante ! ✨"
"Bonjour Marie ! 👋 Découvrez vos statistiques incroyables du jour 🎉"
"Commencez maintenant gratuitement et sans engagement !"
```

### Tone of Voice
- Professionnel mais accessible
- Confiant sans arrogance
- Informatif sans jargon
- Humain sans être trop familier

---

## 🎨 **SVG ILLUSTRATIONS**

### Style
- **Minimal** (pas de détails excessifs)
- **Geometric** (formes simples)
- **Monochrome** ou 2-3 couleurs max
- **Stroke-based** (pas fill complexes)

### Exemple Landing Page
```svg
<!-- Browser mockup -->
<rect fill="white" stroke="#E5E5E5"/>
<circle fill="#EF4444"/> <!-- Traffic lights -->
<rect fill="#F5F5F5"/>   <!-- Content placeholder -->
```

**PAS** de :
- Gradients complexes
- Shadows multiples
- Illustrations "cute"
- Personnages cartoon

---

## 🚫 **CHECKLIST ANTI-AI-SLOP**

Avant de ship une page, vérifier :

- [ ] Pas de gradient purple/pink
- [ ] Pas d'emojis dans UI
- [ ] Pas de "sparkles" icons
- [ ] Font ≠ Inter/Roboto
- [ ] Copie concise (pas marketing fluff)
- [ ] Couleurs neutres (gris dominants)
- [ ] UN seul accent color
- [ ] Animations subtiles (<300ms)
- [ ] SVG minimaux (pas cute)
- [ ] Spacing cohérent (4px base)

---

## 📚 **RÉFÉRENCES DESIGN**

### Inspiration
- **Notion** - Minimal, refined, neutral
- **Linear** - Clean, fast, professional
- **Vercel** - Typography, spacing
- **Arc Browser** - Subtle animations
- **Figma** - UI patterns

### Anti-références
- ❌ Sites générés par AI builders
- ❌ Templates Tailwind UI génériques
- ❌ Landing pages avec 10 gradients

---

**RÉSUMÉ** : On veut que l'app ait l'air d'avoir été **designée par une vraie équipe produit**, pas générée par AI.

**Refined > Flashy**  
**Subtle > Loud**  
**Professional > Playful**
