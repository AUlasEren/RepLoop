import { api } from './api-client';
import type {
  ExerciseDto,
  CreateExerciseCommand,
  UpdateExerciseCommand,
  PaginatedResult,
} from './api-types';

type ExerciseFilters = {
  muscleGroup?: string;
  equipment?: string;
  difficulty?: string;
  page?: number;
  pageSize?: number;
};

export const exerciseService = {
  async list(filters: ExerciseFilters = {}): Promise<PaginatedResult<ExerciseDto>> {
    const params = new URLSearchParams();
    if (filters.muscleGroup) params.append('muscleGroup', filters.muscleGroup);
    if (filters.equipment) params.append('equipment', filters.equipment);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    params.append('page', String(filters.page ?? 1));
    params.append('pageSize', String(filters.pageSize ?? 20));

    return api.get(`/api/exercises?${params.toString()}`, false);
  },

  async getById(id: string): Promise<ExerciseDto> {
    return api.get(`/api/exercises/${id}`, false);
  },

  async create(body: CreateExerciseCommand): Promise<{ id: string }> {
    return api.post('/api/exercises', body);
  },

  async update(id: string, body: Omit<UpdateExerciseCommand, 'id'>): Promise<void> {
    return api.put(`/api/exercises/${id}`, { ...body, id });
  },

  async remove(id: string): Promise<void> {
    return api.delete(`/api/exercises/${id}`);
  },
};
