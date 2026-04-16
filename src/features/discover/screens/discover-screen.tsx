import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthColors, AuthSpacing } from '@/features/auth';
import { WorkoutListCard } from '@/features/workout/components';
import { recommendationService, workoutService } from '@/services';
import type { WorkoutDto, WorkoutTemplate } from '@/services/api-types';
import { useAuth } from '@/store/auth-context';
import { TemplateCard } from '../components';

export function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user: authUser } = useAuth();

  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [templateError, setTemplateError] = useState<string | null>(null);
  const [workoutError, setWorkoutError] = useState<string | null>(null);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setTemplateError(null);
    setWorkoutError(null);

    try {
      const [templatesRes, workoutsRes] = await Promise.all([
        authUser?.id
          ? recommendationService.discover(authUser.id).catch((e) => {
              console.warn('Discover load error:', e);
              setTemplateError('Öneriler yüklenemedi.');
              return null;
            })
          : Promise.resolve(null),
        workoutService.list(1, 20).catch((e) => {
          console.warn('Workout list error:', e);
          setWorkoutError('Antrenmanlar yüklenemedi.');
          return null;
        }),
      ]);

      if (templatesRes) setTemplates(templatesRes.templates);
      if (workoutsRes) setWorkouts(workoutsRes.items);
    } catch (e) {
      console.warn('DiscoverScreen load error:', e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [authUser?.id]);

  useFocusEffect(
    useCallback(() => {
      loadData(templates.length > 0 || workouts.length > 0);
    }, [loadData, templates.length, workouts.length]),
  );

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadData(true);
  }, [loadData]);

  const handleSaveTemplate = useCallback(async (template: WorkoutTemplate, index: number) => {
    setSavingIndex(index);
    try {
      await workoutService.saveFromTemplate({
        name: template.name,
        description: template.description,
        durationMinutes: template.duration_minutes,
        difficulty: template.difficulty,
        exercises: template.exercises.map((ex, i) => ({
          exerciseId: ex.exercise_id,
          exerciseName: ex.name,
          order: i + 1,
          sets: ex.sets,
          reps: ex.reps,
        })),
      });
      setTemplates((prev) => prev.filter((_, i) => i !== index));
      const res = await workoutService.list(1, 20).catch(() => null);
      if (res) setWorkouts(res.items);
    } catch {
      Alert.alert('Hata', 'Kaydetme başarısız oldu. Tekrar dene.');
    } finally {
      setSavingIndex(null);
    }
  }, []);

  const handleDeleteWorkout = useCallback(async (id: string) => {
    try {
      await workoutService.remove(id);
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
    } catch {
      Alert.alert('Hata', 'Antrenman silinemedi.');
    }
  }, []);

  const renderTemplateSection = () => {
    if (templateError) {
      return (
        <View style={styles.inlineMsg}>
          <Text style={styles.inlineMsgText}>{templateError}</Text>
          <TouchableOpacity onPress={() => loadData(true)} hitSlop={8}>
            <Text style={styles.retryText}>Tekrar dene</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (templates.length === 0) {
      return (
        <View style={styles.inlineMsg}>
          <Ionicons name="bulb-outline" size={24} color={AuthColors.whiteSecondary} />
          <Text style={styles.inlineMsgText}>
            Antrenman yaptıkça öneriler gelişecek.
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
        decelerationRate="fast"
        snapToInterval={280 + AuthSpacing.sm}
        snapToAlignment="start"
      >
        {templates.map((tpl, i) => (
          <TemplateCard
            key={`${tpl.name}-${i}`}
            template={tpl}
            onSave={(t) => handleSaveTemplate(t, i)}
            isSaving={savingIndex === i}
            isSaved={false}
          />
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { paddingTop: insets.top + AuthSpacing.md }]}>
        <Text style={styles.headerTitle}>Keşfet</Text>
      </View>

      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={AuthColors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={AuthColors.primary}
            />
          }
        >
          {/* Section 1: Horizontal template carousel */}
          <View style={styles.sectionHeaderPadded}>
            <Ionicons name="sparkles" size={18} color={AuthColors.primary} />
            <Text style={styles.sectionTitle}>Senin için yeni</Text>
          </View>
          {renderTemplateSection()}

          {/* Divider */}
          <View style={styles.divider} />

          {/* Section 2: User workouts — vertical list */}
          <View style={styles.sectionHeaderPadded}>
            <Ionicons name="barbell" size={18} color={AuthColors.primary} />
            <Text style={styles.sectionTitle}>Antrenmanların</Text>
            {workouts.length > 0 && (
              <Text style={styles.sectionCount}>{workouts.length}</Text>
            )}
          </View>

          <View style={styles.workoutSection}>
            {workoutError ? (
              <View style={styles.inlineMsg}>
                <Text style={styles.inlineMsgText}>{workoutError}</Text>
                <TouchableOpacity onPress={() => loadData(true)} hitSlop={8}>
                  <Text style={styles.retryText}>Tekrar dene</Text>
                </TouchableOpacity>
              </View>
            ) : workouts.length === 0 ? (
              <View style={styles.emptyBox}>
                <Ionicons name="barbell-outline" size={32} color={AuthColors.whiteSecondary} />
                <Text style={styles.emptyText}>Henüz antrenman yok</Text>
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={() => router.push('/(tabs)/add')}
                >
                  <Ionicons name="add" size={16} color="#000" />
                  <Text style={styles.createLabel}>Oluştur</Text>
                </TouchableOpacity>
              </View>
            ) : (
              workouts.map((workout) => (
                <WorkoutListCard
                  key={workout.id}
                  workout={workout}
                  onPress={() =>
                    router.push({ pathname: '/workout-detail', params: { id: workout.id } })
                  }
                  onDelete={handleDeleteWorkout}
                />
              ))
            )}
          </View>
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
    paddingBottom: AuthSpacing.md,
  },
  headerTitle: {
    color: AuthColors.white,
    fontSize: 28,
    fontWeight: '800',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderPadded: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AuthSpacing.sm,
    paddingHorizontal: AuthSpacing.lg,
    marginBottom: AuthSpacing.sm,
  },
  sectionTitle: {
    color: AuthColors.white,
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  sectionCount: {
    color: AuthColors.whiteSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  horizontalList: {
    paddingHorizontal: AuthSpacing.lg,
    gap: AuthSpacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: AuthColors.dividerLine,
    marginHorizontal: AuthSpacing.lg,
    marginVertical: AuthSpacing.lg,
  },
  workoutSection: {
    paddingHorizontal: AuthSpacing.lg,
    gap: AuthSpacing.sm,
  },
  inlineMsg: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AuthSpacing.sm,
    marginHorizontal: AuthSpacing.lg,
    backgroundColor: AuthColors.inputBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AuthColors.inputBorder,
    paddingHorizontal: AuthSpacing.md,
    paddingVertical: AuthSpacing.md,
  },
  inlineMsgText: {
    color: AuthColors.whiteSecondary,
    fontSize: 13,
    flex: 1,
  },
  retryText: {
    color: AuthColors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  emptyBox: {
    backgroundColor: AuthColors.inputBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AuthColors.inputBorder,
    padding: AuthSpacing.xl,
    alignItems: 'center',
    gap: AuthSpacing.sm,
  },
  emptyText: {
    color: AuthColors.whiteSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AuthColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    gap: 4,
    marginTop: AuthSpacing.xs,
  },
  createLabel: {
    color: '#000',
    fontSize: 13,
    fontWeight: '700',
  },
});
