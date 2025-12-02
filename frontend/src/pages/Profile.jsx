import React, { useEffect, useState } from "react";
import { API_URL } from "../App";
import { apiGet, apiUploadPicture, apiPut } from "../api";

export default function Profile() {
  const [user, setUser] = useState(null);
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

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiGet("/user/info/1/");
        setUser(data.user);
        setForm({
          name: data.user.name || "",
          age: String(data.user.age ?? ""),
          country: data.user.country || "",
          culture: data.user.culture || "",
        });
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
      setForm({
        name: data.user.name || "",
        age: String(data.user.age ?? ""),
        country: data.user.country || "",
        culture: data.user.culture || "",
      });
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
    if (!user) return;

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
      const data = await apiPut(`/user/info/${user.id}/`, payload);
      if (data.success) {
        setUser(data.user);
        setForm({
          name: data.user.name || "",
          age: String(data.user.age ?? ""),
          country: data.user.country || "",
          culture: data.user.culture || "",
        });
        setStatus("Profile updated.");
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

  const pictureUrl =
    user && user.picture
      ? `${API_URL}/user/picture/${user.picture.split("/").slice(-1)[0]}`
      : "https://via.placeholder.com/120x120.png?text=Profile";

  return (
    <div className="page">
      <h1 className="page-title">Profile & Info</h1>

      {!user ? (
        <p>Loading profile...</p>
      ) : (
        <>
          {/* Avatar + editable form */}
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

              <button
                className="btn btn-primary"
                type="submit"
                disabled={saving}
              >
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

          {/* Divider */}
          <hr style={{ margin: "1.5rem 0", borderColor: "#e5e7eb" }} />

          {/* Info / About section */}
          <section>
            <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
              About CultureConnect
            </h2>
            <p style={{ fontSize: "0.9rem", color: "#4b5563" }}>
              CultureConnect is a culture-based event locator and poster. It
              blends events created inside this app with events coming from
              other websites and ranks them so you see the most relevant
              experiences first.
            </p>

            <h3 style={{ fontSize: "1rem", marginTop: "1rem" }}>
              How recommendations work
            </h3>
            <ul
              style={{
                fontSize: "0.9rem",
                color: "#4b5563",
                paddingLeft: "1.1rem",
              }}
            >
              <li>
                Your profile (country and culture) is used to understand what
                kinds of events you may care about.
              </li>
              <li>
                Local events stored in the app are scored using an algorithm
                that considers culture match, location, and date proximity.
              </li>
              <li>
                External events (from other sites) are pulled in and normalized
                into the same structure so they can be ranked together.
              </li>
              <li>
                A priority-queue–based ranking then surfaces the best events for
                your preferences, while a Bloom filter quickly checks whether we
                have events for a (culture, location) combination.
              </li>
            </ul>

            <h3 style={{ fontSize: "1rem", marginTop: "1rem" }}>
              What you can do here
            </h3>
            <ul
              style={{
                fontSize: "0.9rem",
                color: "#4b5563",
                paddingLeft: "1.1rem",
              }}
            >
              <li>
                Update your picture so event hosts and friends recognize you.
              </li>
              <li>
                Set your culture and country so Explore and Events can
                prioritize relevant festivals, food fairs, and performances.
              </li>
              <li>
                Use the Events and Explore pages to discover things happening
                around you, both from this app and external sources.
              </li>
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
