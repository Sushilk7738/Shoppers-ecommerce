import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "animate.css";
import { addToCart } from "../redux/slices/cartSlice";
import { useToast } from "../context/ToastContext";

const ProductCarousel = ({ category, products = [] }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showToast } = useToast();

    // SAME logic, memo-safe
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

    return (
        <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                {category}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((product, index) => (
                    <div
                        key={product._id || `${category}-${index}`}
                        className="bg-white rounded-xl p-4 shadow-lg
                                    animate__animated animate__fadeInUp
                                    transition-all duration-300
                                    hover:-translate-y-1 hover:shadow-2xl"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="aspect-square overflow-hidden rounded-lg">
                            <img
                                src={product.image}
                                alt={product.name || "product"}
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
                                <span
                                    className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full
                                                animate__animated animate__pulse animate__infinite"
                                >
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
                ))}
            </div>
        </section>
    );
};

export default ProductCarousel;
