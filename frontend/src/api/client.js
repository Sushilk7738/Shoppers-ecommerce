export const API_BASE_URL = import.meta.env.VITE_API_URL;


export async function apiFetch(url, options={}) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
        headers : {
            "Content-Type" : "application/json",
            ...(options.headers || {}),
        },
        ...options,
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