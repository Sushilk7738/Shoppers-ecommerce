export const getImageUrl = (image) => {
if (!image) return "/placeholder.png";

const base = import.meta.env.VITE_API_URL;

// already full url
if (image.startsWith("http")) return image;

// /media/images/xxx.jpg
if (image.startsWith("/media/")) return `${base}${image}`;

// images/xxx.jpg
if (image.startsWith("images/")) return `${base}/media/${image}`;

// /images/xxx.jpg
if (image.startsWith("/images/")) return `${base}/media${image}`;

// fallback
return `${base}/media/images/${image}`;
};
