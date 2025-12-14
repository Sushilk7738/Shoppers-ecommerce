import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQuantity } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/image";

const Cart = () => {
const dispatch = useDispatch();
const navigate = useNavigate();

// STATE
const cart = useSelector((state) => state.cart.cartItems) || [];

// TOTAL
const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0
);

// EMPTY
if (cart.length === 0) {
    return (
        <Layout>
            <h2 className="text-center mt-10 text-xl font-semibold">
                Your Cart is Empty
            </h2>
        </Layout>
    );
}

return (
    <Layout>
        <div className="p-5 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-5">Your Cart</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* ITEMS */}
                <div className="md:col-span-2 space-y-4">
                    {cart.map((item) => {
                        // GUARD
                        if (!item || !item._cartKey) return null;

                        return (
                            <div
                                key={item._cartKey}
                                className="flex items-center gap-4 p-4 shadow-md rounded-xl bg-white"
                            >
                                <img
                                    src={getImageUrl(item.image)}
                                    alt={item.title}
                                    className="w-20 h-20 rounded-md object-cover"
                                />

                                <div className="flex-1">
                                    <h2 className="font-semibold">
                                        {item.title}
                                    </h2>

                                    <p className="text-cyan-700 font-bold">
                                        ₹{item.price}
                                    </p>

                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            onClick={() =>
                                                item.qty > 1 &&
                                                dispatch(
                                                    updateQuantity({
                                                        _cartKey: item._cartKey,
                                                        qty: item.qty - 1,
                                                    })
                                                )
                                            }
                                            className="px-3 py-1 bg-gray-300 rounded"
                                        >
                                            -
                                        </button>

                                        <span className="px-3 py-1 bg-gray-100 rounded">
                                            {item.qty}
                                        </span>

                                        <button
                                            onClick={() =>
                                                dispatch(
                                                    updateQuantity({
                                                        _cartKey: item._cartKey,
                                                        qty: item.qty + 1,
                                                    })
                                                )
                                            }
                                            className="px-3 py-1 bg-gray-300 rounded"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* REMOVE */}
                                <button
                                    onClick={() =>
                                        dispatch(removeFromCart(item._cartKey))
                                    }
                                    className="text-red-600 font-semibold"
                                >
                                    Remove
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* SUMMARY */}
                <div className="bg-white shadow-lg rounded-xl p-5 h-fit">
                    <h2 className="text-xl font-bold mb-3">
                        Order Summary
                    </h2>

                    <p className="text-lg font-semibold">
                        Total:
                        <span className="text-cyan-700 ml-1">
                            ₹{cartTotal}
                        </span>
                    </p>

                    <button
                        className="w-full bg-cyan-600 text-white py-2 rounded-lg mt-4"
                        onClick={() => navigate("/checkout")}
                    >
                        Proceed to Checkout
                    </button>
                </div>

            </div>
        </div>
    </Layout>
);
};

export default Cart;
