export const getImageUrl = (image) => {
    if (!image) return "/placeholder.png";

    const base = import.meta.env.VITE_API_URL;

    // already absolute
    if (image.startsWith("http")) return image;

    // ensure leading slash
    if (!image.startsWith("/")) {
        image = `/${image}`;
    }

    // handle media path
    if (!image.startsWith("/media/")) {
        image = `/media${image}`;
    }

    return `${base}${image}`;
};
