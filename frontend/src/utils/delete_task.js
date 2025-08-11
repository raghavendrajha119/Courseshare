import axios from "axios";

export const deleteTask = async (id) => {
  try {
    const token = localStorage.getItem("access");
    const response = await axios.delete(
      `http://localhost:8000/courseshare/tasks/${id}/delete`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.status === 204;
  } catch (error) {
    console.error("Failed to delete task:", error.response || error);
    return false;
  }
};
