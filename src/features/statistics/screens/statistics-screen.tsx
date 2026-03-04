import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
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
import { useFocusEffect } from '@react-navigation/native';

import { AuthColors, AuthSpacing } from '@/features/auth';
import { statisticsService } from '@/services';
import type {
  PersonalRecordDto,
  BodyMeasurementDto,
  StrengthProgressDto,
} from '@/services/api-types';
import {
  StrengthChart,
  PersonalRecords,
  BodyMeasurements,
  MeasurementCTA,
} from '../components';

export function StatisticsScreen() {
  const insets = useSafeAreaInsets();

  const [personalRecords, setPersonalRecords] = useState<PersonalRecordDto[]>([]);
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurementDto[]>([]);
  const [strengthData, setStrengthData] = useState<StrengthProgressDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [mWeight, setMWeight] = useState('');
  const [mFat, setMFat] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const loadStats = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const [records, measurements] = await Promise.all([
        statisticsService.getPersonalRecords().catch(() => [] as PersonalRecordDto[]),
        statisticsService.getBodyMeasurements(1, 10).catch(() => null),
      ]);

      setPersonalRecords(records);
      if (measurements) setBodyMeasurements(measurements.items);

      if (records.length > 0) {
        const strength = await statisticsService
          .getStrengthProgress(records[0].exerciseId, '30d')
          .catch(() => null);
        setStrengthData(strength);
      }
    } catch {
      // silent
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStats(personalRecords.length > 0);
    }, [loadStats, personalRecords.length]),
  );

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadStats(true);
  }, [loadStats]);

  const handleAddMeasurement = async () => {
    const weightVal = parseFloat(mWeight) || null;
    const fatVal = parseFloat(mFat) || null;

    if (!weightVal && !fatVal) {
      Alert.alert('Hata', 'En az bir değer gir.');
      return;
    }

    setIsSaving(true);
    try {
      await statisticsService.addBodyMeasurement({
        measuredAt: new Date().toISOString(),
        weightKg: weightVal,
        bodyFatPercentage: fatVal,
      });
      setShowModal(false);
      setMWeight('');
      setMFat('');
      loadStats();
    } catch {
      Alert.alert('Hata', 'Ölçüm kaydedilemedi.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { paddingTop: insets.top + AuthSpacing.sm }]}>
        <View style={styles.headerButton} />
        <Text style={styles.headerTitle}>İlerleme İstatistikleri</Text>
        <View style={styles.headerButton} />
      </View>

      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={AuthColors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={AuthColors.primary}
            />
          }
        >
          <StrengthChart data={strengthData} />
          <PersonalRecords records={personalRecords} />
          <BodyMeasurements measurements={bodyMeasurements} />
          <MeasurementCTA onAdd={() => setShowModal(true)} />
        </ScrollView>
      )}

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Yeni Ölçüm</Text>
              <TouchableOpacity hitSlop={8} onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={AuthColors.white} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Kilo (kg)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="ör. 82.5"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={mWeight}
                onChangeText={setMWeight}
                keyboardType="decimal-pad"
                autoFocus
              />
            </View>

            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Yağ Oranı (%)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="ör. 15.2"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={mFat}
                onChangeText={setMFat}
                keyboardType="decimal-pad"
              />
            </View>

            <TouchableOpacity
              style={styles.modalSaveButton}
              activeOpacity={0.8}
              onPress={handleAddMeasurement}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.modalSaveText}>Kaydet</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    gap: AuthSpacing.xl,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    paddingHorizontal: AuthSpacing.lg,
  },
  modalCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: AuthSpacing.lg,
    gap: AuthSpacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    color: AuthColors.white,
    fontSize: 20,
    fontWeight: '800',
  },
  modalField: {
    gap: 6,
  },
  modalLabel: {
    color: AuthColors.whiteSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  modalInput: {
    backgroundColor: AuthColors.inputBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AuthColors.inputBorder,
    paddingHorizontal: 16,
    height: 48,
    color: AuthColors.white,
    fontSize: 16,
  },
  modalSaveButton: {
    backgroundColor: AuthColors.primary,
    borderRadius: 20,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: AuthSpacing.sm,
  },
  modalSaveText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
});
