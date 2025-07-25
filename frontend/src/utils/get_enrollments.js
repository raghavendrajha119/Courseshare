import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/courseshare";

export const getUserEnrollments = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/enrollments/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch enrollments:", error);
    throw error;
  }
};

export const startCheckout = async (courseId, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/checkout/${courseId}/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Checkout failed:", error);
    throw error;
  }
};
