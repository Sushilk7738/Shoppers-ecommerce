import Layout from "../components/Layout";
import ProductCarousel from "../components/ProductCarousel";

const Products = () => {
  // MASTER PRODUCT DATA (easily scalable)
  const productSections = [
    {
      category: "Fashion & Beauty",
      products: [
        { id: 1, title: "Fashion Item 1", price: 999, image: "/images/a.jpeg" },
        { id: 2, title: "Fashion Item 2", price: 1299, image: "/images/p.jpeg" },
        { id: 3, title: "Fashion Item 3", price: 899, image: "/images/c.jpeg" },
        { id: 4, title: "Fashion Item 4", price: 1599, image: "/images/h.jpeg" },
      ],
    },
    {
      category: "Smart Televisions",
      products: [
        { id: 5, title: "Smart TV 1", price: 24999, image: "/images/tel.jpeg" },
        { id: 6, title: "Smart TV 2", price: 29999, image: "/images/tel2.jpeg" },
        { id: 7, title: "Smart TV 3", price: 34999, image: "/images/tel3.jpeg" },
        { id: 8, title: "Smart TV 4", price: 39999, image: "/images/tel4.jpeg" },
      ],
    },
    {
      category: "Smartphones",
      products: [
        { id: 9, title: "Smartphone 1", price: 9999, image: "/images/mb.jpeg" },
        { id: 10, title: "Smartphone 2", price: 12999, image: "/images/mb2.jpeg" },
        { id: 11, title: "Smartphone 3", price: 15999, image: "/images/mb3.jpeg" },
        { id: 12, title: "Smartphone 4", price: 19999, image: "/images/mb7.jpeg" },
      ],
    },
    {
      category: "Tablets",
      products: [
        { id: 13, title: "Tablet 1", price: 7999, image: "/images/tb.jpeg" },
        { id: 14, title: "Tablet 2", price: 9999, image: "/images/tb2.jpeg" },
        { id: 15, title: "Tablet 3", price: 11999, image: "/images/tb3.jpeg" },
        { id: 16, title: "Tablet 4", price: 13999, image: "/images/tb4.jpeg" },
      ],
    },
    {
      category: "Laptops",
      products: [
        { id: 17, title: "Laptop 1", price: 39999, image: "/images/lp.jpeg" },
        { id: 18, title: "Laptop 2", price: 45999, image: "/images/lp2.jpeg" },
        { id: 19, title: "Laptop 3", price: 49999, image: "/images/lp3.jpeg" },
        { id: 20, title: "Laptop 4", price: 54999, image: "/images/lp.jpeg" },
      ],
    },
  ];

  return (
    <Layout>
      <div className="p-4 space-y-12">
        {productSections.map((section) => (
          <ProductCarousel
            key={section.category}
            category={section.category}
            products={section.products}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Products;
