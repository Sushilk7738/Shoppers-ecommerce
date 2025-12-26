import React, { useEffect } from "react";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../redux/slices/orderSlice";
import { Link } from "react-router-dom";
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

                {/* Loading */}
                {loading && (
                    <div className="p-8 text-center text-cyan-700 font-bold animate__animated animate__pulse">
                        Loading your orders...
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="p-6 text-center text-red-600 font-semibold animate__animated animate__shakeX">
                        {typeof error === "string"
                            ? error
                            : error?.detail || "Failed to load orders"}
                    </div>
                )}

                {/* Empty */}
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
                            className="mt-4 inline-block bg-cyan-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-cyan-700 transition-all"
                        >
                            Start Shopping
                        </Link>
                    </div>
                )}

                {/* Orders */}
                <div className="space-y-8">
                    {orders.map((order, index) => {
                        const items = order.orderItems || [];
                        const orderId = order.id;

                        return (
                            <div
                                key={orderId}
                                className="bg-white rounded-2xl shadow-lg border p-6 hover:shadow-2xl transition-all transform hover:scale-[1.01] animate__animated animate__fadeInUp"
                                style={{ animationDelay: `${index * 0.08}s` }}
                            >
                                {/* Header */}
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            Order #{orderId}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Placed:{" "}
                                            {order.createdAt
                                                ? order.createdAt.substring(0, 10)
                                                : "-"}
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
                                            <p className="text-gray-600 text-sm">
                                                Total
                                            </p>
                                            <p className="text-cyan-700 font-bold text-lg">
                                                ₹{order.totalPrice ?? 0}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Items */}
                                {/* Items */}
                                <div className="mt-4 space-y-3">
                                    {items.length > 0 ? (
                                        items.slice(0, 3).map((item, i) => (
                                            <div
                                                key={item.id ?? i}
                                                className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50"
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-16 h-16 rounded-md object-cover border"
                                                />

                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Qty: {item.qty ?? 1}
                                                    </p>
                                                </div>

                                                <div className="text-sm font-bold text-cyan-700">
                                                    ₹{item.price}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">No items</p>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="mt-4 flex justify-between items-center">
                                    <p className="text-gray-600 text-sm">
                                        {items.length} item
                                        {items.length !== 1 ? "s" : ""}
                                    </p>

                                    <Link
                                        to={`/order/${orderId}`}
                                        className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm shadow-md hover:bg-blue-700 transition-all"
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
