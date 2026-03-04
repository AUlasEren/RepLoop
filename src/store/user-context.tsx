import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

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
const EXPERIENCE_TO_API: Record<ExperienceLevel, ApiLevel> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

const API_TO_EXPERIENCE: Record<ApiLevel, ExperienceLevel> = {
  Beginner: 'beginner',
  Intermediate: 'intermediate',
  Advanced: 'advanced',
};

const GOAL_TO_API: Record<GoalType, ApiGoal> = {
  muscle: 'MuscleGain',
  fat_loss: 'WeightLoss',
  endurance: 'Endurance',
};

const API_TO_GOAL: Record<string, GoalType> = {
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
        name: dto.displayName,
        avatarUrl: dto.avatarUrl || '',
        age: dto.age,
        height: dto.heightCm,
        weight: dto.weightKg,
        experience: exp,
        goal,
        goalLabel: GOAL_LABELS[goal],
        levelLabel: LEVEL_LABELS[exp],
      });
    } catch {
      // Profile hasn't been created yet — keep defaults
    }
  }, []);

  const updateUser = useCallback(
    async (partial: Partial<Omit<UserData, 'goalLabel' | 'levelLabel'>>) => {
      setUser((prev) => {
        const next = { ...prev, ...partial };
        if (partial.goal) next.goalLabel = GOAL_LABELS[partial.goal];
        if (partial.experience) next.levelLabel = LEVEL_LABELS[partial.experience];
        return next;
      });

      // Fire API call in background, merge current + partial
      try {
        const current = { ...user, ...partial };
        const cmd: UpdateProfileCommand = {
          displayName: current.name,
          age: current.age,
          heightCm: current.height,
          weightKg: current.weight,
          experienceLevel: EXPERIENCE_TO_API[current.experience],
          goal: GOAL_TO_API[current.goal],
        };
        await userService.updateProfile(cmd);
      } catch {
        // Silently fail — optimistic update already applied
      }
    },
    [user],
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
