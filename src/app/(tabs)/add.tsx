import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { workoutService } from '@/services';

const BG = '#0A0A0A';
const PRIMARY = '#00E676';
const INPUT_BG = 'rgba(255,255,255,0.12)';
const INPUT_BORDER = 'rgba(255,255,255,0.15)';
const WHITE = '#FFFFFF';
const WHITE_SEC = 'rgba(255,255,255,0.6)';
const PLACEHOLDER = 'rgba(255,255,255,0.5)';

type LocalExercise = {
  key: string;
  name: string;
  sets: number;
  reps: number;
  weightKg: number;
};

export default function AddTab() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [exercises, setExercises] = useState<LocalExercise[]>([]);
  const [saving, setSaving] = useState(false);

  const [exName, setExName] = useState('');
  const [exSets, setExSets] = useState('');
  const [exReps, setExReps] = useState('');
  const [exWeight, setExWeight] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleAddExercise = () => {
    if (!exName.trim()) {
      Alert.alert('Hata', 'Egzersiz adı boş bırakılamaz.');
      return;
    }
    const sets = parseInt(exSets, 10) || 3;
    const reps = parseInt(exReps, 10) || 10;
    const weight = parseFloat(exWeight) || 0;

    setExercises((prev) => [
      ...prev,
      { key: `${Date.now()}`, name: exName.trim(), sets, reps, weightKg: weight },
    ]);
    setExName('');
    setExSets('');
    setExReps('');
    setExWeight('');
    setShowForm(false);
  };

  const handleRemoveExercise = (key: string) => {
    setExercises((prev) => prev.filter((e) => e.key !== key));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Hata', 'Antrenman adı boş bırakılamaz.');
      return;
    }
    if (exercises.length === 0) {
      Alert.alert('Hata', 'En az bir egzersiz ekle.');
      return;
    }

    setSaving(true);
    try {
      await workoutService.create({
        name: name.trim(),
        description: description.trim() || null,
        durationMinutes: parseInt(duration, 10) || 0,
        exercises: exercises.map((e) => ({
          exerciseId: '00000000-0000-0000-0000-000000000000',
          exerciseName: e.name,
          sets: e.sets,
          reps: e.reps,
          weightKg: e.weightKg,
          durationSeconds: 0,
          notes: null,
        })),
      });
      Alert.alert('Başarılı', 'Antrenman oluşturuldu.', [
        { text: 'Tamam', onPress: () => router.replace('/(tabs)/workouts') },
      ]);
    } catch (e) {
      console.error('Create workout error:', e);
      Alert.alert('Hata', 'Antrenman oluşturulamadı.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 16, paddingBottom: 120 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.pageTitle}>Yeni Antrenman</Text>

          <View style={styles.section}>
            <Text style={styles.label}>Antrenman Adı *</Text>
            <TextInput
              style={styles.input}
              placeholder="ör. İtme Günü"
              placeholderTextColor={PLACEHOLDER}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Açıklama</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              placeholder="ör. Göğüs, omuz ve triceps odaklı"
              placeholderTextColor={PLACEHOLDER}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Tahmini Süre (dk)</Text>
            <TextInput
              style={styles.input}
              placeholder="ör. 60"
              placeholderTextColor={PLACEHOLDER}
              value={duration}
              onChangeText={setDuration}
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.label}>Egzersizler ({exercises.length})</Text>
              {!showForm && (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setShowForm(true)}
                >
                  <Ionicons name="add" size={18} color="#000" />
                  <Text style={styles.addButtonText}>Ekle</Text>
                </TouchableOpacity>
              )}
            </View>

            {exercises.map((ex, i) => (
              <View key={ex.key} style={styles.exerciseRow}>
                <View style={styles.exOrderCircle}>
                  <Text style={styles.exOrderText}>{i + 1}</Text>
                </View>
                <View style={styles.exInfo}>
                  <Text style={styles.exName}>{ex.name}</Text>
                  <Text style={styles.exMeta}>
                    {ex.sets} set × {ex.reps} tekrar
                    {ex.weightKg > 0 ? ` • ${ex.weightKg} kg` : ''}
                  </Text>
                </View>
                <TouchableOpacity
                  hitSlop={8}
                  onPress={() => handleRemoveExercise(ex.key)}
                >
                  <Ionicons name="trash-outline" size={18} color="#ff5252" />
                </TouchableOpacity>
              </View>
            ))}

            {showForm && (
              <View style={styles.exerciseForm}>
                <TextInput
                  style={styles.input}
                  placeholder="Egzersiz adı *"
                  placeholderTextColor={PLACEHOLDER}
                  value={exName}
                  onChangeText={setExName}
                  autoFocus
                />
                <View style={styles.formRow}>
                  <TextInput
                    style={[styles.input, styles.smallInput]}
                    placeholder="Set"
                    placeholderTextColor={PLACEHOLDER}
                    value={exSets}
                    onChangeText={setExSets}
                    keyboardType="number-pad"
                  />
                  <TextInput
                    style={[styles.input, styles.smallInput]}
                    placeholder="Tekrar"
                    placeholderTextColor={PLACEHOLDER}
                    value={exReps}
                    onChangeText={setExReps}
                    keyboardType="number-pad"
                  />
                  <TextInput
                    style={[styles.input, styles.smallInput]}
                    placeholder="kg"
                    placeholderTextColor={PLACEHOLDER}
                    value={exWeight}
                    onChangeText={setExWeight}
                    keyboardType="decimal-pad"
                  />
                </View>
                <View style={styles.formButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setShowForm(false)}
                  >
                    <Text style={styles.cancelText}>İptal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleAddExercise}
                  >
                    <Text style={styles.confirmText}>Ekle</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {exercises.length === 0 && !showForm && (
              <View style={styles.emptyExercises}>
                <Ionicons name="barbell-outline" size={32} color={WHITE_SEC} />
                <Text style={styles.emptyText}>Henüz egzersiz eklenmedi</Text>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
          {saving ? (
            <View style={styles.saveButton}>
              <ActivityIndicator color="#000" />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.saveButton}
              activeOpacity={0.8}
              onPress={handleSave}
            >
              <Text style={styles.saveText}>Antrenmanı Kaydet</Text>
              <Ionicons name="checkmark" size={20} color="#000" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    gap: 20,
  },
  pageTitle: {
    color: WHITE,
    fontSize: 28,
    fontWeight: '800',
  },
  section: {
    gap: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: WHITE_SEC,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: INPUT_BG,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    paddingHorizontal: 16,
    height: 48,
    color: WHITE,
    fontSize: 15,
  },
  multiline: {
    height: 80,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  addButtonText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '700',
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: INPUT_BG,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    padding: 14,
    gap: 12,
  },
  exOrderCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,230,118,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exOrderText: {
    color: PRIMARY,
    fontSize: 14,
    fontWeight: '800',
  },
  exInfo: {
    flex: 1,
    gap: 2,
  },
  exName: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '700',
  },
  exMeta: {
    color: WHITE_SEC,
    fontSize: 12,
  },
  exerciseForm: {
    backgroundColor: INPUT_BG,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: PRIMARY,
    padding: 14,
    gap: 10,
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
  },
  smallInput: {
    flex: 1,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  cancelText: {
    color: WHITE_SEC,
    fontSize: 14,
    fontWeight: '600',
  },
  confirmButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: PRIMARY,
  },
  confirmText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyExercises: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  emptyText: {
    color: WHITE_SEC,
    fontSize: 14,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: BG,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  saveButton: {
    backgroundColor: PRIMARY,
    borderRadius: 28,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
  },
});
