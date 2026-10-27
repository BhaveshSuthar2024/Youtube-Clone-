import axios from "axios";
import API_BASE_URL from "./api.js";

const fetchData = async (endpoint) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/v1/videos/${endpoint}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response);

    return response;
  } catch (error) {
    console.log(error);
  }
};

export default fetchData;
