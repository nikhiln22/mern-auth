import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";


const PublicRoutes = () => {
  const accessToken = Cookies.get("Accesstoken");
  const refreshToken = Cookies.get("Refreshtoken");

  return accessToken || refreshToken ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoutes;
