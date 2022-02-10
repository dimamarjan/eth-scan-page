import { createSlice } from "@reduxjs/toolkit";
import blockOperations from "./blocks-operations";

const initialState = {
    block: [],
    status: "idle",
    err: null,
};

const blockSlice = createSlice({
    name: "block",
    initialState,

    extraReducers: {
        [blockOperations.getBlock.fulfilled]: (state, action) => {
            state.block = action.payload.data.blockNumber;
            state.status = "fulfilled";
            state.err = null;
        },
        [blockOperations.getBlock.pending]: (state) => {
            state.status = "pending";
        },
        [blockOperations.getBlock.rejected]: (state) => {
            state.status = null;
            state.err = "ERROR";
        },
    },
});

export default blockSlice.reducer;