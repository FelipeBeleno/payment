import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PaymentData } from '../types/types'


const initialState: PaymentData = {
    deviceId: '',
    sesionId: '',
    tokenId: '',
}

const paymentDataSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setPaymentData(state, action: PayloadAction<PaymentData>) {
            state.deviceId = action.payload.deviceId
            state.sesionId = action.payload.sesionId
        },
        setTokenId(state, action: PayloadAction<string>) {
            state.tokenId = action.payload
        }

    },
})

export const { setPaymentData, setTokenId } = paymentDataSlice.actions
export default paymentDataSlice.reducer