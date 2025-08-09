import axios from 'axios';

export const saveVideo = async(videoId) => {

    const BASE_URL = "https://youtube-clone-6wbs.onrender.com/api";

    try {
        const response = await axios.post(`${BASE_URL}/v1/user/saveVideo/${videoId}`, {}, {withCredentials: true});
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
    }
}
