import React, { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut } from "../api";

export default function Info() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    country: "",
    culture: "",
  });
  const [status, setStatus] = useState("");

  // Load or create user 1
  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiGet("/user/info/1/");
        setForm({
          name: data.user.name || "",
          age: String(data.user.age || ""),
          country: data.user.country || "",
          culture: data.user.culture || "",
        });
      } catch (e) {
        console.error("User 1 not found, you may need to create it via POST /user/info/");
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus("");

    const payload = {
      name: form.name,
      age: Number(form.age) || 0,
      country: form.country,
      culture: form.culture,
    };

    try {
      // Try update first
      await apiPut("/user/info/1/", payload);
      setStatus("Profile updated.");
    } catch (err) {
      try {
        // If update fails (no user), create
        await apiPost("/user/info/", payload);
        setStatus("Profile created.");
      } catch (innerErr) {
        console.error("Failed to save user profile", innerErr);
        setStatus("Error saving profile.");
      }
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Info</h1>
      <form onSubmit={handleSave}>
        <div className="form-row">
          <label htmlFor="name">Name</label>
          <input name="name" id="name" value={form.name} onChange={handleChange} />
        </div>
        <div className="form-row">
          <label htmlFor="age">Age</label>
          <input name="age" id="age" value={form.age} onChange={handleChange} />
        </div>
        <div className="form-row">
          <label htmlFor="country">Country</label>
          <input
            name="country"
            id="country"
            value={form.country}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label htmlFor="culture">Culture</label>
          <input
            name="culture"
            id="culture"
            value={form.culture}
            onChange={handleChange}
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Save
        </button>
      </form>
      {status && <p style={{ marginTop: "0.5rem" }}>{status}</p>}
    </div>
  );
}
