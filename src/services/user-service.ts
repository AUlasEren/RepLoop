import { Platform } from 'react-native';

import { api } from './api-client';
import type { UserProfileDto, UpdateProfileCommand } from './api-types';

export const userService = {
  async getProfile(): Promise<UserProfileDto> {
    return api.get('/api/user/profile');
  },

  async updateProfile(body: UpdateProfileCommand): Promise<UserProfileDto> {
    return api.put('/api/user/profile', body);
  },

  async uploadAvatar(uri: string): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    const filename = uri.split('/').pop() || 'avatar.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('file', {
      uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
      name: filename,
      type,
    } as any);

    return api.upload('/api/user/avatar', formData);
  },

  async deleteAccount(): Promise<void> {
    return api.delete('/api/user/account');
  },
};
