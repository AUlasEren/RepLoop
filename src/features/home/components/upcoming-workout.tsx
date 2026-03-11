import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AuthColors, AuthSpacing } from '@/features/auth';
import type { RecommendationItem } from '@/services/api-types';

type UpcomingWorkoutProps = {
  recommendation: RecommendationItem | null;
};

export function UpcomingWorkout({ recommendation }: UpcomingWorkoutProps) {
  const router = useRouter();

  const handlePress = () => {
    if (recommendation) {
      router.push({ pathname: '/workout-detail', params: { id: recommendation.workout_id } });
    } else {
      router.push('/(tabs)/add');
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={styles.iconCircle}>
          <Ionicons name="fitness-outline" size={22} color={AuthColors.primary} />
        </View>
        <View style={styles.textCol}>
          <Text style={styles.title}>
            {recommendation ? recommendation.workout_name : 'Henüz antrenman yok'}
          </Text>
          <Text style={styles.subtitle}>
            {recommendation
              ? `${recommendation.exercise_count} egzersiz • ${recommendation.duration_minutes} dk`
              : 'Bir antrenman programı oluştur'}
          </Text>
        </View>
      </View>
      <View style={styles.right}>
        <TouchableOpacity style={styles.arrowButton} hitSlop={8} onPress={handlePress}>
          <Ionicons name="arrow-forward" size={18} color={AuthColors.white} />
        </TouchableOpacity>
        <View style={styles.waveIcon}>
          <Ionicons name="water-outline" size={28} color={AuthColors.primary} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AuthColors.inputBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AuthColors.inputBorder,
    padding: AuthSpacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AuthSpacing.md,
    flex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    gap: 2,
  },
  title: {
    color: AuthColors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    color: AuthColors.whiteSecondary,
    fontSize: 13,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AuthSpacing.md,
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveIcon: {
    opacity: 0.5,
  },
});
