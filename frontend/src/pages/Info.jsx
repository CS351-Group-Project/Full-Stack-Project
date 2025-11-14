// Info.jsx
import React, { useState, useEffect } from 'react';

const API_URL = 'http://127.0.0.1:8000/api';

export default function Info() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    picture: null,
    name: '',
    age: '',
    country: '',
    culture: ''
  });
  const [previewUrl, setPreviewUrl] = useState(null);

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
          picture: null
        });
      }
    } catch (err) {
      console.error('No user info found:', err);
      setEditing(true);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        picture: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.picture) {
        const formDataUpload = new FormData();
        formDataUpload.append('picture', formData.picture);
        
        await fetch(`${API_URL}/user/picture`, {
          method: 'POST',
          body: formDataUpload
        });
      }

      const url = userInfo 
        ? `${API_URL}/user/info/${userInfo.id}`
        : `${API_URL}/user/info`;
      
      const method = userInfo ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          age: formData.age,
          country: formData.country,
          culture: formData.culture
        })
      });

      const data = await response.json();

      if (data.success) {
        setUserInfo(data.user);
        setEditing(false);
        alert('Information saved!');
      }
    } catch (err) {
      alert('Failed to save');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !userInfo && !editing) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#6B5D52' }}>
        <p style={{ color: '#FFF' }}>Loading...</p>
      </main>
    );
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: '#6B5D52',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#8B7355',
        padding: '40px',
        maxWidth: '500px',
        width: '100%'
      }}>
        {!editing && userInfo ? (
          // Display Mode
          <>
            {/* Picture Circle */}
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: previewUrl ? `url(${previewUrl})` : '#FFFFFF',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              margin: '0 auto 30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              color: '#999'
            }}>
              {!previewUrl && 'picture'}
            </div>

            {/* Info Fields */}
            <input type="text" value={userInfo.name} readOnly style={fieldStyle} />
            <input type="text" value={userInfo.age} readOnly style={fieldStyle} />
            <input type="text" value={userInfo.country} readOnly style={fieldStyle} />
            <input type="text" value={userInfo.culture} readOnly style={fieldStyle} />

            <button onClick={() => setEditing(true)} style={buttonStyle}>
              Edit
            </button>
          </>
        ) : (
          // Edit Mode
          <form onSubmit={handleSubmit}>
            {/* Picture Upload Circle */}
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: previewUrl ? `url(${previewUrl})` : '#FFFFFF',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              margin: '0 auto 30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              color: '#999',
              position: 'relative',
              cursor: 'pointer'
            }}>
              {!previewUrl && 'picture'}
              <input
                type="file"
                accept="image/*"
                onChange={handlePictureChange}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer'
                }}
              />
            </div>

            {/* Input Fields */}
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange}
              placeholder="name"
              required
              style={fieldStyle} 
            />
            <input 
              type="number" 
              name="age" 
              value={formData.age} 
              onChange={handleInputChange}
              placeholder="age"
              required
              style={fieldStyle} 
            />
            <input 
              type="text" 
              name="country" 
              value={formData.country} 
              onChange={handleInputChange}
              placeholder="country"
              required
              style={fieldStyle} 
            />
            <input 
              type="text" 
              name="culture" 
              value={formData.culture} 
              onChange={handleInputChange}
              placeholder="culture"
              required
              style={fieldStyle} 
            />

            <div style={{ display: 'flex', gap: '10px' }}>
              {userInfo && (
                <button type="button" onClick={() => setEditing(false)} style={{ ...buttonStyle, background: '#A89B8E' }}>
                  Cancel
                </button>
              )}
              <button type="submit" disabled={loading} style={buttonStyle}>
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

// Styles
const fieldStyle = {
  width: '100%',
  padding: '12px',
  background: '#FFFFFF',
  border: 'none',
  marginBottom: '15px',
  fontSize: '14px',
  textAlign: 'center',
  boxSizing: 'border-box'
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  background: '#6B5D52',
  color: '#FFFFFF',
  border: 'none',
  fontSize: '14px',
  cursor: 'pointer',
  marginTop: '10px'
};