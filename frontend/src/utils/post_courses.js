import axios from "axios";

const BASE_URL = "http://localhost:8000";

export const createCourse = async (formData) => {
  try {
    const token = localStorage.getItem("access_token");

    const response = await axios.post(`${BASE_URL}/courseshare/courses/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (err) {
    console.error("Error creating the course", err.response?.data || err.message);
    return null;
  }
};
