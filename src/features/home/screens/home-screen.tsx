import React, { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { AuthColors, AuthSpacing } from '@/features/auth';
import { sessionService, workoutService, recommendationService } from '@/services';
import type { SessionDto, RecommendationItem } from '@/services/api-types';
import { useAuth } from '@/store/auth-context';
import { useUser } from '@/store/user-context';
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
  const { user: authUser } = useAuth();
  const { user } = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [recentSessions, setRecentSessions] = useState<SessionDto[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    const timeout = setTimeout(() => {
      setIsLoading(false);
      setIsRefreshing(false);
    }, 5000);

    try {
      const [sessionsRes, recsRes] = await Promise.all([
        sessionService.history(1, 10).catch(() => null),
        authUser?.id
          ? recommendationService.fetchRecommendations(authUser.id, user).catch(() => null)
          : Promise.resolve(null),
      ]);

      if (sessionsRes) setRecentSessions(sessionsRes.items);

      if (recsRes && recsRes.recommendations.length > 0) {
        setRecommendations(recsRes.recommendations);
      } else {
        // Fallback: API hata verirse workoutService ile geri dön
        const workoutsRes = await workoutService.list(1, 3).catch(() => null);
        if (workoutsRes && workoutsRes.items.length > 0) {
          setRecommendations(
            workoutsRes.items.map((w) => ({
              workout_id: w.id,
              workout_name: w.name,
              description: w.description ?? '',
              duration_minutes: w.durationMinutes,
              exercise_count: w.exercises.length,
              muscle_groups: [],
              score: 0,
              reason: '',
              tags: [`${w.exercises.length} egzersiz`, `${w.durationMinutes} dk`],
            })),
          );
        }
      }
    } catch (e) {
      console.error('HomeScreen load error:', e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      clearTimeout(timeout);
    }
  }, [authUser?.id, user]);

  useFocusEffect(
    useCallback(() => {
      loadData(recentSessions.length > 0);
    }, [loadData, recentSessions.length]),
  );

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadData(true);
  }, [loadData]);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todaySessions = recentSessions.filter(
    (s) => new Date(s.startedAt) >= todayStart,
  );

  const completedSets = todaySessions.reduce((sum, s) => sum + s.sets.length, 0);

  const totalSets = completedSets > 0 ? completedSets : 0;

  const todayTotalDuration = todaySessions.reduce((sum, s) => {
    let dur = s.totalDurationSeconds ?? 0;
    if (dur === 0 && s.completedAt && s.startedAt) {
      dur = Math.round(
        (new Date(s.completedAt).getTime() - new Date(s.startedAt).getTime()) / 1000,
      );
    }
    return sum + dur;
  }, 0);

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
            lastSessionDurationSeconds={todayTotalDuration}
            weeklySessionCount={weeklySessionCount}
          />
          <RecommendationCard recommendation={recommendations[0] ?? null} />
          <UpcomingWorkout recommendation={recommendations[1] ?? recommendations[0] ?? null} />
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
