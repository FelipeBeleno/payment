import { CreditCard, DeliveryInfo } from "../types/types";

export interface ValidationError {
  field: string;
  message: string;
}

export const validateCreditCard = (card: CreditCard): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Validar número de tarjeta (solo dígitos y espacios)
  const cardNumberClean = card.number.replace(/\s/g, '');
  if (!cardNumberClean || !/^\d{16}$/.test(cardNumberClean)) {
    errors.push({ field: 'number', message: 'Número de tarjeta inválido. Debe tener 16 dígitos.' });
  }
  
  // Validar nombre del titular
  if (!card.name || card.name.trim().length < 3) {
    errors.push({ field: 'name', message: 'Nombre del titular requerido (mínimo 3 caracteres).' });
  }
  
  // Validar fecha de expiración (formato MM/YY)
  if (!card.expiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) {
    errors.push({ field: 'expiry', message: 'Fecha de expiración inválida. Use formato MM/YY.' });
  } else {
    // Verificar que la fecha no esté expirada
    const [month, year] = card.expiry.split('/');
    const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const currentDate = new Date();
    
    if (expiryDate < currentDate) {
      errors.push({ field: 'expiry', message: 'La tarjeta ha expirado.' });
    }
  }
  
  // Validar CVC (3 o 4 dígitos)
  if (!card.cvc || !/^\d{3,4}$/.test(card.cvc)) {
    errors.push({ field: 'cvc', message: 'CVC inválido. Debe tener 3 o 4 dígitos.' });
  }
  
  return errors;
};

export const validateDeliveryInfo = (delivery: DeliveryInfo): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Validar nombre completo
  if (!delivery.fullName || delivery.fullName.trim().length < 3) {
    errors.push({ field: 'fullName', message: 'Nombre completo requerido (mínimo 3 caracteres).' });
  }
  
  // Validar dirección
  if (!delivery.address || delivery.address.trim().length < 5) {
    errors.push({ field: 'address', message: 'Dirección requerida (mínimo 5 caracteres).' });
  }
  
  // Validar ciudad
  if (!delivery.city || delivery.city.trim().length < 3) {
    errors.push({ field: 'city', message: 'Ciudad requerida.' });
  }
  
  // Validar código postal
  if (!delivery.zipCode || !/^\d{5,6}$/.test(delivery.zipCode)) {
    errors.push({ field: 'zipCode', message: 'Código postal inválido.' });
  }
  
  // Validar teléfono (solo dígitos, mínimo 7)
  if (!delivery.phone || !/^\d{7,15}$/.test(delivery.phone)) {
    errors.push({ field: 'phone', message: 'Teléfono inválido (solo números, 7-15 dígitos).' });
  }
  
  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!delivery.email || !emailRegex.test(delivery.email)) {
    errors.push({ field: 'email', message: 'Email inválido.' });
  }
  
  return errors;
};