import { configureStore } from "@reduxjs/toolkit";
import transactionsReducer from '../slices/transactions/transactions-slice'
import blockReducer from '../slices/blocks/blocks-slice'


export const store = configureStore({
    reducer: {
        transactions: transactionsReducer,
        block: blockReducer
    },
    devTools: process.env.NODE_ENV === "development",
});

