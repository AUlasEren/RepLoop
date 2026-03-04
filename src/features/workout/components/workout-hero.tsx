import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { AuthColors, AuthSpacing } from '@/features/auth';
import type { WorkoutDetail } from '../constants';

type WorkoutHeroProps = {
  workout: WorkoutDetail;
};

export function WorkoutHero({ workout }: WorkoutHeroProps) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: workout.heroImageUrl }} style={styles.image} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)', AuthColors.background]}
        locations={[0, 0.6, 1]}
        style={styles.gradient}
      />
      <View style={styles.overlay}>
        <View style={styles.tags}>
          {workout.tags.map((tag, i) => (
            <View key={tag} style={[styles.tag, i === 0 && styles.tagPrimary]}>
              <Text style={[styles.tagText, i === 0 && styles.tagTextPrimary]}>{tag}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.title}>{workout.title}</Text>
        <Text style={styles.subtitle}>{workout.subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 260,
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
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
