// src/utils/normalize.js

export const normalizeProduct = (product = {}) => {
    const _id = product._id ?? product.id ?? null;

    return {
        _id,                 
        id: _id,            
        name: product.name ?? "",
        image: product.image ?? null,
        brand: product.brand ?? "",
        category: product.category ?? "Others",
        description: product.description ?? "",
        price: Number(product.price ?? 0),
        discount: Number(product.discount ?? 0),
        offer_price:
            product.offer_price !== undefined
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
        isPaid: Boolean(order.isPaid ?? order.is_paid ?? false),
        isDelivered: Boolean(
            order.isDelivered ?? order.is_delivered ?? false
        ),
        total:
            Number(
                order.totalPrice ??
                order.total_price ??
                order.amount ??
                0
            ),
        createdAt:
            order.createdAt ??
            order.created_at ??
            order.created ??
            null,
        status: order.status ?? null,
        items,
        shippingAddress:
            order.shippingAddress ??
            order.shipping_address ??
            order.ShippingAddress ??
            null,
    };
};
