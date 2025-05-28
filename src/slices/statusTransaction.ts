import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StatusTransaction } from '../types/types'


const initialState: StatusTransaction = {
    status: '',
    orderId: ''
}

const statusTransactionSlice = createSlice({
    name: 'statusTransaction',
    initialState,
    reducers: {
        setStatusTransaction(state, action: PayloadAction<StatusTransaction>) {
            state.status = action.payload.status
            state.orderId = action.payload.orderId
        }

    },
})

export const { setStatusTransaction } = statusTransactionSlice.actions
export default statusTransactionSlice.reducer