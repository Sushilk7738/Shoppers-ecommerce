export const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(url, options = {}) {
    const raw = localStorage.getItem("userInfo");
    const user = raw ? JSON.parse(raw) : null;
    const token = user?.token;

    const res = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    });

    if (!res.ok) {
        let msg = "API Error";
        try {
            const data = await res.json();
            msg = data.detail || msg;
        } catch {}
        throw new Error(msg);
    }

    return res.json();
}
