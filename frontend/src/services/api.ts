import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.data?.message) {
            return Promise.reject({
                message: error.response.data.message,
                statusCode: error.response.status,
            });
        }

        return Promise.reject({
            message: 'Erro inesperado',
        });
    }
);