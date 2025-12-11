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
        // ✅ ADD ITEM (with unique key)
        addToCart: (state, action) => {
            if (!action.payload || !action.payload._id) {
                console.error("INVALID PRODUCT PAYLOAD:", action.payload);
                return;
            }

            const item = {
                ...action.payload,
                _id: action.payload._id,                 // ✅ MUST EXIST
                _cartKey: `${action.payload._id}_${Date.now()}`,
                qty: action.payload.qty || 1,
            };

            state.cartItems.push(item);
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },


        // ✅ REMOVE BY _cartKey
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(
                (item) => item._cartKey !== action.payload
            );
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },

        // ✅ UPDATE QUANTITY
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

        // ✅ CLEAR CART
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
