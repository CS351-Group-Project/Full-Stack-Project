import React, { useState, useEffect } from 'react';

const API_URL = 'http://127.0.0.1:8000/api';

export default function Explore() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/events`);
      const data = await response.json();
      if (data.success) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{
      minHeight: '100vh',
      background: '#8B7355',
      padding: '20px'
    }}>
      {/* Wallpaper Header */}
      <div style={{
        height: '100px',
        background: '#6B5D52',
        marginBottom: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#F5F5F0',
        fontSize: '16px'
      }}>
        [wallpaper of culture selected]
      </div>

      {/* Top Two Squares */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
        marginBottom: '50px',
        maxWidth: '1200px',
        margin: '0 auto 50px'
      }}>
        {/* Left Square */}
        <div style={{
          background: '#FFFFFF',
          height: '250px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          color: '#999'
        }}>
          {/* Empty */}
        </div>

        {/* Right Square - Favorite Events */}
        <div style={{
          background: '#FFFFFF',
          height: '250px',
          padding: '20px'
        }}>
          <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#333' }}>
            [favorite events pinned]
          </p>
          {loading ? (
            <p style={{ fontSize: '13px', color: '#999' }}>Loading...</p>
          ) : (
            events.slice(0, 3).map(event => (
              <div key={event.id} style={{ marginBottom: '10px', fontSize: '13px' }}>
                <p style={{ margin: 0, color: '#333' }}>{event.title}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Explore Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h3 style={{
          color: '#F5F5F0',
          fontSize: '18px',
          marginBottom: '20px'
        }}>
          explore:
        </h3>

        {/* Three Bottom Squares */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '30px'
        }}>
          <div style={{
            background: '#FFFFFF',
            height: '180px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            color: '#333',
            position: 'relative'
          }}>
            {loading ? 'Loading...' : events[0]?.title || 'Event 1'}
            <span style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              fontSize: '11px',
              color: '#999'
            }}>
              [link]
            </span>
          </div>

          <div style={{
            background: '#FFFFFF',
            height: '180px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            color: '#333',
            position: 'relative'
          }}>
            {loading ? 'Loading...' : events[1]?.title || 'Event 2'}
            <span style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              fontSize: '11px',
              color: '#999'
            }}>
              [link]
            </span>
          </div>

          <div style={{
            background: '#FFFFFF',
            height: '180px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            color: '#333',
            position: 'relative'
          }}>
            {loading ? 'Loading...' : events[2]?.title || 'Event 3'}
            <span style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              fontSize: '11px',
              color: '#999'
            }}>
              [link]
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}