import { apiFetch } from "./client";  //single gateway

export const productAPI = {
    getProducts: (keyword = "", page = "") =>
        apiFetch(`/api/products/?search=${keyword}&page=${page}`),

    getProductDetails: (id) =>
        apiFetch(`/api/products/${id}/`),

    getTopRated: ()=>
        apiFetch(`/api/products/top/`),
}