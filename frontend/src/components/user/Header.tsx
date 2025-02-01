import { UserCircle } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { logoutSuccess } from "../../redux/slice/userSlice";
import { useState } from "react";
import type { RootState } from "../../redux/store/Store";
import Swal from "sweetalert2"; 

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { user } = useSelector((state: RootState) => state.user);

  const handleLogout=()=>{
    Swal.fire({
      title:"Are you Sure?",
      text:"you will be logged out of your account",
      icon:"warning",
      showCancelButton:true,
      confirmButtonText:"yes,logout",
      cancelButtonText:"cancel",
    }).then((result)=>{
      if(result.isConfirmed){
        Cookies.remove("Accesstoken");
        Cookies.remove("Refreshtoken");
        dispatch(logoutSuccess());
        Swal.fire("Logged Out!","You have been Successfully logged out.","success")
        .then(()=>{
          navigate("/admin");
        })
      }
    })
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md">
      <div className="w-full px-6">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Dashboard text */}
          <div>
            <h1
              className="text-xl font-bold text-gray-800 cursor-pointer"
              onClick={() => {
                navigate("/");
                console.log("Navigate to home");
              }}
            >
              Dashboard
            </h1>
          </div>

          {/* Right side - Dropdown for Profile and Logout */}
          <div className="relative">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              {user?.imagePath ? (
                <img
                  src={user.imagePath}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                // Display UserCircle icon if no profile image is available
                <UserCircle className="h-8 w-8 text-gray-400" />
              )}
              <span>{user?.name || "Profile"}</span>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg">
                <button
                  className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                  onClick={() => {
                    navigate("/profile");
                    console.log("Navigate to profile");
                    setIsDropdownOpen(false); // Close dropdown
                  }}
                >
                  Profile
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
