import { api } from './api-client';
import type {
  SettingsDto,
  WorkoutSettings,
  NotificationSettings,
  PrivacySettings,
} from './api-types';

export const settingsService = {
  async getSettings(): Promise<SettingsDto> {
    return api.get('/api/settings');
  },

  async updateWorkout(body: Partial<WorkoutSettings>): Promise<SettingsDto> {
    return api.patch('/api/settings/workout', body);
  },

  async updateNotifications(body: Partial<NotificationSettings>): Promise<SettingsDto> {
    return api.patch('/api/settings/notifications', body);
  },

  async updatePrivacy(body: Partial<PrivacySettings>): Promise<SettingsDto> {
    return api.patch('/api/settings/privacy', body);
  },
};
