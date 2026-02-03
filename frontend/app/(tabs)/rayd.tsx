import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../src/context/LanguageContext';

export default function RaydScreen() {
  const { t } = useLanguage();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TRITNA RAYD</Text>
        <Text style={styles.headerSubtitle}>{t('rideDelivery')}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Book Ride Card */}
        <TouchableOpacity style={styles.bookRideCard}>
          <View style={styles.bookRideIcon}>
            <Ionicons name="location" size={40} color="#0B0F5B" />
          </View>
          <View style={styles.bookRideContent}>
            <Text style={styles.bookRideTitle}>{t('bookRide')}</Text>
            <Text style={styles.bookRideSubtitle}>{t('whereTo')}</Text>
          </View>
          <Ionicons name="arrow-forward" size={24} color="#0B0F5B" />
        </TouchableOpacity>

        {/* Vehicle Options */}
        <Text style={styles.sectionTitle}>{t('chooseVehicle')}</Text>
        <View style={styles.vehiclesContainer}>
          {[
            { id: 'car', name: t('car'), icon: 'car', price: 'From SLE 15,000', time: '3 min' },
            { id: 'bike', name: t('bike'), icon: 'bicycle', price: 'From SLE 8,000', time: '2 min' },
            { id: 'keke', name: t('keke'), icon: 'bus', price: 'From SLE 10,000', time: '4 min' },
          ].map((vehicle) => (
            <TouchableOpacity key={vehicle.id} style={styles.vehicleCard}>
              <View style={styles.vehicleIcon}>
                <Ionicons name={vehicle.icon as keyof typeof Ionicons.glyphMap} size={32} color="#0B0F5B" />
              </View>
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleName}>{vehicle.name}</Text>
                <Text style={styles.vehiclePrice}>{vehicle.price}</Text>
              </View>
              <View style={styles.vehicleTime}>
                <Ionicons name="time" size={14} color="#666666" />
                <Text style={styles.vehicleTimeText}>{vehicle.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Driver Mode */}
        <TouchableOpacity style={styles.driverModeCard}>
          <View style={styles.driverModeIcon}>
            <Ionicons name="car" size={32} color="#FFFFFF" />
          </View>
          <View style={styles.driverModeContent}>
            <Text style={styles.driverModeTitle}>{t('becomeDriver')}</Text>
            <Text style={styles.driverModeSubtitle}>Earn money driving with TRITNA</Text>
          </View>
          <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Recent Rides */}
        <Text style={styles.sectionTitle}>Recent Rides</Text>
        <View style={styles.recentRidesContainer}>
          {[
            { from: 'Aberdeen', to: 'Downtown', date: 'Today', price: 15000 },
            { from: 'Lumley', to: 'Hill Station', date: 'Yesterday', price: 22000 },
          ].map((ride, index) => (
            <View key={index} style={styles.rideItem}>
              <View style={styles.rideIcon}>
                <Ionicons name="car" size={20} color="#0B0F5B" />
              </View>
              <View style={styles.rideInfo}>
                <Text style={styles.rideRoute}>{ride.from} → {ride.to}</Text>
                <Text style={styles.rideDate}>{ride.date}</Text>
              </View>
              <Text style={styles.ridePrice}>SLE {ride.price.toLocaleString()}</Text>
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  bookRideCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookRideIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#0B0F5B20',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  bookRideContent: {
    flex: 1,
  },
  bookRideTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  bookRideSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  vehiclesContainer: {
    marginBottom: 24,
  },
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  vehicleIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#0B0F5B10',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  vehiclePrice: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  vehicleTime: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  vehicleTimeText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  driverModeCard: {
    backgroundColor: '#0B0F5B',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  driverModeIcon: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  driverModeContent: {
    flex: 1,
  },
  driverModeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  driverModeSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  recentRidesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  rideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  rideIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#0B0F5B10',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rideInfo: {
    flex: 1,
  },
  rideRoute: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  rideDate: {
    fontSize: 12,
    color: '#999999',
    marginTop: 2,
  },
  ridePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B0F5B',
  },
});
