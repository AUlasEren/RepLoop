import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthColors, AuthSpacing } from '@/features/auth';

type GoalCardProps = {
  icon: string;
  label: string;
  description: string;
  selected: boolean;
  onPress: () => void;
};

export function GoalCard({ icon, label, description, selected, onPress }: GoalCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, selected && styles.iconContainerSelected]}>
        <Ionicons
          name={icon as keyof typeof Ionicons.glyphMap}
          size={22}
          color={selected ? '#000000' : AuthColors.white}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      {selected && (
        <View style={styles.checkmark}>
          <Ionicons name="checkmark-circle" size={24} color={AuthColors.primary} />
        </View>
      )}
    </TouchableOpacity>
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
  cardSelected: {
    borderColor: AuthColors.primary,
    backgroundColor: 'rgba(0, 230, 118, 0.08)',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerSelected: {
    backgroundColor: AuthColors.primary,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  label: {
    color: AuthColors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  description: {
    color: AuthColors.whiteSecondary,
    fontSize: 13,
  },
  checkmark: {
    marginLeft: 'auto',
  },
});
