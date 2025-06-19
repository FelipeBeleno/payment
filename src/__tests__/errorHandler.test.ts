import { handleApiError } from '../utils/errorHandler';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('handleApiError', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('handles axios response error', () => {
    // Create a mock axios error with response
    const mockError = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          message: 'Bad request error'
        }
      },
      request: {},
      message: 'Request failed with status code 400'
    };
    
    // Mock the axios.isAxiosError function
    mockedAxios.isAxiosError.mockReturnValue(true);
    
    const result = handleApiError(mockError);
    
    expect(result).toEqual({
      message: 'Bad request error',
      code: '400',
      details: { message: 'Bad request error' }
    });
  });

  test('handles axios request error', () => {
    // Create a mock axios error with request but no response
    const mockError = {
      isAxiosError: true,
      request: {},
      message: 'Network Error',
      response: undefined
    };
    
    // Mock the axios.isAxiosError function
    mockedAxios.isAxiosError.mockReturnValue(true);
    
    const result = handleApiError(mockError);
    
    expect(result).toEqual({
      message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
      code: 'REQUEST_ERROR'
    });
  });

  test('handles other axios errors', () => {
    // Create a mock axios error with neither response nor request
    const mockError = {
      isAxiosError: true,
      message: 'Config error',
      request: undefined,
      response: undefined
    };
    
    // Mock the axios.isAxiosError function
    mockedAxios.isAxiosError.mockReturnValue(true);
    
    const result = handleApiError(mockError);
    
    expect(result).toEqual({
      message: 'Config error',
      code: 'AXIOS_ERROR'
    });
  });

  test('handles standard Error objects', () => {
    const error = new Error('Standard error');
    
    // Mock the axios.isAxiosError function
    mockedAxios.isAxiosError.mockReturnValue(false);
    
    const result = handleApiError(error);
    
    expect(result).toEqual({
      message: 'Standard error',
      code: 'UNKNOWN_ERROR'
    });
  });

  test('handles non-Error objects', () => {
    const nonError = 'Just a string';
    
    // Mock the axios.isAxiosError function
    mockedAxios.isAxiosError.mockReturnValue(false);
    
    const result = handleApiError(nonError);
    
    expect(result).toEqual({
      message: 'Ha ocurrido un error inesperado',
      code: 'UNKNOWN_ERROR',
      details: 'Just a string'
    });
  });

  test('extracts error message from different response formats', () => {
    // Test with { error: "message" } format
    const errorFormatError = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          error: 'Error message in error field'
        }
      },
      request: {},
      message: 'Request failed'
    };
    
    mockedAxios.isAxiosError.mockReturnValue(true);
    
    const resultError = handleApiError(errorFormatError);
    expect(resultError.message).toBe('Error message in error field');
    
    // Test with { errors: ["message"] } format
    const errorsArrayFormat = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          errors: ['First error message', 'Second error message']
        }
      },
      request: {},
      message: 'Request failed'
    };
    
    const resultArray = handleApiError(errorsArrayFormat);
    expect(resultArray.message).toBe('First error message');
  });
});