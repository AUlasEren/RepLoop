import React from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { AuthTextInput, AuthButton } from '../components';
import { AuthColors, AuthSpacing } from '../constants';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../schemas';
import { isApiError } from '@/store/auth-context';
import { authService } from '@/services';

export function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
    mode: 'onBlur',
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const trimmed = data.email.trim();

    try {
      await authService.forgotPassword({ email: trimmed });
    } catch (e) {
      if (isApiError(e) && e.errorCode === 'AUTH-1010') {
        Alert.alert('Lütfen Bekle', 'Lütfen 2 dakika bekleyip tekrar deneyin.');
        return;
      }
      if (!isApiError(e)) {
        Alert.alert('Hata', 'Bağlantı hatası. Lütfen tekrar deneyin.');
        return;
      }
      // API errors silent for security — same flow regardless (prevents user enumeration)
    }

    Alert.alert(
      'Kod Gönderildi',
      'Eğer bu e-posta ile bir hesap varsa, doğrulama kodu gönderildi.',
      [
        {
          text: 'Tamam',
          onPress: () =>
            router.push({ pathname: '/(auth)/reset-password', params: { email: trimmed } }),
        },
      ],
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#1a2e1a', '#12211a', '#0d1a12', '#0A0A0A', '#0A0A0A']}
        locations={[0, 0.15, 0.3, 0.5, 1]}
        style={styles.background}
      >
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingTop: insets.top, paddingBottom: insets.bottom + AuthSpacing.lg },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                hitSlop={12}
              >
                <Ionicons name="arrow-back" size={24} color={AuthColors.white} />
              </TouchableOpacity>
              <Text style={styles.brandName}>REPLOOP</Text>
              <View style={styles.backButton} />
            </View>

            <View style={styles.content}>
              <View style={styles.titleSection}>
                <Ionicons name="lock-open-outline" size={48} color={AuthColors.primary} />
                <Text style={styles.title}>Şifremi Unuttum</Text>
                <Text style={styles.subtitle}>
                  E-posta adresini gir, sana 6 haneli doğrulama kodu gönderelim.
                </Text>
              </View>

              <View style={styles.form}>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AuthTextInput
                      placeholder="E-posta"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoComplete="email"
                      error={errors.email?.message}
                    />
                  )}
                />
              </View>

              {isSubmitting ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color={AuthColors.primary} />
                </View>
              ) : (
                <AuthButton title="Kod Gönder" onPress={handleSubmit(onSubmit)} />
              )}

              <TouchableOpacity
                style={styles.backToLogin}
                onPress={() => router.back()}
                hitSlop={8}
              >
                <Text style={styles.backToLoginText}>Giriş ekranına dön</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AuthColors.background,
  },
  flex: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: AuthSpacing.lg,
    paddingTop: AuthSpacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    color: AuthColors.primary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: AuthSpacing.lg,
    gap: AuthSpacing.lg,
    paddingBottom: AuthSpacing.md,
  },
  titleSection: {
    gap: AuthSpacing.sm,
    alignItems: 'center',
  },
  title: {
    color: AuthColors.white,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 36,
    textAlign: 'center',
  },
  subtitle: {
    color: AuthColors.whiteSecondary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  form: {
    gap: AuthSpacing.md,
  },
  loaderContainer: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backToLogin: {
    alignSelf: 'center',
  },
  backToLoginText: {
    color: AuthColors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
