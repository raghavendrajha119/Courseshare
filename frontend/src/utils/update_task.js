import axios from "axios";

export const updateTask = async (id, taskData) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.patch(
      `http://localhost:8000/courseshare/tasks/${id}/update/`,
      taskData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Update Task error:", error.response || error);
    return null;
  }
};
