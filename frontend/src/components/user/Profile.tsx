import { useState } from "react";
import { Camera } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store/Store";
import { updateImagePath, updateUserDetails } from "../../redux/slice/userSlice";
import Cookie from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation schema using Yup
const ProfileSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters long")
    .matches(/^[^\s].*$/, "Name must not start with a space")
    .matches(/^[a-zA-Z\s]+$/, "Name must not contain special characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
});

const UserProfile = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user.user);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(
    userData?.imagePath || null
  );

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setProfileImage(reader.result);
      }
    };

    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const token = Cookie.get("Accesstoken");
      const response = await axios.post(
        "http://localhost:3000/uploadimage",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success && response.data) {
        dispatch(updateImagePath({ imagePath: response.data.data.user.imagePath }));
        toast.success("Profile image updated successfully!");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again!");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-20">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-8">
            {isEditing ? "Edit Profile" : "User Profile"}
          </h2>

          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <label
                htmlFor="profile-upload"
                className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
              >
                <Camera className="w-4 h-4 text-white" />
              </label>
              <input
                id="profile-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            <Formik
              initialValues={{
                name: userData?.name || "",
                email: userData?.email || "",
                phone: userData?.phone || "",
              }}
              validationSchema={ProfileSchema}
              onSubmit={async (values) => {
                try {
                  const token = Cookie.get("Accesstoken");
                  const response = await axios.put("http://localhost:3000/updateprofile", values, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });

                  if (response.data.success) {
                    dispatch(updateUserDetails(values));
                    toast.success("Profile updated successfully!");
                    setIsEditing(false);
                  }
                } catch (error) {
                  console.error("Error updating profile:", error);
                  toast.error("Failed to update profile. Please try again!");
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className="w-full space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <Field
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!isEditing}
                    />
                    <ErrorMessage name="name" component="div" className="text-sm text-red-500" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!isEditing}
                    />
                    <ErrorMessage name="email" component="div" className="text-sm text-red-500" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <Field
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!isEditing}
                    />
                    <ErrorMessage name="phone" component="div" className="text-sm text-red-500" />
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={handleEdit}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
