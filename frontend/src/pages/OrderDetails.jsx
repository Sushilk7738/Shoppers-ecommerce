import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import {
    fetchOrderDetails,
    downloadInvoice,
} from "../redux/slices/orderSlice";
import "animate.css";


const API_BASE = import.meta.env.VITE_API_URL;

const resolveImageUrl = (image) => {
    if (!image) return "/assets/default.jpeg";
    if (image.startsWith("http")) return image;
    if (image.startsWith("/")) return `${API_BASE}${image}`;
    return `${API_BASE}/media/${image}`;
};

const formatDateTime = (value) => {
    if (!value) return "-";
    try {
        const date = new Date(value);
        return isNaN(date)
            ? String(value).slice(0, 16)
            : date.toLocaleString();
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

    if (steps.includes(status)) {
        const active = steps.indexOf(status);
        return steps.map((step, i) => ({
            key: step,
            label: step.replace(/_/g, " "),
            isActive: i <= active,
        }));
    }

    return [
        { key: "placed", label: "Order Placed", isActive: true },
        { key: "processing", label: "Processing", isActive: order.isPaid },
        { key: "shipped", label: "Shipped", isActive: order.isPaid },
        {
            key: "delivered",
            label: "Delivered",
            isActive: order.isDelivered,
        },
    ];
};

export default function OrderDetails() {
    const { id: orderId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { single: order, loading, error } = useSelector(
        (state) => state.order
    );

    useEffect(() => {
        if (orderId) dispatch(fetchOrderDetails(orderId));
    }, [dispatch, orderId]);

    const timeline = useMemo(
        () => (order ? buildOrderTimeline(order) : []),
        [order]
    );

    const progress =
        timeline.length > 1
            ? ((timeline.filter((s) => s.isActive).length - 1) /
                  (timeline.length - 1)) *
                100
            : 0;

    const orderItems = order?.orderItems || [];

    const handleInvoiceDownload = () => {
        dispatch(downloadInvoice(orderId));
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto p-4 md:p-6">
                {loading && (
                    <div className="p-10 text-center animate__animated animate__pulse">
                        Loading order...
                    </div>
                )}

                {!loading && error && (
                    <div className="p-10 text-center text-red-600">
                        Failed to load order
                    </div>
                )}

                {!loading && order && (
                    <>
                        <header className="rounded-2xl p-6 bg-cyan-50 border shadow-lg flex justify-between">
                            <div>
                                <h1 className="text-2xl font-extrabold">
                                    Order #{order.id}
                                </h1>
                                <p className="text-sm text-slate-600">
                                    Placed:{" "}
                                    {formatDateTime(order.createdAt)}
                                </p>
                            </div>

                            <div className="text-right">
                                <div className="text-sm">Total</div>
                                <div className="text-lg font-bold text-cyan-700">
                                    ₹{order.totalPrice}
                                </div>
                            </div>
                        </header>

                        <section className="mt-6 bg-white rounded-2xl p-6 shadow-md">
                            <h2 className="text-xl font-bold mb-4">
                                Order Tracking
                            </h2>

                            <div className="relative py-6">
                                <div className="absolute left-6 right-6 top-1/2 h-1 bg-slate-200" />
                                <div
                                    className="absolute left-6 top-1/2 h-1 bg-cyan-600 transition-all"
                                    style={{ width: `${progress}%` }}
                                />

                                <div className="flex justify-between">
                                    {timeline.map((step, i) => (
                                        <div
                                            key={step.key}
                                            className="w-24 text-center"
                                        >
                                            <div
                                                className={`w-10 h-10 mx-auto rounded-full ${
                                                    step.isActive
                                                        ? "bg-cyan-600 text-white"
                                                        : "border"
                                                } flex items-center justify-center`}
                                            >
                                                {step.isActive ? "✔" : i + 1}
                                            </div>
                                            <p className="text-xs mt-2">
                                                {step.label}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section className="mt-6 bg-white rounded-2xl p-6 shadow-md">
                            <h3 className="text-lg font-semibold mb-4">
                                Items
                            </h3>

                            {orderItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-4 border-b py-3"
                                >
                                    <img
                                        src={resolveImageUrl(item.image)}
                                        className="w-20 h-20 rounded-md object-cover"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-semibold">
                                            {item.name}
                                        </h4>
                                        <p className="text-sm">
                                            Qty: {item.qty}
                                        </p>
                                    </div>
                                    <div className="font-bold text-cyan-700">
                                        ₹{item.price}
                                    </div>
                                </div>
                            ))}
                        </section>

                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={handleInvoiceDownload}
                                className="bg-cyan-600 text-white px-4 py-2 rounded-md"
                            >
                                Download Invoice
                            </button>

                            <button
                                onClick={() => navigate("/contact-us")}
                                className="border px-4 py-2 rounded-md"
                            >
                                Contact
                            </button>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
}
