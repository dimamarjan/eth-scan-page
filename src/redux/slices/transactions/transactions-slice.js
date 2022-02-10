import { createSlice } from '@reduxjs/toolkit';
import transactionsOperations from './transactions-operations';

const initialState = {
	txn: [],
	status: 'idle',
	err: null,
};

const transactionsSlice = createSlice({
	name: 'transactions',
	initialState,

	extraReducers: {
		[transactionsOperations.getTransactions.fulfilled]: (state, action) => {
			state.txn = action.payload.data;
			state.status = 'fulfilled';
			state.err = null;
		},
		[transactionsOperations.getTransactions.pending]: (state) => {
			state.status = 'pending';
		},
		[transactionsOperations.getTransactions.rejected]: (state) => {
			state.status = null;
			state.err = 'ERROR';
		},

		[transactionsOperations.getTransactionsByFilter.fulfilled]: (
			state,
			action
		) => {
			state.txn = action.payload.data;
			state.status = 'fulfilled';
			state.err = null;
		},
		[transactionsOperations.getTransactionsByFilter.pending]: (state) => {
			state.status = 'pending';
		},
		[transactionsOperations.getTransactionsByFilter.rejected]: (state) => {
			state.status = null;
			state.err = 'ERROR';
		},
	},
});

export default transactionsSlice.reducer;
