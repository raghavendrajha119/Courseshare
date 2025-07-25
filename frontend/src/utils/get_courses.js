import axios from "axios";

const BASE_URL = 'http://localhost:8000';

export const fetchFeaturedCourses = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/courseshare/courses/`);
    console.log(res.data.slice(0,3));
    return res.data;
  } catch (err) {
    console.error("Error fetching courses", err);
    return [];
  }
};

export const fetchSelectCourse = async(id) => {
  try {
    const token = localStorage.getItem('access_token');
    const res = await axios.get(
      `${BASE_URL}/courseshare/courses/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.error("Error fetching courses", err);
    return [];
  }
}
