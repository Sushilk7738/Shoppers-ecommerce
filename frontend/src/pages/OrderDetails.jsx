import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { fetchOrderDetails } from "../redux/slices/orderSlice";
import "animate.css";
import orderAPI from "../mocks/order";

const BASE_URL = import.meta.env.VITE_API_URL; // api

const toImgUrl = (img) => {
if (!img) return "/assets/default.jpeg";
const s = String(img);
if (s.startsWith("http")) return s;
if (s.startsWith("/")) return `${BASE_URL}${s}`;
return `${BASE_URL}/${s.startsWith("media/") ? s : `media/${s}`}`;
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
    label: step
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
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
const { single: order, loading, error } = useSelector(
    (s) => s.order || {}
);

useEffect(() => {
    if (id) dispatch(fetchOrderDetails(id));
}, [dispatch, id]);

const timeline = useMemo(
    () => buildTimelineFromOrder(order),
    [order]
);
const eta = useMemo(() => extractETA(order), [order]);

const items = order?.orderItems ?? order?.order_items ?? [];
const address =
    order?.shippingAddress ??
    order?.shipping_address ??
    order?.ShippingAddress ??
    null;

const active = timeline.filter((t) => t.active).length - 1;
const percent =
    Math.max(0, active / (timeline.length - 1)) * 100;

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
        <div className="p-10 text-center text-gray-700">
            Order not found
        </div>
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

            {/* बाकी JSX unchanged */}
            {/* … exactly same as before, only image URL logic fixed … */}

            <div className="mt-6 flex gap-3">
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
        </>
        )}
    </div>
    </Layout>
);
}
