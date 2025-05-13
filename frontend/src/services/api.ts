import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api'; // Adjust if your backend runs on a different port

export const registerUser = async (name: string, email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, {
      name,
      email,
      password
    });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};