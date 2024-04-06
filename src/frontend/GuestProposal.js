import React, { useState, useEffect } from 'react';
import { submitLocationProposal } from '../backend/api';
import '../style/dashboard.css';

function GuestProposal() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [username, setUsername] = useState('');

  // Effect to retrieve username from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('currentUser'));
    if (userData) {
      setUsername(userData.name);
    }
  }, []);


// Function to handle submission of location proposal
const handleSubmitProposal = async () => {
  try {
    // Log the username to verify if it's correctly extracted
    console.log('Username:', username);
    await submitLocationProposal(name, address, description, latitude, longitude, username);
    alert('Location proposal submitted successfully!');
    // Clear input fields after submission
    setName('');
    setAddress('');
    setDescription('');
    setLatitude('');
    setLongitude('');
  } catch (error) {
    console.error('Error submitting location proposal:', error);
    if (error.response && error.response.data && error.response.data.error) {
      alert(`An error occurred while submitting location proposal: ${error.response.data.error}`);
    } else {
      alert('An error occurred while submitting location proposal');
    }
  }
};



  return (
    <div>
    <div className="page-background"></div>
    <div className="container">
      <h1 className="heading">User Dashboard</h1>
      <h2>Submit Location Proposal</h2>
      {/* Display username */}
      <span className="username">{username}</span>
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
      <button className="button" onClick={handleSubmitProposal}>Submit Location Proposal</button><br />
      <a href="/home"><button className="button link-button">Back to Map</button></a>
    </div>
    </div>
  );
}

export default GuestProposal;
