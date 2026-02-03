import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'en' | 'krio';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isEnglish: boolean;
  isKrio: boolean;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations = {
  en: {
    // Common
    appName: 'TRITNA',
    tagline: 'One App, Everything',
    welcome: 'Welcome',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    next: 'Next',
    back: 'Back',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    search: 'Search',
    loading: 'Loading...',
    error: 'Something went wrong',
    retry: 'Try Again',
    
    // Navigation
    home: 'Home',
    rayd: 'RAYD',
    food: 'FOOD',
    enjoyment: 'ENJOYMENT',
    os: 'OS',
    makit: 'MAKIT',
    wallet: 'Wallet',
    profile: 'Profile',
    
    // Services
    rideDelivery: 'Ride & Delivery',
    foodOrdering: 'Food Ordering',
    eventsNightlife: 'Events & Nightlife',
    housingRentals: 'Housing & Rentals',
    marketplace: 'Marketplace',
    services: 'Services',
    
    // RAYD
    bookRide: 'Book a Ride',
    whereTo: 'Where to?',
    pickupLocation: 'Pickup Location',
    dropoffLocation: 'Dropoff Location',
    chooseVehicle: 'Choose Vehicle',
    car: 'Car',
    bike: 'Bike',
    keke: 'Keke',
    estimatedFare: 'Estimated Fare',
    bookNow: 'Book Now',
    findingDriver: 'Finding Driver...',
    driverArriving: 'Driver Arriving',
    tripInProgress: 'Trip in Progress',
    driverMode: 'Driver Mode',
    becomeDriver: 'Become a Driver',
    
    // FOOD
    orderFood: 'Order Food',
    restaurants: 'Restaurants',
    popularDishes: 'Popular Dishes',
    viewMenu: 'View Menu',
    addToCart: 'Add to Cart',
    yourOrder: 'Your Order',
    checkout: 'Checkout',
    deliveryTime: 'Delivery Time',
    deliveryFee: 'Delivery Fee',
    
    // ENJOYMENT
    events: 'Events',
    buyTickets: 'Buy Tickets',
    ticketPrice: 'Ticket Price',
    venues: 'Venues',
    nightclubs: 'Nightclubs',
    concerts: 'Concerts',
    festivals: 'Festivals',
    sports: 'Sports',
    
    // OS
    findHome: 'Find Home',
    apartments: 'Apartments',
    houses: 'Houses',
    shortStay: 'Short Stay',
    eventSpaces: 'Event Spaces',
    perNight: 'per night',
    guests: 'Guests',
    bedrooms: 'Bedrooms',
    bathrooms: 'Bathrooms',
    amenities: 'Amenities',
    becomeHost: 'Become a Host',
    
    // MAKIT
    buySell: 'Buy & Sell',
    categories: 'Categories',
    electronics: 'Electronics',
    fashion: 'Fashion',
    deals: "Today's Deals",
    chatSeller: 'Chat with Seller',
    myStore: 'My Store',
    addProduct: 'Add Product',
    
    // Wallet
    walletBalance: 'Wallet Balance',
    addMoney: 'Add Money',
    withdraw: 'Withdraw',
    sendMoney: 'Send Money',
    transactionHistory: 'History',
    paymentMethods: 'Payment',
    afrimoney: 'Afrimoney',
    orangeMoney: 'Orange Money',
    visaCard: 'Visa Card',
    cash: 'Cash',
    
    // Profile
    editProfile: 'Edit Profile',
    settings: 'Settings',
    language: 'Language',
    english: 'English',
    krio: 'Krio',
    helpSupport: 'Help & Support',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    
    // Onboarding
    onboarding1Title: 'One App, Everything',
    onboarding1Desc: 'TRITNA brings ride, food, events, housing, and marketplace together in one place.',
    onboarding2Title: 'Easy Payments',
    onboarding2Desc: 'Pay with Afrimoney, Orange Money, or card. Safe, secure, and instant.',
    onboarding3Title: 'Earn Money',
    onboarding3Desc: 'Join as driver, seller, or host and start earning today.',
    getStarted: 'Get Started',
    skip: 'Skip',
  },
  krio: {
    // Common
    appName: 'TRITNA',
    tagline: 'Wan App, Evri Tin',
    welcome: 'Welkom',
    login: 'Login',
    register: 'Sign Op',
    logout: 'Logot',
    next: 'Neks',
    back: 'Go Bak',
    save: 'Sev',
    cancel: 'Kansul',
    confirm: 'Konfirm',
    search: 'Sarch',
    loading: 'Dey Load...',
    error: 'Sometin go rong',
    retry: 'Try Agin',
    
    // Navigation
    home: 'Hom',
    rayd: 'RAYD',
    food: 'FOOD',
    enjoyment: 'ENJOYMENT',
    os: 'OS',
    makit: 'MAKIT',
    wallet: 'Wallet',
    profile: 'Profail',
    
    // Services
    rideDelivery: 'Ride & Delivery',
    foodOrdering: 'Fuud Odah',
    eventsNightlife: 'Event & Nightlife',
    housingRentals: 'Haws & Rent',
    marketplace: 'Makit',
    services: 'Savis',
    
    // RAYD
    bookRide: 'Book Ride',
    whereTo: 'We yu de go?',
    pickupLocation: 'We foh Pik Yu',
    dropoffLocation: 'We foh Drop Yu',
    chooseVehicle: 'Pik Mota',
    car: 'Mota',
    bike: 'Baik',
    keke: 'Keke',
    estimatedFare: 'Hamtin E Go Kost',
    bookNow: 'Book Naw',
    findingDriver: 'Dey Luk foh Driva...',
    driverArriving: 'Driva Dey Kam',
    tripInProgress: 'Trip Dey Go On',
    driverMode: 'Driva Mod',
    becomeDriver: 'Mek yu Driva',
    
    // FOOD
    orderFood: 'Odah Fuud',
    restaurants: 'Restaurant',
    popularDishes: 'Popyula Fuud',
    viewMenu: 'Luk Menu',
    addToCart: 'Put foh Kart',
    yourOrder: 'Yu Oda',
    checkout: 'Pay Naw',
    deliveryTime: 'Tem foh Bring',
    deliveryFee: 'Moni foh Bring',
    
    // ENJOYMENT
    events: 'Event',
    buyTickets: 'Bai Ticket',
    ticketPrice: 'Prais foh Ticket',
    venues: 'Ples',
    nightclubs: 'Nayt Klub',
    concerts: 'Konsat',
    festivals: 'Festaval',
    sports: 'Spot',
    
    // OS
    findHome: 'Fain Hom',
    apartments: 'Apatment',
    houses: 'Haws',
    shortStay: 'Short Stay',
    eventSpaces: 'Event Spes',
    bookNow: 'Book Naw',
    perNight: 'foh nayt',
    guests: 'Gest',
    bedrooms: 'Bed Rum',
    bathrooms: 'Baf Rum',
    amenities: 'Tin Den We De',
    becomeHost: 'Mek yu Host',
    
    // MAKIT
    buySell: 'Bai & Sel',
    categories: 'Kategori',
    electronics: 'Elektronik',
    fashion: 'Fashion',
    deals: 'Tide Dil',
    chatSeller: 'Tok to Sella',
    myStore: 'Mi Sto',
    addProduct: 'Ad Prodok',
    
    // Wallet
    walletBalance: 'Wallet Moni',
    addMoney: 'Ad Moni',
    withdraw: 'Tek Ot',
    sendMoney: 'Sen Moni',
    transactionHistory: 'Wetin Yu Don Pay',
    paymentMethods: 'We foh Pay',
    afrimoney: 'Afrimoney',
    orangeMoney: 'Orange Money',
    visaCard: 'Visa Kad',
    cash: 'Kash',
    
    // Profile
    editProfile: 'Edit Profail',
    settings: 'Setin',
    language: 'Langwij',
    english: 'English',
    krio: 'Krio',
    helpSupport: 'Help & Sopot',
    privacyPolicy: 'Praivasi Polisi',
    termsOfService: 'Tem of Savis',
    
    // Onboarding
    onboarding1Title: 'Wan App, Evri Tin',
    onboarding1Desc: 'TRITNA dey bring ride, food, event, house, and market togeda for wan place.',
    onboarding2Title: 'Izi foh Pay',
    onboarding2Desc: 'Pay wit Afrimoney, Orange Money, or kad. Safe, secure, and instan.',
    onboarding3Title: 'Mek Moni',
    onboarding3Desc: 'Join as driva, sella, or host and start earnin tide.',
    getStarted: 'Start Naw',
    skip: 'Skip',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('tritna-language');
      if (savedLanguage) {
        setLanguageState(savedLanguage as Language);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem('tritna-language', lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'krio' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isEnglish: language === 'en',
        isKrio: language === 'krio',
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
