import { apiFetch } from "./client";
import { getAuthToken } from "../utils/Auth";

export const orderAPI = {
    createOrder: (amount) =>
        apiFetch("/api/orders/create-order/", {
            method: "POST",
            body: JSON.stringify({ amount }),
        }),

    verifyPayment: (payload) =>
        apiFetch("/api/orders/verify-payment/", {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    listMyOrders: () => {
        const token = getAuthToken();
        return apiFetch("/api/orders/myorders/", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    getOrderDetails: (id) => {
        const token = getAuthToken();
        return apiFetch(`/api/orders/${id}/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },
};
