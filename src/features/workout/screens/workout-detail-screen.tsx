import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { AuthColors, AuthSpacing } from '@/features/auth';
import { workoutService } from '@/services';
import type { WorkoutDto } from '@/services/api-types';
import { WorkoutHero, WorkoutMeta, ExerciseCard } from '../components';

export function WorkoutDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [workout, setWorkout] = useState<WorkoutDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    (async () => {
      try {
        const data = await workoutService.getById(id);
        if (!cancelled) setWorkout(data);
      } catch (e) {
        console.error('WorkoutDetail load error:', e);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [id]);

  const handleDelete = () => {
    if (!id) return;
    Alert.alert(
      'Antrenmanı Sil',
      'Bu antrenmanı silmek istediğine emin misin?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await workoutService.remove(id);
              router.back();
            } catch {
              Alert.alert('Hata', 'Antrenman silinemedi.');
            }
          },
        },
      ],
    );
  };

  const handleMenuPress = () => {
    Alert.alert('Seçenekler', undefined, [
      {
        text: 'Antrenmanı Sil',
        style: 'destructive',
        onPress: handleDelete,
      },
      { text: 'İptal', style: 'cancel' },
    ]);
  };

  const handleEditPress = () => {
    Alert.alert('Yakında', 'Düzenleme özelliği yakında gelecek.');
  };

  if (isLoading) {
    return (
      <View style={[styles.root, styles.loader]}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color={AuthColors.primary} />
      </View>
    );
  }

  if (!workout) {
    return (
      <View style={[styles.root, styles.loader]}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.errorText}>Antrenman bulunamadı.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>Antrenman Detayı</Text>
        <TouchableOpacity style={styles.headerButton} hitSlop={12} onPress={handleMenuPress}>
          <Ionicons name="ellipsis-vertical" size={20} color={AuthColors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <WorkoutHero workout={workout} />
        <WorkoutMeta workout={workout} />

        <View style={styles.exercisesSection}>
          <View style={styles.exercisesHeader}>
            <Text style={styles.exercisesTitle}>Egzersizler</Text>
            <TouchableOpacity hitSlop={8} onPress={handleEditPress}>
              <Text style={styles.editLink}>Listeyi Düzenle</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.exercisesList}>
            {workout.exercises.map((exercise, index) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                order={index + 1}
                total={workout.exercises.length}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + AuthSpacing.md }]}>
        <TouchableOpacity
          style={styles.startButton}
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: '/active-workout',
              params: { workoutId: workout.id, workoutName: workout.name },
            })
          }
        >
          <Text style={styles.startButtonText}>Antrenmana Başla</Text>
          <Ionicons name="play" size={18} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AuthColors.background,
  },
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: AuthColors.whiteSecondary,
    fontSize: 16,
    marginBottom: 12,
  },
  backLink: {
    color: AuthColors.primary,
    fontSize: 16,
    fontWeight: '600',
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
    gap: AuthSpacing.lg,
  },
  exercisesSection: {
    gap: AuthSpacing.md,
  },
  exercisesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exercisesTitle: {
    color: AuthColors.white,
    fontSize: 20,
    fontWeight: '800',
  },
  editLink: {
    color: AuthColors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  exercisesList: {
    gap: AuthSpacing.sm,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: AuthSpacing.lg,
    paddingTop: AuthSpacing.md,
    backgroundColor: AuthColors.background,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  startButton: {
    backgroundColor: AuthColors.primary,
    borderRadius: 28,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: AuthSpacing.sm,
  },
  startButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
  },
});
