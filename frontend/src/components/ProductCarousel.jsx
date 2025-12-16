import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "animate.css";
import { addToCart } from "../redux/slices/cartSlice";
import { useToast } from "../context/ToastContext";

// swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const ProductCarousel = ({ category, products = [] }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const getFinalPrice = useCallback((product) => {
        if (product.offer_price) return product.offer_price;
        if (product.discount) {
            return Math.round(
                product.price - (product.price * product.discount) / 100
            );
        }
        return product.price;
    }, []);

    const addToCartCommon = useCallback(
        (product) => {
            if (!product?._id) return;

            dispatch(
                addToCart({
                    _id: product._id ?? product.id,
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

    const addItem = (product) => {
        addToCartCommon(product);
        showToast("Added to Cart!");
    };

    const buyNow = (product) => {
        addToCartCommon(product);
        navigate("/checkout");
    };

    if (!products.length) return null;

    const ProductCard = ({ product, index }) => (
        <div
            className="bg-white rounded-xl p-4 shadow-lg
                       animate__animated animate__fadeInUp
                       transition-all duration-300
                       hover:-translate-y-1 hover:shadow-2xl"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <div className="aspect-square bg-gray-100 overflow-hidden rounded-lg">
                <img
                    src={product.image}
                    alt={product.name || "product"}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
            </div>

            <h3 className="mt-3 font-semibold text-gray-900 truncate">
                {product.name}
            </h3>

            <div className="mt-1 flex items-center gap-2">
                <span className="text-lg font-bold text-green-600">
                    ₹{getFinalPrice(product)}
                </span>

                {(product.discount || product.offer_price) && (
                    <span className="text-sm text-gray-500 line-through">
                        ₹{product.price}
                    </span>
                )}

                {product.discount && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full animate__animated animate__pulse animate__infinite">
                        {product.discount}% OFF
                    </span>
                )}
            </div>

            <div className="mt-4 flex gap-3">
                <button
                    onClick={() => addItem(product)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                >
                    Add to Cart
                </button>

                <button
                    onClick={() => buyNow(product)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                >
                    Buy Now
                </button>
            </div>
        </div>
    );

    return (
        <section className="mb-14">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                {category}
            </h2>

            {/* ===== MOBILE VIEW → SWIPER ===== */}
            <div className="block md:hidden">
                <Swiper
                    slidesPerView={1.2}
                    spaceBetween={16}
                    pagination={{ clickable: true }}
                    modules={[Pagination]}
                >
                    {products.map((product, index) => (
                        <SwiperSlide key={product._id || index}>
                            <ProductCard product={product} index={index} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* ===== DESKTOP / TABLET → GRID ===== */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product, index) => (
                    <ProductCard
                        key={product._id || index}
                        product={product}
                        index={index}
                    />
                ))}
            </div>
        </section>
    );
};

export default ProductCarousel;
