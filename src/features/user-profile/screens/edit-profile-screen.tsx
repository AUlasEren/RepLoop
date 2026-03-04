import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
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
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import { AuthColors, AuthSpacing } from '@/features/auth';
import { useUser } from '@/store/user-context';
import { userService } from '@/services';
import { EXPERIENCE_LEVELS, GOALS } from '@/features/profile/constants';
import { SegmentedControl, GoalCard } from '@/features/profile/components';
import { ProfileAvatar } from '../components';

export function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, updateUser } = useUser();

  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(user.age ? String(user.age) : '');
  const [weight, setWeight] = useState(user.weight ? String(user.weight) : '');
  const [height, setHeight] = useState(user.height ? String(user.height) : '');
  const [experience, setExperience] = useState(user.experience);
  const [goal, setGoal] = useState(user.goal);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarPress = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setUploadingAvatar(true);
      try {
        const { avatarUrl } = await userService.uploadAvatar(result.assets[0].uri);
        await updateUser({ avatarUrl });
      } catch {
        Alert.alert('Hata', 'Avatar yüklenemedi.');
      } finally {
        setUploadingAvatar(false);
      }
    }
  };

  const handleSave = async () => {
    try {
      await updateUser({
        name: name.trim() || user.name,
        age: Number(age) || 0,
        weight: Number(weight) || 0,
        height: Number(height) || 0,
        experience,
        goal,
      });
      Alert.alert('Kaydedildi', 'Profil bilgilerin güncellendi.', [
        { text: 'Tamam', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Hata', 'Profil kaydedilemedi.');
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { paddingTop: insets.top + AuthSpacing.sm }]}>
        <View style={styles.headerBtn} />
        <Text style={styles.headerTitle}>Profilimi Düzenle</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={24} color={AuthColors.white} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity onPress={handleAvatarPress} activeOpacity={0.8} style={styles.avatarWrapper}>
            <ProfileAvatar uri={user.avatarUrl} />
            <View style={styles.cameraOverlay}>
              {uploadingAvatar ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="camera" size={16} color="#fff" />
              )}
            </View>
          </TouchableOpacity>

          <View style={styles.field}>
            <Text style={styles.label}>İsim</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholderTextColor={AuthColors.inputPlaceholder} />
          </View>

          <View style={styles.row}>
            <View style={[styles.field, styles.flex]}>
              <Text style={styles.label}>Yaş</Text>
              <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="number-pad" maxLength={3} placeholderTextColor={AuthColors.inputPlaceholder} />
            </View>
            <View style={[styles.field, styles.flex]}>
              <Text style={styles.label}>Boy (cm)</Text>
              <TextInput style={styles.input} value={height} onChangeText={setHeight} keyboardType="number-pad" maxLength={3} placeholderTextColor={AuthColors.inputPlaceholder} />
            </View>
            <View style={[styles.field, styles.flex]}>
              <Text style={styles.label}>Kilo (kg)</Text>
              <TextInput style={styles.input} value={weight} onChangeText={setWeight} keyboardType="number-pad" maxLength={3} placeholderTextColor={AuthColors.inputPlaceholder} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Deneyim Seviyesi</Text>
            <SegmentedControl options={EXPERIENCE_LEVELS} value={experience} onChange={setExperience} />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Ana Hedef</Text>
            <View style={styles.goalsContainer}>
              {GOALS.map((g) => (
                <GoalCard
                  key={g.key}
                  icon={g.icon}
                  label={g.label}
                  description={g.description}
                  selected={goal === g.key}
                  onPress={() => setGoal(g.key)}
                />
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} activeOpacity={0.8} onPress={handleSave}>
            <Text style={styles.saveText}>Kaydet</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: AuthColors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: AuthSpacing.lg, paddingBottom: AuthSpacing.md,
  },
  headerBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: AuthColors.white, fontSize: 16, fontWeight: '600' },
  content: { paddingHorizontal: AuthSpacing.lg, gap: AuthSpacing.lg },
  field: { gap: AuthSpacing.sm },
  label: { color: AuthColors.whiteSecondary, fontSize: 14, fontWeight: '500' },
  input: {
    backgroundColor: AuthColors.inputBackground, borderRadius: 16, borderWidth: 1,
    borderColor: AuthColors.inputBorder, paddingHorizontal: AuthSpacing.md, height: 52,
    color: AuthColors.white, fontSize: 16, fontWeight: '600',
  },
  row: { flexDirection: 'row', gap: AuthSpacing.sm },
  section: { gap: AuthSpacing.sm },
  goalsContainer: { gap: AuthSpacing.sm },
  avatarWrapper: {
    alignSelf: 'center',
    position: 'relative',
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AuthColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: AuthColors.background,
  },
  saveButton: {
    backgroundColor: AuthColors.primary, borderRadius: 28, height: 56,
    alignItems: 'center', justifyContent: 'center',
  },
  saveText: { color: '#000', fontSize: 18, fontWeight: '700' },
});
