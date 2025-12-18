import { createSlice } from "@reduxjs/toolkit";
import productAPI from "../../mocks/product";
import { normalizeProduct } from "../../utils/normalize";

const initialState = {
    productList: {
        products: [],
        loading: false,
        error: null,
        page: 0,
        pages: 0,
    },
    productDetails: {
        product: { reviews: [] },
        loading: false,
        error: null,
    },
    createReview: {
        loading: false,
        error: null,
        success: false,
    },
    topRatedProducts: {
        products: [],
        loading: false,
        error: null,
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
            state.productList.products = action.payload.products || [];
            state.productList.page = action.payload.page ?? 0;
            state.productList.pages = action.payload.pages ?? 0;
        },
        productListFailure(state, action) {
            state.productList.loading = false;
            state.productList.error = action.payload;
        },

        productDetailsRequest(state) {
            state.productDetails.loading = true;
            state.productDetails.error = null;
        },
        productDetailsSuccess(state, action) {
            state.productDetails.loading = false;
            state.productDetails.product = action.payload;
        },
        productDetailsFailure(state, action) {
            state.productDetails.loading = false;
            state.productDetails.error = action.payload;
        },

        createReviewRequest(state) {
            state.createReview.loading = true;
            state.createReview.error = null;
            state.createReview.success = false;
        },
        createReviewSuccess(state) {
            state.createReview.loading = false;
            state.createReview.success = true;
        },
        createReviewFailure(state, action) {
            state.createReview.loading = false;
            state.createReview.error = action.payload;
        },

        productTopRequest(state) {
            state.topRatedProducts.loading = true;
            state.topRatedProducts.error = null;
        },
        productTopSuccess(state, action) {
            state.topRatedProducts.loading = false;
            state.topRatedProducts.products = action.payload || [];
        },
        productTopFailure(state, action) {
            state.topRatedProducts.loading = false;
            state.topRatedProducts.error = action.payload;
        },
    },
});

export const {
    productListRequest,
    productListSuccess,
    productListFailure,
    productDetailsRequest,
    productDetailsSuccess,
    productDetailsFailure,
    createReviewRequest,
    createReviewSuccess,
    createReviewFailure,
    productTopRequest,
    productTopSuccess,
    productTopFailure,
} = productSlice.actions;

export const fetchProductList =
    (keyword = "", pageNumber = "") =>
    async (dispatch) => {
        try {
            dispatch(productListRequest());

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/products/?search=${keyword}&page=${pageNumber}`
            );

            if (!res.ok) {
                throw new Error("Failed to fetch products");
            }

            const data = await res.json();

            const rawProducts = Array.isArray(data)
                ? data
                : Array.isArray(data.products)
                ? data.products
                : [];

            const normalizedProducts = rawProducts.map(normalizeProduct);

            dispatch(
                productListSuccess({
                    products: normalizedProducts,
                    page: data.page ?? 0,
                    pages: data.pages ?? 0,
                })
            );
        } catch (error) {
            dispatch(
                productListFailure(
                    error?.message || "Failed to load products"
                )
            );
        }
    };

export const fetchProductDetails = (id) => async (dispatch) => {
    try {
        dispatch(productDetailsRequest());
        const productDetails = await productAPI.getProductDetails(id);
        dispatch(productDetailsSuccess(normalizeProduct(productDetails)));
    } catch (error) {
        dispatch(
            productDetailsFailure(
                error?.message || "Failed to load product"
            )
        );
    }
};

export const createReview =
    (productId, review) => async (dispatch) => {
        try {
            dispatch(createReviewRequest());
            await productAPI.createProductReview(productId, review);
            dispatch(createReviewSuccess());
        } catch (error) {
            dispatch(
                createReviewFailure(
                    error?.message || "Failed to create review"
                )
            );
        }
    };

export const fetchTopRatedProducts = () => async (dispatch) => {
    try {
        dispatch(productTopRequest());
        const topRatedProducts =
            await productAPI.getTopRatedProducts();
        const normalizedTopProducts = Array.isArray(topRatedProducts)
            ? topRatedProducts.map(normalizeProduct)
            : [];
        dispatch(productTopSuccess(normalizedTopProducts));
    } catch (error) {
        dispatch(
            productTopFailure(
                error?.message || "Failed to load top products"
            )
        );
    }
};

export default productSlice.reducer;
