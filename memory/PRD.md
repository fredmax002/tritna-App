# TRITNA Mobile App - Product Requirements Document

## Project Overview
**TRITNA** - "Wan App, Evri Tin" (One App, Everything) is a comprehensive super-app for Sierra Leone that combines multiple services in one platform.

## Core Features Implemented

### 1. Authentication System
- Phone-based authentication with Sierra Leone country code (+232)
- OTP verification flow
- User registration with first name, last name, phone, email
- Persistent user session with AsyncStorage

### 2. Multi-Service Platform (ALL 6 SERVICES)
- **RAYD** - Ride-hailing & Delivery (Car, Bike, Keke) - BLUE (#0B0F5B)
- **FOOD** - Food Ordering from restaurants - ORANGE (#F97316)
- **ENJOYMENT** - Events & Nightlife (Concerts, Festivals, Sports) - PURPLE (#8B5CF6)
- **OS** - Housing & Rentals (Apartments, Houses, Short Stay) - GREEN (#22C55E)
- **MAKIT** - Marketplace (Electronics, Fashion, etc.) - PINK (#EC4899)
- **Wallet** - Digital payments (Afrimoney, Orange Money, Visa)

### 3. Digital Wallet
- Balance display (SLE currency)
- Add Money functionality
- Send Money to other users
- Withdraw funds
- Transaction history with color-coded entries
- Multiple payment methods (Afrimoney, Orange Money, Visa)

### 4. Dual Language Support
- English (default)
- Krio (Sierra Leonean Creole)
- Language toggle in Profile settings

### 5. User Profile
- Avatar with initials
- Usage statistics (Rides, Orders, Events)
- Settings menu
- Logout functionality

## Technical Stack
- **Framework**: Expo (React Native)
- **Routing**: Expo Router (file-based)
- **State Management**: React Context API
- **Storage**: AsyncStorage
- **Navigation**: 8-Tab Bottom Navigator
- **Icons**: Expo Vector Icons (Ionicons)
- **Logo**: Custom TRITNA logo (logo.jpg)

## Project Structure
```
frontend/
├── app/                    # Expo Router screens
│   ├── _layout.tsx         # Root layout with providers
│   ├── index.tsx           # Welcome/Onboarding with logo
│   ├── (auth)/             # Auth screens
│   │   ├── login.tsx       # Login with logo
│   │   ├── register.tsx
│   │   └── verify.tsx
│   └── (tabs)/             # Main tab screens (8 tabs)
│       ├── index.tsx       # Home Dashboard
│       ├── rayd.tsx        # RAYD Ride Service
│       ├── food.tsx        # FOOD Ordering
│       ├── enjoyment.tsx   # ENJOYMENT Events & Nightlife
│       ├── os.tsx          # OS Housing & Rentals
│       ├── makit.tsx       # MAKIT Marketplace
│       ├── wallet.tsx      # Digital Wallet
│       └── profile.tsx     # User Profile
├── src/context/            # React Context providers
│   ├── AuthContext.tsx
│   ├── LanguageContext.tsx
│   └── WalletContext.tsx
├── assets/images/
│   └── logo.jpg            # TRITNA brand logo
├── app.json                # Expo configuration
├── eas.json                # EAS Build configuration
└── MOBILE_APP_BUILD_GUIDE.md
```

## Build Configuration
- iOS Bundle ID: `com.tritna.app`
- Android Package: `com.tritna.app`
- Version: 1.0.0
- Splash Screen: logo.jpg on #0B0F5B background

## Notes
- **MOCKED DATA**: Authentication and transactions are currently mocked for demo. Connect to real API for production.
- All 6 service screens are now fully functional
- The app uses file-based routing with Expo Router
- All screens are optimized for mobile with touch-friendly targets (44px minimum)
