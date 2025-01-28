import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () =>{
    const adminAccessToken = Cookies.get("adminAccessToken");
    const adminRefreshToken = Cookies.get("adminRefreshToken");
    
    return adminAccessToken || adminRefreshToken ? <Outlet/> : <Navigate to="/admin"/>
}

export default PrivateRoutes