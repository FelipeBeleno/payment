import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import { config } from "./config";
import { handleApiError } from "./errorHandler";

// Crear instancia de axios con configuración base
const api: AxiosInstance = axios.create({
    baseURL: config.API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000, // 10 segundos de timeout
});

// Interceptor para manejar respuestas
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        const apiError = handleApiError(error);
        
        // Aquí podrías implementar lógica adicional como:
        // - Mostrar notificaciones de error
        // - Reintentar peticiones fallidas
        // - Manejar errores de autenticación (401)
        
        return Promise.reject(apiError);
    }
);

// Interceptor para peticiones
api.interceptors.request.use(
    (config) => {
        // Aquí podrías añadir tokens de autenticación u otros headers
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;