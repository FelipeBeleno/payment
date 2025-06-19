import axios, { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

export const handleApiError = (error: unknown): ApiError => {
  // Error de Axios
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    // Error de respuesta del servidor
    if (axiosError.response) {
      return {
        message: getErrorMessage(axiosError.response.data) || 
                'El servidor respondió con un error',
        code: `${axiosError.response.status}`,
        details: axiosError.response.data
      };
    }
    
    // Error de solicitud (no se pudo enviar la solicitud)
    if (axiosError.request) {
      return {
        message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
        code: 'REQUEST_ERROR'
      };
    }
    
    // Otro error de Axios
    return {
      message: axiosError.message || 'Error desconocido en la solicitud',
      code: 'AXIOS_ERROR'
    };
  }
  
  // Error genérico
  if (error instanceof Error) {
    return {
      message: error.message || 'Ha ocurrido un error inesperado',
      code: 'UNKNOWN_ERROR'
    };
  }
  
  // Si no es un objeto Error
  return {
    message: 'Ha ocurrido un error inesperado',
    code: 'UNKNOWN_ERROR',
    details: error
  };
};

// Función auxiliar para extraer mensajes de error de diferentes formatos de respuesta
const getErrorMessage = (responseData: any): string | null => {
  if (!responseData) return null;
  
  // Formato común: { message: "Error message" }
  if (typeof responseData.message === 'string') {
    return responseData.message;
  }
  
  // Formato común: { error: "Error message" }
  if (typeof responseData.error === 'string') {
    return responseData.error;
  }
  
  // Formato común: { errors: ["Error 1", "Error 2"] }
  if (Array.isArray(responseData.errors) && responseData.errors.length > 0) {
    return responseData.errors[0];
  }
  
  return null;
};