import React, { useEffect } from "react";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../redux/slices/orderSlice";
import { Link } from "react-router-dom";
import { normalizeOrder } from "../utils/normalize";
import "animate.css";

const MyOrders = () => {
const dispatch = useDispatch();
const { orders = [], loading, error } = useSelector(
    (state) => state.order || {}
);

useEffect(() => {
    dispatch(fetchMyOrders());
}, [dispatch]);

return (
    <Layout>
    <div className="max-w-6xl mx-auto p-6 animate__animated animate__fadeIn">
        <h2 className="text-4xl font-extrabold mb-6 text-gray-900 animate__animated animate__fadeInDown">
        My Orders
        </h2>

        {/* LOADING */}
        {loading && (
        <div className="p-8 text-center text-cyan-700 font-bold animate__animated animate__pulse">
            Loading your orders...
        </div>
        )}

        {/* ERROR */}
        {!loading && error && (
        <div className="p-6 text-center text-red-600 font-semibold animate__animated animate__shakeX">
            {typeof error === "string"
            ? error
            : error?.detail || "Failed to load orders"}
        </div>
        )}

        {/* EMPTY */}
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

        {/* ORDERS */}
        <div className="space-y-8">
        {orders.map((rawOrder, idx) => {
            const order = normalizeOrder(rawOrder);

            return (
            <div
                key={order.id}
                className="bg-white rounded-2xl shadow-lg border p-6 hover:shadow-2xl transition-all transform hover:scale-[1.01] animate__animated animate__fadeInUp"
                style={{ animationDelay: `${idx * 0.1}s` }}
            >
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">
                    Order #{order.id}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                    Placed:{" "}
                    {order.createdAt?.substring
                        ? order.createdAt.substring(0, 10)
                        : order.createdAt}
                    </p>
                </div>

                <div className="flex gap-6 items-center">
                    <span
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow ${
                        order.isPaid
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                    >
                    {order.isPaid ? "Paid" : "Pending"}
                    </span>

                    <div className="text-right">
                    <p className="text-gray-600 text-sm">Total</p>
                    <p className="text-cyan-700 font-bold text-lg">
                        ₹{order.total}
                    </p>
                    </div>
                </div>
                </div>

                {/* ITEMS */}
                <div className="mt-4 flex items-center gap-4 overflow-x-auto pb-2">
                {order.items.length === 0 ? (
                    <div className="text-gray-500 text-sm">
                    No items
                    </div>
                ) : (
                    order.items.slice(0, 6).map((item, i) => (
                    <img
                        key={item._id ?? item.id ?? i}
                        src={item.image}
                        alt={item.name ?? item.title ?? "Product"}
                        className="w-20 h-20 rounded-lg object-cover shadow border hover:scale-105 transition-transform"
                    />
                    ))
                )}
                </div>

                {/* FOOTER */}
                <div className="mt-4 flex justify-between items-center">
                <p className="text-gray-600 text-sm">
                    {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""}
                </p>

                <Link
                    to={`/order/${order.id}`}
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
    