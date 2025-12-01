// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { API_URL } from "../App";
import { apiGet, apiUploadPicture, apiPut } from "../api";

export default function Profile({ currentUser, setCurrentUser }) {
  const [profile, setProfile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    age: "",
    country: "",
    culture: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  // Load profile for the logged-in user
  useEffect(() => {
    if (!currentUser) return;

    const initProfile = currentUser.profile || null;
    if (initProfile) {
      setProfile(initProfile);
      setForm({
        name: initProfile.name || "",
        age: String(initProfile.age ?? ""),
        country: initProfile.country || "",
        culture: initProfile.culture || "",
      });
    }

    const fetchProfile = async () => {
      const profileId = initProfile?.id;
      if (!profileId) return;

      try {
        const data = await apiGet(`/user/info/${profileId}/`);
        const p = data.user;
        setProfile(p);
        setForm({
          name: p.name || "",
          age: String(p.age ?? ""),
          country: p.country || "",
          culture: p.culture || "",
        });

        const updatedUser = { ...currentUser, profile: p };
        setCurrentUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } catch (e) {
        console.error("Failed to refresh profile", e);
      }
    };

    fetchProfile();
  }, [currentUser, setCurrentUser]);

  if (!currentUser) {
    return (
      <div className="page">
        <h1 className="page-title">Profile & Info</h1>
        <p>You are not logged in. Go to the Login page to sign in.</p>
      </div>
    );
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    try {
      setUploading(true);
      const data = await apiUploadPicture(file, currentUser.id);
      const updatedProfile = data.user;
      setProfile(updatedProfile);
      setForm({
        name: updatedProfile.name || "",
        age: String(updatedProfile.age ?? ""),
        country: updatedProfile.country || "",
        culture: updatedProfile.culture || "",
      });

      const updatedUser = { ...currentUser, profile: updatedProfile };
      setCurrentUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setError("");
    setStatus("");

    const payload = {
      name: form.name.trim(),
      age: Number(form.age) || 0,
      country: form.country.trim(),
      culture: form.culture.trim(),
    };

    try {
      const data = await apiPut(`/user/info/${profile.id}/`, payload);
      if (data.success) {
        const updatedProfile = data.user;
        setProfile(updatedProfile);
        setForm({
          name: updatedProfile.name || "",
          age: String(updatedProfile.age ?? ""),
          country: updatedProfile.country || "",
          culture: updatedProfile.culture || "",
        });
        setStatus("Profile updated.");

        const updatedUser = { ...currentUser, profile: updatedProfile };
        setCurrentUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        setError("Could not update profile.");
        console.error("Update errors:", data.errors);
      }
    } catch (err) {
      console.error("Update failed", err);
      setError("Network or server error.");
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className="page">
        <h1 className="page-title">Profile & Info</h1>
        <p>Loading profile...</p>
      </div>
    );
  }

  const pictureUrl =
    profile && profile.picture
      ? `${API_URL}/user/picture/${
          profile.picture.split("/").slice(-1)[0]
        }`
      : "https://via.placeholder.com/120x120.png?text=Profile";

  return (
    <div className="page">
      <h1 className="page-title">Profile & Info</h1>

      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          alignItems: "flex-start",
        }}
      >
        <div>
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
          <div style={{ marginTop: "0.75rem" }}>
            <label
              className="btn btn-secondary"
              style={{ display: "inline-block" }}
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

        <form onSubmit={handleSave} style={{ flex: 1, maxWidth: 360 }}>
          <div className="form-row">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label htmlFor="age">Age</label>
            <input
              id="age"
              name="age"
              type="number"
              min="0"
              value={form.age}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label htmlFor="country">Country</label>
            <input
              id="country"
              name="country"
              value={form.country}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label htmlFor="culture">Culture</label>
            <input
              id="culture"
              name="culture"
              value={form.culture}
              onChange={handleChange}
            />
          </div>

          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>

          {error && (
            <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>
          )}
          {status && (
            <p style={{ color: "green", marginTop: "0.5rem" }}>{status}</p>
          )}
        </form>
      </div>

      <hr style={{ margin: "1.5rem 0", borderColor: "#e5e7eb" }} />

      <section>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
          About CultureConnect
        </h2>
        <p style={{ fontSize: "0.9rem", color: "#4b5563" }}>
          CultureConnect is a culture-based event locator and poster. It blends
          events created inside this app with events coming from other websites
          and ranks them so you see the most relevant experiences first.
        </p>
        {/* ... rest of your static explanatory text unchanged ... */}
      </section>
    </div>
  );
}
