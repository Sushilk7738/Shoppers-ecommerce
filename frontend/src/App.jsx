import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import Cart from "./pages/Cart.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Checkout from "./pages/Checkout.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import OrderDetails from "./pages/OrderDetails";
import NotFound from "./pages/NotFound.jsx";


export default function App() {
  return (
    <Routes>
      <Route path="*" element={<NotFound/>} />
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products/>} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/about" element={<About/>} />
      <Route path="/contact-us" element={<Contact/>} />
      <Route path="/my-orders" element={<MyOrders/>} />
      <Route path="/order/:id" element={<OrderDetails/>} />

      
    </Routes>
  );
}
