import React, { useContext, useRef } from "react";
import "../CSS/ProfileCard.css";
import AuthContext from '../Context/AuthContext';
import { set } from "@cloudinary/url-gen/actions/variable";

const ProfileCard = ({ contextUser}) => {
  const { openConfirmDialog, logout, setAlertData, apiUrl, setContextUser } = useContext(AuthContext);
  const fileInputRef = useRef();

  const refreshUser = () => {
    window.location.reload();
  };

  const handleLogOut = () => {
    openConfirmDialog("Are you sure want to Logout", () => logout());
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${apiUrl}/user/${contextUser.id}/update-photo`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        setAlertData({show: true, status: true, message:res.message});
        refreshUser();
      } else {
        setAlertData({show: true, status: false, message:"Failed to upload image"});
      }
    } catch (error) {
      setAlertData({show: true, status: false, message:"Error uploading image"});
    }
  };

  const handleRemoveImage = async () => {
    openConfirmDialog("Are you sure you want to remove the profile image?", async () => {
      try {
        const res = await fetch(`${apiUrl}/user/${contextUser.id}/remove-image`, {
          method: "DELETE",
        });

        if (res.ok) {
          setAlertData({show: true, status: true, message:"Image removed successfully!"});
          refreshUser();
        } else {
          setAlertData({show: true, status: false, message:"Failed to remove image"});
        }
      } catch (error) {
        setAlertData({show: true, status: false, message:"Error removing image"});
      }
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <figure className="profile-icon">
          {contextUser.image ? (
            <img src={contextUser.image} alt="Profile" className="profile-image" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor"
              className="bi bi-person-fill" viewBox="0 0 16 16">
              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            </svg>
          )}
        </figure>
        <h2 className="profile-name">{contextUser.username}</h2>
        <p className="profile-role">{contextUser.email}</p>
        <div className="profile-actions">
          <button className="btn-primary" onClick={() => fileInputRef.current.click()}>
            {contextUser.image ? "Update" : "Upload"}
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
          {contextUser.image && (
            <button className="btn-secondary" onClick={handleRemoveImage}>Remove</button>
          )}
          <button className="btn-third" onClick={handleLogOut}>SignOut</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
