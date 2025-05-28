export interface Product {
  _id: number
  name: string
  description: string
  price: number
  stock: number
  imageUrl: string
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
  email: string
}

export interface PaymentSummary {
  productQuantity: number
  productPrice: number
  total: number
}

export interface PaymentData {
  deviceId?: string,
  sesionId?: string,
  tokenId?: string,
}

export type CardType = "visa" | "mastercard" | "unknown"


export interface StatusTransaction {
  status: OrderStatus| ''
  orderId: ''
}


export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  COMPLETED = 'COMPLETED',
}