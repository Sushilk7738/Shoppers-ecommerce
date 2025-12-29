import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { fetchProductList } from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";

// swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "animate.css";

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { products = [], loading = false } =
        useSelector((state) => state.product.productList || {});

    useEffect(() => {
        dispatch(fetchProductList());
    }, [dispatch]);

    const getFinalPrice = useCallback((product) => {
        if (product?.offer_price) return product.offer_price;
        if (product?.discount) {
            return Math.round(
                product.price - (product.price * product.discount) / 100
            );
        }
        return product?.price || 0;
    }, []);

    const addItem = useCallback(
        (product) => {
            if (!product?.id) return;
            dispatch(
                addToCart({
                    id: product.id,         
                    title: product.name,
                    price: Number(getFinalPrice(product)),
                    originalPrice: Number(product.price),
                    image: product.image,
                    qty: 1,
                })
            );
        },
        [dispatch, getFinalPrice]
    );

    const buyNow = (product) => {
        addItem(product);
        navigate("/checkout");
    };

    return (
        <Layout>
            <div className="bg-white">
                {/* banner */}
                <header className="mb-6 h-[220px] md:h-[420px]">
                    <Swiper
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        modules={[Navigation, Pagination]}
                        className="h-full"
                    >
                        <SwiperSlide>
                            <img src="/p4.jpg" className="w-full h-full object-cover" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="/p2.jpg" className="w-full h-full object-cover" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="/p3.jpg" className="w-full h-full object-cover" />
                        </SwiperSlide>
                    </Swiper>
                </header>

                {/* products */}
                <section className="px-6 md:px-16 pb-20">
                    <h1 className="text-3xl font-bold text-center mb-2">
                        Latest Products
                    </h1>

                    {loading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                            {Array.from({ length: 8 }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className="h-[350px] bg-gray-100 rounded-xl animate-pulse"
                                />
                            ))}
                        </div>
                    )}

                    {!loading && products.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {products.slice(0, 4).map((product, index) => (
                                <div
                                    key={product.id}   // id only
                                    className="bg-white rounded-xl shadow-lg overflow-hidden
                                        animate__animated animate__fadeInUp
                                        transition-all duration-300
                                        hover:-translate-y-1 hover:shadow-2xl"
                                    style={{ animationDelay: `${index * 0.08}s` }}
                                >
                                    <div className="h-64 bg-gray-100 overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            loading="lazy"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>

                                    <div className="p-4">
                                        <h2 className="font-semibold truncate">
                                            {product.name}
                                        </h2>

                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="text-lg font-bold text-green-600">
                                                ₹{getFinalPrice(product)}
                                            </span>

                                            {(product.discount || product.offer_price) && (
                                                <span className="text-sm line-through text-gray-500">
                                                    ₹{product.price}
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-4 space-y-2">
                                            <button
                                                onClick={() => buyNow(product)}
                                                className="w-full bg-green-600 text-white py-2 rounded-lg"
                                            >
                                                Buy Now
                                            </button>

                                            <button
                                                onClick={() => addItem(product)}
                                                className="w-full bg-blue-600 text-white py-2 rounded-lg"
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </Layout>
    );
};

export default Home;
