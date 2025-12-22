import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderAPI } from "../../api/order.api";
import { normalizeOrder } from "../../utils/normalize";

// fetch my orders
export const fetchMyOrders = createAsyncThunk(
    "order/fetchMyOrders",
    async (_, { rejectWithValue }) => {
        try {
            const data = await orderAPI.listMyOrders();
            return Array.isArray(data) ? data.map(normalizeOrder) : [];
        } catch (err) {
            return rejectWithValue(err?.message || err);
        }
    }
);

// fetch single order
export const fetchOrderDetails = createAsyncThunk(
    "order/fetchOrderDetails",
    async (id, { rejectWithValue }) => {
        try {
            const data = await orderAPI.getOrderDetails(id);
            return data;
        } catch (err) {
            return rejectWithValue(err?.message || err);
        }
    }
);

const orderSlice = createSlice({
    name: "order",
    initialState: {
        orders: [],
        single: null,
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.single = action.payload;
            })
            .addCase(fetchOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default orderSlice.reducer;
