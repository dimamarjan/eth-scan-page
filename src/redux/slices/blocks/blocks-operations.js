import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const getBlock = createAsyncThunk("block/get", async () => {
    const { data } = await axios.get('http://localhost:3030/api/blocks');
    return data;
});

const operations = {
    getBlock,
};
export default operations;