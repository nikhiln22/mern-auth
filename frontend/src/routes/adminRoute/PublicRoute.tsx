import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";


const PublicRoutes = () => {
  const adminAccessToken = Cookies.get("adminAccessToken");
  const adminRefreshToken = Cookies.get("adminRefreshToken");

  return adminAccessToken || adminRefreshToken ? <Navigate to="/admin/dashboard" /> : <Outlet />;
};

export default PublicRoutes;