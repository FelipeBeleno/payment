import type React from "react"

import { useState, useEffect } from "react"
import type { CreditCard, CardType } from "../types/types"
import CreditCardDisplay from "./CreditCardDisplay"

interface CreditCardFormProps {
  onSubmit: (data: CreditCard) => void,
  loaderTC: boolean
}

const CreditCardForm = ({ onSubmit, loaderTC }: CreditCardFormProps) => {
  const [cardData, setCardData] = useState<CreditCard>({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof CreditCard, string>>>({})
  const [cardType, setCardType] = useState<CardType>("unknown")
  const [isFlipped, setIsFlipped] = useState(false)


  useEffect(() => {
    const number = cardData.number.replace(/\s/g, "")

    if (number.startsWith("4")) {
      setCardType("visa")
    } else if (number.startsWith("5")) {
      setCardType("mastercard")
    } else {
      setCardType("unknown")
    }
  }, [cardData.number])

  const formatCardNumber = (value: string) => {

    let v = value.replace(/\D/g, "")


    v = v.substring(0, 16)


    const parts = []
    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.substring(i, i + 4))
    }

    return parts.join(" ")
  }

  const formatExpiry = (value: string) => {

    const v = value.replace(/\D/g, "")

    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return v
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target


    if (name === "number") {

      const numericValue = value.replace(/\D/g, "")
      const isVisa = numericValue.startsWith("4")
      const isMastercard = numericValue.startsWith("5")

      if (numericValue.length > 0 && !isVisa && !isMastercard) {
        setErrors({
          ...errors,
          number: "Solo se aceptan tarjetas Visa o Mastercard",
        })
        return
      }

      setCardData({
        ...cardData,
        [name]: formatCardNumber(value),
      })
    } else if (name === "expiry") {
      setCardData({
        ...cardData,
        [name]: formatExpiry(value),
      })
    } else if (name === "cvc") {

      const numericValue = value.replace(/\D/g, "").substring(0, 3)
      setCardData({
        ...cardData,
        [name]: numericValue,
      })
    } else {
      setCardData({
        ...cardData,
        [name]: value,
      })
    }


    if (errors[name as keyof CreditCard]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.name === "cvc") {
      setIsFlipped(true)
    } else {
      setIsFlipped(false)
    }
  }

  const handleBlur = () => {
    setIsFlipped(false)
  }

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CreditCard, string>> = {}


    const cardNumber = cardData.number.replace(/\s/g, "")
    if (cardNumber.length !== 16) {
      newErrors.number = "El número de tarjeta debe tener 16 dígitos"
    } else if (cardType === "unknown") {
      newErrors.number = "Solo se aceptan tarjetas Visa o Mastercard"
    }


    if (!cardData.name.trim()) {
      newErrors.name = "El nombre es obligatorio"
    }


    if (!/^\d{2}\/\d{2}$/.test(cardData.expiry)) {
      newErrors.expiry = "Formato inválido (MM/YY)"
    } else {
      const [month, year] = cardData.expiry.split("/")
      const currentYear = new Date().getFullYear() % 100
      const currentMonth = new Date().getMonth() + 1

      if (Number(month) < 1 || Number(month) > 12) {
        newErrors.expiry = "Mes inválido"
      } else if (Number(year) < currentYear || (Number(year) === currentYear && Number(month) < currentMonth)) {
        newErrors.expiry = "La tarjeta ha expirado"
      }
    }


    if (!/^\d{3}$/.test(cardData.cvc)) {
      newErrors.cvc = "El CVC debe tener 3 dígitos"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      
      onSubmit(cardData)
    }
  }

  return (
    <div className="flex flex-col justify-center min-h-[60vh]">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-medium">Información de la tarjeta</div>
          <div className="flex space-x-2">
            <div
              className={`w-12 h-8 rounded border-2 flex items-center justify-center ${cardType === "visa" ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-100"}`}
            >
              <svg width="32" height="10" viewBox="0 0 750 471" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="750" height="471" fill="white" rx="8" />
                <path d="M278.197 334.228L311.353 136.81H366.56L333.396 334.228H278.197Z" fill="#1A1F71" />
                <path
                  d="M524.306 142.687C511.997 137.85 492.783 132.62 469.104 132.62C413.15 132.62 373.311 161.298 373.066 202.934C372.83 233.193 401.523 249.909 422.884 259.819C444.74 269.973 451.952 276.52 451.952 285.422C451.698 299.333 434.444 305.634 418.445 305.634C396.097 305.634 384.028 302.199 364.07 293.032L356.365 289.35L348.415 334.476C363.333 341.515 391.782 347.736 421.401 348.001C481.207 348.001 520.3 319.813 520.791 275.511C521.036 251.427 506.06 232.928 471.832 216.954C451.706 206.8 439.392 199.761 439.392 189.116C439.637 179.453 450.714 169.789 473.807 169.789C492.783 169.789 506.551 173.962 517.138 178.381L522.602 180.844L530.552 137.095L524.306 142.687Z"
                  fill="#1A1F71"
                />
                <path
                  d="M661.615 136.81H620.283C607.974 136.81 598.869 140.491 593.897 154.402L508.231 334.228H568.037C568.037 334.228 578.624 306.532 580.842 300.977C587.314 300.977 646.384 300.977 654.579 300.977C656.306 308.261 662.106 334.228 662.106 334.228H715.333L661.615 136.81ZM597.851 264.238C602.333 252.929 622.291 200.252 622.291 200.252C621.8 201.261 626.772 188.107 629.726 179.944L633.662 198.443C633.662 198.443 645.731 254.138 647.949 264.238H597.851Z"
                  fill="#1A1F71"
                />
                <path
                  d="M233.302 136.81L177.857 270.284L172.394 244.317C162.789 213.088 135.077 179.453 104.166 162.47L154.755 334.228H215.307L301.748 136.81H233.302Z"
                  fill="#1A1F71"
                />
                <path
                  d="M131.141 136.81H39.1741L38.1924 142.195C113.147 159.178 162.298 197.544 183.32 244.317L166.066 154.402C162.789 140.491 148.305 137.095 131.141 136.81Z"
                  fill="#F7B600"
                />
              </svg>
            </div>
            <div
              className={`w-12 h-8 rounded border-2 flex items-center justify-center ${cardType === "mastercard" ? "border-orange-500 bg-orange-50" : "border-gray-300 bg-gray-100"}`}
            >
              <svg width="32" height="20" viewBox="0 0 750 471" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M434.008 235.5C434.008 323.874 362.382 395.5 274.008 395.5C185.634 395.5 114.008 323.874 114.008 235.5C114.008 147.126 185.634 75.5 274.008 75.5C362.382 75.5 434.008 147.126 434.008 235.5Z"
                  fill="#EB001B"
                />
                <path
                  d="M636.008 235.5C636.008 323.874 564.382 395.5 476.008 395.5C387.634 395.5 316.008 323.874 316.008 235.5C316.008 147.126 387.634 75.5 476.008 75.5C564.382 75.5 636.008 147.126 636.008 235.5Z"
                  fill="#F79E1B"
                />
                <path
                  d="M375.008 142.304C342.124 173.958 322.008 203.304 322.008 235.5C322.008 267.696 342.124 297.042 375.008 328.696C407.892 297.042 428.008 267.696 428.008 235.5C428.008 203.304 407.892 173.958 375.008 142.304Z"
                  fill="#FF5F00"
                />
              </svg>
            </div>
          </div>
        </div>

        <CreditCardDisplay cardData={cardData} cardType={cardType} isFlipped={isFlipped} />

        <div>
          <label htmlFor="number" className="form-label">
            Número de tarjeta
          </label>
          <input
            type="text"
            id="number"
            name="number"
            value={cardData.number}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className={`form-input ${errors.number ? "border-red-500" : ""}`}
          />
          {errors.number && <p className="error-text">{errors.number}</p>}
        </div>

        <div>
          <label htmlFor="name" className="form-label">
            Nombre en la tarjeta
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={cardData.name}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="NOMBRE APELLIDO"
            className={`form-input ${errors.name ? "border-red-500" : ""}`}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiry" className="form-label">
              Fecha de expiración
            </label>
            <input
              type="text"
              id="expiry"
              name="expiry"
              value={cardData.expiry}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="MM/YY"
              maxLength={5}
              className={`form-input ${errors.expiry ? "border-red-500" : ""}`}
            />
            {errors.expiry && <p className="error-text">{errors.expiry}</p>}
          </div>

          <div>
            <label htmlFor="cvc" className="form-label">
              CVC
            </label>
            <input
              type="text"
              id="cvc"
              name="cvc"
              value={cardData.cvc}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="123"
              maxLength={3}
              className={`form-input ${errors.cvc ? "border-red-500" : ""}`}
            />
            {errors.cvc && <p className="error-text">{errors.cvc}</p>}
          </div>
        </div>

        <div className="pt-4">
          <button type="submit" disabled={loaderTC} className="btn-primary w-full">
            Continuar
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreditCardForm
