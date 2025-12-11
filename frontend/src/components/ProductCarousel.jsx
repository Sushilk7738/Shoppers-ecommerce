import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";

const ProductCarousel = ({ category, products }) => {
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const navigate = useNavigate();

    // ✅ ADD TO CART
    const handleAddToCart = (product) => {
        console.log("ADD TO CART PRODUCT:", product);
        console.log("PRODUCT _ID:", product?._id);

        
        dispatch(
            addToCart({
                _id: product._id,          // ✅ DB ID
                title: product.name,       // ✅ cart needs title
                price: product.price,
                image: product.image,
                qty: 1,
            })
        );
        showToast("Added to Cart!");
    };

    // ✅ BUY NOW
    const handleBuyNow = (product) => {
        dispatch(
            addToCart({
                _id: product._id,
                title: product.name,
                price: product.price,
                image: product.image,
                qty: 1,
            })
        );
        navigate("/checkout");
    };

    return (
        <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                {category}
            </h2>

            {/* ========= MOBILE VIEW ========= */}
            <div className="block md:hidden">
                <Swiper spaceBetween={15} slidesPerView={1}>
                    {products.map((product) => (
                        <SwiperSlide key={product._id}>
                            <div className="bg-white shadow-lg rounded-xl p-3 overflow-hidden transition-all duration-300 hover:shadow-xl">

                                <div className="aspect-square w-full overflow-hidden rounded-lg">
                                    <img
                                        src={`http://127.0.0.1:8000${product.image}`}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                    />
                                </div>

                                <h3 className="mt-3 text-base font-semibold text-gray-900">
                                    {product.name}
                                </h3>

                                <p className="text-lg font-bold text-green-600 mt-1">
                                    ₹{product.price}
                                </p>

                                <div className="mt-4 flex gap-3">
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                                    >
                                        Add to Cart
                                    </button>

                                    <button
                                        onClick={() => handleBuyNow(product)}
                                        className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* ========= DESKTOP VIEW ========= */}
            <div className="hidden md:grid grid-cols-4 gap-6">
                {products.map((product) => (
                    <div
                        key={product._id}
                        className="bg-white shadow-lg rounded-xl p-3 overflow-hidden transition-all duration-300 hover:shadow-xl"
                    >
                        <div className="aspect-square w-full overflow-hidden rounded-lg">
                            <img
                                src={`http://127.0.0.1:8000${product.image}`}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                            />
                        </div>

                        <h3 className="mt-3 text-base font-semibold text-gray-900">
                            {product.name}
                        </h3>

                        <p className="text-lg font-bold text-green-600 mt-1">
                            ₹{product.price}
                        </p>

                        <div className="mt-4 flex gap-3">
                            <button
                                onClick={() => handleAddToCart(product)}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                            >
                                Add to Cart
                            </button>

                            <button
                                onClick={() => handleBuyNow(product)}
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
