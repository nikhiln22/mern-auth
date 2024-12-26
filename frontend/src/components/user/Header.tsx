import { UserCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "../../redux/slice/userSlice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md">
      <div className="w-full px-6">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Dashboard text */}
          <div>
            <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          </div>

          {/* Right side - Profile and Logout buttons */}
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => {
                navigate("/profile");
                console.log("Navigate to profile");
              }}
            >
              <UserCircle className="h-5 w-5" />
              <span>Profile</span>
            </button>

            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
              onClick={() => {
                Cookies.remove("Accesstoken");
                Cookies.remove("Refreshtoken");
                dispatch(logoutSuccess());
                navigate("/login");
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
