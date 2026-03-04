import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthColors, AuthSpacing } from '@/features/auth';
import type { WorkoutSummary } from '../constants';

type WorkoutListCardProps = {
  workout: WorkoutSummary;
  onPress: () => void;
};

export function WorkoutListCard({ workout, onPress }: WorkoutListCardProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      <Image source={{ uri: workout.imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>{workout.title}</Text>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{workout.tags[0]}</Text>
          </View>
        </View>
        <Text style={styles.subtitle} numberOfLines={1}>{workout.subtitle}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="barbell-outline" size={13} color={AuthColors.primary} />
            <Text style={styles.metaText}>{workout.exerciseCount} egzersiz</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={13} color={AuthColors.primary} />
            <Text style={styles.metaText}>{workout.duration}</Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={AuthColors.whiteSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AuthColors.inputBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AuthColors.inputBorder,
    padding: AuthSpacing.md,
    gap: AuthSpacing.md,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  content: {
    flex: 1,
    gap: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: AuthSpacing.sm,
  },
  title: {
    color: AuthColors.white,
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  tag: {
    backgroundColor: 'rgba(0,230,118,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  tagText: {
    color: AuthColors.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  subtitle: {
    color: AuthColors.whiteSecondary,
    fontSize: 13,
  },
  metaRow: {
    flexDirection: 'row',
    gap: AuthSpacing.md,
    marginTop: 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: AuthColors.whiteSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
});
