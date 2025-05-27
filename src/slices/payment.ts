import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PaymentData } from '../types/types'


const initialState: PaymentData = {
    deviceId: '',
    sesionId: '',
}

const paymentDataSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setPaymentData(state, action: PayloadAction<PaymentData>) {
            state.deviceId = action.payload.deviceId
            state.sesionId = action.payload.sesionId
        },

    },
})

export const { setPaymentData } = paymentDataSlice.actions
export default paymentDataSlice.reducer