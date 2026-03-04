import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

import type { ExperienceLevel, GoalType } from '@/features/profile/constants';
import { userService } from '@/services';
import type { UpdateProfileCommand, ExperienceLevel as ApiLevel, Goal as ApiGoal } from '@/services/api-types';

export type UserData = {
  name: string;
  avatarUrl: string;
  age: number;
  height: number;
  weight: number;
  experience: ExperienceLevel;
  goal: GoalType;
  goalLabel: string;
  levelLabel: string;
};

const GOAL_LABELS: Record<GoalType, string> = {
  muscle: 'Kas\nKazanma',
  fat_loss: 'Yağ\nYakma',
  endurance: 'Dayanıklılık',
};

const LEVEL_LABELS: Record<ExperienceLevel, string> = {
  beginner: 'Başlangıç Seviye',
  intermediate: 'Orta Seviye',
  advanced: 'İleri Seviye',
};

const DEFAULT_USER: UserData = {
  name: '',
  avatarUrl: '',
  age: 0,
  height: 0,
  weight: 0,
  experience: 'beginner',
  goal: 'muscle',
  goalLabel: GOAL_LABELS.muscle,
  levelLabel: LEVEL_LABELS.beginner,
};

// Frontend <-> Backend enum mapping
// Backend .NET enums are serialized as integers
const EXPERIENCE_TO_API: Record<ExperienceLevel, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

const API_TO_EXPERIENCE: Record<string | number, ExperienceLevel> = {
  0: 'beginner',
  1: 'intermediate',
  2: 'advanced',
  Beginner: 'beginner',
  Intermediate: 'intermediate',
  Advanced: 'advanced',
};

const GOAL_TO_API: Record<GoalType, number> = {
  muscle: 1,
  fat_loss: 0,
  endurance: 2,
};

const API_TO_GOAL: Record<string | number, GoalType> = {
  0: 'fat_loss',
  1: 'muscle',
  2: 'endurance',
  3: 'endurance',
  4: 'muscle',
  MuscleGain: 'muscle',
  WeightLoss: 'fat_loss',
  Endurance: 'endurance',
  Flexibility: 'endurance',
  GeneralFitness: 'muscle',
};

type UserContextType = {
  user: UserData;
  updateUser: (partial: Partial<Omit<UserData, 'goalLabel' | 'levelLabel'>>) => Promise<void>;
  loadProfile: () => Promise<void>;
  resetUser: () => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData>(DEFAULT_USER);

  const loadProfile = useCallback(async () => {
    try {
      const dto = await userService.getProfile();
      const exp = API_TO_EXPERIENCE[dto.experienceLevel] || 'beginner';
      const goal = API_TO_GOAL[dto.goal] || 'muscle';
      setUser({
        name: dto.displayName ?? '',
        avatarUrl: dto.avatarUrl ?? '',
        age: dto.age ?? 0,
        height: dto.heightCm ?? 0,
        weight: dto.weightKg ?? 0,
        experience: exp,
        goal,
        goalLabel: GOAL_LABELS[goal],
        levelLabel: LEVEL_LABELS[exp],
      });
    } catch {
      // Profile hasn't been created yet — keep defaults
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const updateUser = useCallback(
    async (partial: Partial<Omit<UserData, 'goalLabel' | 'levelLabel'>>) => {
      let merged: UserData = DEFAULT_USER;

      setUser((prev) => {
        const next = { ...prev, ...partial };
        if (partial.goal) next.goalLabel = GOAL_LABELS[partial.goal];
        if (partial.experience) next.levelLabel = LEVEL_LABELS[partial.experience];
        merged = next;
        return next;
      });

      try {
        const cmd = {
          displayName: merged.name,
          age: merged.age,
          heightCm: merged.height,
          weightKg: merged.weight,
          experienceLevel: EXPERIENCE_TO_API[merged.experience],
          goal: GOAL_TO_API[merged.goal],
        };
        await userService.updateProfile(cmd as any);
      } catch (e) {
        console.error('updateProfile failed:', e);
      }
    },
    [],
  );

  const resetUser = useCallback(() => {
    setUser(DEFAULT_USER);
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser, loadProfile, resetUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
