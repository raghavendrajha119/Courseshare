import axios from "axios";

const BASE_URL = 'http://localhost:8000';

export const fetchProfileDetails = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const res = await axios.get(`${BASE_URL}/account/profile/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(res);
    return res.data;
  } catch (err) {
    console.error("Error fetching profile details", err);
    return null;
  }
};

export const updateProfileDetail = async (profileData) => {
  try {
    const token = localStorage.getItem("access_token");

    const formData = new FormData();
    if (profileData.profile_image) {
      formData.append("profile_image", profileData.profile_image);
    }
    formData.append("bio", profileData.bio || "");
    formData.append("dob", profileData.dob || "");

    const res = await axios.put(`${BASE_URL}/account/update-profile/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error updating profile details", err);
    return null;
  }
};
