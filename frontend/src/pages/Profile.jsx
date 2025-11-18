import React, { useEffect, useState } from "react";
import { API_URL } from "../App";
import { apiGet, apiUploadPicture } from "../api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiGet("/user/info/1/");
        setUser(data.user);
      } catch (e) {
        console.error("Failed to load user profile", e);
      }
    };
    load();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const data = await apiUploadPicture(file);
      setUser(data.user);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const pictureUrl =
    user && user.picture
      ? `${API_URL}/user/picture/${user.picture.split("/").slice(-1)[0]}`
      : "https://via.placeholder.com/120x120.png?text=Profile";

  return (
    <div className="page">
      <h1 className="page-title">Profile</h1>

      {!user ? (
        <p>Loading profile...</p>
      ) : (
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <img
            src={pictureUrl}
            alt="Profile"
            style={{
              width: 120,
              height: 120,
              borderRadius: "999px",
              objectFit: "cover",
              border: "2px solid #e5e7eb",
            }}
          />
          <div>
            <h2 style={{ margin: 0 }}>{user.name}</h2>
            <p style={{ margin: "0.2rem 0", color: "#4b5563" }}>
              {user.age} • {user.country}
            </p>
            <p style={{ margin: "0.2rem 0", color: "#6b7280" }}>
              Culture: {user.culture}
            </p>

            <label
              className="btn btn-secondary"
              style={{ marginTop: "0.5rem", display: "inline-block" }}
            >
              {uploading ? "Uploading..." : "Change picture"}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
