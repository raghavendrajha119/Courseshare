import axios from "axios";

export const markTaskComplete = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.patch(
      `http://localhost:8000/courseshare/tasks/${id}/complete/`,
      { completed_date: new Date().toISOString().split("T")[0] },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to mark task complete:", error.response || error);
    return null;
  }
};
