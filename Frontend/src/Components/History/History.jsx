import React, { useContext, useEffect, useState } from "react";
import "./History.css";
import StateContext from "../../Context/StateContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function History() {
  const { sidebar, currentLoggedUser } = useContext(StateContext);
  const navigate = useNavigate()

  const [history, sethistory] = useState([])

  const HistoryHandler = async() => {

    const BASE_URL = "http://localhost:3000/api";

    try {
      const response = await axios.get(`${BASE_URL}/v1/user/history`, {withCredentials: true});
      console.log(response);
      sethistory(response.data.user.watchHistory)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    HistoryHandler();
  }, [currentLoggedUser]);

  const RemoveVideoFromHistory = async(videoObj) => {

    const BASE_URL = "http://localhost:3000/api";

    try {
      const response = await axios.delete(`${BASE_URL}/v1/user/history`, {data: videoObj, withCredentials: true});
      console.log(response);
      HistoryHandler();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div
        id="content_container_history"
        style={{ width: sidebar ? "87.7%" : "96.6%" }}
      >
        <div id="history_container">
          <div id="history_container_heading">Watch History</div>
          <div id="day_wise_history_container">
            <div id="day_heading">Today</div>
            {history.map((val, key) => (
              <div id="history_video_container" onClick={(e) => {e.stopPropagation(); e.preventDefault(); navigate(`/video/${val.video._id}`);}}>
                <div id="history_video_thumbnail">
                  <img src={val.video.thumbnailUrl} alt="" />
                </div>
                <div id="history_video_info">
                  <div className="history_video_buttons">
                    <div className="history_video_button" onClick={(e) => {e.stopPropagation(); e.preventDefault(); RemoveVideoFromHistory(val)}}>
                      <i class="fa-solid fa-xmark"></i>
                    </div>
                    <div className="history_video_button">
                      <i class="fa-solid fa-ellipsis-vertical"></i>
                    </div>
                  </div>
                  <div id="history_video_name">
                    {val.video.title}
                  </div>
                  <div id="history_video_extra_info">{val.video.channel.name}</div>
                  <div id="history_video_discription">
                    {val.video.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div id="history_fixed_container">
          <div id="history_fixed_container_optons">
            <div id="history_search_bar">
              <div id="history_search_icon">
                <i class="fa-solid fa-magnifying-glass"></i>
              </div>
              <input type="text" placeholder="Search watch history" />
            </div>
            <div className="history_fixed_container_buttons">
              <i class="fa-solid fa-glass-water"></i>
              <div className="history_fixed_container_button_name">
                Clear all watch history
              </div>
            </div>
            <div className="history_fixed_container_buttons">
              <i class="fa-solid fa-pause"></i>
              <div className="history_fixed_container_button_name">
                Pause watch history
              </div>
            </div>
            <div className="history_fixed_container_buttons">
              <i class="fa-solid fa-gear"></i>
              <div className="history_fixed_container_button_name">
                Manage all history
              </div>
            </div>
            <div className="history_fixed_buttons">Comments</div>
            <div className="history_fixed_buttons">Posts</div>
            <div className="history_fixed_buttons">Live chats</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default History;
