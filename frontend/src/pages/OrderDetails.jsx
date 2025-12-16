import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { fetchOrderDetails } from "../redux/slices/orderSlice";
import orderAPI from "../mocks/order";
import "animate.css";

/* ---------------- Helpers ---------------- */

const resolveImageUrl = (image) => {
    if (!image) return "/assets/default.jpeg";
    const value = String(image);
    if (value.startsWith("http")) return value;
    if (value.startsWith("/")) return `http://127.0.0.1:8000${value}`;
    return `http://127.0.0.1:8000/${
        value.startsWith("media/") ? value : `media/${value}`
    }`;
};

const formatDateTime = (value) => {
    if (!value) return "-";
    try {
        const date = new Date(value);
        return isNaN(date) ? String(value).slice(0, 16) : date.toLocaleString();
    } catch {
        return String(value).slice(0, 16);
    }
};

const buildOrderTimeline = (order) => {
    const status = (order?.status || "").toLowerCase();

    const steps = [
        "placed",
        "processing",
        "packed",
        "shipped",
        "out_for_delivery",
        "delivered",
    ];

    if (status && steps.includes(status)) {
        const activeIndex = steps.indexOf(status);
        return steps.map((step, index) => ({
            key: step,
            label: step.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            isActive: index <= activeIndex,
        }));
    }

    const isPaid = !!(order?.isPaid ?? order?.is_paid);
    const isDelivered = !!(order?.isDelivered ?? order?.is_delivered);

    return [
        { key: "placed", label: "Order Placed", isActive: true },
        { key: "processing", label: "Processing", isActive: isPaid },
        { key: "shipped", label: "Shipped", isActive: isPaid },
        { key: "out_for_delivery", label: "Out for Delivery", isActive: isDelivered },
        { key: "delivered", label: "Delivered", isActive: isDelivered },
    ];
};

const calculateEstimatedDelivery = (order) => {
    if (order?.eta) return order.eta;
    if (order?.estimatedDelivery) return order.estimatedDelivery;
    if (order?.estimated_delivery) return order.estimated_delivery;

    const shippedAt = order?.shippedAt ?? order?.shipped_at;
    if (shippedAt) {
        const date = new Date(shippedAt);
        date.setDate(date.getDate() + 3);
        return date.toLocaleDateString();
    }

    if (order?.isDelivered ?? order?.is_delivered) return "Delivered";
    if (order?.isPaid ?? order?.is_paid) return "Arriving in 2–5 days";
    return "Delivery after payment";
};

/* ---------------- Component ---------------- */

