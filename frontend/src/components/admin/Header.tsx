import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const Header = () => {
  const navigate = useNavigate();

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
          Cookies.remove("adminAccessToken");
          Cookies.remove("adminRefreshToken");
  
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

          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-black hover:bg-black transition-colors"
              onClick={handleLogout}
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
