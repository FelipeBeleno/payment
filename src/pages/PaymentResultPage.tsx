import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { setStatusTransaction } from "../slices/statusTransaction"
import api from "../utils/axiosConfig"
import { config } from "../utils/config"
import { useAppDispatch, useAppSelector } from "../store/store"
import { OrderStatus } from "../types/types"
import { ApiError } from "../utils/errorHandler"

const PaymentResultPage = () => {
  const statusTransaction = useAppSelector(state => state.statusTransaction)
  const [countdown, setCountdown] = useState(10)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const getOrderInfo = useCallback(async () => {
    if (!statusTransaction.orderId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/order/${statusTransaction.orderId}`)
      
      if (response.data) {
        dispatch(setStatusTransaction({
          orderId: response.data._id,
          status: response.data.status as OrderStatus
        }))
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Error al obtener información del pedido");
      console.error("Error al obtener información del pedido:", err);
    } finally {
      setIsLoading(false);
    }
  }, [statusTransaction.orderId, dispatch])

  useEffect(() => {
    // Si no hay ID de orden, redirigir al inicio
    if (!statusTransaction.orderId) {
      navigate('/');
      return;
    }
    
    // Si el estado no es COMPLETED, iniciar cuenta regresiva
    if (statusTransaction.status !== OrderStatus.COMPLETED) {
      setCountdown(10);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            
            // Si el estado es PENDING, actualizar información
            if (statusTransaction.status === OrderStatus.PENDING) {
              getOrderInfo();
              return 10; // Reiniciar cuenta regresiva
            }
            
            // Si no es PENDING ni COMPLETED, redirigir al inicio
            if (statusTransaction.status !== OrderStatus.COMPLETED) {
              navigate('/');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [statusTransaction.status, statusTransaction.orderId, navigate, getOrderInfo]);

  const renderStatusContent = () => {
    switch (statusTransaction.status) {
      case OrderStatus.COMPLETED:
        return (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-[#e6f7d9] rounded-full flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-[#00D284]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">¡Pago exitoso!</h2>
            <p className="text-gray-600 mb-6">
              Tu pedido ha sido procesado correctamente. Hemos enviado un correo electrónico con los detalles de tu
              compra.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-8 w-full max-w-md">
              <p className="text-gray-500 mb-2">ID de transacción:</p>
              <p className="font-mono font-medium">{statusTransaction.orderId}</p>
            </div>
          </div>
        );
        
      case OrderStatus.FAILED:
        return (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Pago fallido</h2>
            <p className="text-gray-600 mb-6">
              Lo sentimos, ha ocurrido un error al procesar tu pago. Por favor, intenta nuevamente o utiliza otro método
              de pago.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-8 w-full max-w-md">
              <p className="text-gray-500 mb-2">ID de transacción:</p>
              <p className="font-mono font-medium">{statusTransaction.orderId}</p>
            </div>
            <p className="text-gray-500 mt-4">Redirigiendo en {countdown} segundos...</p>
          </div>
        );
        
      case OrderStatus.PENDING:
        return (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} fill="none" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l2 2" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Pago pendiente</h2>
            <p className="text-gray-600 mb-6">
              Tu pago está siendo procesado. Te notificaremos por correo electrónico cuando se confirme la transacción.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-8 w-full max-w-md">
              <p className="text-gray-500 mb-2">ID de transacción:</p>
              <p className="font-mono font-medium">{statusTransaction.orderId}</p>
            </div>
            <p className="text-gray-500 m-4">
              {isLoading ? 'Actualizando...' : `Actualizando en ${countdown} segundo${countdown <= 1 ? '' : 's'}...`}
            </p>
          </div>
        );
        
      default:
        return (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Estado desconocido</h2>
            <p className="text-gray-600 mb-6">
              No podemos determinar el estado actual de tu pago. Por favor, contacta con soporte.
            </p>
            <p className="text-gray-500 m-4">Redirigiendo en {countdown} segundos...</p>
          </div>
        );
    }
  };

  return (
    <div className="store-container py-16 animate-[fadeIn_0.5s_ease-out] min-h-screen flex items-center justify-center">
      <div className="card p-8 text-center max-w-3xl mx-auto animate-[slideUp_0.5s_ease-out]">
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            <p>{error}</p>
          </div>
        )}
        
        {renderStatusContent()}

        <button 
          onClick={() => navigate('/')} 
          className="btn-primary"
          disabled={isLoading}
        >
          Volver a la tienda
        </button>
      </div>
    </div>
  )
}

export default PaymentResultPage;