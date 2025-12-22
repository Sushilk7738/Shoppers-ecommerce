import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layout";
import ProductCarousel from "../components/ProductCarousel";
import { fetchProductList } from "../redux/slices/productSlice";

const Products = () => {
    const dispatch = useDispatch();
    const hasFetched = useRef(false);

    const {
        products = [],
        loading = false,
        error = null,
    } = useSelector((state) => state.product.productList || {});

    /* fetch products once */
    useEffect(() => {
        if (!hasFetched.current && products.length === 0) {
        dispatch(fetchProductList());
        hasFetched.current = true;
        }
    }, [dispatch, products.length]);

    /* group products by category */
    const groupedProducts = useMemo(() => {
        return products.reduce((acc, product) => {
        const category = product?.category || "Others";
        if (!acc[category]) acc[category] = [];
        acc[category].push(product);
        return acc;
        }, {});
    }, [products]);

    if (loading) {
        return (
        <Layout>
            <p className="p-10 text-center">Loading products...</p>
        </Layout>
        );
    }

    if (error) {
        return (
        <Layout>
            <p className="p-10 text-center text-red-500">
            {typeof error === "string"
                ? error
                : error?.detail || "Failed to load products"}
            </p>
        </Layout>
        );
    }

    return (
        <Layout>
        <div className="p-4 space-y-12">
            {Object.entries(groupedProducts).map(
            ([category, items]) => (
                <ProductCarousel
                key={category}
                category={category}
                products={items}
                />
            )
            )}
        </div>
        </Layout>
);
};

export default Products;
