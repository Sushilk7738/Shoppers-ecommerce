import userReducer from '../slices/userSlice';
import productReducer from '../slices/productSlice';
import orderReducer from '../slices/orderSlice';
import cartReducer from '../slices/cartSlice';
import { combineReducers } from '@reduxjs/toolkit';

export const rootReducer = combineReducers({
    user: userReducer,
    product: productReducer,
    order: orderReducer,
    cart: cartReducer,
});
