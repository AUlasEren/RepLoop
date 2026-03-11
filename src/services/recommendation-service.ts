import { api } from './api-client';
import type {
  RecommendationRequest,
  RecommendationResponse,
} from './api-types';
import type { UserData } from '@/store/user-context';

// Frontend enum → API format mapping
const EXPERIENCE_MAP: Record<string, RecommendationRequest['experience_level']> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

const GOAL_MAP: Record<string, RecommendationRequest['goal']> = {
  muscle: 'MuscleGain',
  fat_loss: 'WeightLoss',
  endurance: 'Endurance',
};

function getRecommendations(request: RecommendationRequest) {
  return api.post<RecommendationResponse>('/api/recommendations/', request);
}

function fetchRecommendations(userId: string, user: UserData) {
  const request: RecommendationRequest = {
    user_id: userId,
    age: user.age || 25,
    weight_kg: user.weight || 70,
    height_cm: user.height || 170,
    experience_level: EXPERIENCE_MAP[user.experience] ?? 'Beginner',
    goal: GOAL_MAP[user.goal] ?? 'GeneralFitness',
  };
  return getRecommendations(request);
}

export const recommendationService = {
  getRecommendations,
  fetchRecommendations,
};
