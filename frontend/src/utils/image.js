export const getImageUrl = (image) => {
    if (!image) return "/placeholder.png";

    const base = import.meta.env.VITE_API_URL;
    const src = String(image);

    // already full URL (Cloudinary etc.)
    if (src.startsWith("http")) return src;

    // absolute path from backend
    if (src.startsWith("/")) {
        return `${base}${src}`;
    }

    // relative path fallback
    return `${base}/${src}`;
};
