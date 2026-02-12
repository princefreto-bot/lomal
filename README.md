# LOMAL IMMOBILIER 🏠

Plateforme SaaS immobilière pour Lomé, Togo. Permet aux habitants de trouver des chambres par quartier avec un système d'abonnement.

## 🚀 Fonctionnalités

### 👤 Utilisateurs
- **Authentification OTP SMS** via Supabase
- Recherche de chambres par quartier, prix, surface
- **IA de recommandation** intelligente
- Chat temps réel avec l'équipe LOMAL
- Abonnement hebdomadaire (1000 FCFA)

### 👑 Administration (accès via `#admin`)
- Dashboard avec KPIs et analytics
- Gestion des chambres (CRUD)
- Suivi des utilisateurs et paiements
- **Tracking des commissions**
- Messagerie centralisée

## 🛠 Stack Technique

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Paiements**: Mobile Money (PayDunya / CinetPay)
- **Notifications**: WhatsApp API (Twilio / Meta)
- **Hébergement**: Render

## 📦 Installation

```bash
# Cloner le repo
git clone <repo-url>
cd lomal-immobilier

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés Supabase

# Lancer en développement
npm run dev

# Build production
npm run build
```

## ⚙️ Configuration Supabase

### 1. Créer un projet Supabase
1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Noter l'URL et la clé `anon`

### 2. Exécuter le schéma SQL
1. Aller dans **SQL Editor**
2. Copier le contenu de `src/lib/supabase-schema.sql`
3. Exécuter le script

### 3. Activer l'authentification SMS
1. **Authentication > Providers > Phone**
2. Activer "Phone"
3. Configurer Twilio ou autre provider SMS

### 4. Créer le bucket Storage
1. **Storage > Create bucket**
2. Nom: `room-images`
3. Type: **Public**

### 5. Variables d'environnement
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon-ici
```

## 🌐 Déploiement Render

### 1. Créer un Web Service
1. Connecter votre repo GitHub
2. Sélectionner **Static Site** (ou Web Service pour SSR)

### 2. Configuration Build
```
Build Command: npm run build
Publish Directory: dist
```

### 3. Variables d'environnement
Ajouter dans Render:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 💳 Intégration Paiements

### PayDunya
```javascript
// Exemple d'intégration (à implémenter côté serveur)
const paydunya = require('paydunya');

paydunya.setup({
  masterKey: 'VOTRE_MASTER_KEY',
  privateKey: 'VOTRE_PRIVATE_KEY',
  token: 'VOTRE_TOKEN'
});
```

### CinetPay
```javascript
// Voir documentation CinetPay pour l'intégration
```

## 📱 Notifications WhatsApp

### Configuration Twilio
```env
TWILIO_ACCOUNT_SID=votre_sid
TWILIO_AUTH_TOKEN=votre_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### Messages automatiques
- Après inscription
- Après paiement
- Rappel de visite
- Réponse support

## 📁 Structure du Projet

```
src/
├── components/       # Composants React réutilisables
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Chat.tsx
│   └── SubscriptionModal.tsx
├── pages/            # Pages de l'application
│   ├── Home.tsx
│   ├── Rooms.tsx
│   ├── RoomDetail.tsx
│   ├── Login.tsx
│   ├── Subscription.tsx
│   ├── Dashboard.tsx
│   ├── Admin.tsx
│   ├── LegalNotice.tsx
│   ├── PrivacyPolicy.tsx
│   └── TermsOfService.tsx
├── lib/              # Configuration et utilitaires
│   ├── supabase.ts
│   └── supabase-schema.sql
├── hooks/            # Hooks React personnalisés
│   └── useSupabase.ts
├── store/            # État global (Zustand)
│   └── index.ts
├── types/            # Types TypeScript
│   └── index.ts
└── utils/            # Fonctions utilitaires
    └── cn.ts
```

## 🔒 Sécurité

- ✅ Authentification OTP (pas de mots de passe)
- ✅ RLS (Row Level Security) Supabase
- ✅ Chiffrement HTTPS
- ✅ Validation des entrées
- ✅ Protection CSRF

## 📊 Tables Supabase

| Table | Description |
|-------|-------------|
| `users` | Profils utilisateurs |
| `rooms` | Annonces de chambres |
| `messages` | Chat temps réel |
| `payments` | Historique paiements |
| `commissions` | Suivi des closings |

## 🚦 Prochaines étapes

1. [ ] Intégration paiement réel (PayDunya/CinetPay)
2. [ ] Notifications WhatsApp automatiques
3. [ ] PWA pour installation mobile
4. [ ] Géolocalisation des quartiers
5. [ ] Système de favoris
6. [ ] Historique des recherches

## 📞 Support

- **Email**: contact@lomal.tg
- **WhatsApp**: +228 90 00 00 00
- **Site**: www.lomal.tg

## 📄 Licence

© 2025 LOMAL IMMOBILIER. Tous droits réservés.
