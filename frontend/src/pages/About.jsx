import React from "react";
import Layout from "../components/Layout";

const stats = [
{ label: "Daily Orders", value: "5K+" },
{ label: "Pin Codes Served", value: "120+" },
{ label: "Customer Rating", value: "4.8/5" },
];

const features = [
{
    title: "Fresh groceries, always",
    description:
    "We work with trusted suppliers so fruits, veggies, and essentials reach you fresh and on time.",
},
{
    title: "Smart cart experience",
    description:
    "Real-time cart updates, transparent pricing, and clear order summary before checkout.",
},
{
    title: "Secure & fast payments",
    description:
    "Integrated with Razorpay so payments are quick, protected, and hassle-free.",
},
];

const values = [
{
    title: "Reliability first",
    description:
    "Clear timelines, accurate order tracking, and on-time deliveries you can trust.",
},
{
    title: "Customer obsessed",
    description:
    "Every UX decision is tuned to reduce friction and save your time.",
},
{
    title: "Continuous improvement",
    description:
    "We improve the platform constantly based on real user behavior.",
},
];

const About = () => {
return (
    <Layout>
    <main className="w-11/12 max-w-7xl mx-auto py-10 md:py-16 space-y-16 md:space-y-24">

        {/* HERO */}
        <section className="grid gap-10 md:grid-cols-2 items-center">
        <div className="space-y-6 animate__animated animate__fadeInLeft">
            <p className="inline-flex items-center text-xs font-semibold tracking-wide uppercase text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">
            About Shoppers
            </p>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight">
            Groceries delivered
            <span className="text-cyan-600"> the smarter way</span>
            </h1>

            <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-xl">
            Shoppers simplifies everyday grocery shopping by combining fresh products,
            reliable delivery, and a clean digital experience.
            </p>

            <ul className="space-y-2 text-sm md:text-base text-gray-700">
            <li className="flex gap-2">
                <span className="mt-1 text-cyan-500">●</span>
                <span>Live cart updates and transparent order summary.</span>
            </li>
            <li className="flex gap-2">
                <span className="mt-1 text-cyan-500">●</span>
                <span>Delivery slots that fit your daily routine.</span>
            </li>
            <li className="flex gap-2">
                <span className="mt-1 text-cyan-500">●</span>
                <span>Secure Razorpay checkout with instant confirmation.</span>
            </li>
            </ul>
        </div>

        {/* HERO IMAGE */}
        <div className="relative animate__animated animate__fadeInUp">
            <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-100 via-blue-100 to-transparent rounded-3xl blur-2xl opacity-70" />

            <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-cyan-100">
            <img
                src="/ecom.jpg"
                alt="Shoppers grocery delivery"
                className="w-full h-64 md:h-80 lg:h-96 object-cover"
            />

            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur rounded-2xl px-4 py-3 flex items-center justify-between shadow-md">
                <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                    Live order tracking
                </p>
                <p className="text-sm font-semibold text-gray-900">
                    Cart to doorstep
                </p>
                </div>
                <div className="text-right">
                <p className="text-[11px] text-gray-500">Avg delivery</p>
                <p className="text-sm font-semibold text-cyan-600">
                    30–45 mins
                </p>
                </div>
            </div>
            </div>
        </div>
        </section>

        {/* STATS */}
        <section className="grid gap-6 sm:grid-cols-3 bg-cyan-50 rounded-2xl px-6 md:px-10 py-8 md:py-10">
        {stats.map((item) => (
            <div key={item.label} className="text-center sm:text-left">
            <p className="text-2xl md:text-3xl font-semibold text-gray-900">
                {item.value}
            </p>
            <p className="mt-1 text-xs md:text-sm text-cyan-700">
                {item.label}
            </p>
            </div>
        ))}
        </section>

        {/* STORY */}
        <section className="grid gap-10 md:grid-cols-2 items-start">
        <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Who we are
            </h2>
            <p className="text-gray-600 leading-relaxed">
            Shoppers was built to remove everyday grocery pain points —
            long waits, unreliable deliveries, and confusing checkout flows.
            </p>
            <p className="text-gray-600 leading-relaxed">
            Our platform uses Django REST on the backend and React + Redux
            on the frontend to keep orders, carts, and payments in sync.
            </p>
        </div>

        <div className="space-y-4 bg-white border border-gray-100 rounded-2xl p-6 md:p-7 shadow-sm">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900">
            Designed for clarity
            </h3>
            <p className="text-gray-600 leading-relaxed">
            Every interaction—from adding to cart to payment—follows
            a predictable and transparent flow.
            </p>
            <p className="text-gray-600 leading-relaxed">
            The goal is simple: no confusion, no hidden steps.
            </p>
        </div>
        </section>

        {/* FEATURES */}
        <section className="space-y-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 text-center">
            Why shoppers trust <span className="text-cyan-600">Shoppers</span>
        </h2>

        <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
            <article
                key={feature.title}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow animate__animated animate__fadeInUp"
            >
                <div className="w-9 h-9 rounded-full bg-cyan-50 flex items-center justify-center mb-4">
                <span className="text-cyan-600 text-lg">✔</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                {feature.title}
                </h3>
                <p className="mt-3 text-gray-600 leading-relaxed">
                {feature.description}
                </p>
            </article>
            ))}
        </div>
        </section>

        {/* VALUES / CTA */}
        <section className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 bg-cyan-50 rounded-2xl p-6 md:p-8 space-y-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
            What we value
            </h2>

            <div className="grid sm:grid-cols-3 gap-4">
            {values.map((value) => (
                <div key={value.title}>
                <p className="font-semibold text-gray-900">
                    {value.title}
                </p>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                    {value.description}
                </p>
                </div>
            ))}
            </div>
        </div>

        <div className="bg-cyan-600 rounded-2xl p-6 md:p-8 text-white flex flex-col justify-between animate__animated animate__fadeInRight">
            <div>
            <p className="text-xs uppercase tracking-wide text-cyan-100">
                Built for scale
            </p>
            <h3 className="text-xl font-semibold mt-2">
                Fast, clean, responsive on every device
            </h3>
            <p className="mt-3 text-sm text-cyan-100 leading-relaxed">
                From mobile to desktop, Shoppers remains smooth,
                predictable, and fast.
            </p>
            </div>

            <p className="mt-6 text-sm text-cyan-100">
            Explore products and experience the flow yourself.
            </p>
        </div>
        </section>

    </main>
    </Layout>
);
};

export default About;
