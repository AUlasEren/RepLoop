import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AuthColors, AuthSpacing } from '@/features/auth';
import { useUser } from '@/store/user-context';
import { ProfileFormInput, SegmentedControl, GoalCard } from '../components';
import {
  EXPERIENCE_LEVELS,
  GOALS,
  type ExperienceLevel,
  type GoalType,
} from '../constants';

export function ProfileSetupScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, updateUser } = useUser();

  const [age, setAge] = useState(String(user.age));
  const [weight, setWeight] = useState(String(user.weight));
  const [height, setHeight] = useState(String(user.height));
  const [experience, setExperience] = useState<ExperienceLevel>(user.experience);
  const [goal, setGoal] = useState<GoalType>(user.goal);

  const handleCreate = async () => {
    await updateUser({
      age: Number(age) || user.age,
      weight: Number(weight) || user.weight,
      height: Number(height) || user.height,
      experience,
      goal,
    });
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.header, { paddingTop: insets.top + AuthSpacing.sm }]}>
          <Text style={styles.headerTitle}>Profil Ayarları</Text>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + AuthSpacing.lg },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleSection}>
            <Text style={styles.title}>Planınızı özelleştirelim</Text>
            <Text style={styles.subtitle}>
              Sadece size özel hazırlanmış kişisel bir antrenman programı almak için detaylarınızı girin.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.row}>
              <ProfileFormInput
                label="Yaş"
                value={age}
                onChangeText={setAge}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>

            <View style={styles.row}>
              <ProfileFormInput
                label="Kilo (kg)"
                value={weight}
                onChangeText={setWeight}
                keyboardType="number-pad"
                maxLength={3}
              />
              <ProfileFormInput
                label="Boy (cm)"
                value={height}
                onChangeText={setHeight}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Deneyim Seviyesi</Text>
              <SegmentedControl
                options={EXPERIENCE_LEVELS}
                value={experience}
                onChange={setExperience}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Ana Hedef</Text>
              <View style={styles.goalsContainer}>
                {GOALS.map((g) => (
                  <GoalCard
                    key={g.key}
                    icon={g.icon}
                    label={g.label}
                    description={g.description}
                    selected={goal === g.key}
                    onPress={() => setGoal(g.key)}
                  />
                ))}
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.createButton}
            activeOpacity={0.8}
            onPress={handleCreate}
          >
            <Text style={styles.createButtonText}>Programımı Oluştur</Text>
            <Ionicons name="sparkles" size={20} color="#000000" />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AuthColors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: AuthSpacing.lg,
    paddingBottom: AuthSpacing.md,
  },
  headerTitle: {
    color: AuthColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: AuthSpacing.lg,
  },
  titleSection: {
    gap: AuthSpacing.sm,
    marginBottom: AuthSpacing.xl,
  },
  title: {
    color: AuthColors.white,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 36,
  },
  subtitle: {
    color: AuthColors.whiteSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  form: {
    gap: AuthSpacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: AuthSpacing.md,
  },
  section: {
    gap: AuthSpacing.sm,
  },
  sectionLabel: {
    color: AuthColors.whiteSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  goalsContainer: {
    gap: AuthSpacing.sm,
  },
  createButton: {
    backgroundColor: AuthColors.primary,
    borderRadius: 28,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: AuthSpacing.sm,
    marginTop: AuthSpacing.xl,
  },
  createButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },
});
