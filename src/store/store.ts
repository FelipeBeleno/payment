import { configureStore } from '@reduxjs/toolkit'
import paymentDataSlice from '../slices/payment';

export const store = configureStore({
    reducer: {
        paymentData: paymentDataSlice
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch