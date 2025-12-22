import { apiFetch } from "./client";

export const orderAPI = {
    createOrder : (amount, token) =>
        apiFetch("/api/orders/create-order/", {
            method: "POST",
            headers: {Authorization: `Bearer ${token}` },
            body: JSON.stringify({amount}),
        }),

        verifyPayment : (payload, token) =>
            apiFetch("/api/orders/verify-payment/", {
                method: "POST",
                headers: {Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload),
            }),
};