import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AuthColors, AuthSpacing } from '@/features/auth';
import { useSettings, type WorkoutPreferences } from '@/store/settings-context';

type PrefToggle = { id: keyof WorkoutPreferences; label: string; description: string };

const PREFS: PrefToggle[] = [
  { id: 'warmup', label: 'Isınma Hatırlatıcı', description: 'Antrenman öncesi ısınma önerisi göster' },
  { id: 'rest', label: 'Otomatik Dinlenme Sayacı', description: 'Set arası otomatik geri sayım başlat' },
  { id: 'sound', label: 'Sesli Geri Bildirim', description: 'Set tamamlandığında ses çal' },
  { id: 'vibrate', label: 'Titreşim', description: 'Dinlenme bittiğinde titreşimle uyar' },
  { id: 'progressive', label: 'Progresif Yük Artışı', description: 'Her hafta otomatik ağırlık artışı öner' },
  { id: 'supersets', label: 'Superset Önerileri', description: 'Uygun egzersizleri süperset olarak öner' },
];

export function WorkoutPrefsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { settings, updateWorkout } = useSettings();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { paddingTop: insets.top + AuthSpacing.sm }]}>
        <View style={styles.headerBtn} />
        <Text style={styles.headerTitle}>Antrenman Tercihleri</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={24} color={AuthColors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {PREFS.map((pref, i) => (
            <React.Fragment key={pref.id}>
              {i > 0 && <View style={styles.sep} />}
              <View style={styles.row}>
                <View style={styles.textCol}>
                  <Text style={styles.label}>{pref.label}</Text>
                  <Text style={styles.desc}>{pref.description}</Text>
                </View>
                <Switch
                  value={settings.workout[pref.id]}
                  onValueChange={(v) => updateWorkout({ [pref.id]: v })}
                  trackColor={{ false: 'rgba(255,255,255,0.15)', true: 'rgba(0,230,118,0.4)' }}
                  thumbColor={settings.workout[pref.id] ? AuthColors.primary : '#888'}
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
