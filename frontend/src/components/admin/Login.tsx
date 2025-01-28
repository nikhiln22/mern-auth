import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Cookie from "js-cookie";


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const handleClick = async (e: any) => {
    e.preventDefault();
    const formdata = {
      email: email,
      password: password,
    };

    console.log("formData:", formdata);

    const result = await axios.post("http://localhost:3000/admin/adminlogin", formdata);
    console.log("result:", result);
    console.log("result.data.data.tokens:",result.data.data.tokens);
    console.log("result.data.data.usersList:",result.data.data.usersList);
    if (result.status === 200) {
        console.log("status is 200");
        Cookie.set("adminAccessToken", result.data.data.tokens.accessToken);
        Cookie.set("adminRefreshToken", result.data.data.tokens.refreshToken);
        console.log("navigating to the admin dashbaord");
      navigate("/admin/dashboard");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          Admin Login
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Please login to your account.
        </p>
        <form
          onSubmit={(e) => {
            handleClick(e);
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
