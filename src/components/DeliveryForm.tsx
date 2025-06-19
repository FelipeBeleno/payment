import { useState, FormEvent, ChangeEvent } from "react";
import { DeliveryInfo } from "../types/types";
import { validateDeliveryInfo, ValidationError } from "../utils/validation";

interface DeliveryFormProps {
  onSubmit: (data: DeliveryInfo) => void;
  onBack: () => void;
}

const DeliveryForm = ({ onSubmit, onBack }: DeliveryFormProps) => {
  const [deliveryData, setDeliveryData] = useState<DeliveryInfo>({
    fullName: "",
    address: "",
    city: "",
    zipCode: "",
    phone: "",
    email: "",
  });
  
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Formateo específico para ciertos campos
    let formattedValue = value;
    if (name === "phone") {
      formattedValue = value.replace(/\D/g, "").substring(0, 15);
    } else if (name === "zipCode") {
      formattedValue = value.replace(/\D/g, "").substring(0, 6);
    }
    
    setDeliveryData((prev) => ({ ...prev, [name]: formattedValue }));
    
    // Limpiar errores del campo cuando el usuario escribe
    setErrors(errors.filter(error => error.field !== name));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Validar datos de entrega
    const validationErrors = validateDeliveryInfo(deliveryData);
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    onSubmit(deliveryData);
  };

  // Obtener mensaje de error para un campo específico
  const getErrorMessage = (field: string): string => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : "";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-group">
        <label htmlFor="fullName" className="form-label">
          Nombre completo
        </label>
        <input
          id="fullName"
          type="text"
          name="fullName"
          className={`form-input ${getErrorMessage("fullName") ? "border-red-500" : ""}`}
          placeholder="Nombre y apellidos"
          value={deliveryData.fullName}
          onChange={handleChange}
          autoComplete="name"
        />
        {getErrorMessage("fullName") && (
          <p className="text-red-500 text-sm mt-1">{getErrorMessage("fullName")}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="address" className="form-label">
          Dirección
        </label>
        <input
          id="address"
          type="text"
          name="address"
          className={`form-input ${getErrorMessage("address") ? "border-red-500" : ""}`}
          placeholder="Calle, número, piso, etc."
          value={deliveryData.address}
          onChange={handleChange}
          autoComplete="street-address"
        />
        {getErrorMessage("address") && (
          <p className="text-red-500 text-sm mt-1">{getErrorMessage("address")}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label htmlFor="city" className="form-label">
            Ciudad
          </label>
          <input
            id="city"
            type="text"
            name="city"
            className={`form-input ${getErrorMessage("city") ? "border-red-500" : ""}`}
            placeholder="Ciudad"
            value={deliveryData.city}
            onChange={handleChange}
            autoComplete="address-level2"
          />
          {getErrorMessage("city") && (
            <p className="text-red-500 text-sm mt-1">{getErrorMessage("city")}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="zipCode" className="form-label">
            Código postal
          </label>
          <input
            id="zipCode"
            type="text"
            name="zipCode"
            className={`form-input ${getErrorMessage("zipCode") ? "border-red-500" : ""}`}
            placeholder="Código postal"
            value={deliveryData.zipCode}
            onChange={handleChange}
            autoComplete="postal-code"
          />
          {getErrorMessage("zipCode") && (
            <p className="text-red-500 text-sm mt-1">{getErrorMessage("zipCode")}</p>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="phone" className="form-label">
          Teléfono
        </label>
        <input
          id="phone"
          type="tel"
          name="phone"
          className={`form-input ${getErrorMessage("phone") ? "border-red-500" : ""}`}
          placeholder="Número de teléfono"
          value={deliveryData.phone}
          onChange={handleChange}
          autoComplete="tel"
        />
        {getErrorMessage("phone") && (
          <p className="text-red-500 text-sm mt-1">{getErrorMessage("phone")}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          name="email"
          className={`form-input ${getErrorMessage("email") ? "border-red-500" : ""}`}
          placeholder="correo@ejemplo.com"
          value={deliveryData.email}
          onChange={handleChange}
          autoComplete="email"
        />
        {getErrorMessage("email") && (
          <p className="text-red-500 text-sm mt-1">{getErrorMessage("email")}</p>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onBack}
          className="btn-secondary"
        >
          Atrás
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          Continuar
        </button>
      </div>
    </form>
  );
};

export default DeliveryForm;