import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { AuthColors, AuthSpacing } from '@/features/auth';
import type { WorkoutDto } from '@/services/api-types';

type WorkoutHeroProps = {
  workout: WorkoutDto;
};

export function WorkoutHero({ workout }: WorkoutHeroProps) {
  const exercises = workout.exercises ?? [];
  const tags = [`${exercises.length} Egzersiz`, `${workout.durationMinutes ?? 0} dk`];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a2e1a', '#0d1a0d', AuthColors.background]}
        locations={[0, 0.5, 1]}
        style={styles.gradient}
      />
      <View style={styles.overlay}>
        <View style={styles.tags}>
          {tags.map((tag, i) => (
            <View key={tag} style={[styles.tag, i === 0 && styles.tagPrimary]}>
              <Text style={[styles.tagText, i === 0 && styles.tagTextPrimary]}>{tag}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.title}>{workout.name}</Text>
        <Text style={styles.subtitle}>
          {workout.description ?? exercises.map((e) => e.exerciseName).join(', ')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: AuthSpacing.lg,
    gap: AuthSpacing.xs,
  },
  tags: {
    flexDirection: 'row',
    gap: AuthSpacing.sm,
    marginBottom: AuthSpacing.xs,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagPrimary: {
    backgroundColor: AuthColors.primary,
  },
  tagText: {
    color: AuthColors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  tagTextPrimary: {
    color: '#000',
  },
  title: {
    color: AuthColors.white,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  subtitle: {
    color: AuthColors.whiteSecondary,
    fontSize: 14,
  },
});
