import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { OrderStatus, StatusTransaction } from '../types/types'

const initialState: StatusTransaction = {
    status: '',
    orderId: ''
}

const statusTransactionSlice = createSlice({
    name: 'statusTransaction',
    initialState,
    reducers: {
        setStatusTransaction(state, action: PayloadAction<StatusTransaction>) {
            state.status = action.payload.status;
            state.orderId = action.payload.orderId;
        },
        updateTransactionStatus(state, action: PayloadAction<OrderStatus | ''>) {
            state.status = action.payload;
        },
        resetTransaction() {
            return initialState;
        }
    },
})

export const { setStatusTransaction, updateTransactionStatus, resetTransaction } = statusTransactionSlice.actions
export default statusTransactionSlice.reducer