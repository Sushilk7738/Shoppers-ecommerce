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
        // ADD ITEM
        addToCart: (state, action) => {
            state.cartItems.push(action.payload);
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },

        // REMOVE BY ID
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(
                (item) => item.id !== action.payload
            );
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },

        // CLEAR ALL ITEMS (used during LOGOUT)
        clearCart: (state) => {
            state.cartItems = [];
            localStorage.removeItem("cartItems");
        },

        updateQuantity: (state, action) => {
            const { id, qty } = action.payload;

            const item = state.cartItems.find((i) => i.id === id);
            if (item) {
                item.qty = qty < 1 ? 1 : qty;
            }

            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
    },
});

export const { addToCart, removeFromCart, clearCart, updateQuantity,} = cartSlice.actions;
export default cartSlice.reducer;
