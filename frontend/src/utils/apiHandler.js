import axios from 'axios';

const BASE_URL ='http://localhost:3001';

export const get = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      params,
    });
    return response;
  } catch (error) {
    console.error('GET request error:', error);
    throw error;
  }
};

export const post = async (endpoint, data) => {
  try {
    const response = await axios.post(`${BASE_URL}${endpoint}`, data);
    return response;
  } catch (error) {
    console.error('POST request error:', error);
    throw error;
  }
};

export const put = async (endpoint, data) => {
  try {
    const response = await axios.put(`${BASE_URL}${endpoint}`, data);
    return response;
  } catch (error) {
    console.error('PUT request error:', error);
    throw error;
  }
};

export const del = async (endpoint, data = {}) => {
  try {
    const response = await axios.delete(`${BASE_URL}${endpoint}`, { data });
    return response;
  } catch (error) {
    console.error('DELETE request error:', error);
    throw error;
  }
};