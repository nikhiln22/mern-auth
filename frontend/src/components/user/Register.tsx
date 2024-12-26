import { useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import axios from 'axios'
import { IRegisterCredentials } from "../../types";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<IRegisterCredentials>({
        name: "",
        email: "",
        phone: "",
        password: "",
        imagePath: undefined
    })
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (formData.password !== confirmPassword) {
                alert("Passwords Don't Match!");
                return;
            }

            const response = await axios.post<{ success: boolean, message: string }>(
                "http://localhost:3000/register", formData
            );

            console.log('response:', response);

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
                <h1 className="text-2xl font-semibold text-center text-gray-800">Register</h1>
                <p className="text-center text-gray-500 mb-6">
                    Create a new account and start your journey!
                </p>
                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">phone</label>
                        <input
                            type="text"
                            placeholder="Enter your phone no"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
