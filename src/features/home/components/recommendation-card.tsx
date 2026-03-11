import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AuthColors, AuthSpacing } from '@/features/auth';
import type { RecommendationItem } from '@/services/api-types';

type RecommendationCardProps = {
  recommendation: RecommendationItem | null;
};

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const router = useRouter();

  const tags = recommendation?.tags ?? [];
  const scorePercent = recommendation ? Math.round(recommendation.score * 100) : 0;

  const handleStart = () => {
    if (recommendation) {
      router.push({ pathname: '/workout-detail', params: { id: recommendation.workout_id } });
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Sizin İçin Öneriler</Text>
        <TouchableOpacity hitSlop={8} onPress={() => router.push('/(tabs)/workouts')}>
          <Text style={styles.seeAll}>Tümünü Gör</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <LinearGradient
          colors={['#1a2e1a', '#0d1a0d', '#0A0A0A']}
          style={styles.cardBg}
        >
          {recommendation ? (
            <>
              <View style={styles.tags}>
                {scorePercent > 0 && (
                  <View style={[styles.tag, styles.scoreTag]}>
                    <Text style={styles.tagText}>%{scorePercent} uyum</Text>
                  </View>
                )}
                {tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.cardTitle}>{recommendation.workout_name}</Text>
              <Text style={styles.cardDesc}>
                {recommendation.reason || `${recommendation.exercise_count} egzersizli, ${recommendation.duration_minutes} dakikalık antrenman programı.`}
              </Text>

              <View style={styles.cardFooter}>
                <View style={styles.avatarsRow}>
                  <View style={styles.miniAvatar}>
                    <Ionicons name="person" size={12} color={AuthColors.whiteSecondary} />
                  </View>
                  <Text style={styles.avatarCount}>+1b</Text>
                </View>
                <TouchableOpacity
                  style={styles.startButton}
                  activeOpacity={0.8}
                  onPress={handleStart}
                >
                  <Ionicons name="play" size={14} color="#000" />
                  <Text style={styles.startText}>Başla</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="barbell-outline" size={32} color={AuthColors.whiteSecondary} />
              <Text style={styles.placeholderText}>Henüz öneri yok</Text>
              <TouchableOpacity
                style={styles.startButton}
                activeOpacity={0.8}
                onPress={() => router.push('/(tabs)/add')}
              >
                <Ionicons name="add" size={16} color="#000" />
                <Text style={styles.startText}>Antrenman Oluştur</Text>
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: AuthSpacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: AuthColors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  seeAll: {
    color: AuthColors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: AuthColors.inputBorder,
  },
  cardBg: {
    padding: AuthSpacing.lg,
    gap: AuthSpacing.sm,
  },
  tags: {
    flexDirection: 'row',
    gap: AuthSpacing.sm,
  },
  tag: {
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreTag: {
    backgroundColor: 'rgba(0, 230, 118, 0.25)',
  },
  tagText: {
    color: AuthColors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  cardTitle: {
    color: AuthColors.white,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },
  cardDesc: {
    color: AuthColors.whiteSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: AuthSpacing.sm,
  },
  avatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  miniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCount: {
    color: AuthColors.whiteSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AuthColors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  startText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: AuthSpacing.xl,
    gap: AuthSpacing.sm,
  },
  placeholderText: {
    color: AuthColors.whiteSecondary,
    fontSize: 14,
  },
});
