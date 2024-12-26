import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slice/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const handleClick = async (e: any) => {
    e.preventDefault();
    const formdata = {
      email: email,
      password: password,
    };

    console.log("formData:", formdata);

    const result = await axios.post("http://localhost:3000/login", formdata);
    console.log("result:", result);
    if (result.status === 200) {
      dispatch(loginSuccess({ userData: result.data.data.user }));
      Cookie.set("Accesstoken", result.data.data.tokens.accessToken);
      Cookie.set("Refreshtoken", result.data.data.tokens.refreshToken);
      navigate("/");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          Login
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Welcome back! Please login to your account.
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
            Register
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <span
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Register here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
