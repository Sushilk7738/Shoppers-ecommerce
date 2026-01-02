export const API_BASE_URL = import.meta.env.VITE_API_URL;

export const apiFetch = async (url, options = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
        const res = await fetch(
            `${import.meta.env.VITE_API_URL}${url}`,
            {
                ...options,
                signal: controller.signal,
                headers: {
                    "Content-Type": "application/json",
                    ...(options.headers || {}),
                },
            }
        );

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data?.detail || "Request failed");
        }

        return await res.json();
    } catch (err) {
        if (err.name === "AbortError") {
            throw new Error("Server is waking up, please retry");
        }
        throw err;
    } finally {
        clearTimeout(timeoutId);
    }
};
