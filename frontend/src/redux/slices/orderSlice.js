import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orderAPI from "../../mocks/order";
import { normalizeOrder } from "../../utils/normalize";

// fetch my orders
export const fetchMyOrders = createAsyncThunk(
    "order/fetchMyOrders",
    async (_, { rejectWithValue }) => {
        try {
            const data = await orderAPI.listMyOrders();
            return Array.isArray(data) ? data.map(normalizeOrder) : [];
        } catch (err) {
            return rejectWithValue(
                err?.response?.data || err?.message || err
            );
        }
    }
);

// fetch single order details
export const fetchOrderDetails = createAsyncThunk(
    "order/fetchOrderDetails",
    async (id, { rejectWithValue }) => {
        try {
            const data = await orderAPI.getOrderDetails(id);
            return data ? normalizeOrder(data) : null;
        } catch (err) {
            return rejectWithValue(
                err?.response?.data || err?.message || err
            );
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
            // my orders
            .addCase(fetchMyOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = Array.isArray(action.payload)
                    ? action.payload.map(normalizeOrder)
                    : [];
            })
            .addCase(fetchMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // order details
            .addCase(fetchOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.single = normalizeOrder(action.payload);
            })
            .addCase(fetchOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default orderSlice.reducer;
