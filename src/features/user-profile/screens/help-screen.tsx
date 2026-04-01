import React, { useState } from 'react';
import { Linking, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AuthColors, AuthSpacing } from '@/features/auth';

const HELP_ITEMS = [
  { id: 'faq', icon: 'chatbubble-ellipses-outline', label: 'Sıkça Sorulan Sorular', action: 'faq' },
  { id: 'contact', icon: 'mail-outline', label: 'Bize Ulaşın', action: 'mail' },
  { id: 'feedback', icon: 'star-outline', label: 'Geri Bildirim Gönder', action: 'feedback' },
  { id: 'terms', icon: 'document-text-outline', label: 'Kullanım Koşulları', action: 'terms' },
  { id: 'about', icon: 'information-circle-outline', label: 'Hakkında', action: 'about' },
];

export function HelpScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const handlePress = (action: string) => {
    switch (action) {
      case 'mail':
        Linking.openURL('mailto:destek@reploop.com');
        break;
      case 'feedback':
        Linking.openURL('mailto:destek@reploop.com?subject=Geri%20Bildirim');
        break;
      case 'faq':
        setExpandedFaq(expandedFaq === 'faq' ? null : 'faq');
        break;
      case 'terms':
        setExpandedFaq(expandedFaq === 'terms' ? null : 'terms');
        break;
      case 'about':
        setExpandedFaq(expandedFaq === 'about' ? null : 'about');
        break;
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { paddingTop: insets.top + AuthSpacing.sm }]}>
        <View style={styles.headerBtn} />
        <Text style={styles.headerTitle}>Yardım & Destek</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={24} color={AuthColors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {HELP_ITEMS.map((item, i) => (
            <React.Fragment key={item.id}>
              {i > 0 && <View style={styles.sep} />}
              <TouchableOpacity style={styles.row} activeOpacity={0.6} onPress={() => handlePress(item.action)}>
                <View style={styles.iconCircle}>
                  <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={18} color={AuthColors.primary} />
                </View>
                <Text style={styles.label}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={18} color={AuthColors.whiteSecondary} />
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>

        {expandedFaq === 'faq' && (
          <View style={styles.expandedCard}>
            <Text style={styles.expandedTitle}>Sıkça Sorulan Sorular</Text>
            <View style={styles.faqItem}>
              <Text style={styles.faqQ}>Antrenman programımı nasıl değiştiririm?</Text>
              <Text style={styles.faqA}>Antrenmanlar sekmesinden mevcut programlarınızı görüntüleyebilir, yeni program oluşturabilirsiniz.</Text>
            </View>
            <View style={styles.faqItem}>
              <Text style={styles.faqQ}>İlerleme verilerim nerede?</Text>
              <Text style={styles.faqA}>İstatistikler sekmesinden kişisel rekorlarınızı, vücut ölçümlerinizi ve güç ilerlemenizi takip edebilirsiniz.</Text>
            </View>
            <View style={styles.faqItem}>
              <Text style={styles.faqQ}>Şifremi unuttum, ne yapmalıyım?</Text>
              <Text style={styles.faqA}>Giriş ekranında "Şifremi Unuttum" butonuna tıklayarak e-posta adresinize doğrulama kodu gönderebilirsiniz.</Text>
            </View>
          </View>
        )}

        {expandedFaq === 'terms' && (
          <View style={styles.expandedCard}>
            <Text style={styles.expandedTitle}>Kullanım Koşulları</Text>
            <Text style={styles.expandedText}>
              RepLoop uygulamasını kullanarak aşağıdaki koşulları kabul etmiş olursunuz. Uygulama yalnızca kişisel fitness takibi amacıyla kullanılmalıdır. Kullanıcı verileri güvenli bir şekilde saklanır ve üçüncü taraflarla paylaşılmaz. Uygulama içeriği profesyonel tıbbi tavsiye yerine geçmez.
            </Text>
          </View>
        )}

        {expandedFaq === 'about' && (
          <View style={styles.expandedCard}>
            <Text style={styles.expandedTitle}>Hakkında</Text>
            <Text style={styles.expandedText}>
              RepLoop, kişisel antrenman takibi ve fitness hedeflerinize ulaşmanız için tasarlanmış bir mobil uygulamadır. Yapay zeka destekli öneri sistemiyle size özel antrenman programları sunar.
            </Text>
          </View>
        )}

        <View style={styles.versionBox}>
          <Text style={styles.versionText}>RepLoop v1.0.0</Text>
          <Text style={styles.versionSub}> </Text>
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
  content: { paddingHorizontal: AuthSpacing.lg, gap: AuthSpacing.lg },
  card: {
    backgroundColor: AuthColors.inputBackground, borderRadius: 16, borderWidth: 1,
    borderColor: AuthColors.inputBorder, overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
    paddingHorizontal: AuthSpacing.md, gap: AuthSpacing.md,
  },
  iconCircle: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: 'rgba(0,230,118,0.1)', alignItems: 'center', justifyContent: 'center',
  },
  label: { flex: 1, color: AuthColors.white, fontSize: 15, fontWeight: '600' },
  sep: { height: 1, backgroundColor: AuthColors.inputBorder, marginLeft: 66 },
  expandedCard: {
    backgroundColor: AuthColors.inputBackground, borderRadius: 16, borderWidth: 1,
    borderColor: AuthColors.inputBorder, padding: AuthSpacing.lg, gap: AuthSpacing.md,
  },
  expandedTitle: { color: AuthColors.white, fontSize: 17, fontWeight: '800' },
  expandedText: { color: AuthColors.whiteSecondary, fontSize: 14, lineHeight: 22 },
  faqItem: { gap: 4 },
  faqQ: { color: AuthColors.white, fontSize: 14, fontWeight: '700' },
  faqA: { color: AuthColors.whiteSecondary, fontSize: 13, lineHeight: 20 },
  versionBox: { alignItems: 'center', gap: 4, paddingVertical: AuthSpacing.lg },
  versionText: { color: AuthColors.whiteSecondary, fontSize: 13, fontWeight: '600' },
  versionSub: { color: 'rgba(255,255,255,0.3)', fontSize: 12 },
});
