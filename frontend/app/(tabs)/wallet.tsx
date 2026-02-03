import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../src/context/LanguageContext';
import { useWallet } from '../../src/context/WalletContext';

export default function WalletScreen() {
  const { t } = useLanguage();
  const { balance, transactions } = useWallet();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'afrimoney': return 'phone-portrait';
      case 'orange_money': return 'phone-portrait';
      case 'visa': return 'card';
      default: return 'cash';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      
      {/* Header with Balance */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('wallet')}</Text>
        
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>{t('walletBalance')}</Text>
          <Text style={styles.balanceAmount}>SLE {balance.toLocaleString()}</Text>
          
          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: '#22C55E20' }]}>
                <Ionicons name="add" size={24} color="#22C55E" />
              </View>
              <Text style={styles.actionText}>{t('addMoney')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: '#0B0F5B20' }]}>
                <Ionicons name="send" size={20} color="#0B0F5B" />
              </View>
              <Text style={styles.actionText}>{t('sendMoney')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: '#F9731620' }]}>
                <Ionicons name="arrow-down" size={24} color="#F97316" />
              </View>
              <Text style={styles.actionText}>{t('withdraw')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Payment Methods */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('paymentMethods')}</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Manage</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { id: 'afrimoney', name: t('afrimoney'), color: '#22C55E', number: '**** 4523' },
              { id: 'orange', name: t('orangeMoney'), color: '#F97316', number: '**** 7890' },
              { id: 'visa', name: t('visaCard'), color: '#0B0F5B', number: '**** 1234' },
            ].map((method) => (
              <TouchableOpacity key={method.id} style={styles.paymentCard}>
                <View style={[styles.paymentIcon, { backgroundColor: `${method.color}20` }]}>
                  <Ionicons 
                    name={method.id === 'visa' ? 'card' : 'phone-portrait'} 
                    size={24} 
                    color={method.color} 
                  />
                </View>
                <Text style={styles.paymentName}>{method.name}</Text>
                <Text style={styles.paymentNumber}>{method.number}</Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity style={styles.addPaymentCard}>
              <View style={styles.addPaymentIcon}>
                <Ionicons name="add" size={24} color="#666666" />
              </View>
              <Text style={styles.addPaymentText}>Add New</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Transaction History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('transactionHistory')}</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.transactionsContainer}>
            {transactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={[
                  styles.transactionIcon,
                  { backgroundColor: transaction.type === 'credit' ? '#22C55E20' : '#EF444420' }
                ]}>
                  <Ionicons 
                    name={transaction.type === 'credit' ? 'arrow-down' : 'arrow-up'} 
                    size={20} 
                    color={transaction.type === 'credit' ? '#22C55E' : '#EF4444'} 
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>{transaction.description}</Text>
                  <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
                </View>
                <Text style={[
                  styles.transactionAmount,
                  transaction.type === 'credit' ? styles.creditAmount : styles.debitAmount
                ]}>
                  {transaction.type === 'credit' ? '+' : '-'}SLE {transaction.amount.toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  balanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#666666',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0B0F5B',
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#333333',
    fontWeight: '500',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
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
  seeAll: {
    fontSize: 14,
    color: '#0B0F5B',
    fontWeight: '500',
  },
  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 140,
    alignItems: 'center',
  },
  paymentIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  paymentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  paymentNumber: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  addPaymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: 140,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E0E0E0',
  },
  addPaymentIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  addPaymentText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  transactionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  transactionDate: {
    fontSize: 12,
    color: '#999999',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  creditAmount: {
    color: '#22C55E',
  },
  debitAmount: {
    color: '#EF4444',
  },
});
