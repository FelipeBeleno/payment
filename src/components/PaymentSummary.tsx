import type { CreditCard, DeliveryInfo, PaymentSummary } from "../types/types"

interface PaymentSummaryProps {
  paymentSummary: PaymentSummary
  cardData: CreditCard
  deliveryData: DeliveryInfo
  productName: string
  onPayment: () => void
  onBack: () => void
  isProcessing: boolean
}

const PaymentSummaryComponent = ({
  paymentSummary,
  cardData,
  deliveryData,
  productName,
  onPayment,
  onBack,
  isProcessing,
}: PaymentSummaryProps) => {
  const { productQuantity, productPrice, baseFee, shippingFee, total } = paymentSummary

  
  const maskedCardNumber = `**** **** **** ${cardData.number.slice(-4)}`

  return (
    <div className="flex flex-col justify-center min-h-[60vh]">
      <div className="space-y-6">
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Resumen de compra</h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">
                {productName} x {productQuantity}
              </span>
              <span className="font-medium">${productPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Tarifa base</span>
              <span className="font-medium">${baseFee.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Envío</span>
              <span className="font-medium">${shippingFee.toFixed(2)}</span>
            </div>

            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-[#00D284]">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Información de pago</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Método de pago</p>
              <p className="font-medium">Tarjeta de crédito</p>
              <p>{maskedCardNumber}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Titular</p>
              <p className="font-medium">{cardData.name}</p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Dirección de envío</h3>

          <div>
            <p className="font-medium">{deliveryData.fullName}</p>
            <p>{deliveryData.address}</p>
            <p>
              {deliveryData.city}, {deliveryData.zipCode}
            </p>
            <p>Tel: {deliveryData.phone}</p>
          </div>
        </div>

        <div className="pt-4 flex space-x-4">
          <button
            type="button"
            onClick={onBack}
            disabled={isProcessing}
            className="btn-secondary w-1/2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Atrás
          </button>
          <button
            type="button"
            onClick={onPayment}
            disabled={isProcessing}
            className="btn-primary w-1/2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Procesando...
              </div>
            ) : (
              "Realizar pago"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentSummaryComponent
