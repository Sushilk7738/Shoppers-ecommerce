import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { fetchOrderDetails } from "../redux/slices/orderSlice";
import "animate.css";
import orderAPI from "../mocks/order";
import { useNavigate } from "react-router-dom";



const toImgUrl = (img) => {
    if (!img) return "/assets/default.jpeg";
    const s = String(img);
    if (s.startsWith("http")) return s;
    if (s.startsWith("/")) return `http://127.0.0.1:8000${s}`;
    return `http://127.0.0.1:8000/${s.startsWith("media/") ? s : `media/${s}`}`;
};

const formatDate = (value) => {
    if (!value) return "-";
    try {
        const d = new Date(value);
        if (isNaN(d)) return String(value).slice(0, 16);
        return d.toLocaleString();
    } catch {
        return String(value).slice(0, 16);
    }
};

const buildTimelineFromOrder = (order) => {
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
            active: index <= activeIndex,
        }));
    }

    const isPaid = !!(order?.isPaid ?? order?.is_paid);
    const isDelivered = !!(order?.isDelivered ?? order?.is_delivered);

    return [
        { key: "placed", label: "Order Placed", active: true },
        { key: "processing", label: "Processing", active: isPaid },
        { key: "shipped", label: "Shipped", active: isPaid },
        { key: "out_for_delivery", label: "Out for Delivery", active: isDelivered },
        { key: "delivered", label: "Delivered", active: isDelivered },
    ];
};

const extractETA = (order) => {
    if (order?.eta) return order.eta;
    if (order?.estimatedDelivery) return order.estimatedDelivery;
    if (order?.estimated_delivery) return order.estimated_delivery;

    const shipped = order?.shippedAt ?? order?.shipped_at;
    if (shipped) {
        try {
            const d = new Date(shipped);
            d.setDate(d.getDate() + 3);
            return d.toLocaleDateString();
        } catch {}
    }

    const isPaid = !!(order?.isPaid ?? order?.is_paid);
    const isDelivered = !!(order?.isDelivered ?? order?.is_delivered);

    if (isDelivered) return "Delivered";
    if (isPaid) return "Arriving in 2–5 days";
    return "Delivery after payment";
};

