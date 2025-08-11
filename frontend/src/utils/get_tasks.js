import axios from "axios";

const BASE_URL = 'http://localhost:8000';

export const fetchTasks = async () => {
  try {
    const token = localStorage.getItem('access_token');
    if(!token){
      window.location.href="http://localhost:5173/login";
      return;
    }
    const res = await axios.get(
      `${BASE_URL}/courseshare/tasks/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    console.log(res.data.slice(0,3));
    return res.data;
  } catch (err) {
    console.error("Error fetching tasks", err);
    return [];
  }
};