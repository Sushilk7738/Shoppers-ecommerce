// src/context/ToastContext.jsx
import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState("");

    const showToast = (msg = "") => {
        setToast(msg);
        setTimeout(() => setToast(""), 2000); // auto hide after 2s
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
        {children}
        {toast && (
            <div className="fixed top-5 right-5 bg-black text-white px-4 py-2 rounded-lg shadow-lg animate-fade z-[9999]">
            {toast}
            </div>
        )}
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
