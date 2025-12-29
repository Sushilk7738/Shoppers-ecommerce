// product normalizer (SINGLE ID SOURCE)
export const normalizeProduct = (product = {}) => {
    const id = product.id ?? product._id ?? null;

    return {
        id, 

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

// order normalizer (SINGLE ID SOURCE)
export const normalizeOrder = (order = {}) => {
    const id = order.id ?? order._id ?? null;

    return {
        ...order,
        id, 

        orderItems: Array.isArray(order.orderItems)
            ? order.orderItems.map((item) => ({
                ...item,
                id: item.id ?? item._id ?? null, 
            }))
            : [],

        totalPrice: Number(order.totalPrice ?? 0),
        isPaid: Boolean(order.isPaid ?? order.is_paid ?? false),
        isDelivered: Boolean(order.isDelivered ?? order.is_delivered ?? false),
        createdAt: order.createdAt ?? order.created_at ?? null,
    };
};
