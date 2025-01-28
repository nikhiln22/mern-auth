import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md">
      <div className="w-full px-6">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Dashboard text */}
          <div>
            <h1
              className="text-xl font-bold text-gray-800 cursor-pointer"
              onClick={() => {
                navigate("/admin/dashboard");
                console.log("Navigate to admin dashboard");
              }}
            >
              Admin Dashboard
            </h1>
          </div>

          {/* Right side - Profile and Logout buttons */}
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-black hover:bg-black transition-colors"
              onClick={() => {
                Cookies.remove("adminAccessToken");
                Cookies.remove("adminRefreshToken");
                navigate("/admin");
                console.log("Logout clicked");
              }}
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
