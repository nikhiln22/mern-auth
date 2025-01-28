import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";


const PrivateRoutes = () => {
  const accessToken = Cookies.get("Accesstoken");
  const refreshToken = Cookies.get("Refreshtoken");

  return accessToken || refreshToken ? <Outlet /> : <Navigate to="/login" /> ;
};

export default PrivateRoutes;