export default function OrderDetails() {
    const { id: orderId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { single: order, loading, error } = useSelector(
        (state) => state.order || {}
    );

    useEffect(() => {
        if (orderId) {
            dispatch(fetchOrderDetails(orderId));
        }
    }, [dispatch, orderId]);

    const timelineSteps = useMemo(() => {
        if (!order) return [];
        return buildOrderTimeline(order);
    }, [order]);

    const estimatedDelivery = useMemo(
        () => calculateEstimatedDelivery(order),
        [order]
    );

    const orderItems =
    order?.orderItems ??
    order?.order_items ??
    order?.items ??
    [];

    const shippingAddress =
        order?.shippingAddress ??
        order?.shipping_address ??
        order?.ShippingAddress ??
        null;

    const activeStepIndex =
        timelineSteps.filter((step) => step.isActive).length - 1;

    const progressPercent =
        timelineSteps.length > 1
            ? Math.max(0, activeStepIndex / (timelineSteps.length - 1)) * 100
            : 0;

    const handleInvoiceDownload = async () => {
        try {
            const pdfBlob = await orderAPI.downloadInvoice(orderId);
            const fileUrl = window.URL.createObjectURL(pdfBlob);
            const anchor = document.createElement("a");
            anchor.href = fileUrl;
            anchor.download = `Invoice_${orderId}.pdf`;
            anchor.click();
            window.URL.revokeObjectURL(fileUrl);
        } catch {
            alert("Could not download invoice.");
        }
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto p-4 md:p-6">
                {loading && (
                    <div className="p-10 text-center text-xl animate__animated animate__pulse">
                        Loading order...
                    </div>
                )}

                {!loading && error && (
                    <div className="p-10 text-center text-red-600 animate__animated animate__shakeX">
                        Failed to load order
                    </div>
                )}

                {!loading && !error && order && (
                    <>
                        {/* Header */}
                        <header className="rounded-2xl p-6 bg-cyan-50 border shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-extrabold">
                                    Order #{order._id}
                                </h1>
                                <p className="text-sm text-slate-600 mt-1">
                                    Placed:{" "}
                                    {formatDateTime(
                                        order.createdAt ??
                                            order.created_at ??
                                            order.created
                                    )}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <span
                                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                        order.isPaid || order.is_paid
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-amber-100 text-amber-700"
                                    }`}
                                >
                                    {order.isPaid || order.is_paid
                                        ? "Paid"
                                        : "Pending"}
                                </span>

                                <div className="text-right">
                                    <div className="text-sm text-slate-600">
                                        Total
                                    </div>
                                    <div className="text-lg font-bold text-cyan-700">
                                        ₹
                                        {order.totalPrice ??
                                            order.total_price ??
                                            0}
                                    </div>
                                </div>
                            </div>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                            {/* Left */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Timeline */}
                                <section className="bg-white rounded-2xl p-6 border shadow-md">
                                    <h2 className="text-xl font-bold mb-4">
                                        Order Tracking
                                    </h2>

                                    <div className="relative py-6">
                                        <div className="absolute left-6 right-6 top-1/2 h-1 bg-slate-200 -translate-y-1/2" />

                                        <div
                                            className="absolute left-6 top-1/2 h-1 bg-cyan-600 -translate-y-1/2 transition-all duration-700"
                                            style={{ width: `${progressPercent}%` }}
                                        />

                                        <div className="flex justify-between gap-2 overflow-x-auto px-2">
                                            {timelineSteps.map((step, index) => (
                                                <div
                                                    key={step.key}
                                                    className="flex-shrink-0 w-28 flex flex-col items-center text-center"
                                                >
                                                    <div
                                                        className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
                                                            step.isActive
                                                                ? "bg-cyan-600 text-white"
                                                                : "bg-white border text-slate-400"
                                                        }`}
                                                    >
                                                        {step.isActive ? "✔" : index + 1}
                                                    </div>
                                                    <p className="mt-2 text-xs">
                                                        {step.label}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>

                                {/* items */}
                            <section className="bg-white rounded-2xl p-6 border shadow-md">
                                <h3 className="text-lg font-semibold mb-4">
                                    Items in this order
                                </h3>

                                {orderItems.length === 0 ? (
                                    <p className="text-slate-500">No items found.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {orderItems.map((orderItem) => (
                                            <div
                                                key={orderItem._id}
                                                className="flex items-center gap-4 border p-3 rounded-lg"
                                            >
                                                <img
                                                    src={resolveImageUrl(orderItem.image)}
                                                    alt={orderItem.name}
                                                    className="w-20 h-20 rounded-md object-cover"
                                                />

                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-slate-900">
                                                        {orderItem.name}
                                                    </h4>
                                                    <p className="text-sm text-slate-500">
                                                        Qty: {orderItem.qty}
                                                    </p>
                                                </div>

                                                <div className="font-bold text-cyan-700">
                                                    ₹{orderItem.price}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            </div>

                            {/* Right */}
                            <aside className="space-y-6">
                                <div className="rounded-2xl p-5 border shadow-md bg-white">
                                    <div className="text-sm text-slate-500">
                                        Estimated Delivery
                                    </div>
                                    <div className="text-lg font-bold">
                                        {estimatedDelivery}
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-5 border shadow-md">
                                    <h3 className="text-lg font-bold mb-3">
                                        Price Summary
                                    </h3>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Items</span>
                                            <span>
                                                ₹{order.itemsPrice ?? 0}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span>Shipping</span>
                                            <span>
                                                ₹{order.shippingPrice ?? 0}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span>Tax</span>
                                            <span>
                                                ₹{order.taxPrice ?? 0}
                                            </span>
                                        </div>

                                        <div className="flex justify-between text-lg font-extrabold">
                                            <span>Total</span>
                                            <span>
                                                ₹{order.totalPrice ?? 0}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex gap-3">
                                        <button
                                            onClick={handleInvoiceDownload}
                                            className="flex-1 bg-cyan-600 text-white py-2 rounded-md"
                                        >
                                            Download Invoice
                                        </button>

                                        <button
                                            onClick={() => navigate("/contact-us")}
                                            className="px-4 py-2 border rounded-md"
                                        >
                                            Contact
                                        </button>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
}
