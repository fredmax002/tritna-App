import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useLanguage } from '../../src/context/LanguageContext';
import { useAuth } from '../../src/context/AuthContext';

const logoImage = require('../../assets/images/logo.jpg');

export default function LoginScreen() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (phone.length < 8) return;
    
    setIsLoading(true);
    try {
      // In real app, send OTP here
      router.push({ pathname: '/(auth)/verify', params: { phone } });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#0B0F5B" />
          </TouchableOpacity>

          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>TRITNA</Text>
            </View>
            <Text style={styles.title}>{t('welcome')}</Text>
            <Text style={styles.subtitle}>Enter your phone number to continue</Text>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.countryCode}>
              <Text style={styles.flag}>🇸🇱</Text>
              <Text style={styles.code}>+232</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="Phone Number"
              placeholderTextColor="#999999"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              maxLength={10}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.continueButton,
              phone.length < 8 && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={phone.length < 8 || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.continueText}>Continue</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => router.push('/(auth)/register')}
          >
            <Text style={styles.registerText}>
              Don't have an account?{' '}
              <Text style={styles.registerBold}>{t('register')}</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#0B0F5B',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0B0F5B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  flag: {
    fontSize: 20,
    marginRight: 8,
  },
  code: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 16,
    paddingLeft: 12,
    fontSize: 16,
    color: '#333333',
  },
  continueButton: {
    backgroundColor: '#0B0F5B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
  },
  continueButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  registerLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: '#666666',
  },
  registerBold: {
    color: '#0B0F5B',
    fontWeight: '600',
  },
});
