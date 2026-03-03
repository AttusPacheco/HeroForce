import { api } from './api';

export interface UpdateUserPayload {
    name?: string;
    character?: string;
    password?: string;
}

export async function updateUser(id: string, payload: UpdateUserPayload) {
    const { data } = await api.patch(`/users/${id}`, payload);
    return data;
}

export async function getUser(id: string) {
    const { data } = await api.get(`/users/${id}`);
    return data;
}
