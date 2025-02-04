import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/user/LoginPage";
import RegisterPage from "./pages/user/RegisterPage";
import HomePage from "./pages/user/HomePage";
import UserPublicRoutes from "./routes/userRoute/PublicRoutes";
import UserPrivateRoutes from "./routes/userRoute/PrivateRoute";
import AdminPublicRoutes from "./routes/adminRoute/PublicRoute";
import AdminPrivateRoutes from "./routes/adminRoute/PrivateRoute";
import ProfilePage from "./pages/user/ProfilePage";
import AdminLoginPage from "./pages/admin/LoginPage";
import DashboardPage from "./pages/admin/DashboardPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/*user protected routes */}
          <Route element={<UserPrivateRoutes />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          

          {/*user public routes */}
          <Route element={<UserPublicRoutes />}>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/*admin protected routes */}
          <Route element={<AdminPrivateRoutes />}>
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          </Route>

          {/*admin public routes */}
          <Route element={<AdminPublicRoutes />}>
          <Route path="/admin" element={<AdminLoginPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
