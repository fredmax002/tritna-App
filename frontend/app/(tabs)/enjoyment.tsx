import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../src/context/LanguageContext';

export default function EnjoymentScreen() {
  const { t, isEnglish } = useLanguage();

  const categories = [
    { id: '1', name: isEnglish ? 'Concerts' : 'Konsat', icon: 'musical-notes', color: '#8B5CF6' },
    { id: '2', name: isEnglish ? 'Nightlife' : 'Nayt Layf', icon: 'moon', color: '#EC4899' },
    { id: '3', name: isEnglish ? 'Festivals' : 'Festival', icon: 'sparkles', color: '#F97316' },
    { id: '4', name: isEnglish ? 'Sports' : 'Spot', icon: 'football', color: '#22C55E' },
  ];

  const events = [
    {
      id: '1',
      title: 'Freetown Music Festival 2024',
      date: 'Dec 15, 2024',
      venue: 'National Stadium',
      price: 150000,
      ticketsLeft: 500,
      type: 'Concert',
    },
    {
      id: '2',
      title: 'DJ Night at Club X',
      date: 'Dec 20, 2024',
      venue: 'Club X, Lumley',
      price: 50000,
      ticketsLeft: 150,
      type: 'Nightlife',
    },
    {
      id: '3',
      title: 'Sierra Leone Premier League',
      date: 'Dec 22, 2024',
      venue: 'Siaka Stevens Stadium',
      price: 25000,
      ticketsLeft: 1000,
      type: 'Sports',
    },
  ];

  const venues = [
    { name: 'Club X', type: 'Nightclub', rating: 4.8 },
    { name: 'The Hub', type: 'Lounge', rating: 4.6 },
    { name: 'Beach Bar', type: 'Beach Club', rating: 4.7 },
    { name: 'Sky Lounge', type: 'Rooftop', rating: 4.9 },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>TRITNA ENJOYMENT</Text>
            <Text style={styles.headerSubtitle}>
              {isEnglish ? 'Events & Nightlife' : 'Event & Naytlayf'}
            </Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="musical-notes" size={28} color="#FFFFFF" />
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
              placeholder={isEnglish ? 'Search events, venues...' : 'Sarch event, ples...'}
              placeholderTextColor="#999999"
            />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity key={category.id} style={styles.categoryButton}>
              <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
                <Ionicons
                  name={category.icon as keyof typeof Ionicons.glyphMap}
                  size={24}
                  color={category.color}
                />
              </View>
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Featured Event Banner */}
        <View style={styles.featuredBanner}>
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredBadgeText}>
              {isEnglish ? 'Featured Event' : 'Ficha Event'}
            </Text>
          </View>
          <Text style={styles.featuredTitle}>Freetown Music Festival 2024</Text>
          <View style={styles.featuredInfo}>
            <View style={styles.featuredInfoItem}>
              <Ionicons name="calendar" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.featuredInfoText}>Dec 15, 2024</Text>
            </View>
            <View style={styles.featuredInfoItem}>
              <Ionicons name="location" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.featuredInfoText}>National Stadium</Text>
            </View>
            <View style={styles.featuredInfoItem}>
              <Ionicons name="people" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.featuredInfoText}>500+ attending</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.featuredButton}>
            <Ionicons name="ticket" size={18} color="#8B5CF6" />
            <Text style={styles.featuredButtonText}>
              {isEnglish ? 'Buy Tickets' : 'Bai Ticket'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isEnglish ? 'Upcoming Events' : 'Event Den We Dey Kam'}
          </Text>
          {events.map((event) => (
            <TouchableOpacity key={event.id} style={styles.eventCard}>
              <View style={styles.eventImage}>
                <Ionicons name="musical-notes" size={40} color="#8B5CF620" />
                <View style={styles.eventPrice}>
                  <Text style={styles.eventPriceText}>SLE {event.price.toLocaleString()}</Text>
                </View>
              </View>
              <View style={styles.eventContent}>
                <View style={styles.eventType}>
                  <Text style={styles.eventTypeText}>{event.type}</Text>
                </View>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <View style={styles.eventMeta}>
                  <View style={styles.eventMetaItem}>
                    <Ionicons name="calendar" size={14} color="#666666" />
                    <Text style={styles.eventMetaText}>{event.date}</Text>
                  </View>
                  <View style={styles.eventMetaItem}>
                    <Ionicons name="location" size={14} color="#666666" />
                    <Text style={styles.eventMetaText}>{event.venue}</Text>
                  </View>
                  <View style={styles.eventMetaItem}>
                    <Ionicons name="ticket" size={14} color="#666666" />
                    <Text style={styles.eventMetaText}>{event.ticketsLeft} tickets left</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.eventButton}>
                  <Ionicons name="ticket" size={16} color="#FFFFFF" />
                  <Text style={styles.eventButtonText}>
                    {isEnglish ? 'Buy Ticket' : 'Bai Ticket'}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Popular Venues */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isEnglish ? 'Popular Venues' : 'Popyula Ples'}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {venues.map((venue, index) => (
              <TouchableOpacity key={index} style={styles.venueCard}>
                <View style={styles.venueImage}>
                  <Ionicons name="location" size={30} color="#CCCCCC" />
                </View>
                <Text style={styles.venueName}>{venue.name}</Text>
                <Text style={styles.venueType}>{venue.type}</Text>
                <View style={styles.venueRating}>
                  <Ionicons name="star" size={14} color="#F97316" />
                  <Text style={styles.venueRatingText}>{venue.rating}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
    backgroundColor: '#8B5CF6',
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
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryButton: {
    alignItems: 'center',
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#333333',
    fontWeight: '500',
  },
  featuredBanner: {
    marginHorizontal: 20,
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  featuredBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  featuredBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  featuredTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  featuredInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  featuredInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featuredInfoText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
  featuredButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  featuredButtonText: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  eventImage: {
    height: 120,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventPrice: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  eventPriceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  eventContent: {
    padding: 16,
  },
  eventType: {
    backgroundColor: '#8B5CF620',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  eventTypeText: {
    color: '#8B5CF6',
    fontSize: 12,
    fontWeight: '500',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  eventMeta: {
    marginBottom: 16,
  },
  eventMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  eventMetaText: {
    color: '#666666',
    fontSize: 13,
  },
  eventButton: {
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  eventButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  venueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 140,
  },
  venueImage: {
    height: 80,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  venueName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  venueType: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  venueRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  venueRatingText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333333',
  },
});
