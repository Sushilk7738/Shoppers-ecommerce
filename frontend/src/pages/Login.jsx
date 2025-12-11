import React, { useState } from "react";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useDispatch } from "react-redux";
import {
    loginStart,
    loginSuccess,
    loginFailure,
} from "../redux/slices/userSlice";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { showToast } = useToast();

    const [formValue, setFormValue] = useState({
        email: "",
        password: "",
    });

    const { email, password } = formValue;

    const handleChange = (e) => {
        setFormValue({
            ...formValue,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        dispatch(loginStart());

        try {
            const response = await fetch("http://127.0.0.1:8000/api/users/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: email,
                    password: password,
                }),
            });

            const data = await response.json();
            console.log("LOGIN RESPONSE:", response.status, data);

            if (!response.ok) {
                // backend might send { detail: "..." } or validation object
                const errMsg = data?.detail || JSON.stringify(data) || "Invalid credentials";
                dispatch(loginFailure(errMsg));
                showToast(errMsg);
                return;
            }

            // JWT values from backend
            const token = data?.access || data?.token || null;
            const refresh = data?.refresh || null;

            // Build user object expected by userSlice (must include token)
            const user = {
                id: data?.id,
                name: data?.name || data?.username,
                username: data?.username,
                email: data?.email,
                token: token, // IMPORTANT: userSlice reads user.token
            };

            // Save to localStorage — keep both for compatibility
            try {
                // Primary single source
                localStorage.setItem("userInfo", JSON.stringify(user));
                // Backwards-compatible keys some parts of code might read
                if (token) localStorage.setItem("token", token);
                if (refresh) localStorage.setItem("refresh", refresh);
            } catch (err) {
                console.warn("Failed to save userInfo to localStorage", err);
            }

            // Dispatch to redux — userSlice expects { user }
            dispatch(loginSuccess({ user }));

            showToast("Login Successful!");
            navigate("/");

        } catch (error) {
            console.error("Login error:", error);
            dispatch(loginFailure(error.message || "Something went wrong"));
            showToast("Something went wrong!");
        }
    };

    return (
        <Layout>
            <div className="w-full min-h-[calc(100vh-100px)] grid md:grid-cols-2 bg-white">

                <div className="flex items-center justify-center p-6">
                    <img
                        src="/images/signup.jpg"
                        className="w-full max-w-xl object-contain"
                        alt="Login"
                    />
                </div>

                <div className="flex flex-col justify-center p-10 md:p-16 bg-white">
                    <h1 className="text-4xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-gray-600 text-lg">
                        Login to continue shopping
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div className="flex flex-col">
                            <label className="font-semibold text-gray-800 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                required
                                onChange={handleChange}
                                placeholder="example@gmail.com"
                                className="p-3 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-400"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="font-semibold text-gray-800 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                required
                                onChange={handleChange}
                                placeholder="********"
                                className="p-3 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-400"
                            />
                        </div>

                        <button
                            type="submit"
                            className="py-3 px-8 bg-cyan-600 text-white rounded hover:bg-cyan-700 font-semibold transition-all"
                        >
                            Login
                        </button>
                    </form>

                    <p className="mt-4 text-gray-700">
                        Don’t have an account?
                        <span
                            className="text-cyan-600 font-semibold ml-1 cursor-pointer hover:underline"
                            onClick={() => navigate("/signup")}
                        >
                            Signup
                        </span>
                    </p>
                </div>
            </div>
        </Layout>
    );
}

export default Login;
