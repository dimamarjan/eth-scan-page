import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const getTransactions = createAsyncThunk('transactions/get', async () => {
	const { data } = await axios.get('http://localhost:3030/api/transactions');
	return data;
});

const getTransactionsByFilter = createAsyncThunk(
	'transactionsByHash/get',
	async (credentials) => {
		const { data } = await axios.post(
			'http://localhost:3030/api/transactions',
			credentials
		);
		return data;
	}
);

const operations = {
	getTransactions,
	getTransactionsByFilter,
};
export default operations;
