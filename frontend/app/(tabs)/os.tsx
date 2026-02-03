import React, { useState } from 'react';
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

export default function OSScreen() {
  const { t, isEnglish } = useLanguage();
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const propertyTypes = [
    { id: '1', name: isEnglish ? 'Apartments' : 'Apatment', icon: 'business' },
    { id: '2', name: isEnglish ? 'Houses' : 'Haws', icon: 'home' },
    { id: '3', name: isEnglish ? 'Short Stay' : 'Shɔt Stay', icon: 'bed' },
    { id: '4', name: isEnglish ? 'Event Space' : 'Event Ples', icon: 'calendar' },
  ];

  const properties = [
    {
      id: '1',
      title: 'Modern 3BR Apartment',
      location: 'Aberdeen, Freetown',
      price: 450000,
      rating: 4.9,
      bedrooms: 3,
      bathrooms: 2,
      guests: 6,
      amenities: ['WiFi', 'AC', 'Pool', 'Parking'],
    },
    {
      id: '2',
      title: 'Cozy Studio with Ocean View',
      location: 'Lumley Beach Road',
      price: 200000,
      rating: 4.7,
      bedrooms: 1,
      bathrooms: 1,
      guests: 2,
      amenities: ['WiFi', 'AC', 'Kitchen'],
    },
    {
      id: '3',
      title: 'Luxury Villa with Garden',
      location: 'Hill Station',
      price: 800000,
      rating: 4.8,
      bedrooms: 5,
      bathrooms: 4,
      guests: 10,
      amenities: ['WiFi', 'Pool', 'Garden', 'Security'],
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>TRITNA OS</Text>
            <Text style={styles.headerSubtitle}>
              {isEnglish ? 'Housing & Rentals' : 'Haws & Rent'}
            </Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="home" size={28} color="#FFFFFF" />
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#999999" />
            <TextInput
              style={styles.searchInput}
              placeholder={isEnglish ? 'Search location...' : 'Sarch ples...'}
              placeholderTextColor="#999999"
            />
          </View>
        </View>

        {/* Property Types */}
        <View style={styles.typesContainer}>
          {propertyTypes.map((type) => (
            <TouchableOpacity key={type.id} style={styles.typeButton}>
              <View style={styles.typeIcon}>
                <Ionicons
                  name={type.icon as keyof typeof Ionicons.glyphMap}
                  size={24}
                  color="#22C55E"
                />
              </View>
              <Text style={styles.typeText}>{type.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Filters */}
        <View style={styles.filtersRow}>
          <Text style={styles.sectionTitle}>
            {isEnglish ? 'Featured Properties' : 'Ficha Propati'}
          </Text>
          <View style={styles.filterButtons}>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="filter" size={16} color="#666666" />
              <Text style={styles.filterButtonText}>{isEnglish ? 'Filter' : 'Filta'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="map" size={16} color="#666666" />
              <Text style={styles.filterButtonText}>{isEnglish ? 'Map' : 'Map'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Properties Grid */}
        <View style={styles.propertiesContainer}>
          {properties.map((property) => (
            <TouchableOpacity key={property.id} style={styles.propertyCard}>
              {/* Image Placeholder */}
              <View style={styles.propertyImage}>
                <Ionicons name="home" size={50} color="#22C55E30" />
                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={() => toggleFavorite(property.id)}
                >
                  <Ionicons
                    name={favorites.includes(property.id) ? 'heart' : 'heart-outline'}
                    size={20}
                    color={favorites.includes(property.id) ? '#EF4444' : '#666666'}
                  />
                </TouchableOpacity>
                <View style={styles.propertyPrice}>
                  <Text style={styles.propertyPriceText}>
                    SLE {property.price.toLocaleString()}/{isEnglish ? 'night' : 'nayt'}
                  </Text>
                </View>
              </View>

              {/* Content */}
              <View style={styles.propertyContent}>
                <View style={styles.propertyHeader}>
                  <Text style={styles.propertyTitle} numberOfLines={1}>
                    {property.title}
                  </Text>
                  <View style={styles.propertyRating}>
                    <Ionicons name="star" size={14} color="#22C55E" />
                    <Text style={styles.propertyRatingText}>{property.rating}</Text>
                  </View>
                </View>

                <View style={styles.propertyLocation}>
                  <Ionicons name="location" size={14} color="#666666" />
                  <Text style={styles.propertyLocationText} numberOfLines={1}>
                    {property.location}
                  </Text>
                </View>

                {/* Features */}
                <View style={styles.propertyFeatures}>
                  <View style={styles.featureItem}>
                    <Ionicons name="bed" size={14} color="#666666" />
                    <Text style={styles.featureText}>{property.bedrooms}</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="water" size={14} color="#666666" />
                    <Text style={styles.featureText}>{property.bathrooms}</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="people" size={14} color="#666666" />
                    <Text style={styles.featureText}>{property.guests} {isEnglish ? 'guests' : 'gest'}</Text>
                  </View>
                </View>

                {/* Amenities */}
                <View style={styles.amenitiesRow}>
                  {property.amenities.slice(0, 3).map((amenity, i) => (
                    <View key={i} style={styles.amenityBadge}>
                      <Ionicons name="checkmark" size={10} color="#666666" />
                      <Text style={styles.amenityText}>{amenity}</Text>
                    </View>
                  ))}
                  {property.amenities.length > 3 && (
                    <View style={styles.amenityBadge}>
                      <Text style={styles.amenityText}>+{property.amenities.length - 3}</Text>
                    </View>
                  )}
                </View>

                {/* CTA */}
                <View style={styles.ctaRow}>
                  <TouchableOpacity style={styles.bookButton}>
                    <Ionicons name="calendar" size={16} color="#FFFFFF" />
                    <Text style={styles.bookButtonText}>
                      {isEnglish ? 'Book Now' : 'Book Naw'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.contactButton}>
                    <Text style={styles.contactButtonText}>
                      {isEnglish ? 'Contact' : 'Kontak'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Become a Host CTA */}
        <View style={styles.hostCta}>
          <View>
            <Text style={styles.hostCtaTitle}>
              {isEnglish ? 'Become a Host' : 'Mek yu Host'}
            </Text>
            <Text style={styles.hostCtaSubtitle}>
              {isEnglish
                ? 'Earn money by renting out your property'
                : 'Mek moni foh rent ɔt yu propati'}
            </Text>
          </View>
          <TouchableOpacity style={styles.hostCtaButton}>
            <Text style={styles.hostCtaButtonText}>
              {isEnglish ? 'Get Started' : 'Start Naw'}
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
    backgroundColor: '#22C55E',
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
  headerIcon: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
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
  typesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  typeButton: {
    alignItems: 'center',
  },
  typeIcon: {
    width: 56,
    height: 56,
    backgroundColor: '#22C55E20',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  typeText: {
    fontSize: 11,
    color: '#333333',
    fontWeight: '500',
    textAlign: 'center',
  },
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
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
  propertiesContainer: {
    paddingHorizontal: 20,
  },
  propertyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  propertyImage: {
    height: 160,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  propertyPrice: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  propertyPriceText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#22C55E',
  },
  propertyContent: {
    padding: 16,
  },
  propertyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
  },
  propertyRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22C55E20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  propertyRatingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#22C55E',
  },
  propertyLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  propertyLocationText: {
    fontSize: 13,
    color: '#666666',
    flex: 1,
  },
  propertyFeatures: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    fontSize: 13,
    color: '#666666',
  },
  amenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  amenityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  amenityText: {
    fontSize: 11,
    color: '#666666',
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  bookButton: {
    flex: 1,
    backgroundColor: '#22C55E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  contactButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  contactButtonText: {
    color: '#22C55E',
    fontSize: 14,
    fontWeight: '600',
  },
  hostCta: {
    margin: 20,
    backgroundColor: '#22C55E',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hostCtaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  hostCtaSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  hostCtaButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  hostCtaButtonText: {
    color: '#22C55E',
    fontSize: 14,
    fontWeight: '600',
  },
});
