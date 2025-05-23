import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

interface PaymentResultProps {
  status: "success" | "failed"
  transactionId: string
  onBackToProduct: () => void
}

const PaymentResultPage = ({ status, transactionId, onBackToProduct }: PaymentResultProps) => {
  const navigate = useNavigate()
  const params = useParams()

  
  useEffect(() => {
    if (params.status && params.status !== status) {
      navigate(`/result/${status}`, { replace: true })
    }
  }, [status, params.status, navigate])

  return (
    <div className="store-container py-16 animate-[fadeIn_0.5s_ease-out] min-h-screen flex items-center justify-center">
      <div className="card p-8 text-center max-w-3xl mx-auto animate-[slideUp_0.5s_ease-out]">
        {status === "success" ? (
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
              <p className="font-mono font-medium">{transactionId}</p>
            </div>
          </div>
        ) : (
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
              <p className="font-mono font-medium">{transactionId}</p>
            </div>
          </div>
        )}

        <button onClick={onBackToProduct} className="btn-primary">
          Volver a la tienda
        </button>
      </div>
    </div>
  )
}

export default PaymentResultPage;
