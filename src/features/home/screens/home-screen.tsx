import React, { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { AuthColors, AuthSpacing } from '@/features/auth';
import { sessionService, workoutService } from '@/services';
import type { SessionDto, WorkoutDto } from '@/services/api-types';
import {
  UserHeader,
  WeekCalendar,
  ProgressCard,
  StatsRow,
  RecommendationCard,
  UpcomingWorkout,
} from '../components';

function getStartOfWeek(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(now.getDate() + diff);
  return monday;
}

export function HomeScreen() {
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [recentSessions, setRecentSessions] = useState<SessionDto[]>([]);
  const [recommendedWorkout, setRecommendedWorkout] = useState<WorkoutDto | null>(null);
  const [upcomingWorkout, setUpcomingWorkout] = useState<WorkoutDto | null>(null);

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    const timeout = setTimeout(() => {
      setIsLoading(false);
      setIsRefreshing(false);
    }, 5000);

    try {
      const [sessionsRes, workoutsRes] = await Promise.all([
        sessionService.history(1, 10).catch(() => null),
        workoutService.list(1, 3).catch(() => null),
      ]);

      if (sessionsRes) setRecentSessions(sessionsRes.items);
      if (workoutsRes && workoutsRes.items.length > 0) {
        setRecommendedWorkout(workoutsRes.items[0]);
        setUpcomingWorkout(workoutsRes.items.length > 1 ? workoutsRes.items[1] : workoutsRes.items[0]);
      }
    } catch (e) {
      console.error('HomeScreen load error:', e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      clearTimeout(timeout);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData(recentSessions.length > 0);
    }, [loadData, recentSessions.length]),
  );

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadData(true);
  }, [loadData]);

  const lastSession = recentSessions.length > 0 ? recentSessions[0] : null;
  const completedSets = lastSession?.sets.length ?? 0;
  const totalSets = completedSets > 0 ? completedSets : 0;

  let lastSessionDuration = lastSession?.totalDurationSeconds ?? 0;
  if (lastSessionDuration === 0 && lastSession?.completedAt && lastSession?.startedAt) {
    lastSessionDuration = Math.round(
      (new Date(lastSession.completedAt).getTime() - new Date(lastSession.startedAt).getTime()) / 1000,
    );
  }

  const weekStart = getStartOfWeek();
  const weeklySessionCount = recentSessions.filter((s) => {
    const started = new Date(s.startedAt);
    return started >= weekStart;
  }).length;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={AuthColors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + AuthSpacing.md, paddingBottom: 100 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={AuthColors.primary}
            />
          }
        >
          <UserHeader />
          <WeekCalendar />
          <ProgressCard completedSets={completedSets} totalSets={totalSets} />
          <StatsRow
            lastSessionDurationSeconds={lastSessionDuration}
            weeklySessionCount={weeklySessionCount}
          />
          <RecommendationCard workout={recommendedWorkout} />
          <UpcomingWorkout workout={upcomingWorkout} />
        </ScrollView>
      )}
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
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
