import { configureStore } from '@reduxjs/toolkit'
import paymentDataSlice from '../slices/payment';
import statusTransactionSlice from '../slices/statusTransaction';

export const store = configureStore({
    reducer: {
        paymentData: paymentDataSlice,
        statusTransaction: statusTransactionSlice
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch