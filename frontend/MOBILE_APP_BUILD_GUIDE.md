# TRITNA Mobile App - Developer Guide

## Overview
**TRITNA - Wan App, Evri Tin** is a comprehensive super-app for Sierra Leone, combining multiple services in one platform:

- 🚗 **RAYD** - Ride-hailing & Delivery
- 🍝 **FOOD** - Food Ordering
- 🎵 **ENJOYMENT** - Events & Nightlife
- 🏠 **OS** - Housing & Rentals
- 🛒 **MAKIT** - Marketplace
- 💳 **Wallet** - Digital payments (Afrimoney, Orange Money, Visa)

Supports **English** and **Krio (Sierra Leonean Creole)** languages.

---

## Quick Start for App Developers

### Prerequisites
- Node.js 18+ 
- Yarn or npm
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`
- Expo Go app on your device (for testing)

### Installation

```bash
# Clone/copy the project
cd frontend

# Install dependencies
yarn install

# Start development server
yarn start
```

### Running on Devices

```bash
# iOS Simulator
yarn ios

# Android Emulator
yarn android

# Expo Go (scan QR code)
yarn start
```

---

## Building for App Stores

### 1. Create Expo Account
```bash
# Login to Expo
eas login
```

### 2. Configure EAS Build

Update `eas.json` with your credentials:
- **iOS**: Apple ID, App Store Connect App ID, Team ID
- **Android**: Google Play Service Account JSON

### 3. Build Commands

```bash
# Development build (for testing)
eas build --platform all --profile development

# Preview build (internal testing - APK)
eas build --platform android --profile preview

# Production build (App Store/Play Store)
eas build --platform all --profile production
```

### 4. Submit to Stores

```bash
# Submit to App Store
eas submit --platform ios --profile production

# Submit to Google Play
eas submit --platform android --profile production
```

---

## Project Structure

```
frontend/
├── app/                      # Expo Router screens
│   ├── _layout.tsx           # Root layout with providers
│   ├── index.tsx             # Welcome/Onboarding screen
│   ├── (auth)/               # Authentication screens
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── verify.tsx
│   └── (tabs)/               # Main tab screens
│       ├── index.tsx         # Home
│       ├── rayd.tsx          # RAYD service
│       ├── food.tsx          # FOOD service
│       ├── wallet.tsx        # Wallet
│       └── profile.tsx       # Profile
├── src/
│   └── context/              # React Context providers
│       ├── AuthContext.tsx   # Authentication state
│       ├── LanguageContext.tsx # i18n (EN/Krio)
│       └── WalletContext.tsx # Wallet state
├── assets/                   # Images, fonts, icons
├── app.json                  # Expo configuration
├── eas.json                  # EAS Build configuration
└── package.json
```

---

## Key Features

### 1. Dual Language Support
The app supports English and Krio. Toggle in Profile settings.

```typescript
import { useLanguage } from '../src/context/LanguageContext';

const { t, toggleLanguage, language } = useLanguage();
// t('home') returns 'Home' or 'Hom' based on language
```

### 2. Navigation
Using Expo Router (file-based routing):
- `app/index.tsx` → `/` (Welcome)
- `app/(auth)/login.tsx` → `/login`
- `app/(tabs)/index.tsx` → Main Home Tab

### 3. State Management
- **AuthContext**: User authentication
- **WalletContext**: Balance, transactions
- **LanguageContext**: i18n support

### 4. Theming
Primary brand color: `#0B0F5B` (Deep Navy)
Accent colors per service:
- RAYD: `#0B0F5B`
- FOOD: `#F97316`
- ENJOYMENT: `#8B5CF6`
- OS: `#22C55E`
- MAKIT: `#EC4899`

---

## Required Assets

Before building, add these images to `assets/images/`:

| File | Size | Description |
|------|------|-------------|
| `icon.png` | 1024x1024 | App icon |
| `adaptive-icon.png` | 1024x1024 | Android adaptive icon |
| `splash-icon.png` | 200x200 | Splash screen logo |
| `favicon.png` | 48x48 | Web favicon |

---

## Environment Variables

Create `.env` file:
```
EXPO_PUBLIC_API_URL=https://your-api-url.com
```

---

## App Store Requirements

### iOS (App Store)
- **Bundle ID**: `com.tritna.app`
- **Minimum iOS**: 13.0
- **Required permissions**: Location (when in use & always)

### Android (Google Play)
- **Package**: `com.tritna.app`
- **Minimum SDK**: 23
- **Permissions**: Location, Camera, Storage, Internet

---

## Testing Checklist

- [ ] Onboarding flow
- [ ] Login/Register with OTP
- [ ] Home screen services
- [ ] RAYD booking flow
- [ ] FOOD ordering
- [ ] Wallet transactions
- [ ] Profile settings
- [ ] Language switching
- [ ] Deep linking

---

## Support

For development questions, contact the TRITNA team.

**TRITNA - Wan App, Evri Tin** 🇸🇱
