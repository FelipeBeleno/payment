import { configureStore } from '@reduxjs/toolkit'
import paymentDataSlice from '../slices/payment';
import statusTransactionSlice from '../slices/statusTransaction';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

export const store = configureStore({
    reducer: {
        paymentData: paymentDataSlice,
        statusTransaction: statusTransactionSlice
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                // Ignorar acciones no serializables si es necesario
                // ignoredActions: ['some/action'],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production',
})

// Tipos inferidos del store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Hooks tipados para usar en componentes
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;