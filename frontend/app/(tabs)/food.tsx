import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../src/context/LanguageContext';
import { useAuth } from '../../src/context/AuthContext';
import { foodAPI } from '../../src/services/api';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  delivery_time: string;
  delivery_fee: number;
  image: string;
  menu: MenuItem[];
}

interface CartItem {
  item_id: string;
  name: string;
  quantity: number;
  price: number;
  restaurant_id: string;
  restaurant_name: string;
}

export default function FoodScreen() {
  const { t, isEnglish } = useLanguage();
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);

  const categories = [
    { id: 'All', name: isEnglish ? 'All' : 'Ɔl' },
    { id: 'African', name: isEnglish ? 'African' : 'Afrikan' },
    { id: 'Fast Food', name: isEnglish ? 'Fast Food' : 'Fast Fuud' },
    { id: 'Chinese', name: isEnglish ? 'Chinese' : 'Chayniz' },
    { id: 'Continental', name: isEnglish ? 'Continental' : 'Kontinental' },
  ];

  useEffect(() => {
    loadRestaurants();
  }, [selectedCategory]);

  const loadRestaurants = async () => {
    setIsLoading(true);
    try {
      const data = await foodAPI.getRestaurants(selectedCategory === 'All' ? undefined : selectedCategory || undefined);
      setRestaurants(data);
    } catch (error) {
      console.error('Error loading restaurants:', error);
      Alert.alert('Error', 'Failed to load restaurants');
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (item: MenuItem, restaurant: Restaurant) => {
    const existingItem = cart.find(
      c => c.item_id === item.id && c.restaurant_id === restaurant.id
    );

    if (existingItem) {
      setCart(cart.map(c =>
        c.item_id === item.id && c.restaurant_id === restaurant.id
          ? { ...c, quantity: c.quantity + 1 }
          : c
      ));
    } else {
      // Check if cart has items from different restaurant
      if (cart.length > 0 && cart[0].restaurant_id !== restaurant.id) {
        Alert.alert(
          'Different Restaurant',
          'Your cart has items from another restaurant. Clear cart and add this item?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Clear & Add',
              onPress: () => {
                setCart([{
                  item_id: item.id,
                  name: item.name,
                  quantity: 1,
                  price: item.price,
                  restaurant_id: restaurant.id,
                  restaurant_name: restaurant.name,
                }]);
              }
            }
          ]
        );
        return;
      }

      setCart([...cart, {
        item_id: item.id,
        name: item.name,
        quantity: 1,
        price: item.price,
        restaurant_id: restaurant.id,
        restaurant_name: restaurant.name,
      }]);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const placeOrder = async () => {
    if (!user) {
      Alert.alert('Error', 'Please login to place order');
      return;
    }

    if (cart.length === 0) {
      Alert.alert('Error', 'Cart is empty');
      return;
    }

    setIsOrdering(true);
    try {
      const result = await foodAPI.placeOrder(user.id, {
        restaurant_id: cart[0].restaurant_id,
        items: cart.map(item => ({
          item_id: item.item_id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        delivery_address: 'Default Address', // In production, get from user
        payment_method: 'wallet',
      });

      if (result.success) {
        Alert.alert('Success', 'Order placed successfully!', [
          { text: 'OK', onPress: () => setCart([]) }
        ]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to place order');
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>TRITNA FOOD</Text>
          <Text style={styles.headerSubtitle}>{t('foodOrdering')}</Text>
        </View>
        <TouchableOpacity style={styles.cartButton}>
          <Ionicons name="cart" size={24} color="#0B0F5B" />
          {getCartCount() > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartCount}>{getCartCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#999999" />
          <TextInput
            style={styles.searchInput}
            placeholder={isEnglish ? 'Search restaurants...' : 'Sarch restaurant...'}
            placeholderTextColor="#999999"
          />
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive,
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F97316" />
          <Text style={styles.loadingText}>Loading restaurants...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Restaurant Menu Modal View */}
          {selectedRestaurant ? (
            <View style={styles.menuContainer}>
              <TouchableOpacity
                style={styles.backToRestaurants}
                onPress={() => setSelectedRestaurant(null)}
              >
                <Ionicons name="arrow-back" size={24} color="#333333" />
                <Text style={styles.backText}>Back to restaurants</Text>
              </TouchableOpacity>

              <View style={styles.restaurantHeader}>
                <Text style={styles.restaurantDetailName}>{selectedRestaurant.name}</Text>
                <Text style={styles.restaurantDetailCuisine}>{selectedRestaurant.cuisine}</Text>
              </View>

              <Text style={styles.menuTitle}>Menu</Text>
              {selectedRestaurant.menu.map((item) => (
                <View key={item.id} style={styles.menuItem}>
                  <View style={styles.menuItemInfo}>
                    <Text style={styles.menuItemName}>{item.name}</Text>
                    <Text style={styles.menuItemDesc}>{item.description}</Text>
                    <Text style={styles.menuItemPrice}>SLE {item.price.toLocaleString()}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.addItemButton}
                    onPress={() => addToCart(item, selectedRestaurant)}
                  >
                    <Ionicons name="add" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            /* Restaurants List */
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('restaurants')}</Text>
              {restaurants.length === 0 ? (
                <Text style={styles.emptyText}>No restaurants found</Text>
              ) : (
                restaurants.map((restaurant) => (
                  <TouchableOpacity
                    key={restaurant.id}
                    style={styles.restaurantCard}
                    onPress={() => setSelectedRestaurant(restaurant)}
                  >
                    <View style={styles.restaurantImage}>
                      <Ionicons name="storefront" size={40} color="#F97316" />
                    </View>
                    <View style={styles.restaurantInfo}>
                      <Text style={styles.restaurantName}>{restaurant.name}</Text>
                      <Text style={styles.restaurantCuisine}>{restaurant.cuisine}</Text>
                      <View style={styles.restaurantMeta}>
                        <View style={styles.metaItem}>
                          <Ionicons name="star" size={12} color="#F97316" />
                          <Text style={styles.metaText}>{restaurant.rating}</Text>
                        </View>
                        <View style={styles.metaItem}>
                          <Ionicons name="time" size={12} color="#666666" />
                          <Text style={styles.metaText}>{restaurant.delivery_time}</Text>
                        </View>
                        <View style={styles.metaItem}>
                          <Ionicons name="bicycle" size={12} color="#666666" />
                          <Text style={styles.metaText}>SLE {restaurant.delivery_fee.toLocaleString()}</Text>
                        </View>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#CCCCCC" />
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}

          {/* Cart Summary */}
          {cart.length > 0 && (
            <View style={styles.cartSummary}>
              <View style={styles.cartSummaryInfo}>
                <Text style={styles.cartSummaryTitle}>
                  {getCartCount()} item{getCartCount() > 1 ? 's' : ''} from {cart[0]?.restaurant_name}
                </Text>
                <Text style={styles.cartSummaryTotal}>
                  SLE {getCartTotal().toLocaleString()}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={placeOrder}
                disabled={isOrdering}
              >
                {isOrdering ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.checkoutButtonText}>
                    {isEnglish ? 'Place Order' : 'Put Oda'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F97316',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#F97316',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartCount: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#333333',
  },
  categoriesContainer: {
    paddingVertical: 16,
    paddingLeft: 20,
    backgroundColor: '#FFFFFF',
  },
  categoryButton: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryButtonActive: {
    backgroundColor: '#F97316',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  loadingText: {
    marginTop: 10,
    color: '#666666',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666666',
    marginTop: 20,
  },
  restaurantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  restaurantImage: {
    width: 70,
    height: 70,
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  restaurantCuisine: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  restaurantMeta: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#666666',
  },
  menuContainer: {
    padding: 20,
  },
  backToRestaurants: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  backText: {
    fontSize: 16,
    color: '#333333',
  },
  restaurantHeader: {
    marginBottom: 20,
  },
  restaurantDetailName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  restaurantDetailCuisine: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  menuItemDesc: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  menuItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F97316',
    marginTop: 8,
  },
  addItemButton: {
    width: 36,
    height: 36,
    backgroundColor: '#F97316',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartSummary: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: '#F97316',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartSummaryInfo: {
    flex: 1,
  },
  cartSummaryTitle: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  cartSummaryTotal: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  checkoutButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  checkoutButtonText: {
    color: '#F97316',
    fontSize: 14,
    fontWeight: '600',
  },
});
