import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AuthColors, AuthSpacing } from '@/features/auth';
import type { UserProfileData } from '../constants';

type ProfileStatsProps = {
  profile: UserProfileData;
};

function StatItem({ label, value, unit, isText }: { label: string; value: string; unit?: string; isText?: boolean }) {
  return (
    <View style={styles.item}>
      <Text style={styles.label}>{label}</Text>
      {isText ? (
        <Text style={styles.textValue}>{value}</Text>
      ) : (
        <Text style={styles.value}>
          {value}
          {unit ? <Text style={styles.unit}> {unit}</Text> : null}
        </Text>
      )}
    </View>
  );
}

export function ProfileStats({ profile }: ProfileStatsProps) {
  return (
    <View style={styles.container}>
      <StatItem label="BOY" value={String(profile.height)} unit="cm" />
      <View style={styles.divider} />
      <StatItem label="KİLO" value={String(profile.weight)} unit="kg" />
      <View style={styles.divider} />
      <StatItem label="HEDEF" value={profile.goal} isText />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: AuthColors.inputBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AuthColors.inputBorder,
    paddingVertical: AuthSpacing.md,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  label: {
    color: AuthColors.whiteSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  value: {
    color: AuthColors.white,
    fontSize: 22,
    fontWeight: '800',
  },
  unit: {
    fontSize: 13,
    fontWeight: '500',
    color: AuthColors.whiteSecondary,
  },
  textValue: {
    color: AuthColors.primary,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 20,
  },
  divider: {
    width: 1,
    backgroundColor: AuthColors.inputBorder,
  },
});
