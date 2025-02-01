import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Search,
  Edit2,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Cookies from "js-cookie";
import axios from "axios";
import { IUser } from "../../types";
import {IUserFormValues} from "../../types";

// Create two separate validation schemas for adding and editing
const addUserSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .matches(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces")
    .required("Name is required")
    .trim(),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .lowercase()
    .trim(),

  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("Password is required"),
});


const editUserSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .matches(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces")
    .required("Name is required")
    .trim(),

    email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .lowercase()
    .trim(),

  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
});



const AdminDashboard = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const usersPerPage = 10;


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const adminAccessToken = Cookies.get("adminAccessToken");
      if (!adminAccessToken) {
        throw new Error("No admin access token found");
      }

      const response = await axios.get<{
        success: boolean;
        data: { usersList: IUser[] };
      }>("http://localhost:3000/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${adminAccessToken}`,
        },
      });

      if (response.data.success) {
        setUsers(response.data.data.usersList);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleDelete = async (userId: string) => {
    try {
      const adminAccessToken = Cookies.get("adminAccessToken");
      if (!adminAccessToken) {
        throw new Error("No admin access token found");
      }

      const response = await axios.delete<{ success: boolean }>(
        `http://localhost:3000/admin/deleteuser/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
          },
        }
      );

      if (response.data.success) {
        setUsers(users.filter((user) => user._id !== userId));
        setError("");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user");
    }
  };

  const confirmDelete = (userId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(userId);
        Swal.fire("Deleted!", "The user has been deleted.", "success");
      }
    });
  };

  const handleEdit = (user: IUser) => {
    if (!user._id) {
      console.error("Invalid user data provided to handleEdit");
      return;
    }

    setEditingUser(user);
    setIsDialogOpen(true); // Open the dialog when editing
  };

  const handleSubmit = async (values: IUserFormValues, { resetForm }: any) => {
    try {
      const adminAccessToken = Cookies.get("adminAccessToken");
      if (!adminAccessToken) {
        throw new Error("No admin access token found");
      }

      const userData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        ...(values.password && { password: values.password }),
      };

      const url = editingUser?._id
        ? `http://localhost:3000/admin/edituser/${editingUser._id}`
        : "http://localhost:3000/admin/adduser";

      const response = await axios<{ success: boolean; data: { user: IUser } }>(
        {
          method: editingUser ? "put" : "post",
          url: url,
          data: userData,
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        if (editingUser?._id) {
          setUsers(
            users.map((user) =>
              user._id === editingUser._id ? response.data.data.user : user
            )
          );
        } else {
          setUsers([...users, response.data.data.user]);
        }
        setIsDialogOpen(false);
        setEditingUser(null);
        setError("");
        resetForm();
        Swal.fire({
          title: "Success!",
          text: `User successfully ${editingUser ? "updated" : "added"}`,
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error saving user:", error);
      setError("Failed to save user");
      Swal.fire({
        title: "Error!",
        text: "Failed to save user",
        icon: "error",
      });
    }
  };

 
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8 text-gray-800">User Management</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="relative border-2 border-gray-300 rounded-lg">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search users..."
            className="pl-8 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={() => {
            setEditingUser(null);
            setIsDialogOpen(true);
          }}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-900"
        >
          <Plus className="h-4 w-4" />
          Add New User
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full border-2 border-gray-300 rounded-lg">
          <table className="min-w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-16 px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider border-2">
                  Sl No
                </th>
                <th className="w-1/4 px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider border-2">
                  User Name
                </th>
                <th className="w-1/3 px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider border-2">
                  Email
                </th>
                <th className="w-1/4 px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider border-2">
                  Mobile Number
                </th>
                <th className="w-28 px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider border-2">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : currentUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    No users found.
                  </td>
                </tr>
              ) : (
                currentUsers.map((user, index) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 text-center">{index + 1}</td>
                    <td className="px-6 py-4 text-center">{user.name}</td>
                    <td className="px-6 py-4 text-center">{user.email}</td>
                    <td className="px-6 py-4 text-center">{user.phone}</td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => confirmDelete(user._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingUser ? "Edit User" : "Add New User"}
            </h2>

            <Formik
              initialValues={{
                name: editingUser?.name || "",
                email: editingUser?.email || "",
                phone: editingUser?.phone || "",
                password: "",
              }}
              validationSchema={editingUser ? editUserSchema : addUserSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      className="mt-1 p-2 w-full border rounded focus:ring-2 focus:ring-black"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="mt-1 p-2 w-full border rounded focus:ring-2 focus:ring-black"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Mobile
                    </label>
                    <Field
                      type="text"
                      id="phone"
                      name="phone"
                      className="mt-1 p-2 w-full border rounded focus:ring-2 focus:ring-black"
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {!editingUser && (
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Password
                      </label>
                      <Field
                        type="password"
                        id="password"
                        name="password"
                        className="mt-1 p-2 w-full border rounded focus:ring-2 focus:ring-black"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  )}

                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDialogOpen(false);
                        setEditingUser(null);
                      }}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900 disabled:opacity-50"
                    >
                      {isSubmitting
                        ? "Saving..."
                        : editingUser
                        ? "Update User"
                        : "Add User"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
