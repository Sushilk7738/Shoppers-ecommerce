export const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(url, options = {}) {
    const userInfoRaw = localStorage.getItem("userInfo");
    const userInfo = userInfoRaw ? JSON.parse(userInfoRaw) : null;
    const token = userInfo?.token;

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    });

    if (!response.ok) {
        let error = "API Error";
        try {
            const data = await response.json();
            error = data.detail || error;
        } catch {}
        throw new Error(error);
    }

    return response.json();
}
