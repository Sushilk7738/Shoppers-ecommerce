import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layout";
import ProductCarousel from "../components/ProductCarousel";
import { fetchProductList } from "../redux/slices/productSlice";

const Products = () => {
    const dispatch = useDispatch();

    // state
    const productState =
        useSelector((state) => state.product.productList) || {};

    const {
        products = [],
        loading = false,
        error = null,
    } = productState;

    // fetch
    useEffect(() => {
        dispatch(fetchProductList());
    }, [dispatch]);

    // loading
    if (loading) {
        return (
            <Layout>
                <p className="p-10 text-center">Loading products...</p>
            </Layout>
        );
    }

    // error
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

    // group by category
    const groupedProducts = products.reduce((acc, product) => {
        const category = product?.category || "Others"; // guard
        if (!acc[category]) acc[category] = [];
        acc[category].push(product);
        return acc;
    }, {});

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
