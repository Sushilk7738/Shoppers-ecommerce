import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Layout from "../components/Layout";
import "animate.css";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";

const Checkout = () => {
const { showToast } = useToast();
const navigate = useNavigate();
const dispatch = useDispatch();

// ✅ CART
const cart = useSelector((state) => state.cart.cartItems) || [];

// ✅ TOKEN
const tokenFromStore = useSelector((state) => state.user.token);
const token =
    tokenFromStore ||
    (typeof window !== "undefined" ? localStorage.getItem("token") : null);

// ✅ FORM STATE
const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    address: "",
});

const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
);

// ✅ VERIFY PAYMENT
const verifyPayment = async (response) => {
    const paymentData = {
    razorpay_payment_id: response.razorpay_payment_id,
    razorpay_order_id: response.razorpay_order_id,
    razorpay_signature: response.razorpay_signature,
    amount: cartTotal,
    address: form,
    cartItems: cart,
    };

    try {
    const res = await fetch(
        "http://127.0.0.1:8000/api/orders/verify-payment/",
        {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(paymentData),
        }
    );

    const data = await res.json();

    if (res.ok) {
        showToast("Order Completed Successfully!");
        dispatch(clearCart());
        navigate("/my-orders");
    } else {
        showToast(data.detail || "Verification failed");
    }
    } catch (error) {
    console.log(error);
    showToast("Payment verification failed");
    }
};

// ✅ CREATE ORDER
const createOrder = async () => {
    if (!token) {
    showToast("Please login before checkout");
    return;
    }

    if (!form.fullName || !form.mobile || !form.address) {
    showToast("Please fill all fields");
    return;
    }

    try {
    const response = await fetch(
        "http://127.0.0.1:8000/api/orders/create-order/",
        {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: cartTotal }),
        }
    );

    const order = await response.json();

    if (!response.ok) {
        showToast(order.detail || "Order creation failed");
        return;
    }

    openRazorpay(order);
    } catch (err) {
    console.log(err);
    showToast("Something went wrong!");
    }
};

// ✅ OPEN RAZORPAY (NOT DURING RENDER)
const openRazorpay = (order) => {
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
};

// ✅ SINGLE RETURN (CRITICAL FIX)
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
            {/* LEFT */}
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

                {cart.map((item, i) => (
                <div
                    key={`${item.id}-${i}`}
                    className="flex justify-between border-b py-2"
                >
                    <span>
                    {item.title} × {item.qty}
                    </span>
                    <span>₹{item.price * item.qty}</span>
                </div>
                ))}
            </div>
            </div>

            {/* RIGHT */}
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
