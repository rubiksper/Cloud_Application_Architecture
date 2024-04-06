import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import gemData from '../data/gem.json';
import '../style/map.css';
mapboxgl.accessToken = 'pk.eyJ1IjoiZG9kbzI4IiwiYSI6ImNsdGxteWl5aTBidnEyanJyazJpMmI2c2gifQ.l6XS_YASDfbs4-xDdD1cwg';

const Menu = ({ isOpen, toggleMenu }) => {
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
              <a href="/">Home</a>
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

  const toggleMenu = () => {
    setMenuOpen(prevMenuOpen => !prevMenuOpen);
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

    // Filtrer les données pour n'inclure que les destinations sélectionnées
    const selectedDestinations = gemData.features.filter(feature => {
      // Remplacez 'destination1', 'destination2', etc. par les noms des destinations que vous souhaitez afficher
      return feature.properties.name === 'IDIOM' || feature.properties.name === 'Donuterie' || feature.properties.name === 'Lasagneria' || feature.properties.name === 'Želivárna' || feature.properties.name === 'Aromi' || feature.properties.name === 'Burgerman' || feature.properties.name === 'Sodo' || feature.properties.name === 'PAPRIKA' || feature.properties.name === 'Bruxx' || feature.properties.name === 'PIPCA';
    });

    selectedDestinations.forEach(feature => {
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
  }, []); // Empty dependency array means this effect will only run once after initial render

  return (
    <div>
      <Menu isOpen={menuOpen} toggleMenu={toggleMenu} />
      <div style={{ paddingTop: '0px', width: '100vw', height: 'calc(100vh - 40px)' }}>
        <div ref={mapContainer} className="map-container" style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}
