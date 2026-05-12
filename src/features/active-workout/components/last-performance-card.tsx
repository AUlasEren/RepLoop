import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AuthColors, AuthSpacing } from '@/features/auth';
import { statisticsService } from '@/services';
import type { StrengthDataPoint } from '@/services/api-types';

type LastPerformanceCardProps = {
  exerciseName: string;
  exerciseId?: string | null;
};

const ZERO_ID = '00000000-0000-0000-0000-000000000000';

export function LastPerformanceCard({ exerciseName, exerciseId }: LastPerformanceCardProps) {
  const [loading, setLoading] = useState(false);
  const [lastSession, setLastSession] = useState<StrengthDataPoint | null>(null);
  const [personalBest, setPersonalBest] = useState<number | null>(null);

  useEffect(() => {
    if (!exerciseId || exerciseId === ZERO_ID) {
      setLastSession(null);
      setPersonalBest(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setLastSession(null);
    setPersonalBest(null);

    Promise.all([
      statisticsService.getStrengthProgress(exerciseId, '90d').catch(() => null),
      statisticsService.getPersonalRecords().catch(() => null),
    ])
      .then(([progress, prs]) => {
        if (cancelled) return;
        const latest = progress?.dataPoints?.length
          ? progress.dataPoints[progress.dataPoints.length - 1]
          : null;
        setLastSession(latest);
        const pr = prs?.find((p) => p.exerciseId === exerciseId);
        setPersonalBest(pr?.maxWeightKg ?? null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [exerciseId]);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.exerciseName}>{exerciseName}</Text>
      <View style={styles.card}>
        {loading ? (
          <ActivityIndicator size="small" color={AuthColors.primary} />
        ) : lastSession ? (
          <>
            <View style={styles.headerRow}>
              <Ionicons name="sparkles" size={16} color={AuthColors.primary} />
              <Text style={styles.headerText}>
                Son seans · {formatRelativeDate(lastSession.date)}
              </Text>
            </View>
            <Text style={styles.statLine}>
              <Text style={styles.statValue}>{formatNumber(lastSession.maxWeightKg)} kg</Text>
              <Text style={styles.statSeparator}> × </Text>
              <Text style={styles.statValue}>{lastSession.maxReps}</Text>
              <Text style={styles.statLabel}> reps</Text>
            </Text>
            <View style={styles.metaRow}>
              {lastSession.totalVolume > 0 && (
                <Text style={styles.metaText}>
                  Toplam: {formatNumber(lastSession.totalVolume)} kg
                </Text>
              )}
              {personalBest !== null && personalBest > lastSession.maxWeightKg && (
                <Text style={styles.metaText}>PB: {formatNumber(personalBest)} kg</Text>
              )}
            </View>
          </>
        ) : (
          <View style={styles.emptyRow}>
            <Ionicons name="flame-outline" size={18} color={AuthColors.primary} />
            <Text style={styles.emptyText}>İlk kez yapıyorsun — başlangıç verisi yok.</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function formatNumber(n: number): string {
  if (Number.isInteger(n)) return n.toString();
  return n.toFixed(1);
}

function formatRelativeDate(iso: string): string {
  const then = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffDays <= 0) return 'bugün';
  if (diffDays === 1) return 'dün';
  if (diffDays < 7) return `${diffDays} gün önce`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? '1 hafta önce' : `${weeks} hafta önce`;
  }
  const months = Math.floor(diffDays / 30);
  return months === 1 ? '1 ay önce' : `${months} ay önce`;
}

const styles = StyleSheet.create({
  wrapper: {
    gap: AuthSpacing.sm,
  },
  exerciseName: {
    color: AuthColors.white,
    fontSize: 22,
    fontWeight: '800',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: AuthSpacing.md,
    gap: AuthSpacing.xs,
    minHeight: 92,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AuthSpacing.xs,
  },
  headerText: {
    color: AuthColors.whiteSecondary,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statLine: {
    color: AuthColors.white,
    fontSize: 24,
    fontWeight: '800',
  },
  statValue: {
    color: AuthColors.white,
  },
  statSeparator: {
    color: AuthColors.whiteSecondary,
    fontWeight: '600',
  },
  statLabel: {
    color: AuthColors.whiteSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    gap: AuthSpacing.md,
    marginTop: AuthSpacing.xs,
  },
  metaText: {
    color: AuthColors.whiteSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  emptyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AuthSpacing.sm,
  },
  emptyText: {
    color: AuthColors.whiteSecondary,
    fontSize: 14,
    flex: 1,
  },
});
