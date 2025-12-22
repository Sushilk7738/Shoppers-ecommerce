import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/userSlice";
import { clearCart } from "../redux/slices/cartSlice";

const Layout = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false); // clean
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // guard
    const user = useSelector((state) => state.user || null);
    const cartItems = useSelector(
        (state) => state.cart?.cartItems || []
    );

    const totalItems = cartItems.length; // clean

    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearCart());
        navigate("/");
    };

    // static
    const menus = [
        { label: "Home", href: "/" },
        { label: "Products", href: "/products" },
        { label: "About", href: "/about" },
        { label: "Contact us", href: "/contact-us" },
    ];

    const displayName =
        user?.name || user?.username || user?.email || "User"; // guard

    return (
        <div>
            {/* NAVBAR */}
            <nav className="sticky top-0 left-0 shadow-lg bg-white z-50">
                <div className="w-11/12 mx-auto flex items-center justify-between py-3">
                    {/* LOGO */}
                    <Link to="/">
                        <img
                            src="/logo.png"
                            alt="site-logo"
                            className="w-[120px] sm:w-[150px] md:w-[180px] h-auto"
                        />
                    </Link>

                    {/* DESKTOP MENU */}
                    <ul className="hidden sm:flex gap-4 items-center">
                        {menus.map((item) => (
                            <li key={item.href}>
                                <Link
                                    to={item.href}
                                    className="block py-2 px-3 rounded-md text-sm hover:bg-blue-600 hover:text-white transition-all"
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}

                        {/* CART */}
                        <Link
                            to="/cart"
                            className="relative block py-2 px-3 rounded-md text-xl hover:bg-blue-600 hover:text-white transition-all"
                        >
                            🛒
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 rounded-full">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {/* USER */}
                        {!user ? (
                            <>
                                <Link
                                    to="/login"
                                    className="block py-2 px-3 rounded-md text-sm hover:bg-blue-600 hover:text-white transition-all"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/signup"
                                    className="bg-cyan-600 text-white py-2 px-4 text-sm font-semibold rounded-md hover:bg-[#4776af] transition-all"
                                >
                                    Signup
                                </Link>
                            </>
                        ) : (
                            <>
                                <span className="text-gray-700 font-semibold px-2 py-1">
                                    Hello, {displayName}
                                </span>

                                <Link
                                    to="/my-orders"
                                    className="py-2 px-4 rounded-md text-sm font-semibold border border-cyan-500 text-cyan-700 hover:bg-cyan-600 hover:text-white transition-all"
                                >
                                    My Orders
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="py-2 px-4 bg-red-500 text-white rounded-md text-sm font-semibold hover:bg-red-600 transition-all"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </ul>

                    {/* MOBILE TOGGLE */}
                    <button
                        className="sm:hidden text-3xl p-2"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? "✕" : "☰"}
                    </button>
                </div>

                {/* MOBILE MENU */}
                {isOpen && (
                    <div className="sm:hidden bg-white shadow-md">
                        <ul className="flex flex-col p-3 space-y-2">
                            {menus.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        to={item.href}
                                        className="block py-2 px-2 rounded-md text-base"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}

                            {!user ? (
                                <>
                                    <Link
                                        to="/login"
                                        className="block py-2 px-2"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        to="/signup"
                                        className="block py-2 px-2 bg-cyan-600 text-white rounded-md text-center"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Signup
                                    </Link>
                                </>
                            ) : (
                                <div className="flex justify-between items-center px-2 py-2">
                                    <span className="font-semibold">
                                        Hello, {displayName}
                                    </span>

                                    <Link
                                        to="/my-orders"
                                        className="block py-2 px-2 rounded-md text-base"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        📦 My Orders
                                    </Link>

                                    <button
                                        className="text-red-500 font-semibold"
                                        onClick={() => {
                                            handleLogout();
                                            setIsOpen(false);
                                        }}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}

                            <Link
                                to="/cart"
                                className="flex justify-between items-center py-2 px-2 rounded-md text-base"
                                onClick={() => setIsOpen(false)}
                            >
                                <span>🛒 Cart</span>
                                {totalItems > 0 && (
                                    <span className="bg-red-600 text-white text-xs px-2 rounded-full">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                        </ul>
                    </div>
                )}
            </nav>

            {/* CONTENT */}
            <div>{children}</div>

            {/* FOOTER */}
            <footer className="bg-cyan-500 py-16 mt-10">
                <div className="w-11/12 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                    <div>
                        <h1 className="text-white font-semibold text-xl sm:text-2xl mb-3">
                            Website Links
                        </h1>
                        <ul className="space-y-2 text-slate-50">
                            {menus.map((item) => (
                                <li key={item.href}>
                                    <Link to={item.href}>{item.label}</Link>
                                </li>
                            ))}

                            {!user && (
                                <>
                                    <li>
                                        <Link to="/login">Login</Link>
                                    </li>
                                    <li>
                                        <Link to="/signup">Signup</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    <div>
                        <h1 className="text-white font-semibold text-xl sm:text-2xl mb-3">
                            Follow us
                        </h1>
                        <ul className="space-y-2 text-slate-50">
                            <li><Link to="/">Facebook</Link></li>
                            <li><Link to="/">Youtube</Link></li>
                            <li><Link to="/">Instagram</Link></li>
                            <li><Link to="/">LinkedIn</Link></li>
                            <li><Link to="/">Twitter</Link></li>
                        </ul>
                    </div>

                    <div className="pr-8">
                        <h1 className="text-white font-semibold text-xl sm:text-2xl mb-3">
                            Brand Details
                        </h1>
                        <p className="text-slate-50 mb-6">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        </p>
                        <img src="/logo1.png" alt="brand-logo" className="w-[100px]" />
                    </div>

                    <div>
                        <h1 className="text-white font-semibold text-xl sm:text-2xl mb-3">
                            Contact Us
                        </h1>
                        <form className="space-y-4">
                            <input
                                required
                                name="fullname"
                                className="bg-white w-full rounded p-3 text-sm"
                                placeholder="Your Name"
                            />
                            <input
                                required
                                type="email"
                                name="email"
                                className="bg-white w-full rounded p-3 text-sm"
                                placeholder="Enter email id"
                            />
                            <textarea
                                required
                                name="message"
                                className="bg-white w-full rounded p-3 text-sm"
                                placeholder="Message"
                                rows={3}
                            />
                            <button className="bg-black text-white py-3 px-6 rounded">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
