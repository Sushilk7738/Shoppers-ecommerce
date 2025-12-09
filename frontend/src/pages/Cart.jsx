import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQuantity } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector((state) => state.cart.cartItems);

    // TOTAL PRICE
    const cartTotal = cart.reduce(
        (total, item) => total + item.price * item.qty,
        0
    );

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

                    {/* LEFT PRODUCTS */}
                    <div className="md:col-span-2 space-y-4">
                        {cart.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-4 p-4 shadow-md rounded-xl bg-white"
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-20 h-20 rounded-md object-cover"
                                />

                                <div className="flex-1">
                                    <h2 className="font-semibold text-sm md:text-base">
                                        {item.title}
                                    </h2>
                                    <p className="text-cyan-700 font-bold">
                                        ₹{item.price}
                                    </p>

                                    {/* QUANTITY CONTROLS */}
                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            onClick={() =>
                                                dispatch(
                                                    updateQuantity({
                                                        id: item.id,
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
                                                        id: item.id,
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
                                    onClick={() => dispatch(removeFromCart(item.id))}
                                    className="text-red-600 font-semibold hover:text-red-800"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT SUMMARY */}
                    <div className="bg-white shadow-lg rounded-xl p-5 h-fit">
                        <h2 className="text-xl font-bold mb-3">Order Summary</h2>

                        <p className="text-lg font-semibold">
                            Total:{" "}
                            <span className="text-cyan-700">
                                ₹{cartTotal}
                            </span>
                        </p>

                        <button
                            className="w-full bg-cyan-600 text-white py-2 rounded-lg mt-4
                                hover:bg-cyan-700 active:scale-95 transition"
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
