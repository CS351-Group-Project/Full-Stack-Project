import React, { useState, useEffect } from "react";
import "../App.css";

const API_URL = "http://127.0.0.1:8000/api";

export default function Info() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    picture: null,
    name: "",
    age: "",
    country: "",
    culture: "",
  });

  const [previewUrl, setPreviewUrl] = useState(null);

  /* --------------------- LOAD USER INFO --------------------- */
  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/user/info/1`);
      const data = await response.json();

      if (data.success) {
        setUserInfo(data.user);
        setFormData({
          name: data.user.name,
          age: data.user.age,
          country: data.user.country,
          culture: data.user.culture,
          picture: null,
        });
      }
    } catch (err) {
      console.error("No user info found:", err);
      setEditing(true);
    } finally {
      setLoading(false);
    }
  };

  /* --------------------- INPUT HANDLING --------------------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, picture: file }));

    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  /* --------------------- SAVE FORM --------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.picture) {
        const upload = new FormData();
        upload.append("picture", formData.picture);

        await fetch(`${API_URL}/user/picture`, {
          method: "POST",
          body: upload,
        });
      }

      const url = userInfo
        ? `${API_URL}/user/info/${userInfo.id}`
        : `${API_URL}/user/info`;

      const method = userInfo ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          age: formData.age,
          country: formData.country,
          culture: formData.culture,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setUserInfo(data.user);
        setEditing(false);
        alert("Information saved!");
      }
    } catch (err) {
      alert("Failed to save");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* --------------------- LOADING STATE --------------------- */
  if (loading && !userInfo && !editing) {
    return (
      <main className="page-container bg-main" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#fff", fontSize: "1.5rem" }}>Loading...</p>
      </main>
    );
  }

  /* ===================== UI ===================== */

  return (
    <main className="page-container bg-main">
      <div className="content-box">

        {/* Page Title */}
        <h1 className="page-title">Account Information</h1>

        {/* Profile Picture */}
        <div
          className="avatar"
          style={{
            width: "120px",
            height: "120px",
            margin: "0 auto 25px",
            background: previewUrl
              ? `url(${previewUrl})`
              : userInfo?.picture
              ? `url(${API_URL}/user/picture/${userInfo.picture})`
              : "#d8c4a3",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "9999px",
            border: "3px solid #cbb9a3",
            position: "relative",
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handlePictureChange}
            style={{
              opacity: 0,
              width: "100%",
              height: "100%",
              position: "absolute",
              cursor: "pointer",
            }}
          />
        </div>

        {/* ===================== DISPLAY MODE ===================== */}
        {!editing && userInfo ? (
          <div className="account-info">

            <div className="account-field">
              <label className="account-label">Name</label>
              <p className="account-value">{userInfo.name}</p>
            </div>

            <div className="account-field">
              <label className="account-label">Age</label>
              <p className="account-value">{userInfo.age}</p>
            </div>

            <div className="account-field">
              <label className="account-label">Country</label>
              <p className="account-value">{userInfo.country}</p>
            </div>

            <div className="account-field">
              <label className="account-label">Culture</label>
              <p className="account-value">{userInfo.culture}</p>
            </div>

            <button className="exit-button" onClick={() => setEditing(true)} style={{ marginTop: "20px" }}>
              Edit Information
            </button>
          </div>
        ) : (
          /* ===================== EDIT MODE ===================== */
          <form onSubmit={handleSubmit} className="account-info">

            <div className="account-field">
              <label className="account-label">Name</label>
              <input
                type="text"
                name="name"
                className="account-value"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{ background: "#fff" }}
              />
            </div>

            <div className="account-field">
              <label className="account-label">Age</label>
              <input
                type="number"
                name="age"
                className="account-value"
                value={formData.age}
                onChange={handleInputChange}
                required
                style={{ background: "#fff" }}
              />
            </div>

            <div className="account-field">
              <label className="account-label">Country</label>
              <input
                type="text"
                name="country"
                className="account-value"
                value={formData.country}
                onChange={handleInputChange}
                required
                style={{ background: "#fff" }}
              />
            </div>

            <div className="account-field">
              <label className="account-label">Culture</label>
              <input
                type="text"
                name="culture"
                className="account-value"
                value={formData.culture}
                onChange={handleInputChange}
                required
                style={{ background: "#fff" }}
              />
            </div>

            <button className="exit-button" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>

            {userInfo && (
              <button
                className="exit-button"
                type="button"
                style={{ background: "#a89a8b" }}
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
