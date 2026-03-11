import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { exerciseService } from '@/services';
import type { ExerciseDto } from '@/services/api-types';

const SHEET_BG = '#1A1A1A';
const PRIMARY = '#00E676';
const WHITE = '#FFFFFF';
const WHITE_SEC = 'rgba(255,255,255,0.6)';
const INPUT_BG = 'rgba(255,255,255,0.12)';
const INPUT_BORDER = 'rgba(255,255,255,0.15)';
const PLACEHOLDER = 'rgba(255,255,255,0.5)';

export type SelectedExercise = {
  exerciseId: string;
  exerciseName: string;
  muscleGroup: string;
};

type ExercisePickerProps = {
  value: SelectedExercise | null;
  onChange: (exercise: SelectedExercise) => void;
};

export function ExercisePicker({ value, onChange }: ExercisePickerProps) {
  const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [exercises, setExercises] = useState<ExerciseDto[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);

  const cache = useRef<Record<string, ExerciseDto[]>>({});

  // Fetch all exercises on mount to extract unique muscle groups
  useEffect(() => {
    let cancelled = false;
    setLoadingGroups(true);
    exerciseService
      .list({ pageSize: 200 })
      .then((res) => {
        if (cancelled) return;
        const groups = [
          ...new Set(
            res.items
              .map((e) => e.muscleGroup)
              .filter((g): g is string => g != null && g.trim() !== ''),
          ),
        ].sort();
        setMuscleGroups(groups);

        // Pre-fill cache per group
        for (const ex of res.items) {
          if (ex.muscleGroup) {
            if (!cache.current[ex.muscleGroup]) {
              cache.current[ex.muscleGroup] = [];
            }
            cache.current[ex.muscleGroup].push(ex);
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingGroups(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSelectGroup = useCallback(
    (group: string) => {
      setSelectedGroup(group);
      setGroupModalVisible(false);

      // Reset selected exercise if group changed
      if (value && value.muscleGroup !== group) {
        // Parent will see the new group via next exercise selection
      }

      // Load exercises for this group
      if (cache.current[group]) {
        setExercises(cache.current[group]);
        return;
      }

      setLoadingExercises(true);
      exerciseService
        .list({ muscleGroup: group, pageSize: 100 })
        .then((res) => {
          cache.current[group] = res.items;
          setExercises(res.items);
        })
        .catch(() => {})
        .finally(() => setLoadingExercises(false));
    },
    [value],
  );

  const handleSelectExercise = useCallback(
    (exercise: ExerciseDto) => {
      onChange({
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        muscleGroup: selectedGroup!,
      });
      setExerciseModalVisible(false);
    },
    [onChange, selectedGroup],
  );

  const groupLabel = selectedGroup ?? 'Kas Grubu Seçin';
  const exerciseLabel = value?.exerciseName ?? 'Egzersiz Seçin';
  const exerciseDisabled = !selectedGroup;

  return (
    <View style={styles.container}>
      {/* Muscle Group Selector */}
      <TouchableOpacity
        style={styles.selector}
        activeOpacity={0.7}
        onPress={() => setGroupModalVisible(true)}
      >
        <Text style={[styles.selectorText, !selectedGroup && styles.placeholder]}>
          {groupLabel}
        </Text>
        {loadingGroups ? (
          <ActivityIndicator size="small" color={WHITE_SEC} />
        ) : (
          <Ionicons name="chevron-down" size={20} color={WHITE_SEC} />
        )}
      </TouchableOpacity>

      {/* Exercise Selector */}
      <TouchableOpacity
        style={[styles.selector, exerciseDisabled && styles.selectorDisabled]}
        activeOpacity={exerciseDisabled ? 1 : 0.7}
        onPress={() => {
          if (!exerciseDisabled) setExerciseModalVisible(true);
        }}
      >
        <Text
          style={[
            styles.selectorText,
            !value && styles.placeholder,
            exerciseDisabled && styles.disabledText,
          ]}
        >
          {exerciseLabel}
        </Text>
        {loadingExercises ? (
          <ActivityIndicator size="small" color={WHITE_SEC} />
        ) : (
          <Ionicons
            name="chevron-down"
            size={20}
            color={exerciseDisabled ? PLACEHOLDER : WHITE_SEC}
          />
        )}
      </TouchableOpacity>

      {/* Muscle Group Modal */}
      <Modal
        visible={groupModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setGroupModalVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setGroupModalVisible(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Kas Grubu</Text>
            {loadingGroups ? (
              <ActivityIndicator
                size="large"
                color={PRIMARY}
                style={styles.loader}
              />
            ) : muscleGroups.length === 0 ? (
              <Text style={styles.emptyText}>Kas grubu bulunamadı</Text>
            ) : (
              <ScrollView style={styles.scrollArea} bounces={false}>
                {muscleGroups.map((group) => (
                  <TouchableOpacity
                    key={group}
                    style={[
                      styles.option,
                      selectedGroup === group && styles.optionSelected,
                    ]}
                    onPress={() => handleSelectGroup(group)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedGroup === group && styles.optionTextSelected,
                      ]}
                    >
                      {group}
                    </Text>
                    {selectedGroup === group && (
                      <Ionicons name="checkmark" size={20} color={PRIMARY} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </Pressable>
      </Modal>

      {/* Exercise Modal */}
      <Modal
        visible={exerciseModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setExerciseModalVisible(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setExerciseModalVisible(false)}
        >
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{selectedGroup} Egzersizleri</Text>
            {loadingExercises ? (
              <ActivityIndicator
                size="large"
                color={PRIMARY}
                style={styles.loader}
              />
            ) : exercises.length === 0 ? (
              <Text style={styles.emptyText}>Egzersiz bulunamadı</Text>
            ) : (
              <ScrollView style={styles.scrollArea} bounces={false}>
                {exercises.map((ex) => (
                  <TouchableOpacity
                    key={ex.id}
                    style={[
                      styles.option,
                      value?.exerciseId === ex.id && styles.optionSelected,
                    ]}
                    onPress={() => handleSelectExercise(ex)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        value?.exerciseId === ex.id && styles.optionTextSelected,
                      ]}
                    >
                      {ex.name}
                    </Text>
                    {value?.exerciseId === ex.id && (
                      <Ionicons name="checkmark" size={20} color={PRIMARY} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  selector: {
    backgroundColor: INPUT_BG,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    paddingHorizontal: 16,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorDisabled: {
    opacity: 0.4,
  },
  selectorText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '600',
  },
  placeholder: {
    color: PLACEHOLDER,
  },
  disabledText: {
    color: PLACEHOLDER,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: SHEET_BG,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 8,
    maxHeight: '60%',
  },
  sheetTitle: {
    color: WHITE,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  scrollArea: {
    flexGrow: 0,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  optionSelected: {
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
  },
  optionText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: PRIMARY,
    fontWeight: '700',
  },
  loader: {
    paddingVertical: 32,
  },
  emptyText: {
    color: WHITE_SEC,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 32,
  },
});
