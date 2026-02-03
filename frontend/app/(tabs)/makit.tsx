import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../src/context/LanguageContext';

const { width } = Dimensions.get('window');

export default function MakitScreen() {
  const { t, isEnglish } = useLanguage();
  const [cartItems, setCartItems] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const addToCart = () => {
    setCartItems(prev => prev + 1);
  };

  const categories = [
    { id: 'all', name: isEnglish ? 'All' : 'Ɔl' },
    { id: 'electronics', name: isEnglish ? 'Electronics' : 'Elektronik' },
    { id: 'fashion', name: isEnglish ? 'Fashion' : 'Fashon' },
    { id: 'home', name: isEnglish ? 'Home' : 'Hom' },
    { id: 'beauty', name: isEnglish ? 'Beauty' : 'Byuti' },
  ];

  const products = [
    { id: '1', name: 'iPhone 15 Pro', price: 8500000, rating: 4.9, category: 'Electronics' },
    { id: '2', name: 'Nike Air Max', price: 580000, rating: 4.7, category: 'Fashion' },
    { id: '3', name: 'Samsung TV 55"', price: 3200000, rating: 4.8, category: 'Electronics' },
    { id: '4', name: 'Leather Handbag', price: 450000, rating: 4.6, category: 'Fashion' },
    { id: '5', name: 'Bluetooth Speaker', price: 280000, rating: 4.5, category: 'Electronics' },
    { id: '6', name: 'Kitchen Blender', price: 350000, rating: 4.4, category: 'Home' },
  ];

  const moreProducts = [
    { name: 'Wireless Earbuds', price: 320000 },
    { name: "Men's Sneakers", price: 420000 },
    { name: 'Laptop Stand', price: 180000 },
    { name: 'Phone Case', price: 45000 },
    { name: 'Backpack', price: 220000 },
    { name: 'Water Bottle', price: 65000 },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>TRITNA MAKIT</Text>
            <Text style={styles.headerSubtitle}>
              {isEnglish ? 'Buy & Sell Marketplace' : 'Bai & Sel Makit'}
            </Text>
          </View>
          <TouchableOpacity style={styles.cartButton}>
            <Ionicons name="cart" size={24} color="#FFFFFF" />
            {cartItems > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItems}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#999999" />
            <TextInput
              style={styles.searchInput}
              placeholder={isEnglish ? 'Search products...' : 'Sarch prodok...'}
              placeholderTextColor="#999999"
            />
          </View>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons
                name="grid"
                size={16}
                color={selectedCategory === category.id ? '#FFFFFF' : '#EC4899'}
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Deals Banner */}
        <View style={styles.dealsBanner}>
          <View style={styles.dealsContent}>
            <View style={styles.dealsTag}>
              <Ionicons name="pricetag" size={14} color="#FFFFFF" />
              <Text style={styles.dealsTagText}>
                {isEnglish ? "Today's Deals" : 'Tide Dil'}
              </Text>
            </View>
            <Text style={styles.dealsTitle}>
              {isEnglish ? 'Up to 50% OFF' : 'Ɔp to 50% ƆF'}
            </Text>
            <Text style={styles.dealsSubtitle}>
              {isEnglish ? 'Limited time offers' : 'Limit tem ofa'}
            </Text>
          </View>
          <TouchableOpacity style={styles.dealsButton}>
            <Text style={styles.dealsButtonText}>
              {isEnglish ? 'Shop Now' : 'Bai Naw'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {isEnglish ? 'Featured Products' : 'Ficha Prodok'}
            </Text>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="filter" size={16} color="#666666" />
              <Text style={styles.filterButtonText}>{isEnglish ? 'Filter' : 'Filta'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.productsGrid}>
            {products.map((product) => (
              <TouchableOpacity key={product.id} style={styles.productCard}>
                <View style={styles.productImage}>
                  <Ionicons name="cube" size={36} color="#CCCCCC" />
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => toggleFavorite(product.id)}
                  >
                    <Ionicons
                      name={favorites.includes(product.id) ? 'heart' : 'heart-outline'}
                      size={16}
                      color={favorites.includes(product.id) ? '#EF4444' : '#666666'}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.productContent}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {product.name}
                  </Text>
                  <Text style={styles.productCategory}>{product.category}</Text>
                  <View style={styles.productRating}>
                    <Ionicons name="star" size={12} color="#F97316" />
                    <Text style={styles.productRatingText}>{product.rating}</Text>
                  </View>
                  <View style={styles.productFooter}>
                    <Text style={styles.productPrice}>
                      SLE {product.price.toLocaleString()}
                    </Text>
                    <TouchableOpacity style={styles.addButton} onPress={addToCart}>
                      <Ionicons name="add" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* More to Explore */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isEnglish ? 'More to Explore' : 'Mo foh Luk'}
          </Text>
          <View style={styles.moreGrid}>
            {moreProducts.map((item, index) => (
              <TouchableOpacity key={index} style={styles.moreCard}>
                <View style={styles.moreImage}>
                  <Ionicons name="cube" size={30} color="#CCCCCC" />
                </View>
                <Text style={styles.moreName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.morePrice}>SLE {item.price.toLocaleString()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Become a Seller CTA */}
        <View style={styles.sellerCta}>
          <View style={styles.sellerCtaIcon}>
            <Ionicons name="storefront" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.sellerCtaContent}>
            <Text style={styles.sellerCtaTitle}>
              {isEnglish ? 'Become a Seller' : 'Mek yu Sella'}
            </Text>
            <Text style={styles.sellerCtaSubtitle}>
              {isEnglish
                ? 'Start selling your products today'
                : 'Start foh sel yu prodok tide'}
            </Text>
          </View>
          <TouchableOpacity style={styles.sellerCtaButton}>
            <Ionicons name="storefront" size={16} color="#22C55E" />
            <Text style={styles.sellerCtaButtonText}>
              {isEnglish ? 'Open Store' : 'Op Stɔ'}
            </Text>
          </TouchableOpacity>
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
    backgroundColor: '#EC4899',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  cartButton: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333333',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 10,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: '#EC4899',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  dealsBanner: {
    marginHorizontal: 20,
    backgroundColor: '#F97316',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  dealsContent: {
    flex: 1,
  },
  dealsTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  dealsTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  dealsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dealsSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  dealsButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  dealsButtonText: {
    color: '#F97316',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  filterButtonText: {
    fontSize: 13,
    color: '#666666',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  productCard: {
    width: (width - 52) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  productImage: {
    height: 120,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productContent: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 6,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  productRatingText: {
    fontSize: 12,
    color: '#666666',
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#EC4899',
  },
  addButton: {
    width: 28,
    height: 28,
    backgroundColor: '#EC4899',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  moreCard: {
    width: (width - 52) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
  },
  moreImage: {
    height: 80,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  moreName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  morePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#EC4899',
  },
  sellerCta: {
    margin: 20,
    backgroundColor: '#22C55E',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerCtaIcon: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sellerCtaContent: {
    flex: 1,
  },
  sellerCtaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sellerCtaSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  sellerCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  sellerCtaButtonText: {
    color: '#22C55E',
    fontSize: 13,
    fontWeight: '600',
  },
});
