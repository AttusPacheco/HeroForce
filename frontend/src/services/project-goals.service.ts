import { api } from './api';
import { ProjectStatus } from './projects.service';

export interface ProjectGoal {
    id: string;
    title: string;
    description?: string;
    status: ProjectStatus;
    createdAt: string;
    updatedAt: string;
}

export interface StoreGoal {
    title: string;
    description?: string;
    status?: ProjectStatus;
}

export async function getProjectGoals(projectId: string) {
    const response = await api.get(`/projects/${projectId}/goals`);
    return response.data as ProjectGoal[];
}

export async function createProjectGoal(projectId: string, payload: StoreGoal) {
    const response = await api.post(`/projects/${projectId}/goals`, payload);
    return response.data;
}

export async function updateProjectGoal(projectId: string, goalId: string, payload: Partial<StoreGoal>) {
    const response = await api.patch(`/projects/${projectId}/goals/${goalId}`, payload);
    return response.data;
}

export async function deleteProjectGoal(projectId: string, goalId: string) {
    const response = await api.delete(`/projects/${projectId}/goals/${goalId}`);
    return response.data;
}
