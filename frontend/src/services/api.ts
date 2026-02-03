/**
 * TRITNA API Service
 * Handles all API calls to the backend
 */

import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Get the backend URL from environment
const API_BASE_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || 
                     process.env.EXPO_PUBLIC_BACKEND_URL || 
                     '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

// ============== AUTH API ==============

export const authAPI = {
  sendOTP: async (phone: string) => {
    const response = await api.post('/api/auth/send-otp', { phone });
    return response.data;
  },

  verifyOTP: async (data: {
    phone: string;
    otp: string;
    first_name?: string;
    last_name?: string;
    email?: string;
  }) => {
    const response = await api.post('/api/auth/verify-otp', data);
    return response.data;
  },

  getUser: async (userId: string) => {
    const response = await api.get(`/api/auth/user/${userId}`);
    return response.data;
  },

  updateUser: async (userId: string, data: {
    first_name?: string;
    last_name?: string;
    email?: string;
  }) => {
    const response = await api.put(`/api/auth/user/${userId}`, data);
    return response.data;
  },
};

// ============== WALLET API ==============

export const walletAPI = {
  getWallet: async (userId: string) => {
    const response = await api.get(`/api/wallet/${userId}`);
    return response.data;
  },

  addMoney: async (userId: string, data: {
    amount: number;
    payment_method: string;
  }) => {
    const response = await api.post(`/api/wallet/${userId}/add-money`, data);
    return response.data;
  },

  withdraw: async (userId: string, data: {
    amount: number;
    payment_method: string;
  }) => {
    const response = await api.post(`/api/wallet/${userId}/withdraw`, data);
    return response.data;
  },

  sendMoney: async (userId: string, data: {
    phone: string;
    amount: number;
  }) => {
    const response = await api.post(`/api/wallet/${userId}/send`, data);
    return response.data;
  },
};

// ============== RAYD (RIDES) API ==============

export const raydAPI = {
  getVehicleTypes: async () => {
    const response = await api.get('/api/rayd/vehicles');
    return response.data;
  },

  bookRide: async (userId: string, data: {
    pickup_location: string;
    pickup_lat?: number;
    pickup_lng?: number;
    dropoff_location: string;
    dropoff_lat?: number;
    dropoff_lng?: number;
    vehicle_type: string;
    payment_method: string;
  }) => {
    const response = await api.post(`/api/rayd/book/${userId}`, data);
    return response.data;
  },

  getRides: async (userId: string) => {
    const response = await api.get(`/api/rayd/rides/${userId}`);
    return response.data;
  },

  completeRide: async (rideId: string, userId: string) => {
    const response = await api.put(`/api/rayd/rides/${rideId}/complete?user_id=${userId}`);
    return response.data;
  },

  cancelRide: async (rideId: string) => {
    const response = await api.put(`/api/rayd/rides/${rideId}/cancel`);
    return response.data;
  },
};

// ============== FOOD API ==============

export const foodAPI = {
  getRestaurants: async (category?: string) => {
    const params = category ? { category } : {};
    const response = await api.get('/api/food/restaurants', { params });
    return response.data;
  },

  getRestaurant: async (restaurantId: string) => {
    const response = await api.get(`/api/food/restaurants/${restaurantId}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/api/food/categories');
    return response.data;
  },

  placeOrder: async (userId: string, data: {
    restaurant_id: string;
    items: Array<{
      item_id: string;
      name: string;
      quantity: number;
      price: number;
    }>;
    delivery_address: string;
    payment_method: string;
  }) => {
    const response = await api.post(`/api/food/orders/${userId}`, data);
    return response.data;
  },

  getOrders: async (userId: string) => {
    const response = await api.get(`/api/food/orders/${userId}`);
    return response.data;
  },
};

// ============== ENJOYMENT (EVENTS) API ==============

export const enjoymentAPI = {
  getEvents: async (category?: string) => {
    const params = category ? { category } : {};
    const response = await api.get('/api/enjoyment/events', { params });
    return response.data;
  },

  getEvent: async (eventId: string) => {
    const response = await api.get(`/api/enjoyment/events/${eventId}`);
    return response.data;
  },

  getVenues: async () => {
    const response = await api.get('/api/enjoyment/venues');
    return response.data;
  },

  buyTicket: async (userId: string, data: {
    event_id: string;
    quantity: number;
    payment_method: string;
  }) => {
    const response = await api.post(`/api/enjoyment/tickets/${userId}`, data);
    return response.data;
  },

  getTickets: async (userId: string) => {
    const response = await api.get(`/api/enjoyment/tickets/${userId}`);
    return response.data;
  },
};

// ============== OS (HOUSING) API ==============

export const osAPI = {
  getProperties: async (propertyType?: string) => {
    const params = propertyType ? { property_type: propertyType } : {};
    const response = await api.get('/api/os/properties', { params });
    return response.data;
  },

  getProperty: async (propertyId: string) => {
    const response = await api.get(`/api/os/properties/${propertyId}`);
    return response.data;
  },

  bookProperty: async (userId: string, data: {
    property_id: string;
    check_in: string;
    check_out: string;
    guests: number;
    payment_method: string;
  }) => {
    const response = await api.post(`/api/os/bookings/${userId}`, data);
    return response.data;
  },

  getBookings: async (userId: string) => {
    const response = await api.get(`/api/os/bookings/${userId}`);
    return response.data;
  },
};

// ============== MAKIT (MARKETPLACE) API ==============

export const makitAPI = {
  getProducts: async (category?: string) => {
    const params = category ? { category } : {};
    const response = await api.get('/api/makit/products', { params });
    return response.data;
  },

  getProduct: async (productId: string) => {
    const response = await api.get(`/api/makit/products/${productId}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/api/makit/categories');
    return response.data;
  },

  getCart: async (userId: string) => {
    const response = await api.get(`/api/makit/cart/${userId}`);
    return response.data;
  },

  addToCart: async (userId: string, data: {
    product_id: string;
    quantity: number;
  }) => {
    const response = await api.post(`/api/makit/cart/${userId}`, data);
    return response.data;
  },

  removeFromCart: async (userId: string, productId: string) => {
    const response = await api.delete(`/api/makit/cart/${userId}/${productId}`);
    return response.data;
  },

  placeOrder: async (userId: string, data: {
    items: Array<{
      product_id: string;
      name: string;
      quantity: number;
      price: number;
    }>;
    delivery_address: string;
    payment_method: string;
  }) => {
    const response = await api.post(`/api/makit/orders/${userId}`, data);
    return response.data;
  },

  getOrders: async (userId: string) => {
    const response = await api.get(`/api/makit/orders/${userId}`);
    return response.data;
  },
};

// ============== HEALTH CHECK ==============

export const healthCheck = async () => {
  const response = await api.get('/api/health');
  return response.data;
};

export default api;
