import React, { useRef } from 'react';
import { Alert, Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

import { AuthColors, AuthSpacing } from '@/features/auth';
import type { WorkoutDto } from '@/services/api-types';

type WorkoutListCardProps = {
  workout: WorkoutDto;
  onPress: () => void;
  onDelete?: (id: string) => void;
};

export function WorkoutListCard({ workout, onPress, onDelete }: WorkoutListCardProps) {
  const swipeableRef = useRef<Swipeable>(null);
  const exercises = workout.exercises ?? [];
  const subtitle =
    workout.description ??
    exercises.map((e) => e.exerciseName).join(', ');

  const renderRightActions = (_progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0.5],
      extrapolate: 'clamp',
    });

    const handleDeletePress = () => {
      swipeableRef.current?.close();
      Alert.alert(
        'Antrenmanı Sil',
        'Bu antrenmanı silmek istediğine emin misin?',
        [
          { text: 'İptal', style: 'cancel' },
          {
            text: 'Sil',
            style: 'destructive',
            onPress: () => onDelete?.(workout.id),
          },
        ],
      );
    };

    return (
      <TouchableOpacity style={styles.deleteAction} activeOpacity={0.7} onPress={handleDeletePress}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons name="trash-outline" size={22} color="#fff" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={onDelete ? renderRightActions : undefined}
      overshootRight={false}
      friction={2}
    >
      <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
        <View style={styles.iconCircle}>
          <Ionicons name="barbell-outline" size={24} color={AuthColors.primary} />
        </View>
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.title} numberOfLines={1}>{workout.name}</Text>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{workout.durationMinutes} dk</Text>
            </View>
          </View>
          <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="barbell-outline" size={13} color={AuthColors.primary} />
              <Text style={styles.metaText}>{exercises.length} egzersiz</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={13} color={AuthColors.primary} />
              <Text style={styles.metaText}>{workout.durationMinutes} dk</Text>
            </View>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={AuthColors.whiteSecondary} />
      </TouchableOpacity>
    </Swipeable>
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
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(0,230,118,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
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
  deleteAction: {
    backgroundColor: '#E53935',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
    marginLeft: AuthSpacing.sm,
  },
});
