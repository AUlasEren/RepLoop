import { api } from './api-client';
import type {
  WorkoutDto,
  CreateWorkoutCommand,
  UpdateWorkoutCommand,
  PaginatedResult,
} from './api-types';

export const workoutService = {
  async list(page = 1, pageSize = 20): Promise<PaginatedResult<WorkoutDto>> {
    return api.get(`/api/workouts?page=${page}&pageSize=${pageSize}`);
  },

  async history(page = 1, pageSize = 10): Promise<PaginatedResult<WorkoutDto>> {
    return api.get(`/api/workouts/history?page=${page}&pageSize=${pageSize}`);
  },

  async getById(id: string): Promise<WorkoutDto> {
    return api.get(`/api/workouts/${id}`);
  },

  async create(body: CreateWorkoutCommand): Promise<{ id: string }> {
    return api.post('/api/workouts', body);
  },

  async update(id: string, body: UpdateWorkoutCommand): Promise<void> {
    return api.put(`/api/workouts/${id}`, { ...body, id });
  },

  async remove(id: string): Promise<void> {
    return api.delete(`/api/workouts/${id}`);
  },
};
