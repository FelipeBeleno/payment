import type React from "react"

import { useState } from "react"
import type { DeliveryInfo } from "../types/types"
import CountrySelect, { countries } from "./CountrySelect"

interface DeliveryFormProps {
  onSubmit: (data: DeliveryInfo) => void
  onBack: () => void
}

const DeliveryForm = ({ onSubmit, onBack }: DeliveryFormProps) => {
  const [deliveryData, setDeliveryData] = useState<DeliveryInfo>({
    fullName: "",
    address: "",
    city: "",
    zipCode: "",
    phone: "",
  })
  const [selectedCountry, setSelectedCountry] = useState(countries[0]) 
  const [errors, setErrors] = useState<Partial<Record<keyof DeliveryInfo, string>>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    
    if (name === "phone") {
      
      const formattedValue = value.replace(/\D/g, "")
      setDeliveryData({
        ...deliveryData,
        [name]: formattedValue,
      })
    } else if (name === "zipCode") {
      
      const formattedValue = value.replace(/\D/g, "")
      setDeliveryData({
        ...deliveryData,
        [name]: formattedValue,
      })
    } else {
      setDeliveryData({
        ...deliveryData,
        [name]: value,
      })
    }

    
    if (errors[name as keyof DeliveryInfo]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors: Partial<Record<keyof DeliveryInfo, string>> = {}

    
    if (!deliveryData.fullName.trim()) {
      newErrors.fullName = "El nombre completo es obligatorio"
    } else if (deliveryData.fullName.trim().length < 3) {
      newErrors.fullName = "El nombre debe tener al menos 3 caracteres"
    }

    
    if (!deliveryData.address.trim()) {
      newErrors.address = "La dirección es obligatoria"
    } else if (deliveryData.address.trim().length < 5) {
      newErrors.address = "La dirección debe ser más detallada"
    }

    
    if (!deliveryData.city.trim()) {
      newErrors.city = "La ciudad es obligatoria"
    }

    
    if (!deliveryData.zipCode.trim()) {
      newErrors.zipCode = "El código postal es obligatorio"
    } else if (!/^\d{5}$/.test(deliveryData.zipCode)) {
      newErrors.zipCode = "El código postal debe tener 5 dígitos"
    }

    
    if (!deliveryData.phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio"
    } else if (!/^\d{10}$/.test(deliveryData.phone)) {
      newErrors.phone = "El teléfono debe tener 10 dígitos"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      
      const fullPhoneNumber = `${selectedCountry.dialCode} ${deliveryData.phone}`
      onSubmit({
        ...deliveryData,
        phone: fullPhoneNumber,
      })
    }
  }

  return (
    <div className="flex flex-col justify-center min-h-[60vh]">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-lg font-medium mb-4">Información de entrega</div>

        <div>
          <label htmlFor="fullName" className="form-label">
            Nombre completo
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={deliveryData.fullName}
            onChange={handleChange}
            placeholder="Nombre y apellidos"
            className={`form-input ${errors.fullName ? "border-red-500" : ""}`}
          />
          {errors.fullName && <p className="error-text">{errors.fullName}</p>}
        </div>

        <div>
          <label htmlFor="address" className="form-label">
            Dirección
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={deliveryData.address}
            onChange={handleChange}
            placeholder="Calle, número, colonia"
            className={`form-input ${errors.address ? "border-red-500" : ""}`}
          />
          {errors.address && <p className="error-text">{errors.address}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="form-label">
              Ciudad
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={deliveryData.city}
              onChange={handleChange}
              placeholder="Ciudad"
              className={`form-input ${errors.city ? "border-red-500" : ""}`}
            />
            {errors.city && <p className="error-text">{errors.city}</p>}
          </div>

          <div>
            <label htmlFor="zipCode" className="form-label">
              Código postal
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={deliveryData.zipCode}
              onChange={handleChange}
              placeholder="12345"
              maxLength={5}
              className={`form-input ${errors.zipCode ? "border-red-500" : ""}`}
            />
            {errors.zipCode && <p className="error-text">{errors.zipCode}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="form-label">
            Teléfono
          </label>
          <div className="flex">
            <CountrySelect selectedCountry={selectedCountry} onChange={setSelectedCountry} />
            <input
              type="tel"
              id="phone"
              name="phone"
              value={deliveryData.phone}
              onChange={handleChange}
              placeholder="1234567890"
              maxLength={10}
              className={`form-input rounded-l-none ${errors.phone ? "border-red-500" : ""}`}
            />
          </div>
          {errors.phone && <p className="error-text">{errors.phone}</p>}
        </div>

        <div className="pt-4 flex space-x-4">
          <button type="button" onClick={onBack} className="btn-secondary w-1/2">
            Atrás
          </button>
          <button type="submit" className="btn-primary w-1/2">
            Continuar
          </button>
        </div>
      </form>
    </div>
  )
}

export default DeliveryForm
