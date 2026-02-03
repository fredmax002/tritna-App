# TRITNA Mobile App - Product Requirements Document

## Project Overview
**TRITNA** - "Wan App, Evri Tin" (One App, Everything) is a comprehensive super-app for Sierra Leone that combines multiple services in one platform.

## Core Features Implemented

### 1. Authentication System
- Phone-based authentication with Sierra Leone country code (+232)
- OTP verification flow
- User registration with first name, last name, phone, email
- Persistent user session with AsyncStorage

### 2. Multi-Service Platform
- **RAYD** - Ride-hailing & Delivery (Car, Bike, Keke)
- **FOOD** - Food Ordering from restaurants
- **ENJOYMENT** - Events & Nightlife (placeholder)
- **OS** - Housing & Rentals (placeholder)
- **MAKIT** - Marketplace (placeholder)

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
- **Navigation**: Bottom Tab Navigator
- **Icons**: Expo Vector Icons (Ionicons)

## Project Structure
```
frontend/
├── app/                    # Expo Router screens
│   ├── _layout.tsx         # Root layout with providers
│   ├── index.tsx           # Welcome/Onboarding
│   ├── (auth)/             # Auth screens
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── verify.tsx
│   └── (tabs)/             # Main tab screens
│       ├── index.tsx       # Home
│       ├── rayd.tsx        # RAYD service
│       ├── food.tsx        # FOOD service
│       ├── wallet.tsx      # Wallet
│       └── profile.tsx     # Profile
├── src/context/            # React Context providers
│   ├── AuthContext.tsx
│   ├── LanguageContext.tsx
│   └── WalletContext.tsx
├── app.json                # Expo configuration
├── eas.json                # EAS Build configuration
└── MOBILE_APP_BUILD_GUIDE.md
```

## Build Configuration
- iOS Bundle ID: `com.tritna.app`
- Android Package: `com.tritna.app`
- Version: 1.0.0

## Notes
- **MOCKED DATA**: Authentication and wallet transactions are currently mocked for demo purposes. Real API integration needed for production.
- The app uses file-based routing with Expo Router
- All screens are optimized for mobile with touch-friendly targets (44px minimum)
