import { createSlice } from "@reduxjs/toolkit";

let initialCartItems = [];

try {
    const saved = localStorage.getItem("cartItems");
    initialCartItems = saved ? JSON.parse(saved) : [];
} catch (e) {
    console.error("Invalid cartItems JSON, clearing...", e);
    localStorage.removeItem("cartItems");
    initialCartItems = [];
}

const cartSlice = createSlice({
    name: "cart",

    initialState: {
        cartItems: initialCartItems,
    },

    reducers: {
        addToCart: (state, action) => {
            if (!action.payload || !action.payload._id) {
                console.error("INVALID PRODUCT PAYLOAD:", action.payload);
                return;
            }

            const item = {
                ...action.payload,

                _id: action.payload._id,
                _cartKey: `${action.payload._id}_${Date.now()}`,
                qty: Number(action.payload.qty) || 1,

                price: Number(
                    action.payload.price ??
                    action.payload.offer_price ??
                    0
                ),
            };

            state.cartItems.push(item);
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },

        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(
                (item) => item._cartKey !== action.payload
            );
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },

        updateQuantity: (state, action) => {
            const { _cartKey, qty } = action.payload;

            const item = state.cartItems.find(
                (i) => i._cartKey === _cartKey
            );

            if (item) {
                item.qty = qty < 1 ? 1 : qty;
            }

            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },

        clearCart: (state) => {
            state.cartItems = [];
            localStorage.removeItem("cartItems");
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
