import { apiFetch } from "./client";
import { getAuthToken } from "../utils/Auth";

export const orderAPI = {
    // create razorpay order 
    createOrder: (amount) => {
        const token = getAuthToken();
        return apiFetch("/api/orders/create-order/", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ amount }),
        });
    },

    // verify payment 
    verifyPayment: (payload) => {
        const token = getAuthToken();
        return apiFetch("/api/orders/verify-payment/", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
    },

    // my orders 
    listMyOrders: () => {
        const token = getAuthToken();
        return apiFetch("/api/orders/myorders/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    // single order details 
    getOrderDetails: (id) => {
        const token = getAuthToken();
        return apiFetch(`/api/orders/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    // invoice download 
    downloadInvoice: async (id) => {
        const token = getAuthToken();

        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/orders/${id}/invoice/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!res.ok) {
            throw new Error("Invoice download failed");
        }

        return res.blob();
    },
};
