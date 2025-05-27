export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  image: string
}

export interface CreditCard {
  number: string
  name: string
  expiry: string
  cvc: string
}

export interface DeliveryInfo {
  fullName: string
  address: string
  city: string
  zipCode: string
  phone: string
}

export interface PaymentSummary {
  productQuantity: number
  productPrice: number
  baseFee: number
  shippingFee: number
  total: number
}

export interface PaymentData {
  deviceId: string,
  sesionId: string,
}

export type CardType = "visa" | "mastercard" | "unknown"
