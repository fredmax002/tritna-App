import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useLanguage } from '../../src/context/LanguageContext';
import { useAuth } from '../../src/context/AuthContext';

export default function VerifyScreen() {
  const { t } = useLanguage();
  const { sendOTP, verifyOTP } = useAuth();
  const params = useLocalSearchParams<{ 
    phone: string; 
    first_name?: string; 
    last_name?: string; 
    email?: string;
    devOtp?: string;
  }>();
  
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<TextInput[]>([]);

  // Show dev OTP hint in development
  useEffect(() => {
    if (params.devOtp) {
      console.log('Development OTP:', params.devOtp);
    }
  }, [params.devOtp]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 4) {
      Alert.alert('Error', 'Please enter the complete 4-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      // Verify OTP with optional registration data
      await verifyOTP(
        params.phone || '',
        otpCode,
        params.first_name ? {
          first_name: params.first_name,
          last_name: params.last_name,
          email: params.email,
        } : undefined
      );
      
      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      const result = await sendOTP(params.phone || '');
      if (result.success) {
        setCountdown(60);
        setOtp(['', '', '', '']);
        Alert.alert('Success', 'OTP resent successfully');
        // For development, log the new OTP
        if (result.otp) {
          console.log('New OTP:', result.otp);
        }
      } else {
        Alert.alert('Error', result.message || 'Failed to resend OTP');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const isOtpComplete = otp.every(digit => digit.length === 1);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0B0F5B" />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <Text style={styles.title}>Verify Phone</Text>
          <Text style={styles.subtitle}>
            Enter the 4-digit code sent to{' '}
            <Text style={styles.phone}>+232 {params.phone}</Text>
          </Text>
        </View>

        {/* Dev OTP hint - remove in production */}
        {params.devOtp && (
          <View style={styles.devHint}>
            <Ionicons name="information-circle" size={16} color="#F97316" />
            <Text style={styles.devHintText}>Dev OTP: {params.devOtp}</Text>
          </View>
        )}

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) inputRefs.current[index] = ref;
              }}
              style={[
                styles.otpInput,
                digit && styles.otpInputFilled,
              ]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value.replace(/[^0-9]/g, ''), index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              editable={!isLoading}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.verifyButton,
            (!isOtpComplete || isLoading) && styles.verifyButtonDisabled,
          ]}
          onPress={handleVerify}
          disabled={!isOtpComplete || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.verifyButtonText}>{t('confirm')}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          {countdown > 0 ? (
            <Text style={styles.resendText}>
              Resend code in <Text style={styles.countdownText}>{countdown}s</Text>
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend} disabled={isLoading}>
              <Text style={styles.resendLink}>Resend Code</Text>
            </TouchableOpacity>
          )}
        </View>
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
    padding: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  headerContainer: {
    marginTop: 20,
    marginBottom: 24,
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
    lineHeight: 24,
  },
  phone: {
    fontWeight: '600',
    color: '#333333',
  },
  devHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    gap: 8,
  },
  devHintText: {
    color: '#F97316',
    fontSize: 14,
    fontWeight: '500',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 40,
  },
  otpInput: {
    width: 56,
    height: 56,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  otpInputFilled: {
    borderColor: '#0B0F5B',
    backgroundColor: '#FFFFFF',
  },
  verifyButton: {
    backgroundColor: '#0B0F5B',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  verifyButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  resendContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#666666',
  },
  countdownText: {
    fontWeight: '600',
    color: '#0B0F5B',
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B0F5B',
  },
});
