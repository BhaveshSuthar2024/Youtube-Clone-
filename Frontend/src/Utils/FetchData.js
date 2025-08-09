import axios from "axios";

const fetchData = async (endpoint) => {
  const BASE_URL = "https://youtube-clone-6wbs.onrender.com/api";

  try {
    const response = await axios.get(`${BASE_URL}/v1/videos/${endpoint}`, {
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
