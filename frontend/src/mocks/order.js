// src/mocks/order.js
import axios from "axios";
import { getAuthToken } from "../utils/Auth";

const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/orders`,
    headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

class OrderAPI {
    async createOrder(order) {
        const res = await API.post("/create-order/", order);
        return res.data;
    }

    async verifyPayment(payload) {
        const res = await API.post("/verify-payment/", payload);
        return res.data;
    }

    async listMyOrders() {
        const res = await API.get("/myorders/");
        return res.data;
    }

    async getOrderDetails(id) {
        const res = await API.get(`/${id}/`);
        return res.data;
    }

    async downloadInvoice(id) {
    const res = await API.get(`/${id}/invoice/`, {
        responseType: "blob",  // Very important for PDFs
    });
    return res.data;
    }

}

export default new OrderAPI();
