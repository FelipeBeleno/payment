import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PaymentData } from '../types/types'

const initialState: PaymentData = {
    deviceId: '',
    sesionId: '',
    tokenId: '',
}

const paymentDataSlice = createSlice({
    name: 'paymentData', // Corregido el nombre del slice
    initialState,
    reducers: {
        setPaymentData(state, action: PayloadAction<Partial<PaymentData>>) {
            // Usar Object.assign para actualizar solo los campos proporcionados
            return { ...state, ...action.payload };
        },
        setTokenId(state, action: PayloadAction<string>) {
            state.tokenId = action.payload;
        },
        resetPaymentData() {
            return initialState;
        }
    },
})

export const { setPaymentData, setTokenId, resetPaymentData } = paymentDataSlice.actions
export default paymentDataSlice.reducer