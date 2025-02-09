import { useState } from "react";
import { Camera } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store/Store";
import {
  updateImagePath,
  updateUserDetails,
} from "../../redux/slice/userSlice";
import Cookie from "js-cookie";
import axios from 'axios'

const UserProfile = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user.user);
  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: userData?.name || "",
    email: userData?.email || "",
    phone: userData?.phone || "",
  });
  const [tempDetails, setTempDetails] = useState({ ...userDetails });
  const [profileImage, setProfileImage] = useState<string | null>(
    userData?.imagePath || null
  );

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (file) {
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
          dispatch(
            updateImagePath({ imagePath: response.data.data.user.imagePath })
          );
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleEdit = async () => {
    if (isEditing) {
      console.log("tempDetails", tempDetails);
      try {
        const token = Cookie.get("Accesstoken");
        const response = await axios.put(
          "http://localhost:3000/updateprofile",
          tempDetails,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("response:", response);

        if (response.data.success) {
          dispatch(updateUserDetails(tempDetails));
          setUserDetails(tempDetails);
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        setTempDetails({ ...userDetails });
      }
    } else {
      setTempDetails({ ...userDetails });
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setTempDetails({ ...userDetails });
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-20">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-8">
            {isEditing ? "Edit Profile" : "User Profile"}
          </h2>

          <div className="flex flex-col items-center space-y-6">
            {/* Profile Image Section */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
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

            {/* User Details Section */}
            <div className="w-full space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={tempDetails.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 p-2 border rounded-md bg-gray-50">
                    {userDetails.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={tempDetails.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 p-2 border rounded-md bg-gray-50">
                    {userDetails.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={tempDetails.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 p-2 border rounded-md bg-gray-50">
                    {userDetails.phone}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEdit}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
