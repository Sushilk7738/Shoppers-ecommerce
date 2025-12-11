import React, { useEffect } from "react";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../redux/slices/orderSlice";
import { Link } from "react-router-dom";
import "animate.css";

const toImgUrl = (img) => {
if (!img) return "/assets/default.jpeg";
const s = String(img);
if (s.startsWith("http")) return s;
if (s.startsWith("/")) return `http://127.0.0.1:8000${s}`;
return `http://127.0.0.1:8000/${s.startsWith("media/") ? s : `media/${s}`}`;
};

const MyOrders = () => {
const dispatch = useDispatch();
const { orders = [], loading, error } = useSelector((s) => s.order || {});

useEffect(() => {
    dispatch(fetchMyOrders());
}, [dispatch]);

return (
    <Layout>
    <div className="max-w-6xl mx-auto p-6 animate__animated animate__fadeIn">

        <h2 className="text-4xl font-extrabold mb-6 text-gray-900 animate__animated animate__fadeInDown">
        My Orders
        </h2>

        {/* Loading */}
        {loading && (
        <div className="p-8 text-center text-cyan-700 font-bold animate__animated animate__pulse">
            Loading your orders...
        </div>
        )}

        {/* Error */}
        {error && !loading && (
        <div className="p-6 text-center text-red-600 font-semibold animate__animated animate__shakeX">
            {typeof error === "string"
            ? error
            : error?.detail || "Failed to load orders"}
        </div>
        )}

        {/* Empty State */}
        {!loading && !error && orders.length === 0 && (
        <div className="p-10 text-center bg-white rounded-xl shadow-xl animate__animated animate__fadeInUp">
            <h3 className="text-2xl font-bold text-gray-800">
            No orders yet
            </h3>
            <p className="mt-2 text-gray-600 text-lg">
            When you place orders, they’ll appear here.
            </p>
            <Link
            to="/products"
            className="mt-4 inline-block bg-cyan-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-cyan-700 transition-all animate__animated animate__pulse animate__infinite"
            >
            Start Shopping
            </Link>
        </div>
        )}

        {/* Orders List */}
        <div className="space-y-8">
        {orders.map((o, idx) => {
            const id = o._id ?? o.id ?? o.orderId ?? o.pk;
            const paid = o.isPaid ?? o.is_paid ?? false;
            const total = o.totalPrice ?? o.total_price ?? o.amount ?? 0;
            const created = o.createdAt ?? o.created_at ?? o.created ?? "";
            const items = o.orderItems ?? o.order_items ?? [];

            return (
            <div
                key={id}
                className="bg-white rounded-2xl shadow-lg border p-6 hover:shadow-2xl transition-all transform hover:scale-[1.01] animate__animated animate__fadeInUp"
                style={{ animationDelay: `${idx * 0.1}s` }}
            >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">

                <div>
                    <h3 className="text-xl font-bold text-gray-900">
                    Order #{id}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                    Placed:{" "}
                    {created?.substring ? created.substring(0, 10) : created}
                    </p>
                </div>

                <div className="flex gap-6 items-center">

                    {/* Payment Status */}
                    <span
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow ${
                        paid
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                    >
                    {paid ? "Paid" : "Pending"}
                    </span>

                    {/* Total */}
                    <div className="text-right">
                    <p className="text-gray-600 text-sm">Total</p>
                    <p className="text-cyan-700 font-bold text-lg">₹{total}</p>
                    </div>
                </div>
                </div>

                {/* Item Thumbnails */}
                <div className="mt-4 flex items-center gap-4 overflow-x-auto pb-2">
                {items.length === 0 ? (
                    <div className="text-gray-500 text-sm">No items</div>
                ) : (
                    items.slice(0, 6).map((it, i) => (
                    <img
                        key={it._id ?? it.id ?? i}
                        src={toImgUrl(it.image ?? it.image_url ?? it.photo)}
                        alt={it.name ?? it.title ?? "Product"}
                        className="w-20 h-20 rounded-lg object-cover shadow border hover:scale-105 transition-transform"
                    />
                    ))
                )}
                </div>

                {/* Footer Row */}
                <div className="mt-4 flex justify-between items-center">
                <p className="text-gray-600 text-sm">
                    {items.length} item{items.length !== 1 ? "s" : ""}
                </p>

                <Link
                    to={`/order/${id}`}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm shadow-md hover:bg-blue-700 transition-all animate__animated animate__fadeInRight"
                >
                    View Details
                </Link>
                </div>
            </div>
            );
        })}
        </div>
    </div>
    </Layout>
);
};

export default MyOrders;
