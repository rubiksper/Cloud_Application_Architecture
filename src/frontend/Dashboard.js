import React, { useState } from 'react';
import { addLocation, deleteLocation } from '../backend/api';
import '../style/dashboard.css';

function Dashboard() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleAddLocation = async () => {
    try {
      await addLocation(name, address, description, latitude, longitude);
      alert('Location added successfully!');
    } catch (error) {
      console.error('Error adding location:', error);
      if (error.response && error.response.data && error.response.data.error) {
        alert(`An error occurred while adding location: ${error.response.data.error}`);
      } else {
        alert('An error occurred while adding location');
      }
    }
  };

  const handleDeleteLocation = async () => {
    try {
      if (!name) {
        alert('Location Name is required');
        return;
      }
  
      const response = await deleteLocation(name);
      if (response.status === 200) {
        alert('Location deleted successfully!');
      } else if (response.status === 404) {
        const data = await response.json();
        alert(`Location not found: ${data.error}`);
      } else {
        alert('An error occurred while deleting location');
      }
    } catch (error) {
      console.error('Error deleting location:', error);
      if (error.response && error.response.data && error.response.data.error) {
        alert(`An error occurred while deleting location: ${error.response.data.error}`);
      } else {
        alert('An error occurred while deleting location');
      }
    }
  };

  return (
    <div>
      <div className="page-background"></div>
      <div className="container">
        <h1 className="heading">Admin Dashboard</h1>
        <h2>Add Location</h2>
        <input 
          className="input-field" 
          type="text" 
          placeholder="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <input 
          className="input-field" 
          type="text" 
          placeholder="Address" 
          value={address} 
          onChange={(e) => setAddress(e.target.value)} 
        />
        <input 
          className="input-field" 
          type="text" 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />
        <input 
          className="input-field" 
          type="text" 
          placeholder="Latitude" 
          value={latitude} 
          onChange={(e) => setLatitude(e.target.value)} 
        />
        <input 
          className="input-field" 
          type="text" 
          placeholder="Longitude" 
          value={longitude} 
          onChange={(e) => setLongitude(e.target.value)} 
        />
        <button className="button" onClick={handleAddLocation}>Add Location</button>
        <h2>Delete Location</h2>
        <input 
          className="input-field" 
          type="text" 
          placeholder="Location Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <button className="button delete-button" onClick={handleDeleteLocation}>Delete Location</button><br />
        <a href="/AdminHouse">
          <button className="button link-button">Back to Map</button>
        </a>
      </div>
    </div>
  );
}

export default Dashboard;
