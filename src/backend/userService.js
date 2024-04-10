// userService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const signUp = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/signup`, { name, email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  

  export function signOut() {
    // Remove user data from localStorage
    localStorage.removeItem('currentUser');
  }
  


  export async function signIn(email, password) {
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      const userData = response.data;
      // Save user data in localStorage
      localStorage.setItem('currentUser', JSON.stringify(userData.user));
      return userData;
    } catch (error) {
      throw error;
    }
  }
  
  
  export async function getUserInfo(userId) {
    try {
      const response = await axios.get(`http://localhost:5000/users/${userId}`);
      const userInfo = response.data;
      return userInfo;
    } catch (error) {
      throw error; // Throw the error for handling in the component
    }
  }
  


export const signInAsGuest = async () => {
    try {
    } catch (error) {
      throw error;
    }
  };
