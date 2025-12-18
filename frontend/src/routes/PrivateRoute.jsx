import { Navigate, Outlet } from "react-router-dom";
import { getAuthToken } from "../utils/Auth";



const PrivateRoute = ()=>{
    const token = getAuthToken();
    return token ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoute;