import { apiFetch } from "./client";

export const orderAPI = {
    // create razorpay order
    createOrder: (amount) =>
        apiFetch("/api/orders/create-order/", {
            method: "POST",
            body: JSON.stringify({ amount }),
        }),

    // verify payment
    verifyPayment: (payload) =>
        apiFetch("/api/orders/verify-payment/", {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    listMyOrders: () =>
        apiFetch("/api/orders/myorders/"),

    // single order details
    getOrderDetails: (id) =>
        apiFetch(`/api/orders/${id}/`),

    // invoice download 
    downloadInvoice: async (id) => {
        const token =
            JSON.parse(localStorage.getItem("userInfo"))?.token;

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
