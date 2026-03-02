import {api} from './api';

interface LoginPayload {
    email: string;
    password: string;
}

interface RegisterPayload {
    name: string;
    caracter: string;
    email: string;
    password: string;
}

export async function login(payload: LoginPayload) {
    const {data} = await api.post('/auth/login', payload);
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
}

export async function register(payload: RegisterPayload) {
    const {data} = await api.post('/users', payload);

    if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
    }

    return data;
}

export function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
}