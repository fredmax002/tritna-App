import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useLanguage } from '../../src/context/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const logoImage = require('../../assets/images/logo.jpg');

interface ServiceCard {
  id: string;
  title: string;
  titleKrio: string;
  description: string;
  descriptionKrio: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  route: string;
}

export default function HomeScreen() {
  const { t, isEnglish } = useLanguage();

  const services: ServiceCard[] = [
    {
      id: 'rayd',
      title: 'RAYD',
      titleKrio: 'RAYD',
      description: 'Ride & Delivery',
      descriptionKrio: 'Ride & Delivery',
      icon: 'car',
      color: '#0B0F5B',
      route: '/(tabs)/rayd',
    },
    {
      id: 'food',
      title: 'FOOD',
      titleKrio: 'FOOD',
      description: 'Food Ordering',
      descriptionKrio: 'Fuud Odah',
      icon: 'restaurant',
      color: '#F97316',
      route: '/(tabs)/food',
    },
    {
      id: 'enjoyment',
      title: 'ENJOYMENT',
      titleKrio: 'ENJOYMENT',
      description: 'Events & Nightlife',
      descriptionKrio: 'Event & Naytlayf',
      icon: 'musical-notes',
      color: '#8B5CF6',
      route: '/(tabs)/enjoyment',
    },
    {
      id: 'os',
      title: 'OS',
      titleKrio: 'OS',
      description: 'Housing & Rentals',
      descriptionKrio: 'Haws & Rent',
      icon: 'home',
      color: '#22C55E',
      route: '/(tabs)/os',
    },
    {
      id: 'makit',
      title: 'MAKIT',
      titleKrio: 'MAKIT',
      description: 'Buy & Sell',
      descriptionKrio: 'Bai & Sel',
      icon: 'cart',
      color: '#EC4899',
      route: '/(tabs)/makit',
    },
  ];

  const stats = [
    { value: '50K+', label: isEnglish ? 'Users' : 'Yuzas' },
    { value: '5', label: isEnglish ? 'Services' : 'Savis' },
    { value: '100K+', label: isEnglish ? 'Orders' : 'Odas' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <SafeAreaView edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Image source={logoImage} style={styles.logo} resizeMode="cover" />
              </View>
              <View style={styles.availableBadge}>
                <View style={styles.availableDot} />
                <Text style={styles.availableText}>
                  {isEnglish ? 'Available in Sierra Leone' : 'Dey Naw foh Salone'}
                </Text>
              </View>
            </View>

            {/* Hero Content */}
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>
                {isEnglish ? 'One App,' : 'Wan App,'}
              </Text>
              <Text style={styles.heroTitle}>
                {isEnglish ? 'Everything' : 'Evri Tin'}
              </Text>
              <Text style={styles.heroSubtitle}>
                {isEnglish
                  ? 'TRITNA brings ride, food, events, housing, and marketplace together in one place.'
                  : 'TRITNA dey bring ride, food, event, house, and market togeda for wan place.'}
              </Text>

              {/* CTA Button */}
              <TouchableOpacity
                style={styles.ctaButton}
                onPress={() => router.push('/(tabs)/rayd')}
              >
                <Text style={styles.ctaButtonText}>
                  {isEnglish ? 'Start Now' : 'Start Naw'}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#0B0F5B" />
              </TouchableOpacity>

              {/* Stats */}
              <View style={styles.statsContainer}>
                {stats.map((stat, index) => (
                  <View key={index} style={styles.statItem}>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </SafeAreaView>
        </View>

        {/* Services Section */}
        <View style={styles.servicesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {isEnglish ? 'Our Services' : 'Ɔl Savis'}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {isEnglish
                ? 'Everything you need, all in one app'
                : 'Evritin yu nid, ɔl foh wan app'}
            </Text>
          </View>

          {/* Services Grid */}
          <View style={styles.servicesGrid}>
            {services.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceCard}
                onPress={() => router.push(service.route as any)}
                activeOpacity={0.7}
              >
                <View style={[styles.serviceIcon, { backgroundColor: `${service.color}15` }]}>
                  <Ionicons name={service.icon} size={28} color={service.color} />
                </View>
                <Text style={styles.serviceTitle}>
                  {isEnglish ? service.title : service.titleKrio}
                </Text>
                <Text style={styles.serviceDescription}>
                  {isEnglish ? service.description : service.descriptionKrio}
                </Text>
                <View style={styles.serviceArrow}>
                  <Text style={[styles.serviceExplore, { color: service.color }]}>
                    {isEnglish ? 'Explore' : 'Luk'}
                  </Text>
                  <Ionicons name="arrow-forward" size={14} color={service.color} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* How It Works Section */}
        <View style={styles.howItWorksSection}>
          <Text style={styles.sectionTitle}>
            {isEnglish ? 'How It Works' : 'Aw E Wok'}
          </Text>
          
          <View style={styles.stepsContainer}>
            {[
              {
                step: '1',
                title: isEnglish ? 'Choose Service' : 'Pik Savis',
                desc: isEnglish ? 'Select what you need' : 'Silekt wetin yu nid',
                icon: 'apps',
              },
              {
                step: '2',
                title: isEnglish ? 'Place Order' : 'Put Oda',
                desc: isEnglish ? 'Quick and easy' : 'Kwik an izi',
                icon: 'checkmark-circle',
              },
              {
                step: '3',
                title: isEnglish ? 'Pay & Enjoy' : 'Pay & Enjoy',
                desc: isEnglish ? 'Multiple payment options' : 'Plenti we foh pay',
                icon: 'card',
              },
            ].map((item, index) => (
              <View key={index} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={24} color="#0B0F5B" />
                </View>
                <Text style={styles.stepTitle}>{item.title}</Text>
                <Text style={styles.stepDesc}>{item.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>
            {isEnglish ? 'Pay Your Way' : 'Pay Yu We'}
          </Text>
          <Text style={styles.paymentSubtitle}>
            {isEnglish
              ? 'Multiple payment options for your convenience'
              : 'Plenti we foh pay foh mek am izi foh yu'}
          </Text>
          <View style={styles.paymentMethods}>
            {[
              { name: 'Afrimoney', color: '#22C55E' },
              { name: 'Orange Money', color: '#F97316' },
              { name: 'Visa/Card', color: '#0B0F5B' },
              { name: 'Cash', color: '#666666' },
            ].map((method, index) => (
              <View key={index} style={styles.paymentMethod}>
                <View style={[styles.paymentIcon, { backgroundColor: `${method.color}20` }]}>
                  <Ionicons
                    name={method.name === 'Cash' ? 'cash' : method.name === 'Visa/Card' ? 'card' : 'phone-portrait'}
                    size={20}
                    color={method.color}
                  />
                </View>
                <Text style={styles.paymentMethodText}>{method.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  heroSection: {
    backgroundColor: '#0B0F5B',
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 12,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  availableDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  availableText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '500',
  },
  heroContent: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 48,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 24,
    marginTop: 16,
    marginBottom: 24,
  },
  ctaButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
    alignSelf: 'flex-start',
    gap: 10,
  },
  ctaButtonText: {
    color: '#0B0F5B',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 32,
    gap: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  servicesSection: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  serviceCard: {
    width: (width - 52) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 4,
  },
  serviceIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  serviceArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  serviceExplore: {
    fontSize: 13,
    fontWeight: '500',
  },
  howItWorksSection: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  stepNumber: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0B0F5B10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  stepDesc: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  paymentSection: {
    marginHorizontal: 20,
    marginTop: 40,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: 24,
  },
  paymentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  paymentSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentMethod: {
    alignItems: 'center',
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  paymentMethodText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '500',
  },
});
