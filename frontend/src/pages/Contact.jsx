import React, { useState } from "react";
import Layout from "../components/Layout";
import { useToast } from "../context/ToastContext";

const Contact = () => {
const { showToast } = useToast();

const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
});

const handleChange = (e) => {
    setFormData({
    ...formData,
    [e.target.name]: e.target.value,
    });
};

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
    const response = await fetch("http://127.0.0.1:8000/api/contact/", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    if (response.ok) {
        showToast("Message sent successfully");
        setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        });
    } else {
        showToast("Something went wrong. Try again.");
    }
    } catch (error) {
    showToast("Server error. Please try later.");
    }
};

return (
    <Layout>
    <main className="w-11/12 max-w-7xl mx-auto pt-6 pb-16">

        {/* HEADER */}
        <section className="mb-10 animate__animated animate__fadeInDown">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
            Contact Us
        </h1>
        <p className="mt-3 text-gray-600 max-w-2xl leading-relaxed">
            Have a question, feedback, or need help with an order?
            Our support team is always ready to help.
        </p>
        </section>

        {/* MAIN GRID */}
        <section className="grid gap-14 lg:grid-cols-2 items-start">

        {/* LEFT – IMAGE */}
        <div className="animate__animated animate__fadeInLeft">
            <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-100 via-blue-100 to-transparent rounded-3xl blur-2xl opacity-70" />

            <div className="relative bg-white rounded-3xl border border-cyan-100 shadow-lg overflow-hidden">
                <img
                src="/contact1.jpg"
                alt="Customer support"
                className="w-full h-64 md:h-80 object-cover"
                />

                <div className="p-6 space-y-4">
                <div>
                    <p className="text-sm font-medium text-gray-900">
                    Customer Support
                    </p>
                    <p className="text-sm text-gray-600">
                    support@shoppers.com
                    </p>
                </div>

                <div>
                    <p className="text-sm font-medium text-gray-900">
                    Phone
                    </p>
                    <p className="text-sm text-gray-600">
                    +91 98XXXXXX52
                    </p>
                </div>

                <div>
                    <p className="text-sm font-medium text-gray-900">
                    Working Hours
                    </p>
                    <p className="text-sm text-gray-600">
                    Mon – Sat, 9:00 AM – 8:00 PM
                    </p>
                </div>
                </div>
            </div>
            </div>
        </div>

        {/* RIGHT – FORM */}
        <div className="animate__animated animate__fadeInRight">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
                Send us a message
            </h2>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                </label>
                <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                </label>
                <textarea
                    rows="4"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
                </div>

                <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-cyan-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-cyan-700 transition"
                >
                Send Message
                </button>
            </form>
            </div>
        </div>

        </section>
    </main>
    </Layout>
);
};

export default Contact;
