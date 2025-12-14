export const getImageUrl = (image) => {
    if (!image) return "/placeholder.png";
    return image; // Cloudinary full URL
};
