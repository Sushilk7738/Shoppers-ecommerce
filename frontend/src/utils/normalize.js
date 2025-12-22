//product normalizer
export const normalizeProduct = (product = {}) => {
    return {
        _id: product._id ?? product.id ?? null,
        id: product._id ?? product.id ?? null,

        name: product.name ?? "",
        image: product.image ?? null,
        brand: product.brand ?? "",
        category: product.category ?? "Others",
        description: product.description ?? "",

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

//order normalizer
export const normalizeOrder = (order = {}) => {
    return {
        ...order,                        
        _id: order._id ?? order.id ?? null,

        orderItems: Array.isArray(order.orderItems)
            ? order.orderItems
            : [],

        totalPrice: Number(order.totalPrice ?? 0),
        isPaid: Boolean(order.isPaid ?? false),
        isDelivered: Boolean(order.isDelivered ?? false),
        createdAt: order.createdAt ?? null,
    };
};
