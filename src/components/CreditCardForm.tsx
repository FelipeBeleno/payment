import { useState, FormEvent, ChangeEvent } from "react";
import { CreditCard, CardType } from "../types/types";
import CreditCardDisplay from "./CreditCardDisplay";
import { validateCreditCard, ValidationError } from "../utils/validation";

interface CreditCardFormProps {
  onSubmit: (data: CreditCard) => void;
  loaderTC: boolean;
}

const CreditCardForm = ({ onSubmit, loaderTC }: CreditCardFormProps) => {
  const [cardData, setCardData] = useState<CreditCard>({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });
  
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [cardType, setCardType] = useState<CardType>("unknown");
  const [focused, setFocused] = useState<keyof CreditCard | null>(null);

  // Detectar tipo de tarjeta basado en el número
  const detectCardType = (number: string): CardType => {
    const visaRegex = /^4/;
    const mastercardRegex = /^5[1-5]/;
    const cleanNumber = number.replace(/\s+/g, "");
    
    if (visaRegex.test(cleanNumber)) return "visa";
    if (mastercardRegex.test(cleanNumber)) return "mastercard";
    return "unknown";
  };

  // Formatear número de tarjeta con espacios cada 4 dígitos
  const formatCardNumber = (value: string): string => {
    const cleanValue = value.replace(/\s+/g, "").replace(/\D/g, "");
    const parts = [];
    
    for (let i = 0; i < cleanValue.length; i += 4) {
      parts.push(cleanValue.substring(i, i + 4));
    }
    
    return parts.join(" ");
  };

  // Formatear fecha de expiración
  const formatExpiry = (value: string): string => {
    const cleanValue = value.replace(/\D/g, "");
    
    if (cleanValue.length > 2) {
      return `${cleanValue.substring(0, 2)}/${cleanValue.substring(2, 4)}`;
    }
    
    return cleanValue;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // Aplicar formato según el campo
    if (name === "number") {
      formattedValue = formatCardNumber(value);
      setCardType(detectCardType(formattedValue));
    } else if (name === "expiry") {
      formattedValue = formatExpiry(value);
    } else if (name === "cvc") {
      formattedValue = value.replace(/\D/g, "").substring(0, 4);
    }
    
    setCardData((prev) => ({ ...prev, [name]: formattedValue }));
    
    // Limpiar errores del campo cuando el usuario escribe
    setErrors(errors.filter(error => error.field !== name));
  };

  const handleFocus = (field: keyof CreditCard) => {
    setFocused(field);
  };

  const handleBlur = () => {
    setFocused(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Validar datos de la tarjeta
    const validationErrors = validateCreditCard(cardData);
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    onSubmit(cardData);
  };

  // Obtener mensaje de error para un campo específico
  const getErrorMessage = (field: string): string => {
    const error = errors.find(err => err.field === field);
    return error ? error.message : "";
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <CreditCardDisplay
          cardData={cardData}
          cardType={cardType}
          focused={focused}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label htmlFor="card-number" className="form-label">
            Número de tarjeta
          </label>
          <input
            id="card-number"
            type="text"
            name="number"
            className={`form-input ${getErrorMessage("number") ? "border-red-500" : ""}`}
            placeholder="1234 5678 9012 3456"
            value={cardData.number}
            onChange={handleChange}
            onFocus={() => handleFocus("number")}
            onBlur={handleBlur}
            maxLength={19}
            autoComplete="cc-number"
          />
          {getErrorMessage("number") && (
            <p className="text-red-500 text-sm mt-1">{getErrorMessage("number")}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="card-name" className="form-label">
            Nombre del titular
          </label>
          <input
            id="card-name"
            type="text"
            name="name"
            className={`form-input ${getErrorMessage("name") ? "border-red-500" : ""}`}
            placeholder="NOMBRE APELLIDO"
            value={cardData.name}
            onChange={handleChange}
            onFocus={() => handleFocus("name")}
            onBlur={handleBlur}
            autoComplete="cc-name"
          />
          {getErrorMessage("name") && (
            <p className="text-red-500 text-sm mt-1">{getErrorMessage("name")}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="card-expiry" className="form-label">
              Fecha de expiración
            </label>
            <input
              id="card-expiry"
              type="text"
              name="expiry"
              className={`form-input ${getErrorMessage("expiry") ? "border-red-500" : ""}`}
              placeholder="MM/YY"
              value={cardData.expiry}
              onChange={handleChange}
              onFocus={() => handleFocus("expiry")}
              onBlur={handleBlur}
              maxLength={5}
              autoComplete="cc-exp"
            />
            {getErrorMessage("expiry") && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage("expiry")}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="card-cvc" className="form-label">
              CVC
            </label>
            <input
              id="card-cvc"
              type="text"
              name="cvc"
              className={`form-input ${getErrorMessage("cvc") ? "border-red-500" : ""}`}
              placeholder="123"
              value={cardData.cvc}
              onChange={handleChange}
              onFocus={() => handleFocus("cvc")}
              onBlur={handleBlur}
              maxLength={4}
              autoComplete="cc-csc"
            />
            {getErrorMessage("cvc") && (
              <p className="text-red-500 text-sm mt-1">{getErrorMessage("cvc")}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loaderTC}
        >
          {loaderTC ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </span>
          ) : (
            "Continuar"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreditCardForm;