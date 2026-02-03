import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useLanguage } from '../../src/context/LanguageContext';
import { useWallet } from '../../src/context/WalletContext';

const { width } = Dimensions.get('window');

interface ServiceCard {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  route: string;
}

export default function HomeScreen() {
  const { t, isEnglish } = useLanguage();
  const { balance } = useWallet();

  const services: ServiceCard[] = [
    {
      id: 'rayd',
      title: 'RAYD',
      subtitle: t('rideDelivery'),
      icon: 'car',
      color: '#0B0F5B',
      route: '/(tabs)/rayd',
    },
    {
      id: 'food',
      title: 'FOOD',
      subtitle: t('foodOrdering'),
      icon: 'restaurant',
      color: '#F97316',
      route: '/(tabs)/food',
    },
    {
      id: 'enjoyment',
      title: 'ENJOYMENT',
      subtitle: t('eventsNightlife'),
      icon: 'musical-notes',
      color: '#8B5CF6',
      route: '/(tabs)/rayd',
    },
    {
      id: 'os',
      title: 'OS',
      subtitle: t('housingRentals'),
      icon: 'home',
      color: '#22C55E',
      route: '/(tabs)/rayd',
    },
    {
      id: 'makit',
      title: 'MAKIT',
      subtitle: t('marketplace'),
      icon: 'cart',
      color: '#EC4899',
      route: '/(tabs)/rayd',
    },
  ];

  const quickActions = [
    { icon: 'add-circle', label: t('addMoney'), color: '#22C55E', route: '/(tabs)/wallet' },
    { icon: 'send', label: t('sendMoney'), color: '#0B0F5B', route: '/(tabs)/wallet' },
    { icon: 'time', label: t('transactionHistory'), color: '#F97316', route: '/(tabs)/wallet' },
    { icon: 'card', label: t('paymentMethods'), color: '#8B5CF6', route: '/(tabs)/wallet' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>T</Text>
            </View>
            <View>
              <Text style={styles.greeting}>
                {isEnglish ? 'Good Morning!' : 'Gud Monin!'}
              </Text>
              <Text style={styles.userName}>John Doe</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={24} color="#FFFFFF" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Wallet Card */}
        <View style={styles.walletCard}>
          <View>
            <Text style={styles.walletLabel}>{t('walletBalance')}</Text>
            <Text style={styles.walletBalance}>
              SLE {balance.toLocaleString()}
            </Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push('/(tabs)/wallet')}>
            <Ionicons name="add" size={24} color="#0B0F5B" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          {quickActions.map((action, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.quickActionButton}
              onPress={() => router.push(action.route as any)}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}20` }]}>
                <Ionicons name={action.icon as keyof typeof Ionicons.glyphMap} size={24} color={action.color} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Services */}
        <View style={styles.servicesContainer}>
          <Text style={styles.sectionTitle}>{t('services')}</Text>
          <View style={styles.servicesGrid}>
            {services.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceCard}
                onPress={() => router.push(service.route as any)}
              >
                <View style={[styles.serviceIcon, { backgroundColor: `${service.color}20` }]}>
                  <Ionicons name={service.icon} size={32} color={service.color} />
                </View>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceSubtitle}>{service.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <View style={styles.activityHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/wallet')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {[
            { title: 'Ride to Downtown', amount: -15000, date: 'Today', icon: 'car', color: '#0B0F5B' },
            { title: 'Food Order', amount: -45000, date: 'Yesterday', icon: 'restaurant', color: '#F97316' },
            { title: 'Wallet Top-up', amount: 100000, date: '2 days ago', icon: 'wallet', color: '#22C55E' },
          ].map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: `${activity.color}20` }]}>
                <Ionicons name={activity.icon as keyof typeof Ionicons.glyphMap} size={20} color={activity.color} />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDate}>{activity.date}</Text>
              </View>
              <Text style={[
                styles.activityAmount,
                activity.amount > 0 ? styles.positiveAmount : styles.negativeAmount
              ]}>
                {activity.amount > 0 ? '+' : ''}SLE {Math.abs(activity.amount).toLocaleString()}
              </Text>
            </View>
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
    backgroundColor: '#0B0F5B',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0B0F5B',
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationCount: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  walletCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  walletBalance: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0B0F5B',
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickActionButton: {
    alignItems: 'center',
    width: (width - 80) / 4,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 11,
    color: '#333333',
    textAlign: 'center',
  },
  servicesContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceCard: {
    width: (width - 52) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  serviceIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  serviceSubtitle: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  activityContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    color: '#0B0F5B',
    fontWeight: '500',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  activityDate: {
    fontSize: 12,
    color: '#999999',
    marginTop: 2,
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  positiveAmount: {
    color: '#22C55E',
  },
  negativeAmount: {
    color: '#EF4444',
  },
});
