import axios from "axios";

const BASE_URL = 'http://localhost:8000';

export const getMyCourses = async () => {
    try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
            `${BASE_URL}/courseshare/courses/my/`,
            {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            },
        );
        return response.data;
    } catch(err) {
        console.error("Error getting the educator course",err);
        return null;
    }
}