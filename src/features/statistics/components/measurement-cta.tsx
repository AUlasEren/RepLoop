import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { AuthColors, AuthSpacing } from '@/features/auth';

type MeasurementCTAProps = {
  onAdd: () => void;
};

export function MeasurementCTA({ onAdd }: MeasurementCTAProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0d2a3d', '#0a1e2e', '#0A1520']}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.title}>Yeni ölçüm kaydet</Text>
        <Text style={styles.description}>
          İstatistiklerinizi güncel tutmak için kilonuzu ve vücut ölçülerinizi takip edin.
        </Text>
        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onAdd}>
          <Text style={styles.buttonText}>Ölçüleri Güncelle</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  card: {
    padding: AuthSpacing.lg,
    gap: AuthSpacing.sm,
  },
  title: {
    color: AuthColors.white,
    fontSize: 20,
    fontWeight: '800',
  },
  description: {
    color: AuthColors.whiteSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    backgroundColor: AuthColors.primary,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
    marginTop: AuthSpacing.xs,
  },
  buttonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
  },
});
