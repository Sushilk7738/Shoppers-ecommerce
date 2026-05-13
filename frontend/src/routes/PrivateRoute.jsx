import { Navigate, Outlet } from "react-router-dom";

const isTokenValid = (token) => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
};


const PrivateRoute = () => {
    const raw = localStorage.getItem("userInfo");

    let user = null;
    try {
        user = raw ? JSON.parse(raw) : null;
    } catch (e) {
        user = null;
    }

    
    return user?.token && isTokenValid(user.token) ? <Outlet /> : <Navigate to="/login" replace />;
};



export default PrivateRoute;
