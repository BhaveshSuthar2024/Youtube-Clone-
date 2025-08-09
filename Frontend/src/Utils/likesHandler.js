import axios from "axios";

export const likeHandler = async (videoId) => {
  const BASE_URL = "http://localhost:3000/api";

  try {
    const response = await axios.post(
      `${BASE_URL}/v1/videos/like/${videoId}`,
      {},
      { withCredentials: true },
    );
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const commentLikeHandler = async (commentId) => {
  const BASE_URL = "http://localhost:3000/api";

  try {
    const response = await axios.post(
      `${BASE_URL}/v1/comment/like/${commentId}`,
      {},
      { withCredentials: true },
    );
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const dislikeHandler = async (videoId) => {
  const BASE_URL = "http://localhost:3000/api";

  try {
    const response = await axios.post(
      `${BASE_URL}/v1/videos/dislike/${videoId}`,
      {},
      { withCredentials: true },
    );
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const commentDislikeHandler = async (commentId) => {
  const BASE_URL = "http://localhost:3000/api";

  try {
    const response = await axios.post(
      `${BASE_URL}/v1/comment/dislike/${commentId}`,
      {},
      { withCredentials: true },
    );
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};