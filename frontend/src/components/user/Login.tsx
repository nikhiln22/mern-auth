import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookie from "js-cookie";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slice/userSlice";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast} from 'react-toastify';


const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .required("Password is required"),
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const result = await axios.post("http://localhost:3000/login", values);
      if (result.status === 200) {
        dispatch(loginSuccess({ userData: result.data.data.user }));
        Cookie.set("Accesstoken", result.data.data.tokens.accessToken);
        Cookie.set("Refreshtoken", result.data.data.tokens.refreshToken);
        navigate("/");
        toast.success("Login successful!");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data.message || "An error occurred";
        toast.error(errorMessage); 
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          User Login
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Welcome back! Please login to your account.
        </p>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email Address
                </label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
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
