import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { AuthColors, AuthSpacing } from '@/features/auth';
import type { WorkoutTemplate } from '@/services/api-types';

type TemplateCardProps = {
  template: WorkoutTemplate;
  onSave: (template: WorkoutTemplate) => Promise<void>;
  isSaving: boolean;
  isSaved: boolean;
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: '#66BB6A',
  Intermediate: '#FFA726',
  Advanced: '#EF5350',
};

const CARD_WIDTH = 280;

export function TemplateCard({ template, onSave, isSaving, isSaved }: TemplateCardProps) {
  const diffColor = DIFFICULTY_COLORS[template.difficulty] ?? AuthColors.primary;
  const preview = template.exercises.slice(0, 3);

  return (
    <View style={styles.card}>
      {/* Top: difficulty + meta badges */}
      <View style={styles.badgeRow}>
        <View style={[styles.badge, { backgroundColor: `${diffColor}22` }]}>
          <Text style={[styles.badgeText, { color: diffColor }]}>{template.difficulty}</Text>
        </View>
        <View style={styles.badge}>
          <Ionicons name="time-outline" size={11} color={AuthColors.primary} />
          <Text style={styles.badgeText}>{template.duration_minutes} dk</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{template.exercises.length} egzersiz</Text>
        </View>
      </View>

      {/* Title + description */}
      <Text style={styles.title} numberOfLines={1}>{template.name}</Text>
      <Text style={styles.description} numberOfLines={2}>{template.description}</Text>

      {/* Exercise preview */}
      <View style={styles.exerciseBox}>
        {preview.map((ex, i) => (
          <View key={`${ex.exercise_id}-${i}`} style={styles.exerciseRow}>
            <Text style={styles.exerciseDot}>·</Text>
            <Text style={styles.exerciseName} numberOfLines={1}>
              {ex.name}
            </Text>
            <Text style={styles.exerciseSets}>{ex.sets}x{ex.reps}</Text>
          </View>
        ))}
        {template.exercises.length > 3 && (
          <Text style={styles.moreText}>
            +{template.exercises.length - 3} daha
          </Text>
        )}
      </View>

      {/* Score reasons */}
      {template.score_reasons.length > 0 && (
        <View style={styles.reasonRow}>
          {template.score_reasons.slice(0, 2).map((reason) => (
            <View key={reason} style={styles.reasonBadge}>
              <Text style={styles.reasonText} numberOfLines={1}>{reason}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Save button — pinned at bottom */}
      <View style={styles.spacer} />
      <TouchableOpacity
        style={[styles.saveButton, isSaved && styles.saveButtonDone]}
        activeOpacity={0.8}
        onPress={() => onSave(template)}
        disabled={isSaving || isSaved}
      >
        {isSaving ? (
          <ActivityIndicator size="small" color="#000" />
        ) : isSaved ? (
          <>
            <Ionicons name="checkmark" size={15} color={AuthColors.primary} />
            <Text style={[styles.saveLabel, styles.saveLabelDone]}>Kaydedildi</Text>
          </>
        ) : (
          <>
            <Ionicons name="add" size={15} color="#000" />
            <Text style={styles.saveLabel}>Programa Ekle</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: AuthColors.inputBackground,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AuthColors.inputBorder,
    padding: AuthSpacing.md,
    gap: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,230,118,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  badgeText: {
    color: AuthColors.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    color: AuthColors.white,
    fontSize: 17,
    fontWeight: '800',
    marginTop: 2,
  },
  description: {
    color: AuthColors.whiteSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  exerciseBox: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 3,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exerciseDot: {
    color: AuthColors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  exerciseName: {
    color: AuthColors.white,
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  exerciseSets: {
    color: AuthColors.whiteSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  moreText: {
    color: AuthColors.whiteSecondary,
    fontSize: 11,
    marginTop: 1,
    paddingLeft: 12,
  },
  reasonRow: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  reasonBadge: {
    backgroundColor: 'rgba(0,230,118,0.08)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    maxWidth: '60%',
  },
  reasonText: {
    color: AuthColors.primary,
    fontSize: 10,
    fontWeight: '500',
  },
  spacer: {
    flex: 1,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AuthColors.primary,
    borderRadius: 12,
    paddingVertical: 9,
    gap: 5,
  },
  saveButtonDone: {
    backgroundColor: 'rgba(0,230,118,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0,230,118,0.3)',
  },
  saveLabel: {
    color: '#000',
    fontSize: 13,
    fontWeight: '700',
  },
  saveLabelDone: {
    color: AuthColors.primary,
  },
});
