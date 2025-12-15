// src/utils/normalize.js

export const normalizeProduct = (product = {}) => {
    return {
        // 🔑 IMPORTANT: BOTH id AND _id ठेवतो
        _id: product._id ?? product.id ?? null,
        id: product._id ?? product.id ?? null,

        name: product.name ?? "",
        image: product.image ?? null,
        brand: product.brand ?? "",
        category: product.category ?? "Others",
        description: product.description ?? "",

        // 💰 PRICE NEVER LOST
        price: Number(product.price ?? 0),
        discount: Number(product.discount ?? 0),
        offer_price:
            product.offer_price !== null && product.offer_price !== undefined
                ? Number(product.offer_price)
                : null,

        rating: Number(product.rating ?? 0),
        countInStock: Number(product.countInStock ?? 0),
        numReviews: Number(product.numReviews ?? 0),
    };
};

export const normalizeOrder = (order = {}) => {
    const items = order.orderItems ?? order.order_items ?? [];

    return {
        id: order._id ?? order.id ?? null,
        isPaid: Boolean(order.isPaid ?? false),
        isDelivered: Boolean(order.isDelivered ?? false),

        // 💰 THIS FIXES TOTAL = 0
        total: Number(
            order.totalPrice ??
            order.total_price ??
            order.amount ??
            0
        ),

        createdAt:
            order.createdAt ??
            order.created_at ??
            null,

        status: order.status ?? null,
        items,

        shippingAddress:
            order.ShippingAddress ??
            order.shippingAddress ??
            null,
    };
};
