import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setStatusTransaction } from "../slices/statusTransaction"
import api from "../utils/axiosConfig"



const PaymentResultPage = () => {
  const statusTransaction = useSelector((state: any) => state.statusTransaction)
  const [countdown, setCountdown] = useState(10)

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const getInfo = useCallback(
    async () => {
      const request = await api.get(`${import.meta.env.VITE_API_URL}/order/${statusTransaction.orderId}`)

      dispatch(setStatusTransaction({
        orderId: request.data._id,
        status: request.data.status
      }))

    }, [])


  useEffect(() => {
    if (statusTransaction.status !== "COMPLETED") {
      setCountdown(10)
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            if (statusTransaction.status !== "COMPLETED" && statusTransaction.status === 'PENDING') {

              getInfo()

              return 0
            }
            navigate('/')
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [statusTransaction.status])

  return (
    <div className="store-container py-16 animate-[fadeIn_0.5s_ease-out] min-h-screen flex items-center justify-center">
      <div className="card p-8 text-center max-w-3xl mx-auto animate-[slideUp_0.5s_ease-out]">
        {statusTransaction.status === "COMPLETED" ? (
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
        ) : statusTransaction.status === "FAILED" ? (
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
        ) : statusTransaction.status === "PENDING"
          ? (
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
              <p className="text-gray-500 m-4">Actualizando en {countdown} segundo{countdown <= 1 ? '' : 's'} ...</p>
            </div>
          )
          : (
            <div className="flex flex-col items-center">
              <p className="text-gray-500 m-4">Actualizando en {countdown} segundo{countdown <= 1 ? '' : 's'} ...</p>
            </div>
          )
        }

        <button onClick={() => navigate('/')} className="btn-primary">
          Volver a la tienda
        </button>
      </div>
    </div>
  )
}

export default PaymentResultPage;