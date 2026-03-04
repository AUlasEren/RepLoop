import React from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthColors, AuthSpacing } from '@/features/auth';
import {
  UserHeader,
  WeekCalendar,
  ProgressCard,
  StatsRow,
  RecommendationCard,
  UpcomingWorkout,
} from '../components';

export function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + AuthSpacing.md, paddingBottom: 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <UserHeader />
        <WeekCalendar />
        <ProgressCard />
        <StatsRow />
        <RecommendationCard />
        <UpcomingWorkout />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AuthColors.background,
  },
  scrollContent: {
    paddingHorizontal: AuthSpacing.lg,
    gap: AuthSpacing.lg,
  },
});
