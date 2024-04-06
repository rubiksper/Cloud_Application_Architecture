// api.js

import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const addLocation = async (name, address, description, latitude, longitude) => {
    try {
        const response = await axios.post(`${API_URL}/locations`, { name, address, description, latitude, longitude });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const rejectProposal = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/location-proposals/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const deleteLocation = async (name) => {
    try {
        const response = await axios.delete(`${API_URL}/locations/${name}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const submitLocationProposal = async (name, address, description, latitude, longitude, username) => {
  try {
    if (!name || !address || !description) {
      throw new Error('Missing required fields');
    }

    const response = await axios.post(`${API_URL}/location-proposals`, { name, address, description, latitude, longitude, username });
    return response.data;
  } catch (error) {
    throw error;
  }
};



export const getProposals = async () => {
  try {
    const response = await axios.get(`${API_URL}/location-proposals`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const approveProposal = async (id, name, address, description, latitude, longitude, username) => {
  try {
    const response = await axios.post(`${API_URL}/location-proposals/${id}/approve`, { name, address, description, latitude, longitude,username });
    return response.data;
  } catch (error) {
    throw error;
  }
};
