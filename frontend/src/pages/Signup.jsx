import React, { useState } from "react";
import { useToast } from "../context/ToastContext";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/userSlice";

function Signup() {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formValue, setFormValue] = useState({
        fullname: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const { fullname, email, password, confirmPassword } = formValue;

    const handleOnChange = (e) => {
        setFormValue({ ...formValue, [e.target.name]: e.target.value });
    };

    // ============================
    // HANDLE SUBMIT
    // ============================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
        showToast("Passwords do not match!");
        return;
        }

        try {
        const response = await fetch(
            "http://127.0.0.1:8000/api/users/register/",
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: email.trim().toLowerCase(), // Django expects this
                email: email.trim().toLowerCase(),
                name: fullname,
                password: password,
            }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            showToast(data.detail || "Signup failed!");
            return;
        }

        // SUCCESS
        showToast("Signup successful!");

        // If backend returns token → login automatically
        if (data.token) {
            localStorage.setItem("token", data.token);

            const userData = {
            username: data.user?.username || email,
            email: data.user?.email || email,
            };

            // save user info in localStorage
            localStorage.setItem("userInfo", JSON.stringify(userData));

            // save user in Redux
            dispatch(loginSuccess(userData));
        }

        // Move to home
        navigate("/");

        } catch (error) {
        console.log(error);
        showToast("Something went wrong!");
        }
};

return (
    <Layout>
    <div className="w-full min-h-[calc(100vh-100px)] grid md:grid-cols-2 bg-white">

        {/* Left Illustration */}
        <div className="flex items-center justify-center p-6">
        <img 
            src="/images/signup.jpg" 
            className="w-full max-w-xl object-contain"
            alt="Signup"
        />
        </div>

        {/* Form Section */}
        <div className="flex flex-col justify-center p-10 md:p-16 bg-white">

        <h1 className="text-4xl font-bold text-gray-900">Create Account</h1>
        <p className="text-gray-600 text-lg">Join us to start shopping!</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">

            {/* Full Name */}
            <div className="flex flex-col">
            <label className="font-semibold text-gray-800 mb-1">Full Name</label>
            <input
                type="text"
                name="fullname"
                value={fullname}
                required
                placeholder="John Doe"
                onChange={handleOnChange}
                className="p-3 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-400"
            />
            </div>

            {/* Email */}
            <div className="flex flex-col">
            <label className="font-semibold text-gray-800 mb-1">Email Address</label>
            <input
                type="email"
                name="email"
                value={email}
                required
                placeholder="example@gmail.com"
                onChange={handleOnChange}
                className="p-3 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-400"
            />
            </div>

            {/* Password */}
            <div className="flex flex-col">
            <label className="font-semibold text-gray-800 mb-1">Password</label>
            <input
                type="password"
                name="password"
                value={password}
                required
                placeholder="********"
                onChange={handleOnChange}
                className="p-3 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-400"
            />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col">
            <label className="font-semibold text-gray-800 mb-1">Confirm Password</label>
            <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                required
                placeholder="Re-enter password"
                onChange={handleOnChange}
                className="p-3 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-400"
            />
            </div>

            {/* Button */}
            <button
            type="submit"
            className="py-3 px-8 bg-cyan-600 text-white rounded hover:bg-cyan-700 font-semibold transition-all"
            >
            Signup
            </button>
        </form>

        {/* Footer */}
        <p className="mt-4 text-gray-700">
            Already have an account?
            <span 
            className="text-cyan-600 font-semibold ml-1 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
            >
            Login
            </span>
        </p>

        </div>
    </div>
    </Layout>
);
}

export default Signup;