export default function OrderDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();
    const { single: order, loading, error } = useSelector((s) => s.order || {});

    useEffect(() => {
        if (id) dispatch(fetchOrderDetails(id));
    }, [dispatch, id]);

    const timeline = useMemo(() => buildTimelineFromOrder(order), [order]);
    const eta = useMemo(() => extractETA(order), [order]);

    const items = order?.orderItems ?? order?.order_items ?? [];
    const address =
        order?.shippingAddress ??
        order?.shipping_address ??
        order?.ShippingAddress ??
        null;

    const active = timeline.filter((t) => t.active).length - 1;
    const percent = Math.max(0, active / (timeline.length - 1)) * 100;

    const handleInvoiceDownload = async () => {
        try {
            const pdfBlob = await orderAPI.downloadInvoice(id);
            const url = window.URL.createObjectURL(pdfBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Invoice_${id}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Invoice download failed:", err);
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

                {!loading && !error && !order && (
                    <div className="p-10 text-center text-gray-700">Order not found</div>
                )}

                {!loading && !error && order && (
                    <>
                        <header className="rounded-2xl p-6 bg-gradient-to-r from-cyan-50 to-white shadow-lg border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                                    Order #{order._id}
                                </h1>
                                <p className="mt-1 text-sm text-slate-600">
                                    Placed:{" "}
                                    {formatDate(
                                        order.createdAt ??
                                            order.created_at ??
                                            order.created
                                    )}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div
                                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                        order.isPaid || order.is_paid
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-amber-100 text-amber-700"
                                    }`}
                                >
                                    {order.isPaid || order.is_paid
                                        ? "Paid"
                                        : "Pending"}
                                </div>

                                <div className="text-right">
                                    <div className="text-sm text-slate-600">
                                        Total
                                    </div>
                                    <div className="text-cyan-700 font-bold text-lg">
                                        ₹
                                        {order.totalPrice ??
                                            order.total_price ??
                                            0}
                                    </div>
                                </div>
                            </div>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                            <div className="lg:col-span-2 space-y-6">
                                {/* Timeline */}
                                <section className="bg-white rounded-2xl p-6 shadow-md border animate__animated animate__fadeInUp">
                                    <h2 className="text-xl font-bold text-slate-900 mb-4">
                                        Order Timeline
                                    </h2>

                                    <div className="relative py-6">
                                        <div className="absolute left-6 right-6 top-1/2 h-1 bg-slate-200 transform -translate-y-1/2" />

                                        <div
                                            className="absolute left-6 top-1/2 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 transform -translate-y-1/2 transition-all duration-700"
                                            style={{ width: `${percent}%` }}
                                        />

                                        <div className="flex justify-between gap-2 overflow-x-auto px-2 py-2">
                                            {timeline.map((step, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex-shrink-0 w-28 flex flex-col items-center text-center"
                                                >
                                                    <div
                                                        className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
                                                            step.active
                                                                ? "bg-gradient-to-br from-cyan-600 to-blue-600 text-white shadow-lg"
                                                                : "bg-white border border-slate-200 text-slate-400"
                                                        }`}
                                                    >
                                                        {step.active
                                                            ? "✔"
                                                            : idx + 1}
                                                    </div>
                                                    <p className="mt-2 text-xs text-slate-700">
                                                        {step.label}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>

                                {/* Shipping */}
                                <section className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border shadow-sm animate__animated animate__fadeInUp">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">
                                        Shipping Address
                                    </h3>

                                    {address ? (
                                        <div className="text-slate-700 space-y-1">
                                            <div className="font-semibold">
                                                {address.fullName ??
                                                    address.name ??
                                                    ""}
                                            </div>
                                            <div>{address.address}</div>
                                            <div>
                                                {address.city}{" "}
                                                {address.postalCode ??
                                                    address.postal_code}
                                            </div>
                                            <div>{address.country}</div>
                                        </div>
                                    ) : (
                                        <p className="text-slate-500">
                                            No address found
                                        </p>
                                    )}
                                </section>

                                {/* Items */}
                                <section className="bg-white rounded-2xl p-6 border shadow-md animate__animated animate__fadeInUp">
                                    <h3 className="text-lg font-semibold mb-4">
                                        Items in this order
                                    </h3>

                                    <div className="space-y-4">
                                        {items.map((it, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-4 border p-3 rounded-lg hover:shadow-lg transition"
                                            >
                                                <img
                                                    src={toImgUrl(it.image)}
                                                    alt={it.name ?? it.title}
                                                    className="w-20 h-20 rounded-md object-cover"
                                                />

                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-slate-900">
                                                        {it.name ??
                                                            it.title}
                                                    </h4>
                                                    <p className="text-sm text-slate-500">
                                                        Qty:{" "}
                                                        {it.qty ??
                                                            it.quantity ??
                                                            1}
                                                    </p>
                                                </div>

                                                <div className="text-right">
                                                    <div className="font-bold text-cyan-700">
                                                        ₹{it.price}
                                                    </div>
                                                    <div className="text-xs text-slate-400">
                                                        each
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {/* Right panel */}
                            <aside className="space-y-6">
                                {/* ETA */}
                                <div className="rounded-2xl p-5 shadow-md border bg-gradient-to-br from-white to-cyan-50 animate__animated animate__fadeInRight">
                                    <div className="text-sm text-slate-500">
                                        Estimated Delivery
                                    </div>
                                    <div className="text-lg font-bold">
                                        {eta}
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1">
                                        Updated:{" "}
                                        {formatDate(
                                            order.updatedAt ??
                                                order.updated_at ??
                                                order.paidAt ??
                                                order.paid_at
                                        )}
                                    </div>

                                    <div className="mt-4 h-3 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                                            style={{
                                                width: `${Math.max(
                                                    8,
                                                    percent
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Price Summary */}
                                <div className="bg-white rounded-2xl p-5 border shadow-md animate__animated animate__fadeInRight">
                                    <h3 className="text-lg font-bold mb-3">
                                        Price Summary
                                    </h3>

                                    <div className="space-y-2 text-sm text-slate-700">
                                        <div className="flex justify-between">
                                            <span>Items</span>
                                            <span>
                                                ₹
                                                {order.itemsPrice ??
                                                    order.items_price ??
                                                    0}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span>Shipping</span>
                                            <span>
                                                ₹
                                                {order.shippingPrice ??
                                                    order.shipping_price ??
                                                    0}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span>Tax</span>
                                            <span>
                                                ₹
                                                {order.taxPrice ??
                                                    order.tax_price ??
                                                    0}
                                            </span>
                                        </div>

                                        <div className="flex justify-between text-lg font-extrabold mt-2">
                                            <span>Total</span>
                                            <span>
                                                ₹
                                                {order.totalPrice ??
                                                    order.total_price ??
                                                    0}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 🔥 FIXED BUTTONS (Your request) */}
                                    <div className="mt-4 flex gap-3">
                                        <button
                                            onClick={handleInvoiceDownload}
                                            className="flex-1 bg-cyan-600 text-white py-2 rounded-md hover:bg-cyan-700 transition"
                                        >
                                            Download Invoice
                                        </button>

                                        <button
                                            className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
                                            onClick={() => navigate("/contact-us")}
                                        >
                                            Contact
                                        </button>
                                    </div>
                                </div>

                                <div className="text-xs text-center text-slate-500">
                                    Tip: Download your invoice for warranty &
                                    returns.
                                </div>
                            </aside>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
}
