import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderAPI } from "../../api/order.api";
import { normalizeOrder } from "../../utils/normalize";

// fetch my orders
export const fetchMyOrders = createAsyncThunk(
    "order/fetchMyOrders",
    async (_, { rejectWithValue }) => {
        try {
            const data = await orderAPI.listMyOrders();
            return Array.isArray(data)
                ? data.map(normalizeOrder)
                : [];
        } catch (err) {
            return rejectWithValue(err?.message || "Failed to load orders");
        }
    }
);

// fetch single order
export const fetchOrderDetails = createAsyncThunk(
    "order/fetchOrderDetails",
    async (id, { rejectWithValue }) => {
        try {
            const data = await orderAPI.getOrderDetails(id);
            return normalizeOrder(data);
        } catch (err) {
            return rejectWithValue(err?.message || "Failed to load order");
        }
    }
);

// download invoice
export const downloadInvoice = createAsyncThunk(
    "order/downloadInvoice",
    async (orderId, { rejectWithValue }) => {
        try {
            const pdfBlob = await orderAPI.downloadInvoice(orderId);
            const fileUrl = window.URL.createObjectURL(pdfBlob);
            const anchor = document.createElement("a");
            anchor.href = fileUrl;
            anchor.download = `Invoice_${orderId}.pdf`;
            anchor.click();
            window.URL.revokeObjectURL(fileUrl);
            return true;
        } catch (err) {
            return rejectWithValue(
                err?.message || "Failed to download invoice"
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
    reducers: {},
    extraReducers: (builder) => {
        builder
            // my orders
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

            // single order
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
            })

            // invoice
            .addCase(downloadInvoice.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export default orderSlice.reducer;
