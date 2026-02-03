import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useLanguage } from '../src/context/LanguageContext';

const logoImage = require('../assets/images/logo.jpg');

const { width } = Dimensions.get('window');

interface OnboardingItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  titleKey: string;
  descKey: string;
  color: string;
}

const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    icon: 'apps',
    titleKey: 'onboarding1Title',
    descKey: 'onboarding1Desc',
    color: '#0B0F5B',
  },
  {
    id: '2',
    icon: 'wallet',
    titleKey: 'onboarding2Title',
    descKey: 'onboarding2Desc',
    color: '#22C55E',
  },
  {
    id: '3',
    icon: 'cash',
    titleKey: 'onboarding3Title',
    descKey: 'onboarding3Desc',
    color: '#F97316',
  },
];

export default function WelcomeScreen() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const renderItem = ({ item }: { item: OnboardingItem }) => (
    <View style={[styles.slide, { width }]}>
      <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
        <Ionicons name={item.icon} size={80} color={item.color} />
      </View>
      <Text style={styles.title}>{t(item.titleKey)}</Text>
      <Text style={styles.description}>{t(item.descKey)}</Text>
    </View>
  );

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {onboardingData.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 30, 10],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                { width: dotWidth, opacity },
                index === currentIndex && { backgroundColor: '#0B0F5B' },
              ]}
            />
          );
        })}
      </View>
    );
  };

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      router.replace('/(auth)/login');
    }
  };

  const handleSkip = () => {
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>{t('skip')}</Text>
      </TouchableOpacity>

      {/* Onboarding Slides */}
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      {/* Dots Indicator */}
      {renderDots()}

      {/* Bottom Buttons */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.getStartedButton} onPress={handleNext}>
          <Text style={styles.getStartedText}>
            {currentIndex === onboardingData.length - 1 ? t('getStarted') : t('next')}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
  },
  skipText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0B0F5B',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  getStartedButton: {
    backgroundColor: '#0B0F5B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
