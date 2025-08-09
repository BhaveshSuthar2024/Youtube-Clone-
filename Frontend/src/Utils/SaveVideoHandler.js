import axios from 'axios';

export const saveVideo = async(videoId) => {

    const BASE_URL = "http://localhost:3000/api";

    try {
        const response = await axios.post(`${BASE_URL}/v1/user/saveVideo/${videoId}`, {}, {withCredentials: true});
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
    }
}
