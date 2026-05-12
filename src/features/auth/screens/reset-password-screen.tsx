import React, { useState, useRef, useEffect } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { AuthTextInput, AuthButton } from '../components';
import { AuthColors, AuthSpacing } from '../constants';
import { resetPasswordSchema, type ResetPasswordFormData } from '../schemas';
import { isApiError } from '@/store/auth-context';
import { authService } from '@/services';

const CODE_LENGTH = 6;

export function ResetPasswordScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [resending, setResending] = useState(false);
  const codeInputRefs = useRef<(TextInput | null)[]>([]);
  const [codeDigits, setCodeDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { code: '', newPassword: '', confirmPassword: '' },
    mode: 'onBlur',
  });

  useEffect(() => {
    if (!email?.trim()) {
      router.replace('/(auth)/forgot-password');
    }
  }, [email]);

  if (!email?.trim()) return null;

  const handleCodeChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = [...codeDigits];
    newDigits[index] = digit;
    setCodeDigits(newDigits);
    setValue('code', newDigits.join(''), { shouldValidate: false });

    if (digit && index < CODE_LENGTH - 1) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !codeDigits[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
      const newDigits = [...codeDigits];
      newDigits[index - 1] = '';
      setCodeDigits(newDigits);
      setValue('code', newDigits.join(''), { shouldValidate: false });
    }
  };

  const handleExpiredOrExceeded = () => {
    Alert.alert(
      'Yeni Kod Gerekli',
      'Kodunuzun süresi dolmuş veya deneme hakkınız bitmiş. Yeni bir kod isteyin.',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Yeni Kod İste', onPress: () => handleResendCode() },
      ],
    );
  };

  const handleResendCode = async () => {
    if (!email) return;
    setResending(true);
    try {
      await authService.forgotPassword({ email });
      Alert.alert('Kod Gönderildi', 'Yeni doğrulama kodu e-posta adresine gönderildi.');
      setCodeDigits(Array(CODE_LENGTH).fill(''));
      reset({ code: '', newPassword: '', confirmPassword: '' });
      codeInputRefs.current[0]?.focus();
    } catch (e) {
      if (isApiError(e) && e.errorCode === 'AUTH-1010') {
        Alert.alert('Lütfen Bekle', 'Lütfen 2 dakika bekleyip tekrar deneyin.');
      } else {
        Alert.alert('Hata', 'Kod gönderilemedi. Lütfen tekrar deneyin.');
      }
    } finally {
      setResending(false);
    }
  };

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await authService.resetPassword({
        email: email!,
        code: data.code,
        newPassword: data.newPassword,
      });
      Alert.alert('Başarılı', 'Şifreniz başarıyla değiştirildi. Giriş yapabilirsiniz.', [
        { text: 'Giriş Yap', onPress: () => router.replace('/(auth)/login') },
      ]);
    } catch (e) {
      if (!isApiError(e)) {
        Alert.alert('Hata', 'Bağlantı hatası. Lütfen tekrar deneyin.');
        return;
      }

      const { errorCode, detail } = e;

      if (errorCode === 'AUTH-1012' || errorCode === 'AUTH-1013') {
        handleExpiredOrExceeded();
        return;
      }

      if (errorCode === 'AUTH-1011') {
        setError('code', {
          type: 'server',
          message: detail || 'Geçersiz kod. Lütfen tekrar deneyin.',
        });
        return;
      }

      if (errorCode === 'AUTH-1010') {
        Alert.alert('Lütfen Bekle', 'Lütfen 2 dakika bekleyip tekrar deneyin.');
        return;
      }

      Alert.alert('Hata', detail || 'Şifre sıfırlanamadı. Lütfen tekrar deneyin.');
    }
  };

  // RHF tracks `code` for validation, but the OTP boxes own the UI.
  // Errors from setError('code', ...) propagate via formState.errors.code.
  const codeError = errors.code?.message;

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
                <Ionicons name="shield-checkmark-outline" size={48} color={AuthColors.primary} />
                <Text style={styles.title}>Şifre Sıfırla</Text>
                <Text style={styles.subtitle}>
                  {email} adresine gönderilen 6 haneli kodu gir ve yeni şifreni belirle.
                </Text>
              </View>

              <Controller
                control={control}
                name="code"
                render={() => (
                  <View style={styles.codeContainer}>
                    <Text style={styles.codeLabel}>Doğrulama Kodu</Text>
                    <View style={styles.codeRow}>
                      {Array.from({ length: CODE_LENGTH }).map((_, i) => (
                        <TextInput
                          key={i}
                          ref={(ref) => {
                            codeInputRefs.current[i] = ref;
                          }}
                          style={[
                            styles.codeInput,
                            codeDigits[i] ? styles.codeInputFilled : null,
                            codeError ? styles.codeInputError : null,
                          ]}
                          value={codeDigits[i]}
                          onChangeText={(text) => handleCodeChange(text, i)}
                          onKeyPress={({ nativeEvent }) => handleCodeKeyPress(nativeEvent.key, i)}
                          keyboardType="number-pad"
                          maxLength={1}
                          selectTextOnFocus
                          placeholderTextColor={AuthColors.inputPlaceholder}
                        />
                      ))}
                    </View>
                    {codeError && <Text style={styles.codeErrorText}>{codeError}</Text>}
                    <TouchableOpacity
                      style={styles.resendButton}
                      onPress={handleResendCode}
                      disabled={resending}
                      hitSlop={8}
                    >
                      {resending ? (
                        <ActivityIndicator size="small" color={AuthColors.primary} />
                      ) : (
                        <Text style={styles.resendText}>Kodu tekrar gönder</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              />

              <View style={styles.form}>
                <Controller
                  control={control}
                  name="newPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AuthTextInput
                      placeholder="Yeni Şifre"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      isPassword
                      autoComplete="new-password"
                      error={errors.newPassword?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AuthTextInput
                      placeholder="Yeni Şifre (Tekrar)"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      isPassword
                      autoComplete="new-password"
                      error={errors.confirmPassword?.message}
                    />
                  )}
                />
              </View>

              {isSubmitting ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color={AuthColors.primary} />
                </View>
              ) : (
                <AuthButton title="Şifreyi Sıfırla" onPress={handleSubmit(onSubmit)} />
              )}
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
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  codeContainer: {
    gap: AuthSpacing.sm,
    alignItems: 'center',
  },
  codeLabel: {
    color: AuthColors.whiteSecondary,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  codeRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  codeInput: {
    width: 48,
    height: 56,
    borderRadius: 12,
    backgroundColor: AuthColors.inputBackground,
    borderWidth: 1,
    borderColor: AuthColors.inputBorder,
    color: AuthColors.white,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  codeInputFilled: {
    borderColor: AuthColors.primary,
  },
  codeInputError: {
    borderColor: AuthColors.error,
  },
  codeErrorText: {
    color: AuthColors.error,
    fontSize: 13,
  },
  resendButton: {
    marginTop: AuthSpacing.xs,
    height: 24,
    justifyContent: 'center',
  },
  resendText: {
    color: AuthColors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  form: {
    gap: AuthSpacing.md,
  },
  loaderContainer: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
