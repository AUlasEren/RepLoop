import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AuthColors, AuthSpacing } from '@/features/auth';
import { useSettings, type NotificationPreferences } from '@/store/settings-context';

type NotifOption = { id: keyof NotificationPreferences; label: string; description: string };

const NOTIFS: NotifOption[] = [
  { id: 'reminder', label: 'Antrenman Hatırlatıcı', description: 'Günlük antrenman saatinde bildirim al' },
  { id: 'progress', label: 'Haftalık İlerleme', description: 'Her Pazar ilerleme özetini gör' },
  { id: 'records', label: 'Kişisel Rekor', description: 'Yeni rekor kırdığında bildirim al' },
  { id: 'tips', label: 'İpuçları & Öneriler', description: 'Antrenman ve beslenme ipuçları al' },
  { id: 'social', label: 'Sosyal Bildirimler', description: 'Arkadaş aktiviteleri hakkında bildirim' },
  { id: 'marketing', label: 'Promosyonlar', description: 'Kampanya ve indirim bildirimleri' },
];

export function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { settings, updateNotifications } = useSettings();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { paddingTop: insets.top + AuthSpacing.sm }]}>
        <View style={styles.headerBtn} />
        <Text style={styles.headerTitle}>Bildirimler</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={24} color={AuthColors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {NOTIFS.map((n, i) => (
            <React.Fragment key={n.id}>
              {i > 0 && <View style={styles.sep} />}
              <View style={styles.row}>
                <View style={styles.textCol}>
                  <Text style={styles.label}>{n.label}</Text>
                  <Text style={styles.desc}>{n.description}</Text>
                </View>
                <Switch
                  value={settings.notifications[n.id]}
                  onValueChange={(v) => updateNotifications({ [n.id]: v })}
                  trackColor={{ false: 'rgba(255,255,255,0.15)', true: 'rgba(0,230,118,0.4)' }}
                  thumbColor={settings.notifications[n.id] ? AuthColors.primary : '#888'}
                />
              </View>
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: AuthColors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: AuthSpacing.lg, paddingBottom: AuthSpacing.md,
  },
  headerBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: AuthColors.white, fontSize: 16, fontWeight: '600' },
  content: { paddingHorizontal: AuthSpacing.lg },
  card: {
    backgroundColor: AuthColors.inputBackground, borderRadius: 16, borderWidth: 1,
    borderColor: AuthColors.inputBorder, overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center', padding: AuthSpacing.md, gap: AuthSpacing.md },
  textCol: { flex: 1, gap: 2 },
  label: { color: AuthColors.white, fontSize: 15, fontWeight: '600' },
  desc: { color: AuthColors.whiteSecondary, fontSize: 12, lineHeight: 16 },
  sep: { height: 1, backgroundColor: AuthColors.inputBorder, marginLeft: AuthSpacing.md },
});
