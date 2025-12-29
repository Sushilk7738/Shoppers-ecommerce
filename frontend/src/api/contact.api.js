import { apiFetch } from "./client";

export const contactAPI = {
    sendMessage: (payload) =>
        apiFetch("/api/contact/", {
            method: "POST",
            body: JSON.stringify(payload),
        }),
};
