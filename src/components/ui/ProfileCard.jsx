import React, { useContext, useRef } from "react";
import "../../styles/ProfileCard.css";
import AuthContext from '../../context/AuthContext';

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
      const res = await fetch(`${apiUrl}/api/users/${contextUser.id}/update-photo`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (res.ok) {
        setAlertData({show: true, status: true, message:"Profile image updated successfully!"});
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
        const res = await fetch(`${apiUrl}/api/users/${contextUser.id}/remove-photo`, {
          method: "DELETE",
          credentials: "include",
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

  const handleDeleteAccount = async () => {
    openConfirmDialog("Are you sure you want to delete your account?", async () => {
      try {
        const res = await fetch(`${apiUrl}/api/users/${contextUser.id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (res.ok) {
          setAlertData({show: true, status: true, message:"Account deleted successfully!"});
          setContextUser(undefined);
          logout();
          refreshUser();
        } else {
          setAlertData({show: true, status: false, message:"Failed to delete account"});
        }
      } catch (error) {
        setAlertData({show: true, status: false, message:"Error deleting account"});
      }
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <figure className="profile-icon">
            <img src={contextUser.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(contextUser.username)}&background=random&rounded=true`} alt={contextUser.username} className="avatar" />
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
        <div className="Delete-Account" style={{ margin: "5px" , width: "100%" }}>
          <button className="btn-third" style={{ width: "100%" } } onClick={() => handleDeleteAccount()}>Delete Account</button>
        </div>
            
      </div>
    </div>
  );
};

export default ProfileCard;
