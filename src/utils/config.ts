// Centraliza el acceso a las variables de entorno para evitar su uso directo en el código

interface EnvConfig {
  API_URL: string;
  WOMPI_PUBLIC_KEY: string;
  WOMPI_API_URL: string;
}

// Valores por defecto para desarrollo local (nunca usar claves reales aquí)
const defaultConfig: EnvConfig = {
  API_URL: 'http://localhost:3000',
  WOMPI_PUBLIC_KEY: 'test_public_key',
  WOMPI_API_URL: 'https://sandbox.wompi.co/v1'
};

// Función para obtener variables de entorno con validación
const getEnvVariable = (key: string): string => {
  const value = import.meta.env[`VITE_${key}`];
  
  if (!value) {
    console.warn(`Variable de entorno VITE_${key} no definida. Usando valor por defecto.`);
    return (defaultConfig as any)[key] || '';
  }
  
  return value;
};

// Configuración exportada
export const config: EnvConfig = {
  API_URL: getEnvVariable('API_URL'),
  WOMPI_PUBLIC_KEY: getEnvVariable('PUBLIC_KEY_ACCESS'),
  WOMPI_API_URL: getEnvVariable('URL_WP')
};

// Función para validar que todas las variables de entorno necesarias estén definidas
export const validateEnvConfig = (): boolean => {
  let isValid = true;
  
  Object.keys(defaultConfig).forEach(key => {
    if (!import.meta.env[`VITE_${key}`]) {
      console.error(`Variable de entorno VITE_${key} no definida.`);
      isValid = false;
    }
  });
  
  return isValid;
};