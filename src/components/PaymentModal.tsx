import { useState } from "react"
import type { CreditCard, DeliveryInfo, PaymentSummary, Product } from "../types/types"
import CreditCardForm from "./CreditCardForm"
import DeliveryForm from "./DeliveryForm"
import PaymentSummaryComponent from "./PaymentSummary"
import { setTokenId } from "../slices/payment"
import { setStatusTransaction } from "../slices/statusTransaction"
import api from "../utils/axiosConfig"
import { config } from "../utils/config"
import { WompiCardTokenRequest, WompiTokenResponse } from "../types/wompi"
import { useAppDispatch, useAppSelector } from "../store/store"
import { ApiError } from "../utils/errorHandler"

interface PaymentModalProps {
  onClose: () => void
  paymentSummary: PaymentSummary
  onPaymentComplete: (success: boolean) => void
  product: Product
}

const PaymentModal = ({ onClose, paymentSummary, onPaymentComplete, product }: PaymentModalProps) => {
  const paymentData = useAppSelector(state => state.paymentData)
  const dispatch = useAppDispatch();

  const [loaderTC, setLoaderTC] = useState(false)
  const [step, setStep] = useState<"card" | "delivery" | "summary">("card")
  const [cardData, setCardData] = useState<CreditCard>({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  })
  const [deliveryData, setDeliveryData] = useState<DeliveryInfo>({
    fullName: "",
    address: "",
    city: "",
    zipCode: "",
    phone: "",
    email: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [animation, setAnimation] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleCardSubmit = async (data: CreditCard) => {
    setError(null)
    setLoaderTC(true)
    setCardData(data)
    setAnimation("slideOut")

    try {
      const cardRequest: WompiCardTokenRequest = {
        number: data.number.replace(/ /g, ''),
        exp_month: data.expiry.split("/")[0].trim(),
        exp_year: data.expiry.split("/")[1].trim(),
        cvc: data.cvc,
        card_holder: data.name,
      }

      const response = await api.post<WompiTokenResponse>(config.WOMPI_API_URL, cardRequest, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.WOMPI_PUBLIC_KEY}`
        },
      })
      
      if (response.data?.data?.id) {
        dispatch(setTokenId(response.data.data.id))
        
        setAnimation("slideOut")
        setTimeout(() => {
          setStep("delivery")
          setAnimation("slideIn")
        }, 300)
      } else {
        setError("No se pudo procesar la tarjeta. Verifica los datos e intenta nuevamente.")
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Error al procesar la tarjeta. Intenta nuevamente.")
      console.error("Error al tokenizar la tarjeta:", err)
    } finally {
      setLoaderTC(false)
    }
  }

  const handleDeliverySubmit = (data: DeliveryInfo) => {
    setDeliveryData(data)
    setAnimation("slideOut")
    setTimeout(() => {
      setStep("summary")
      setAnimation("slideIn")
    }, 300)
  }

  const handlePayment = async () => {
    setError(null)
    setIsProcessing(true)

    try {
      const orderData = {
        deliveryInfo: deliveryData,
        paymentData: paymentData,
        products: [
          {
            productId: product._id,
            quantity: paymentSummary.productQuantity,
            priceU: product.price,
            priceT: paymentSummary.total,
            name: product.name,
          }
        ],
        feeOrder: paymentSummary.total,
        feeDelivery: 8500,
        feeBought: paymentSummary.total - 8500,
      }

      const response = await api.post('/order', orderData)

      if (response.data) {
        dispatch(setStatusTransaction({
          status: response.data.status,
          orderId: response.data._id
        }))

        onPaymentComplete(true)
      } else {
        setError("No se pudo procesar el pago. Intenta nuevamente.")
        onPaymentComplete(false)
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Error al procesar el pago. Intenta nuevamente.")
      console.error("Error al procesar el pago:", err)
      onPaymentComplete(false)
    } finally {
      setIsProcessing(false)
    }
  }

  const goBack = () => {
    setError(null)
    setAnimation("slideOutReverse")
    setTimeout(() => {
      if (step === "delivery") {
        setStep("card")
      } else if (step === "summary") {
        setStep("delivery")
      }
      setAnimation("slideInReverse")
    }, 300)
  }

  const getAnimationClasses = () => {
    let classes = "transition-all duration-300"
    if (animation === "slideIn") {
      classes += " animate-[slideIn_0.3s_ease-out]"
    } else if (animation === "slideOut") {
      classes += " animate-[slideOut_0.3s_ease-out]"
    } else if (animation === "slideInReverse") {
      classes += " animate-[slideInReverse_0.3s_ease-out]"
    } else if (animation === "slideOutReverse") {
      classes += " animate-[slideOutReverse_0.3s_ease-out]"
    }
    return classes
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {step === "card" && "Información de pago"}
              {step === "delivery" && "Información de entrega"}
              {step === "summary" && "Resumen de pago"}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            </div>
          )}

          <div className="steps-indicator">
            <div
              className={`step ${step === "card" ? "active" : ""} ${step === "delivery" || step === "summary" ? "completed" : ""}`}
            >
              <div className="step-circle">1</div>
              <div>Pago</div>
            </div>
            <div className={`step ${step === "delivery" ? "active" : ""} ${step === "summary" ? "completed" : ""}`}>
              <div className="step-circle">2</div>
              <div>Entrega</div>
            </div>
            <div className={`step ${step === "summary" ? "active" : ""}`}>
              <div className="step-circle">3</div>
              <div>Confirmar</div>
            </div>
          </div>

          <div className={getAnimationClasses()}>
            {step === "card" && <CreditCardForm onSubmit={handleCardSubmit} loaderTC={loaderTC} />}

            {step === "delivery" && <DeliveryForm onSubmit={handleDeliverySubmit} onBack={goBack} />}

            {step === "summary" && (
              <PaymentSummaryComponent
                paymentSummary={paymentSummary}
                cardData={cardData}
                deliveryData={deliveryData}
                productName={product.name}
                onPayment={handlePayment}
                onBack={goBack}
                isProcessing={isProcessing}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal
