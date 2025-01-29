import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";

// Validation schema using Yup
const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters long")
    .matches(/^[^\s].*$/, "Name must not start with a space")
    .matches(/^[a-zA-Z\s]+$/, "Name must not contain special characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address"
    ),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(/[A-Z]/, "Password must include at least one uppercase letter")
    .matches(/[a-z]/, "Password must include at least one lowercase letter")
    .matches(/[0-9]/, "Password must include at least one digit")
    .matches(
      /[@$!%*?&#]/,
      "Password must include at least one special character"
    )
    .matches(
      /^[^\s]+$/,
      "Password must not contain spaces"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm password is required"),
});



const Register = () => {
  const navigate = useNavigate();

  const handleRegister = async (values: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      const { confirmPassword, ...formData } = values;

      const response = await axios.post<{ success: boolean; message: string }>(
        "http://localhost:3000/register",
        formData
      );

      console.log("response:", response);

      if (response.status === 201) {
        console.log("Registration Successful!");
        navigate("/login");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Registration failed:", error.response?.data.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          Register
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Create a new account and start your journey!
        </p>

        {/* Formik Form */}
        <Formik
          initialValues={{
            name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={RegisterSchema}
          onSubmit={handleRegister}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Name
                </label>
                <Field
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email Address
                </label>
                <Field
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Phone
                </label>
                <Field
                  name="phone"
                  type="text"
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Password
                </label>
                <Field
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Confirm Password
                </label>
                <Field
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <span
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
