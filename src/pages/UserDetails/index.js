import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { fetchUserData, updateUserProfile } from "../../utils/api";
import { MyContext } from "../../App";
import { FaCloudUploadAlt } from "react-icons/fa";
import { RiVerifiedBadgeFill } from "react-icons/ri";

const UserDetails = () => {
  const { user, setUser } = useContext(MyContext);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    profilePhoto: "",
    facebook: "",
    instagram: "",
    whatsApp: "",
  });

  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      const data = await fetchUserData(`/api/user/${user.userId}`);
      if (data.message) {
        console.error("Error:", data.message);
        return;
      }

      const nameParts = data.name ? data.name.split(" ") : ["", ""];
      setUserData({
        ...data,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
      });

      if (data.profilePhoto) {
        setProfilePhotoPreview(
          `https://ecommerce-shopping-server.onrender.com/uploads/${data.profilePhoto}`
        );
      }
    };
    getUserData();
  }, [user.userId]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    setProfilePhotoFile(file);
    const previewUrl = URL.createObjectURL(file);
    setProfilePhotoPreview(previewUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("firstName", userData.firstName);
    formData.append("lastName", userData.lastName);
    formData.append("email", userData.email);
    formData.append("phone", userData.phone);
    formData.append("address", userData.address);
    formData.append("facebook", userData.facebook);
    formData.append("instagram", userData.instagram);
    formData.append("whatsApp", userData.whatsApp);
    
    if (profilePhotoFile) {
      formData.append("profilePhoto", profilePhotoFile);
    }

    const updated = await updateUserProfile(
      `/api/user/${user.userId}`,
      formData
    );
    
    if (updated) {
      const updatedUser = {
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        userId: user.userId,
        profilePhoto: updated.user.profilePhoto || user.profilePhoto,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Profile updated successfully");
    }
  };

  return (
     <div className="right-content w-100 bottomEle">
        <div className="card shadow mt-100">
    <form onSubmit={handleSubmit}>
      <div className="mc-tab-card">
        <h6 className="mc-tab-card-title">User Information</h6>
        <div className="row">
          <div className="col-xl-4">
            <div className="mc-user-avatar-upload">
              <div className="mc-user-avatar">
                <img
                  src={profilePhotoPreview}
                  alt="avatar"
                />
              </div>
              <div className="mc-file-upload button">
                <input
                  type="file"
                  id="avatar"
                  onChange={handleProfilePhotoChange}
                />
                <label htmlFor="avatar">
                  <FaCloudUploadAlt />
                  &nbsp;
                  <span>Upload</span>
                </label>
              </div>
            </div>
          </div>
          <div className="col-xl-8">
            <div className="row">
              <div className="col-xl-6">
                <fieldset className="mc-fieldset mb-4">
                  <legend>First Name</legend>
                  <input
                    type="text"
                    placeholder="Type here..."
                    className="w-100 h-md"
                    value={userData.firstName}
                    name="firstName"
                    onChange={handleChange}
                  />
                </fieldset>
              </div>
              <div className="col-xl-6">
                <fieldset className="mc-fieldset mb-4">
                  <legend>Last Name</legend>
                  <input
                    type="text"
                    placeholder="Type here..."
                    className="w-100 h-md"
                    value={userData.lastName}
                    name="lastName"
                    onChange={handleChange}
                  />
                </fieldset>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mc-tab-card">
        <h6 className="mc-tab-card-title">Private Information</h6>
        <div className="row">
          <div className="col-xl-6">
            <fieldset className="mc-fieldset mb-4">
              <legend>Email</legend>
              <input
                type="email"
                placeholder="Type here..."
                className="w-100 h-md"
                value={userData.email}
                name="email"
                onChange={handleChange}
              />
            </fieldset>
          </div>
          <div className="col-xl-6">
            <fieldset className="mc-fieldset mb-4">
              <legend>Phone</legend>
              <input
                type="tel"
                placeholder="Type here..."
                className="w-100 h-md"
                value={userData.phone}
                name="phone"
                onChange={handleChange}
              />
            </fieldset>
          </div>
          <div className="col-xl-12">
            <fieldset className="mc-fieldset">
              <legend>Address</legend>
              <textarea
                className="w-100 h-text-md"
                placeholder="Long textarea..."
                value={userData.address}
                name="address"
                onChange={handleChange}
              ></textarea>
            </fieldset>
          </div>
        </div>
      </div>

      <div className="mc-tab-card">
        <h6 className="mc-tab-card-title">Social Information</h6>
        <div className="row row-cols-md-2 row-cols-1">
          <div className="col">
            <fieldset className="mc-fieldset mb-4">
              <legend>Facebook</legend>
              <input
                placeholder="Type here..."
                className="w-100 h-md"
                value={userData.facebook}
                name="facebook"
                onChange={handleChange}
              />
            </fieldset>
          </div>

          <div className="col">
            <fieldset className="mc-fieldset mb-4">
              <legend>Instagram</legend>
              <input
                placeholder="Type here..."
                className="w-100 h-md"
                value={userData.instagram}
                name="instagram"
                onChange={handleChange}
              />
            </fieldset>
          </div>

          <div className="col">
            <fieldset className="mc-fieldset mb-4">
              <legend>WhatsApp</legend>
              <input
                placeholder="Type here..."
                className="w-100 h-md"
                value={userData.whatsApp}
                name="whatsApp"
                onChange={handleChange}
              />
            </fieldset>
          </div>
        </div>
      </div>

      <Button className="mc-btn primary" variant="contained" type="submit">
        <RiVerifiedBadgeFill />
        &nbsp;
        <span>Save Changes</span>
      </Button>
    </form>
    </div>
    </div>
  );
};

export default UserDetails;
