import { createSlice } from "@reduxjs/toolkit";
import { productAPI } from "../../api/product.api"; // centralized API
import { normalizeProduct } from "../../utils/normalize"; // normalize once

const initialState = {
    productList: {
        products: [],
        loading: false,
        error: null,
        page: 0,
        pages: 0,
        fetched: false, // fetch guard
    },
};

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        productListRequest(state) {
            state.productList.loading = true;
            state.productList.error = null;
        },
        productListSuccess(state, action) {
            state.productList.loading = false;
            state.productList.products = action.payload.products;
            state.productList.page = action.payload.page;
            state.productList.pages = action.payload.pages;
            state.productList.fetched = true; // mark fetched
        },
        productListFailure(state, action) {
            state.productList.loading = false;
            state.productList.error = action.payload;
        },
    },
});

export const {
    productListRequest,
    productListSuccess,
    productListFailure,
} = productSlice.actions;

// single fetch 
export const fetchProductList =
    (keyword = "", page = "") =>
    async (dispatch) => {
        try {
            dispatch(productListRequest());

            const data = await productAPI.getProducts(keyword, page);

            const raw = Array.isArray(data?.products)
                ? data.products
                : Array.isArray(data)
                ? data
                : [];

            const products = raw.map(normalizeProduct);

            dispatch(
                productListSuccess({
                    products,
                    page: data?.page ?? 0,
                    pages: data?.pages ?? 0,
                })
            );
        } catch (err) {
            dispatch(
                productListFailure(err?.message || "Failed to load products")
            );
        }
    };


export default productSlice.reducer;
