import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthColors, AuthSpacing } from '@/features/auth';
import type { SettingsItem } from '../constants';

type SettingsMenuProps = {
  title: string;
  items: SettingsItem[];
  onItemPress?: (id: string) => void;
};

function MenuItem({ item, onPress }: { item: SettingsItem; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.row} activeOpacity={0.6} onPress={onPress}>
      <View style={[styles.iconCircle, { backgroundColor: `${item.iconBg}20` }]}>
        <Ionicons
          name={item.icon as keyof typeof Ionicons.glyphMap}
          size={18}
          color={item.iconBg}
        />
      </View>
      <Text style={styles.label}>{item.label}</Text>
      <View style={styles.rightSide}>
        {item.hasBadge && <View style={styles.badge} />}
        <Ionicons name="chevron-forward" size={18} color={AuthColors.whiteSecondary} />
      </View>
    </TouchableOpacity>
  );
}

export function SettingsMenu({ title, items, onItemPress }: SettingsMenuProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 && <View style={styles.separator} />}
            <MenuItem item={item} onPress={() => onItemPress?.(item.id)} />
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: AuthSpacing.sm,
  },
  sectionTitle: {
    color: AuthColors.white,
    fontSize: 17,
    fontWeight: '800',
  },
  card: {
    backgroundColor: AuthColors.inputBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AuthColors.inputBorder,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: AuthSpacing.md,
    gap: AuthSpacing.md,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    color: AuthColors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  rightSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5252',
  },
  separator: {
    height: 1,
    backgroundColor: AuthColors.inputBorder,
    marginLeft: 66,
  },
});
