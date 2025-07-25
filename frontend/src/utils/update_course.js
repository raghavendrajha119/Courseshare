import axios from "axios";

export const updateCourse = async (id, courseData) => {
  try {
    const token = localStorage.getItem("access");
    const response = await axios.put(
      `http://localhost:8000/courseshare/courses/${id}/`,
      courseData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Update error:", error.response || error);
    return null;
  }
};
