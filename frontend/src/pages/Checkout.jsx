import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";
import "animate.css";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
    const { showToast } = useToast();
    const navigate = useNavigate();

    // ===== CART FROM REDUX (single source of truth) =====
    const cart = useSelector((state) => state.cart.cartItems) || [];

    // If user opens checkout with empty cart → block them
    if (!cart || cart.length === 0) {
        return (
        <Layout>
            <div className="p-10 text-center text-xl font-semibold">
            Your cart is empty.  
            <button
                className="block mt-4 bg-cyan-600 text-white px-4 py-2 rounded"
                onClick={() => navigate("/")}
            >
                Continue Shopping
            </button>
            </div>
        </Layout>
        );
    }

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    // ===== USER TOKEN =====
    const tokenFromStore = useSelector((state) => state.user.token);

    const token =
    tokenFromStore ||
    (typeof window !== "undefined" ? localStorage.getItem("token") : null);

    
    
    const [form, setForm] = useState({
        fullName: "",
        mobile: "",
        address: "",
    });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });


    const verifyPayment = async (response) => {
        console.log("TOKEN SENT TO VERIFY:", token);
        const paymentData = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            amount: cartTotal,
            address: form,
            cartItems: cart,
        };

        try {
            const res = await fetch("http://127.0.0.1:8000/api/orders/verify-payment/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
            },
            body: JSON.stringify(paymentData),
            });

            const data = await res.json();
            console.log("VERIFY RESPONSE:", data);

            if (res.ok) {
            showToast("Order Completed Successfully!");
            navigate("/"); // later we will change this to Order Success Page
            } else {
            showToast(data.detail || "Verification failed");
            }
        } catch (error) {
            console.log("Verify error:", error);
        }
        };

    
    
    
    
    // ===== CREATE ORDER (backend) =====
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

    // ===== RAZORPAY PAYMENT WINDOW =====
    if (!window.Razorpay) {
        alert("Razorpay SDK failed to load. Check your internet or script tag.");
        return;
    }

    const openRazorpay = (order) => {
        console.log("RAZORPAY KEY FROM BACKEND:", order.key);
        const options = {
            key: order.key,
            amount: order.amount,
            currency: "INR",
            order_id: order.id,
            name: "Shoppers Store",
            description: "Order Payment",

            handler: function (response) {
                console.log("Payment Success:", response);
                verifyPayment(response);
        },

        prefill: {
            name: form.fullName,
            contact: form.mobile,
        },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

return (
    <Layout>
    <div className="p-6 max-w-5xl mx-auto animate__animated animate__fadeIn">
        <h2 className="text-3xl font-bold mb-6 tracking-wide">Checkout</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* LEFT SIDE */}
        <div className="md:col-span-2 space-y-6">

            {/* ADDRESS */}
            <div className="bg-white p-5 rounded-xl shadow-lg animate__animated animate__fadeInUp hover:shadow-xl transition-all">
            <h3 className="text-xl font-semibold mb-4">Delivery Information</h3>

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
            ></textarea>
            </div>

            {/* CART ITEMS */}
            <div className="bg-white p-5 rounded-xl shadow-lg animate__animated animate__fadeInUp hover:shadow-xl transition-all">
            <h3 className="text-xl font-semibold mb-4">Your Items</h3>

            <div className="space-y-4">
                {cart.map((item, i) => (
                <div
                    key={`${item.id}-${i}`}
                    className="flex items-center gap-4 border-b pb-3 animate__animated animate__fadeInUp"
                >
                    <img
                    src={item.image}
                    className="w-16 h-16 rounded-md object-cover shadow-sm"
                    alt={item.title}
                    />

                    <div className="flex-1">
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-sm text-gray-600">
                        Qty: {item.qty} × ₹{item.price}
                    </p>
                    </div>

                    <p className="font-bold text-cyan-700">
                    ₹{item.qty * item.price}
                    </p>
                </div>
                ))}
            </div>
            </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white p-5 rounded-xl shadow-lg h-fit animate__animated animate__fadeInRight hover:shadow-xl transition-all">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>

            <p className="flex justify-between mb-1">
            <span>Items Total</span>
            <span className="font-medium">₹{cartTotal}</span>
            </p>

            <p className="flex justify-between mb-1">
            <span>Shipping</span>
            <span className="font-medium text-cyan-600">Free</span>
            </p>

            <hr className="my-4" />

            <p className="flex justify-between text-lg font-semibold mb-4">
            <span>Total Amount</span>
            <span className="text-cyan-700">₹{cartTotal}</span>
            </p>

            
            <button
            onClick={createOrder}
            className="w-full bg-cyan-600 text-white py-3 rounded-lg hover:bg-cyan-700 transition shadow-md"
            >
            Proceed to Payment
            </button>
        </div>

        </div>
    </div>
    </Layout>
);
};

export default Checkout;
