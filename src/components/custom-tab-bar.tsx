import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const TABS: {
  name: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
}[] = [
  { name: 'index', label: 'Ana Sayfa', icon: 'home-outline', iconActive: 'home' },
  { name: 'workouts', label: 'Antrenmanlar', icon: 'search-outline', iconActive: 'search' },
  { name: 'add', label: '', icon: 'add', iconActive: 'add' },
  { name: 'statistics', label: 'İstatistikler', icon: 'bar-chart-outline', iconActive: 'bar-chart' },
  { name: 'profile-tab', label: 'Profil', icon: 'person-outline', iconActive: 'person' },
];

const PRIMARY = '#00E676';
const BG = '#0A0A0A';
const INACTIVE = 'rgba(255,255,255,0.45)';

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.bar}>
        {TABS.map((tab, index) => {
          const isFocused = state.index === index;
          const isCenter = tab.name === 'add';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: state.routes[index]?.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(state.routes[index]?.name ?? tab.name);
            }
          };

          if (isCenter) {
            return (
              <TouchableOpacity
                key={tab.name}
                style={styles.centerButton}
                onPress={onPress}
                activeOpacity={0.8}
              >
                <View style={styles.centerCircle}>
                  <Ionicons name="add" size={28} color="#000" />
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tab}
              onPress={onPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isFocused ? tab.iconActive : tab.icon}
                size={22}
                color={isFocused ? PRIMARY : INACTIVE}
              />
              <Text style={[styles.label, isFocused && styles.labelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: BG,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 60,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: INACTIVE,
  },
  labelActive: {
    color: PRIMARY,
    fontWeight: '700',
  },
  centerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  centerCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});
