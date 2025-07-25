import axios from 'axios'
const BASE_URL = 'http://localhost:8000';

export const loginUser = async (email, password) => {
    const response = await axios.post(`${BASE_URL}/account/login/`, {email,password});
    return response.data;
};

export const registerUser = async (formData) => {
    const response = await axios.post(`${BASE_URL}/account/register/`, formData);
    return response.data;
};

export const refreshToken = async (refresh) => {
    const response = await axios.post(`${BASE_URL}/api/token/refresh/`, { refresh });
    return response.data;
};