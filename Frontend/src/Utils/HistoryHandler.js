import axios from 'axios';

const WatchHistoryHandler = async(videoId, eligibility) => {

    const BASE_URL = "http://localhost:3000/api";
    try {
        const response = await axios.post(`${BASE_URL}/v1/user/${videoId}`, {videoEligibility: eligibility}, {withCredentials: true});
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

export default WatchHistoryHandler;