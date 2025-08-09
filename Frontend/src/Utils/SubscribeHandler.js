import axios from "axios";

const subscribeHandler = async (channelId) => {
  const BASE_URL = "http://localhost:3000/api";

  try {
    const response = await axios.post(
      `${BASE_URL}/v1/channel/subscribe/${channelId}`,
      {},
      { withCredentials: true },
    );
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

const unSubscribeHandler = async (channelId) => {
  const BASE_URL = "http://localhost:3000/api";

  try {
    const response = await axios.post(
      `${BASE_URL}/v1/channel/unsubscribe/${channelId}`,
      {},
      { withCredentials: true },
    );
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

export { subscribeHandler, unSubscribeHandler };
