import { apiFetch } from "./client";

// LOGIN
export const loginAPI = (email, password) => {
    return apiFetch("/api/users/login/", {
        method: "POST",
        body: JSON.stringify({
            username: email,
            password,
        }),
    });
};

// REGISTER
export const registerAPI = (fullname, email, password) => {
    return apiFetch("/api/users/register/", {
        method: "POST",
        body: JSON.stringify({
            name: fullname,
            email: email.trim().toLowerCase(),
            password,
        }),
    });
};
