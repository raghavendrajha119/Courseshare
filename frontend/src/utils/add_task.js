import axios from "axios";

const BASE_URL = "http://localhost:8000";

export const addTask = async (formData) => {
  try {
    const token = localStorage.getItem("access_token");

    const response = await axios.post(`${BASE_URL}/courseshare/tasks/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response.data)
    return response.data;
  } catch (err) {
    console.error("Error creating the task", err.response?.data || err.message);
    return null;
  }
};
