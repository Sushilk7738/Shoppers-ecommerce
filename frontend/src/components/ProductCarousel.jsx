import { useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "animate.css";
import { addToCart } from "../redux/slices/cartSlice";
import { useToast } from "../context/ToastContext";

// swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const ProductCarousel = ({ category, products = [] }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const hasAnimated = useRef(false);

    const getFinalPrice = useCallback((product) => {
        if (product.offer_price) return product.offer_price;
        if (product.discount) {
            return Math.round(
                product.price - (product.price * product.discount) / 100
            );
        }
        return product.price;
    }, []);

    // add item
    const addToCartCommon = useCallback(
        (product) => {
            if (!product?.id) return;

            dispatch(
                addToCart({
                    id: product.id,          // single id
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

    if (!hasAnimated.current && products.length > 0) {
        hasAnimated.current = true;
    }

    const ProductCard = ({ product }) => (
        <div
            className={`bg-white rounded-xl p-4 shadow-lg
                ${
                    !hasAnimated.current
                        ? "animate__animated animate__fadeInUp"
                        : ""
                }
                transition-all duration-300
                hover:-translate-y-1 hover:shadow-2xl`}
        >
            <div className="aspect-square bg-gray-100 overflow-hidden rounded-lg">
                <img
                    src={product.image}
                    alt={product.name || "product"}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
            </div>

            <h3 className="mt-3 font-semibold truncate">
                {product.name}
            </h3>

            <div className="mt-1 flex items-center gap-2">
                <span className="text-lg font-bold text-green-600">
                    ₹{getFinalPrice(product)}
                </span>

                {(product.discount || product.offer_price) && (
                    <span className="text-sm line-through text-gray-500">
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
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold"
                >
                    Add to Cart
                </button>

                <button
                    onClick={() => buyNow(product)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold"
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

            <div className="block md:hidden">
                <Swiper slidesPerView={1} spaceBetween={12}>
                    {products.map((product) => (
                        <SwiperSlide key={product.id}>
                            <ProductCard product={product} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
};

export default ProductCarousel;
