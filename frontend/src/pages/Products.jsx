import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layout";
import ProductCarousel from "../components/ProductCarousel";
import { fetchProductList } from "../redux/slices/productSlice";

const Products = () => {
    const dispatch = useDispatch();

    const {
        products = [],
        loading = false,
        error = null,
    } = useSelector((state) => state.product.productList || {});

    // Product fetch 
    useEffect(() => {
        if (!products || products.length === 0) {
            dispatch(fetchProductList());
        }
    }, [dispatch, products.length]);

    
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
