import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AuthColors, AuthSpacing } from '@/features/auth';
import { WorkoutHero, WorkoutMeta, ExerciseCard } from '../components';
import { DUMMY_WORKOUT } from '../constants';

export function WorkoutDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const workout = DUMMY_WORKOUT;

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
        <TouchableOpacity style={styles.headerButton} hitSlop={12}>
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
            <TouchableOpacity hitSlop={8}>
              <Text style={styles.editLink}>Listeyi Düzenle</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.exercisesList}>
            {workout.exercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + AuthSpacing.md }]}>
        <TouchableOpacity
          style={styles.startButton}
          activeOpacity={0.8}
          onPress={() => router.push('/active-workout')}
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
