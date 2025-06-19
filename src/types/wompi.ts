export interface WompiInitData {
  sessionId: string
  deviceData: {
    deviceID: string
    [key: string]: any
  }
  [key: string]: any
}

export interface WompiError {
  type: string
  message: string
  code?: string
  [key: string]: any
}

export interface WompiTokenResponse {
  data: {
    id: string
    [key: string]: any
  }
  status: boolean
  [key: string]: any
}

export interface WompiCardTokenRequest {
  number: string
  exp_month: string
  exp_year: string
  cvc: string
  card_holder: string
}