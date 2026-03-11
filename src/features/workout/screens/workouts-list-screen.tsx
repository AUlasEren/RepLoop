import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AuthColors, AuthSpacing } from '@/features/auth';
import { workoutService } from '@/services';
import type { WorkoutDto } from '@/services/api-types';
import { WorkoutListCard } from '../components';

export function WorkoutsListScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [workouts, setWorkouts] = useState<WorkoutDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadWorkouts = useCallback(async () => {
    try {
      const result = await workoutService.list(1, 20);
      setWorkouts(result.items);
    } catch (e) {
      console.error('WorkoutsListScreen load error:', e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadWorkouts();
    }, [loadWorkouts]),
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadWorkouts();
  };

  const handleDelete = async (id: string) => {
    try {
      await workoutService.remove(id);
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
    } catch {
      Alert.alert('Hata', 'Antrenman silinemedi.');
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { paddingTop: insets.top + AuthSpacing.md }]}>
        <Text style={styles.headerTitle}>Antrenmanlar</Text>
        <Text style={styles.headerSubtitle}>
          {workouts.length > 0 ? `${workouts.length} program hazır` : 'Yükleniyor...'}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={AuthColors.primary} />
        </View>
      ) : workouts.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="barbell-outline" size={48} color={AuthColors.whiteSecondary} />
          <Text style={styles.emptyTitle}>Henüz antrenman yok</Text>
          <Text style={styles.emptySubtitle}>
            + butonuna basarak yeni bir antrenman oluştur
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={AuthColors.primary}
            />
          }
        >
          {workouts.map((workout) => (
            <WorkoutListCard
              key={workout.id}
              workout={workout}
              onPress={() =>
                router.push({ pathname: '/workout-detail', params: { id: workout.id } })
              }
              onDelete={handleDelete}
            />
          ))}
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
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: AuthSpacing.sm,
    paddingHorizontal: AuthSpacing.xl,
  },
  emptyTitle: {
    color: AuthColors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  emptySubtitle: {
    color: AuthColors.whiteSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
});
