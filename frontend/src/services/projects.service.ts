import { api } from './api';

export type ProjectStatus = 'pendente' | 'em_andamento' | 'concluido';

export interface Project {
    id: string;
    name: string;
    description: string;
    status: ProjectStatus;
    owner: {
        id: string;
        name: string;
    };
    goals: {
        total: number;
        completed: number;
        progress: number;
    };
    createdAt: string;
}

export interface ProjectsResponse {
    data: Project[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
    };
}

interface StoreProject {
    name: string;
    description: string;
}

export async function getProjects(page = 1, limit = 6, status?: ProjectStatus) {
    const response = await api.get<ProjectsResponse>(
        `/projects?page=${page}&limit=${limit}&status=${status}`,
    );

    return response.data;
}

export async function getProjectStats() {
    const response = await api.get('/projects/stats');
    return response.data;
}

export async function storeProject(payload: StoreProject) {
    const {data} = await api.post('/projects/', payload);

    return data;
}

