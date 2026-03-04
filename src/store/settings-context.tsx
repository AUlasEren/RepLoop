import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

import { settingsService } from '@/services';
import type {
  SettingsDto,
  WorkoutSettings,
  NotificationSettings,
  PrivacySettings,
} from '@/services/api-types';

// ─── Local UI types (used by screens) ───────────────────────────────────────

export type WorkoutPreferences = {
  warmup: boolean;
  rest: boolean;
  sound: boolean;
  vibrate: boolean;
  progressive: boolean;
  supersets: boolean;
};

export type NotificationPreferences = {
  reminder: boolean;
  progress: boolean;
  records: boolean;
  tips: boolean;
  social: boolean;
  marketing: boolean;
};

export type PrivacyPreferences = {
  public: boolean;
  analytics: boolean;
  biometric: boolean;
};

export type AppSettings = {
  workout: WorkoutPreferences;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
};

// ─── Defaults ───────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: AppSettings = {
  workout: {
    warmup: true, rest: true, sound: false, vibrate: true, progressive: true, supersets: false,
  },
  notifications: {
    reminder: true, progress: true, records: true, tips: false, social: true, marketing: false,
  },
  privacy: {
    public: false, analytics: true, biometric: false,
  },
};

// ─── Mapping between UI keys and API keys ───────────────────────────────────

function mapApiToLocal(dto: SettingsDto): AppSettings {
  return {
    workout: {
      warmup: dto.workout.workoutDays.length > 0,
      rest: dto.workout.restBetweenSetsSeconds > 0,
      sound: false,
      vibrate: true,
      progressive: true,
      supersets: false,
    },
    notifications: {
      reminder: dto.notifications.workoutReminders,
      progress: dto.notifications.weeklyReport,
      records: dto.notifications.achievementAlerts,
      tips: dto.notifications.emailNotifications,
      social: dto.notifications.pushNotifications,
      marketing: false,
    },
    privacy: {
      public: false,
      analytics: dto.privacy.allowDataAnalysis,
      biometric: false,
    },
  };
}

// ─── Context ────────────────────────────────────────────────────────────────

type SettingsContextType = {
  settings: AppSettings;
  loadSettings: () => Promise<void>;
  updateWorkout: (partial: Partial<WorkoutPreferences>) => void;
  updateNotifications: (partial: Partial<NotificationPreferences>) => void;
  updatePrivacy: (partial: Partial<PrivacyPreferences>) => void;
  resetSettings: () => void;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  const loadSettings = useCallback(async () => {
    try {
      const dto = await settingsService.getSettings();
      setSettings(mapApiToLocal(dto));
    } catch {
      // Keep defaults
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateWorkout = useCallback((partial: Partial<WorkoutPreferences>) => {
    setSettings((prev) => {
      const next = { ...prev, workout: { ...prev.workout, ...partial } };
      const restSeconds = next.workout.rest ? 60 : 0;
      settingsService.updateWorkout({ restBetweenSetsSeconds: restSeconds }).catch(() => {});
      return next;
    });
  }, []);

  const updateNotifications = useCallback((partial: Partial<NotificationPreferences>) => {
    setSettings((prev) => ({ ...prev, notifications: { ...prev.notifications, ...partial } }));
    const apiPartial: Partial<NotificationSettings> = {};
    if ('reminder' in partial) apiPartial.workoutReminders = partial.reminder;
    if ('progress' in partial) apiPartial.weeklyReport = partial.progress;
    if ('records' in partial) apiPartial.achievementAlerts = partial.records;
    if ('tips' in partial) apiPartial.emailNotifications = partial.tips;
    if ('social' in partial) apiPartial.pushNotifications = partial.social;
    settingsService.updateNotifications(apiPartial).catch(() => {});
  }, []);

  const updatePrivacy = useCallback((partial: Partial<PrivacyPreferences>) => {
    setSettings((prev) => ({ ...prev, privacy: { ...prev.privacy, ...partial } }));
    const apiPartial: Partial<PrivacySettings> = {};
    if ('analytics' in partial) apiPartial.allowDataAnalysis = partial.analytics;
    settingsService.updatePrivacy(apiPartial).catch(() => {});
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return (
    <SettingsContext.Provider
      value={{ settings, loadSettings, updateWorkout, updateNotifications, updatePrivacy, resetSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
