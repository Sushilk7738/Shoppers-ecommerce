// src/pages/Home.jsx

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layout";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { fetchProductList } from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Home = () => {
const dispatch = useDispatch();
const navigate = useNavigate();

const { products = [], loading = false } =
    useSelector((state) => state.product.productList) || {};

useEffect(() => {
    dispatch(fetchProductList());
}, [dispatch]);

// ======================
// ADD TO CART (Redux)
// ======================
const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, qty: 1 }));
};

// ======================
// BUY NOW (Redux + Navigate)
// ======================
const handleBuyNow = (product) => {
    dispatch(addToCart({ ...product, qty: 1 }));
    navigate("/checkout");
};

const getImageURL = (image) => {
    return image ? `http://127.0.0.1:8000${image}` : "/images/placeholder.png";
};

const calculateFinalPrice = (price, discount, offerPrice) => {
    const p = Number(price) || 0;
    const d = Number(discount) || 0;
    const op = Number(offerPrice) || null;

    if (op) return op;
    if (d > 0) return Math.round(p - (p * d) / 100);

    return p;
};

return (
    <Layout>
        <div>

            {/* ================= HERO SLIDER ================= */}
            <header>
            <Swiper
                pagination={true}
                navigation={true}
                modules={[Navigation, Pagination]}
                slidesPerView={1}
            >
                <SwiperSlide><img src="/p4.jpg" alt="banner-1" /></SwiperSlide>
                <SwiperSlide><img src="/p2.jpg" alt="banner-2" /></SwiperSlide>
                <SwiperSlide><img src="/p3.jpg" alt="banner-3" /></SwiperSlide>
                <SwiperSlide><img src="/p.jpg" alt="banner-4" /></SwiperSlide>
            </Swiper>
            </header>

            <div className="md:p-16 p-8 bg-white">
            <h1 className="text-3xl font-bold text-center">Latest Products</h1>
            <p className="text-center text-gray-600 md:w-7/12 mx-auto mt-2 mb-16">
                Here is where we’ll show our latest products fetched from the backend.
            </p>

            <div className="md:w-10/12 mx-auto grid gap-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

                {loading &&
                Array.from({ length: 8 }).map((_, i) => (
                    <div
                    key={`skeleton-${i}`}
                    className="bg-white shadow-lg rounded-xl overflow-hidden animate-pulse"
                    >
                    <div className="w-full h-48 bg-gray-200" />
                    <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                        <div className="h-10 bg-gray-200 rounded w-full" />
                        <div className="h-10 bg-gray-200 rounded w-full" />
                    </div>
                    </div>
                ))}

                {!loading && products.length === 0 && (
                <div className="col-span-full text-center py-16 text-gray-600">
                    No products found.
                </div>
                )}

                {!loading &&
                products.slice(0, 4).map((product) => {
                    const originalPrice = Number(product.price) || 0;
                    const discount = Number(product.discount) || 0;
                    const offerPrice = Number(product.offer_price) || null;

                    const finalPrice = calculateFinalPrice(
                    originalPrice,
                    discount,
                    offerPrice
                    );

                    return (
                    <div
                        key={product._id || product.id}
                        className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-[350px]"
                    >
                        <img
                        src={getImageURL(product.image)}
                        alt={product.name}
                        className="w-full h-64 object-contain bg-white"
                        />

                        <div className="p-4">
                        <h1 className="text-lg font-semibold truncate">
                            {product.name}
                        </h1>

                        <div className="mt-2 flex items-center space-x-2">
                            <span className="text-green-600 font-bold text-lg">
                            ₹{finalPrice}
                            </span>

                            {(discount > 0 || offerPrice) && originalPrice > 0 && (
                            <>
                                <del className="text-gray-500">₹{originalPrice}</del>
                                <span className="text-gray-600 text-sm">
                                ({discount}% OFF)
                                </span>
                            </>
                            )}
                        </div>

                        <button
                            onClick={() => handleBuyNow(product)}
                            className="bg-green-500 py-2 w-full rounded text-white font-semibold mt-4"
                        >
                            Buy Now
                        </button>

                        <button
                            onClick={() => handleAddToCart(product)}
                            className="bg-rose-500 py-2 w-full rounded text-white font-semibold mt-2 flex items-center justify-center"
                        >
                            <i className="ri-shopping-cart-line mr-2"></i>
                            Add to Cart
                        </button>
                        </div>
                    </div>
                    );
                })}
            </div>
            </div>
        </div>
    </Layout>
);
};

export default Home;
