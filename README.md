# Payment Frontend - Aplicación de Pagos

Una aplicación web moderna para procesamiento de pagos construida con React, TypeScript y integración con Wompi.

## 🚀 Tecnologías Principales

- **React 18** - Librería para interfaces de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Vite** - Herramienta de construcción y desarrollo rápido
- **Redux Toolkit** - Gestión del estado global
- **React Router DOM** - Enrutamiento del lado del cliente
- **Tailwind CSS** - Framework de CSS utilitario
- **Axios** - Cliente HTTP para comunicación con la API
- **Radix UI** - Componentes de UI accesibles
- **Lucide React** - Iconos modernos

## 📦 Características

- **Catálogo de Productos**: Visualización de productos con imágenes, precios y stock
- **Carrito de Compras**: Gestión de productos seleccionados
- **Formulario de Pago**: Integración completa con Wompi para procesamiento de pagos
- **Formulario de Entrega**: Captura de información de envío
- **Validación de Tarjetas**: Validación en tiempo real de datos de tarjeta de crédito
- **Responsive Design**: Optimizado para dispositivos móviles y desktop
- **Lazy Loading**: Carga optimizada de componentes
- **Error Boundaries**: Manejo robusto de errores
- **Testing**: Suite de pruebas con Jest y Testing Library

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/FelipeBeleno/payment.git
   cd payment
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configurar variables de entorno**
   
   Crear archivo `.env` en la raíz del proyecto:
   ```env
   VITE_API_URL=https://api.test-p.store
   VITE_PUBLIC_KEY_ACCESS=pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7
   VITE_URL_WP=https://api-sandbox.co.uat.wompi.dev/v1/tokens/cards
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   # o
   yarn dev
   ```

   La aplicación estará disponible en `http://localhost:5173`

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la construcción de producción
- `npm run lint` - Ejecuta el linter para verificar el código
- `npm run test` - Ejecuta las pruebas
- `npm run test:watch` - Ejecuta las pruebas en modo watch
- `npm run test:coverage` - Genera reporte de cobertura de pruebas

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── CreditCardForm.tsx
│   ├── PaymentModal.tsx
│   ├── PaymentSummary.tsx
│   └── ...
├── pages/              # Páginas principales
│   ├── ProductCatalogPage.tsx
│   ├── ProductPage.tsx
│   └── PaymentResultPage.tsx
├── slices/             # Redux slices
├── store/              # Configuración de Redux
├── types/              # Definiciones de tipos TypeScript
├── utils/              # Utilidades y configuraciones
├── __tests__/          # Archivos de prueba
└── App.tsx             # Componente principal
```

## 🔧 Configuración de Wompi

La aplicación está integrada con Wompi para el procesamiento de pagos. La inicialización se realiza automáticamente al cargar la aplicación:

```typescript
// Inicialización automática de Wompi
useEffect(() => {
  if (window.$wompi && typeof window.$wompi.initialize === "function") {
    window.$wompi.initialize((data: WompiInitData, error: WompiError | null) => {
      if (error === null) {
        // Configurar datos de sesión y dispositivo
        dispatch(setPaymentData({
          deviceId: data.deviceData.deviceID,
          sesionId: data.sessionId,
        }))
      }
    })
  }
}, [dispatch])
```

## 🌐 Despliegue

### Producción en AWS S3 + CloudFront

La aplicación está desplegada en:
- **URL**: https://d6n0zwptnzjv3.cloudfront.net
- **Hosting**: AWS S3
- **CDN**: AWS CloudFront
- **SSL**: Certificado SSL automático

### Construcción para Producción

```bash
npm run build
```

Los archivos optimizados se generan en la carpeta `dist/`.

## 🧪 Testing

El proyecto incluye pruebas unitarias y de integración:

```bash
# Ejecutar todas las pruebas
npm run test

# Ejecutar pruebas con cobertura
npm run test:coverage

# Ejecutar pruebas en modo watch
npm run test:watch
```

## 🔗 Integración con Backend

La aplicación se comunica con el backend a través de:
- **API Base URL**: `https://api.test-p.store`
- **Endpoints principales**:
  - `GET /product` - Obtener catálogo de productos
  - `POST /payment` - Procesar pagos
  - `POST /order` - Crear órdenes

## 📱 Características de UX/UI

- **Diseño Responsive**: Adaptado para móviles, tablets y desktop
- **Animaciones Suaves**: Transiciones CSS para mejor experiencia
- **Loading States**: Indicadores de carga durante operaciones
- **Error Handling**: Manejo elegante de errores con mensajes informativos
- **Accesibilidad**: Componentes accesibles con Radix UI

## 🔒 Seguridad

- **Validación de Formularios**: Validación tanto en cliente como servidor
- **HTTPS**: Comunicación segura con certificados SSL
- **Sanitización**: Limpieza de datos de entrada
- **Error Boundaries**: Prevención de crashes por errores no controlados

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto es privado y está bajo licencia propietaria.

## 📞 Soporte

Para soporte técnico o consultas, contactar al equipo de desarrollo.