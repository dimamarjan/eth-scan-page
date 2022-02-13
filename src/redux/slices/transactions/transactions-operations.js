import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const getTransactions = createAsyncThunk("transactions/get", async () => {
  const { data } = await axios.get(
    "https://eth-node-server.herokuapp.com/api/transactions"
  );
  return data;
});

const getTransactionsByFilter = createAsyncThunk(
  "transactionsByHash/get",
  async (credentials) => {
    const { data } = await axios.post(
      "https://eth-node-server.herokuapp.com/api/transactions",
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
