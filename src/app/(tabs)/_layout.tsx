import React from 'react';
import { Tabs } from 'expo-router';

import { CustomTabBar } from '@/components/custom-tab-bar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="workouts" />
      <Tabs.Screen name="add" />
      <Tabs.Screen name="statistics" />
      <Tabs.Screen name="profile-tab" />
    </Tabs>
  );
}
