import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { AuthColors, AuthSpacing } from '@/features/auth';
import { WorkoutListCard } from '../components';
import { WORKOUT_LIST } from '../constants';

export function WorkoutsListScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { paddingTop: insets.top + AuthSpacing.md }]}>
        <Text style={styles.headerTitle}>Antrenmanlar</Text>
        <Text style={styles.headerSubtitle}>
          {WORKOUT_LIST.length} program hazır
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {WORKOUT_LIST.map((workout) => (
          <WorkoutListCard
            key={workout.id}
            workout={workout}
            onPress={() => router.push('/workout-detail')}
          />
        ))}
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
    paddingHorizontal: AuthSpacing.lg,
    paddingBottom: AuthSpacing.lg,
    gap: AuthSpacing.xs,
  },
  headerTitle: {
    color: AuthColors.white,
    fontSize: 28,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: AuthColors.whiteSecondary,
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: AuthSpacing.lg,
    gap: AuthSpacing.sm,
  },
});
