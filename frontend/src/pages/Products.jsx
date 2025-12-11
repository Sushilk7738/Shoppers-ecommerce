import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layout";
import ProductCarousel from "../components/ProductCarousel";
import { fetchProductList } from "../redux/slices/productSlice";

const Products = () => {
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector(
    (state) => state.product.productList
  );

  useEffect(() => {
    dispatch(fetchProductList());
  }, [dispatch]);

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
        <p className="p-10 text-center text-red-500">{error}</p>
      </Layout>
    );
  }

  // ✅ group by category (backend category)
  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
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
