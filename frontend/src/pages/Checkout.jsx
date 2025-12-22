import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useToast } from "../context/ToastContext";
import { clearCart } from "../redux/slices/cartSlice";
import { orderAPI } from "../api/order.api";
import "animate.css";

const Checkout = () => {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart.cartItems) || [];
    const token = useSelector((state) => state.user.token);

    const [form, setForm] = useState({
        fullName: "",
        mobile: "",
        address: "",
    });

    useEffect(() => {
        if (!token) {
        showToast("Please login to continue checkout");
        navigate("/login?redirect=/checkout");
        }
    }, [token, navigate, showToast]);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const cartTotal = cart.reduce((sum, item) => {
        const price = item.offer_price ?? item.price ?? 0;
        return sum + Number(price) * Number(item.qty || 0);
    }, 0);

    const verifyPayment = useCallback(
        async (response) => {
        if (!token) {
            showToast("Please login to continue checkout");
            navigate("/login?redirect=/checkout");
            return;
        }

        const paymentData = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            amount: cartTotal,
            address: form,
            cartItems: cart,
        };

        try {
            const data = await orderAPI.verifyPayment(paymentData, token);
            showToast("Order Completed Successfully!");
            dispatch(clearCart());
            navigate(`/order/${data._id}`);
        } catch {
            showToast("Payment verification failed");
        }
        },
        [token, cartTotal, form, cart, dispatch, navigate, showToast]
    );

    const openRazorpay = useCallback(
        (order) => {
        if (!token) {
            showToast("Please login to continue checkout");
            navigate("/login?redirect=/checkout");
            return;
        }

        if (!window.Razorpay) {
            showToast("Razorpay SDK not loaded");
            return;
        }

        const options = {
            key: order.key,
            amount: order.amount,
            currency: "INR",
            order_id: order.id,
            name: "Shoppers Store",
            description: "Order Payment",
            handler: verifyPayment,
            prefill: {
            name: form.fullName,
            contact: form.mobile,
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        },
        [token, verifyPayment, form, navigate, showToast]
    );

    const createOrder = async () => {
        if (!form.fullName || !form.mobile || !form.address) {
        showToast("Please fill all fields");
        return;
        }

        if (!token) {
        showToast("Please login to continue checkout");
        navigate("/login?redirect=/checkout");
        return;
        }

        try {
        const order = await orderAPI.createOrder(cartTotal, token);
        openRazorpay(order);
        } catch {
        showToast("Order creation failed");
        }
};

    return (
        <Layout>
        {!cart || cart.length === 0 ? (
            <div className="p-10 text-center text-xl font-semibold">
            Your cart is empty.
            <button
                className="block mt-4 bg-cyan-600 text-white px-4 py-2 rounded"
                onClick={() => navigate("/")}
            >
                Continue Shopping
            </button>
            </div>
        ) : (
            <div className="p-6 max-w-5xl mx-auto animate__animated animate__fadeIn">
            <h2 className="text-3xl font-bold mb-6">Checkout</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                <div className="bg-white p-5 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">
                    Delivery Information
                    </h3>

                    <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    className="w-full border p-2 rounded mb-3"
                    value={form.fullName}
                    onChange={handleChange}
                    />

                    <input
                    type="text"
                    name="mobile"
                    placeholder="Mobile Number"
                    className="w-full border p-2 rounded mb-3"
                    value={form.mobile}
                    onChange={handleChange}
                    />

                    <textarea
                    name="address"
                    placeholder="Complete Address"
                    className="w-full border p-2 rounded h-28"
                    value={form.address}
                    onChange={handleChange}
                    />
                </div>

                <div className="bg-white p-5 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">Your Items</h3>

                    {cart.map((item) => (
                    <div
                        key={item._cartKey}
                        className="flex justify-between border-b py-2"
                    >
                        <span>
                        {item.name} × {item.qty}
                        </span>
                        <span>₹{item.price * item.qty}</span>
                    </div>
                    ))}
                </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-lg h-fit">
                <h3 className="text-xl font-bold mb-4">Order Summary</h3>

                <p className="flex justify-between mb-2">
                    <span>Total</span>
                    <span className="font-bold text-cyan-700">
                    ₹{cartTotal}
                    </span>
                </p>

                <button
                    onClick={createOrder}
                    className="w-full bg-cyan-600 text-white py-3 rounded-lg hover:bg-cyan-700"
                >
                    Proceed to Payment
                </button>
                </div>
            </div>
            </div>
        )}
    </Layout>
);
};

export default Checkout;
