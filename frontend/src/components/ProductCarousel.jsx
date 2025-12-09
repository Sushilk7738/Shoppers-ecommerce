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

    // ADD TO CART (Redux)
    const handleAddToCart = (item) => {
        dispatch(addToCart({ ...item, qty: 1 }));
        showToast("Added to Cart!");
    };

    // BUY NOW → add item + redirect
    const handleBuyNow = (item) => {
        dispatch(addToCart({ ...item, qty: 1 }));
        navigate("/checkout");
    };

    return (
        <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{category}</h2>

        {/* ============== MOBILE VIEW ============== */}
        <div className="block md:hidden">
            <Swiper spaceBetween={15} slidesPerView={1}>
            {products.map((item) => (
                <SwiperSlide key={item.id}>
                <div className="bg-white shadow-lg rounded-xl p-3 overflow-hidden transition-all duration-300 hover:shadow-xl">

                    {/* IMAGE */}
                    <div className="aspect-square w-full overflow-hidden rounded-lg">
                    <img
                        src={item.image}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    </div>

                    {/* TITLE */}
                    <h3 className="mt-3 text-base font-semibold text-gray-900">
                    {item.title}
                    </h3>

                    {/* PRICE */}
                    <p className="text-lg font-bold text-green-600 mt-1">
                    ₹{item.price}
                    </p>

                    {/* BUTTONS */}
                    <div className="mt-4 flex gap-3">
                    <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95 hover:bg-blue-700"
                    >
                        Add to Cart
                    </button>

                    <button
                        onClick={() => handleBuyNow(item)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95 hover:bg-green-700"
                    >
                        Buy Now
                    </button>
                    </div>

                </div>
                </SwiperSlide>
            ))}
            </Swiper>
        </div>

        {/* ============== DESKTOP VIEW ============== */}
        <div className="hidden md:grid grid-cols-4 gap-6">
            {products.map((item) => (
            <div
                key={item.id}
                className="bg-white shadow-lg rounded-xl p-3 overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
                {/* IMAGE */}
                <div className="aspect-square w-full overflow-hidden rounded-lg">
                <img
                    src={item.image}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                </div>

                {/* TITLE */}
                <h3 className="mt-3 text-base font-semibold text-gray-900">
                {item.title}
                </h3>

                {/* PRICE */}
                <p className="text-lg font-bold text-green-600 mt-1">
                ₹{item.price}
                </p>

                {/* BUTTONS */}
                <div className="mt-4 flex gap-3">
                <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95 hover:bg-blue-700"
                >
                    Add to Cart
                </button>

                <button
                    onClick={() => handleBuyNow(item)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95 hover:bg-green-700"
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
