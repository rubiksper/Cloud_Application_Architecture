import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import gemData from '../data/gem.json';
import '../style/map.css';
import { signOut } from '../backend/userService';

mapboxgl.accessToken = 'pk.eyJ1IjoiZG9kbzI4IiwiYSI6ImNsdGxteWl5aTBidnEyanJyazJpMmI2c2gifQ.l6XS_YASDfbs4-xDdD1cwg';

const Menu = ({ isOpen, toggleMenu, username, handleLogout }) => {
  return (
    <nav className={`desktop-nav ${isOpen ? 'open' : ''}`}>
      <div className={`menu-container ${isOpen ? 'open' : ''}`}>
        <div className={`menu-icon ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <div className="menu-line"></div>
          <div className="menu-line"></div>
          <div className="menu-line"></div>
        </div>
        {isOpen && (
          <ul className="menus">
            <li className="menu-items">
              <span className="username">Logged in as: {username}</span>
            </li>
            <li className="menu-items">
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </li>
            <li className="menu-items">
              <a href="/">Home</a>
            </li>
            <li className="menu-items">
              <a href="/GuestProposal">Proposal</a>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(14.4378);
  const [lat, setLat] = useState(50.0755);
  const [zoom, setZoom] = useState(12);
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState('');

  const toggleMenu = () => {
    setMenuOpen(prevMenuOpen => !prevMenuOpen);
  };

  const handleLogout = () => {
    signOut(); // Call the signOut function from userService.js to remove user data from localStorage
    window.location.href = '/login'; // Redirect user to the login page
  };

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []); // Empty dependency array means this effect will only run once after initial render

  useEffect(() => {
    if (!map.current) return;

    gemData.features.forEach(feature => {
      const { geometry, properties } = feature;
      const { coordinates } = geometry;
      const popup = new mapboxgl.Popup().setHTML(
        `<h2>${properties.name}</h2>
        <p>${properties.address}</p>
        <p>${properties.description}</p>`
      );

      new mapboxgl.Marker()
        .setLngLat(coordinates)
        .setPopup(popup)
        .addTo(map.current);
    });
  }, [gemData]);

  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('currentUser'));
    if (userData) {
      setUsername(userData.name);
    }
  }, []);

  return (
    <div>
      <Menu isOpen={menuOpen} toggleMenu={toggleMenu} username={username} handleLogout={handleLogout} />
      <div style={{ paddingTop: '0px', width: '100vw', height: 'calc(100vh - 40px)' }}>
        <div ref={mapContainer} className="map-container" style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}
