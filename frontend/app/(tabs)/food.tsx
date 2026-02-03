import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../src/context/LanguageContext';

export default function FoodScreen() {
  const { t } = useLanguage();

  const categories = [
    { id: '1', name: 'All', icon: 'grid' },
    { id: '2', name: 'Fast Food', icon: 'fast-food' },
    { id: '3', name: 'African', icon: 'restaurant' },
    { id: '4', name: 'Drinks', icon: 'beer' },
    { id: '5', name: 'Desserts', icon: 'ice-cream' },
  ];

  const restaurants = [
    { id: '1', name: "Mama's Kitchen", cuisine: 'African', rating: 4.8, time: '25-35 min', delivery: 5000 },
    { id: '2', name: 'Crown Xpress', cuisine: 'Fast Food', rating: 4.5, time: '20-30 min', delivery: 3000 },
    { id: '3', name: 'Golden Dragon', cuisine: 'Chinese', rating: 4.6, time: '30-40 min', delivery: 4000 },
    { id: '4', name: 'Lagoonda', cuisine: 'Continental', rating: 4.7, time: '35-45 min', delivery: 5000 },
  ];

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
          <View style={styles.cartBadge}>
            <Text style={styles.cartCount}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#999999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants or dishes..."
            placeholderTextColor="#999999"
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  index === 0 && styles.categoryButtonActive,
                ]}
              >
                <Ionicons
                  name={category.icon as keyof typeof Ionicons.glyphMap}
                  size={20}
                  color={index === 0 ? '#FFFFFF' : '#0B0F5B'}
                />
                <Text style={[
                  styles.categoryText,
                  index === 0 && styles.categoryTextActive,
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('popularDishes')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { name: 'Jollof Rice', price: 35000, rating: 4.9 },
              { name: 'Cassava Leaves', price: 40000, rating: 4.8 },
              { name: 'Fufu & Soup', price: 45000, rating: 4.7 },
            ].map((dish, index) => (
              <TouchableOpacity key={index} style={styles.dishCard}>
                <View style={styles.dishImage}>
                  <Ionicons name="restaurant" size={40} color="#F97316" />
                </View>
                <Text style={styles.dishName}>{dish.name}</Text>
                <Text style={styles.dishPrice}>SLE {dish.price.toLocaleString()}</Text>
                <View style={styles.dishRating}>
                  <Ionicons name="star" size={12} color="#F97316" />
                  <Text style={styles.dishRatingText}>{dish.rating}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Restaurants */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('restaurants')}</Text>
          {restaurants.map((restaurant) => (
            <TouchableOpacity key={restaurant.id} style={styles.restaurantCard}>
              <View style={styles.restaurantImage}>
                <Ionicons name="storefront" size={40} color="#0B0F5B" />
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
                    <Text style={styles.metaText}>{restaurant.time}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="bicycle" size={12} color="#666666" />
                    <Text style={styles.metaText}>SLE {restaurant.delivery.toLocaleString()}</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#CCCCCC" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    gap: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#0B0F5B',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  categoryTextActive: {
    color: '#FFFFFF',
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
  dishCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    width: 140,
    alignItems: 'center',
  },
  dishImage: {
    width: 80,
    height: 80,
    backgroundColor: '#F9731620',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  dishName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  dishPrice: {
    fontSize: 12,
    color: '#F97316',
    fontWeight: '600',
    marginTop: 4,
  },
  dishRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  dishRatingText: {
    fontSize: 12,
    color: '#666666',
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
    backgroundColor: '#0B0F5B10',
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
});
