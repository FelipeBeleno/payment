import { useState } from "react"
import type { CreditCard, DeliveryInfo, PaymentSummary } from "../types/types"
import CreditCardForm from "./CreditCardForm"
import DeliveryForm from "./DeliveryForm"
import PaymentSummaryComponent from "./PaymentSummary"

interface PaymentModalProps {
  onClose: () => void
  paymentSummary: PaymentSummary
  onPaymentComplete: (success: boolean) => void
  productName: string
}

const PaymentModal = ({ onClose, paymentSummary, onPaymentComplete, productName }: PaymentModalProps) => {


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
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [animation, setAnimation] = useState("")

  const handleCardSubmit = async (data: CreditCard) => {

    setLoaderTC(true)
    setCardData(data)
    setAnimation("slideOut")



    // TOKENISAR LA TARJETA

    const request = await fetch('https://api-sandbox.co.uat.wompi.dev/v1/tokens/cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application',
        'Authorization': `Bearer pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7`
      },
      body: JSON.stringify({
        "number": data.number.replace(/ /g, ''),
        "exp_month": data.expiry.split("/")[0].trim(),
        "exp_year": data.expiry.split("/")[1].trim(),
        "cvc": data.cvc,
        "card_holder": data.name,
      })
    })

    const response = await request.json()

    if (!request.ok) {
      console.error("Error al tokenizar la tarjeta:", response)
      setLoaderTC(false)
      return
    }

    if (response.data) {
      setAnimation("slideOut")
      setTimeout(() => {
        setStep("delivery")
        setAnimation("slideIn")
      }, 300)
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
    setIsProcessing(true)


    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))


      const isSuccessful = Math.random() < 0.9

      if (isSuccessful) {
        onPaymentComplete(true)
      } else {
        onPaymentComplete(false)
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error)
      onPaymentComplete(false)
    } finally {
      setIsProcessing(false)
    }
  }

  const goBack = () => {
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
                productName={productName}
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
