import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

const { width } = Dimensions.get('window');

const ImprovedOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [weight, setWeight] = useState('70');
  const [unit, setUnit] = useState('kg');

  const steps = [
    {
      id: 0,
      title: 'Burn Calories Effortlessly',
      subtitle: 'Zero-Workout Tracking',
      description:
        'Track your daily passive metabolism. Small movements throughout your day add up to big calorie burns.',
      icon: '🔥',
    },
    {
      id: 1,
      title: 'How It Works',
      items: [
        {
          icon: '📊',
          title: 'We Calculate Your Burn',
          desc: 'Using MET science + your weight, we know exactly how many calories each movement burns.',
        },
        {
          icon: '✅',
          title: 'You Log Real Movements',
          desc: 'Tap when you actually do an activity. No cheating—your honest effort counts.',
        },
        {
          icon: '📈',
          title: 'Watch Your Progress',
          desc: 'See calories burned today, streaks, and level up as you build daily habits.',
        },
      ],
    },
    {
      id: 2,
      title: 'Set Your Starting Weight',
      subtitle: 'This helps us personalize your calorie burn',
      inputReady: true,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Onboarding complete, navigate to home');
    }
  };

  const handleSkip = () => {
    setCurrentStep(steps.length - 1);
  };

  const renderStep = () => {
    const step = steps[currentStep];

    if (step.id === 0) {
      return (
        <View style={styles.stepContainer}>
          <View style={styles.heroSection}>
            <Text style={styles.heroIcon}>{step.icon}</Text>
            <Text style={styles.heroTitle}>{step.title}</Text>
            <Text style={styles.heroSubtitle}>{step.subtitle}</Text>
            <Text style={styles.heroDescription}>{step.description}</Text>
          </View>
        </View>
      );
    }

    if (step.id === 1) {
      return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>{step.title}</Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.itemsContainer}
          >
            {step.items.map((item, idx) => (
              <View key={idx} style={styles.infoCard}>
                <Text style={styles.cardIcon}>{item.icon}</Text>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      );
    }

    if (step.id === 2) {
      return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>{step.title}</Text>
          <Text style={styles.stepSubtitle}>{step.subtitle}</Text>

          <View style={styles.weightInputSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Your Weight</Text>
              <View style={styles.weightInputWrapper}>
                <Text style={styles.weightValue}>{weight}</Text>
                <Text style={styles.weightUnit}>{unit}</Text>
              </View>
            </View>

            <View style={styles.unitToggle}>
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  unit === 'kg' && styles.unitButtonActive,
                ]}
                onPress={() => setUnit('kg')}
              >
                <Text
                  style={[
                    styles.unitButtonText,
                    unit === 'kg' && styles.unitButtonTextActive,
                  ]}
                >
                  kg
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.unitButton,
                  unit === 'lbs' && styles.unitButtonActive,
                ]}
                onPress={() => setUnit('lbs')}
              >
                <Text
                  style={[
                    styles.unitButtonText,
                    unit === 'lbs' && styles.unitButtonTextActive,
                  ]}
                >
                  lbs
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.helpText}>
              ℹ️ Your weight helps us calculate exactly how many calories you burn
              for each activity using science-backed MET formulas.
            </Text>
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderStep()}
      </ScrollView>

      <View style={styles.footer}>
        {currentStep > 0 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentStep(currentStep - 1)}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}

        {currentStep < steps.length - 1 && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.stepIndicator}>
        {steps.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              idx === currentStep && styles.dotActive,
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  heroIcon: {
    fontSize: 80,
    marginBottom: 30,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#4ade80',
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  stepTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 30,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 30,
    lineHeight: 24,
  },
  itemsContainer: {
    paddingBottom: 40,
  },
  infoCard: {
    backgroundColor: '#1a1f3a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    borderLeftWidth: 4,
    borderLeftColor: '#4ade80',
  },
  cardIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
  weightInputSection: {
    marginTop: 20,
  },
  inputGroup: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    fontWeight: '600',
  },
  weightInputWrapper: {
    backgroundColor: '#1a1f3a',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4ade80',
  },
  weightValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#4ade80',
    marginRight: 12,
  },
  weightUnit: {
    fontSize: 20,
    color: '#666',
    fontWeight: '600',
  },
  unitToggle: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  unitButton: {
    flex: 1,
    backgroundColor: '#1a1f3a',
    borderRadius: 8,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#333',
  },
  unitButtonActive: {
    backgroundColor: '#4ade80',
    borderColor: '#4ade80',
  },
  unitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  unitButtonTextActive: {
    color: '#0a0e27',
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 21,
    backgroundColor: '#1a1f3a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4ade80',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#1a1f3a',
    gap: 12,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#1a1f3a',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  skipButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#4ade80',
    borderRadius: 8,
    paddingVertical: 12,
  },
  nextButtonText: {
    color: '#0a0e27',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 20,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333',
  },
  dotActive: {
    backgroundColor: '#4ade80',
    width: 24,
  },
});

export default ImprovedOnboarding;
