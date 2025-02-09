import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookie from "js-cookie";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();

  // Define validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          Admin Login
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Please login to your account.
        </p>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            const formdata = {
              email: values.email,
              password: values.password,
            };

            console.log("formData:", formdata);

            try {
              const result = await axios.post(
                "http://localhost:3000/admin/adminlogin",
                formdata
              );
              if (result.status === 200) {
                console.log("status is 200");
                Cookie.set("adminAccessToken", result.data.data.tokens.accessToken);
                Cookie.set("adminRefreshToken", result.data.data.tokens.refreshToken);
                navigate("/admin/dashboard");
                toast.success("Login successful!", { autoClose: 3000 });
              }
            } catch (error: any) {
              if (error.response) {
                toast.error(error.response.data.message);
              } else {
                toast.error("Network error. Please check your connection.");
              }
            }
          }}
        >
          {() => (
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
                  className="text-red-500 text-sm mt-1"
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
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
              >
                Login
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
