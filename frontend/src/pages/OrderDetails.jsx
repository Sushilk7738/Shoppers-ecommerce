import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { fetchOrderDetails } from "../redux/slices/orderSlice";
import { normalizeOrder } from "../utils/normalize";
import orderAPI from "../mocks/order";
import "animate.css";

const formatDate = (value) => {
if (!value) return "-";
try {
    const d = new Date(value);
    return isNaN(d) ? String(value).slice(0, 16) : d.toLocaleString();
} catch {
    return String(value).slice(0, 16);
}
};

const buildTimelineFromOrder = (order) => {
const status = (order.status || "").toLowerCase();

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

    return steps.map((step, i) => ({
    key: step,
    label: step.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
    active: i <= activeIndex,
    }));
}

return [
    { key: "placed", label: "Order Placed", active: true },
    { key: "processing", label: "Processing", active: order.isPaid },
    { key: "shipped", label: "Shipped", active: order.isPaid },
    { key: "out_for_delivery", label: "Out for Delivery", active: order.isDelivered },
    { key: "delivered", label: "Delivered", active: order.isDelivered },
];
};

const extractETA = (order) => {
if (order.eta) return order.eta;
if (order.isDelivered) return "Delivered";
if (order.isPaid) return "Arriving in 2–5 days";
return "Delivery after payment";
};

export default function OrderDetails() {
const { id } = useParams();
const navigate = useNavigate();
const dispatch = useDispatch();

const { single, loading, error } = useSelector(s => s.order || {});

const order = useMemo(
    () => (single ? normalizeOrder(single) : null),
    [single]
);

useEffect(() => {
    if (id) dispatch(fetchOrderDetails(id));
}, [dispatch, id]);

const timeline = useMemo(
    () => (order ? buildTimelineFromOrder(order) : []),
    [order]
);

const eta = useMemo(
    () => (order ? extractETA(order) : "-"),
    [order]
);

const active = timeline.filter(t => t.active).length - 1;
const percent =
    timeline.length > 1
    ? Math.max(0, active / (timeline.length - 1)) * 100
    : 0;

const handleInvoiceDownload = async () => {
    try {
    const pdfBlob = await orderAPI.downloadInvoice(id);
    const url = window.URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice_${order.id}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
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

        {!loading && !error && !order && (
        <div className="p-10 text-center text-gray-700">
            Loading order details...
        </div>
        )}

        {!loading && !error && order && order.id && (
        <>
            <header className="rounded-2xl p-6 bg-gradient-to-r from-cyan-50 to-white shadow-lg border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                Order #{order.id}
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                Placed: {formatDate(order.createdAt)}
                </p>
            </div>

            <div className="flex items-center gap-4">
                <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    order.isPaid
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
                >
                {order.isPaid ? "Paid" : "Pending"}
                </span>

                <div className="text-right">
                <div className="text-sm text-slate-600">Total</div>
                <div className="text-cyan-700 font-bold text-lg">
                    ₹{order.total}
                </div>
                </div>
            </div>
            </header>


            <div className="mt-6 flex gap-3">
            <button
                onClick={handleInvoiceDownload}
                className="flex-1 bg-cyan-600 text-white py-2 rounded-md hover:bg-cyan-700 transition"
            >
                Download Invoice
            </button>

            <button
                onClick={() => navigate("/contact-us")}
                className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
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
