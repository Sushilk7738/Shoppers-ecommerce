import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { fetchOrderDetails } from "../redux/slices/orderSlice";
import orderAPI from "../mocks/order";
import "animate.css";

/* ---------- Helpers ---------- */

const resolveImageUrl = (image) => {
    if (!image) return "/assets/default.jpeg";
    const value = String(image);

    if (value.startsWith("http")) return value;
    if (value.startsWith("/")) return `http://127.0.0.1:8000${value}`;

    return `http://127.0.0.1:8000/${
        value.startsWith("media/") ? value : `media/${value}`
    }`;
};

const formatDateTime = (dateValue) => {
    if (!dateValue) return "-";
    try {
        const date = new Date(dateValue);
        return isNaN(date) ? String(dateValue).slice(0, 16) : date.toLocaleString();
    } catch {
        return String(dateValue).slice(0, 16);
    }
};

const buildOrderTimeline = (order) => {
    const status = (order?.status || "").toLowerCase();

    if (status) {
        const steps = [
            "placed",
            "processing",
            "packed",
            "shipped",
            "out_for_delivery",
            "delivered",
        ];

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

/* ---------- Component ---------- */

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

    const timelineSteps = useMemo(
        () => buildOrderTimeline(order),
        [order]
    );

    const estimatedDelivery = useMemo(
        () => calculateEstimatedDelivery(order),
        [order]
    );

    const orderItems = order?.orderItems ?? order?.order_items ?? [];
    const shippingAddress =
        order?.shippingAddress ??
        order?.shipping_address ??
        order?.ShippingAddress ??
        null;

    const activeStepIndex =
        timelineSteps.filter((step) => step.isActive).length - 1;

    const progressPercent =
        Math.max(0, activeStepIndex / (timelineSteps.length - 1)) * 100;

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
                    </>
                )}
            </div>
        </Layout>
    );
}
