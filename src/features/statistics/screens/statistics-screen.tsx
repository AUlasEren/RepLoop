import React from 'react';
import {
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
import {
  StrengthChart,
  PersonalRecords,
  BodyMeasurements,
  MeasurementCTA,
} from '../components';

export function StatisticsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { paddingTop: insets.top + AuthSpacing.sm }]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.canGoBack() && router.back()}
          hitSlop={12}
        >
          <Ionicons name="arrow-back" size={22} color={AuthColors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>İlerleme İstatistikleri</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <StrengthChart />
        <PersonalRecords />
        <BodyMeasurements />
        <MeasurementCTA />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AuthColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: AuthSpacing.lg,
    paddingBottom: AuthSpacing.md,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: AuthColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: AuthSpacing.lg,
    gap: AuthSpacing.xl,
  },
});
