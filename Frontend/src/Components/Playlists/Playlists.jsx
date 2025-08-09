import React, { useContext, useEffect, useState } from "react";
import StateContext from "../../Context/StateContext";
import './Playlists.css'
import { useNavigate } from "react-router-dom";
import axios from 'axios'

function Playlists() {

  const { sidebar, currentLoggedUser } = useContext(StateContext);
  const [playlists, setplaylists] = useState([])
  const navigate = useNavigate();

  const LoadPlaylist = async() => {

    const BASE_URL = "http://localhost:3000/api";
    try {
      const response = await axios.get(`${BASE_URL}/v1/playlist`, {withCredentials: true});
      console.log(response);
      setplaylists(response.data.playlists)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {LoadPlaylist()}, []);

  return (
    <div id="content_container_playlist" style={{ width: sidebar ? "87.7%" : "96.6%" }}>
        
        <div id="user_profile_section_heading_name_playlist">Playlists</div>
        <div id="playlist_top_options">
            <div className="playlist_top_option">Recently added</div>
            <div className="playlist_top_option">Playlists</div>
            <div className="playlist_top_option">Courses</div>
            <div className="playlist_top_option">Owned</div>
            <div className="playlist_top_option">Saved</div>
        </div>
        <div className="video_container_playlists">

        
          {playlists?.map((val, key) => (
            <div className="user_profile_video_playlist">
              <div className="user_profile_thumbnail_playlist">
                <div className="user_profile_thumbnail_container">
                  <img src={val?.videos[0]?.thumbnailUrl || "/image.png"} alt="" />
                </div>
              </div>
              <div className="user_profile_video_details">
                <div className="user_profile_channel_logo_container">
                  <img src={val?.channel?.channelLogo} alt="" />
                </div>
                <div className="user_profile_video_info">
                  <div className="user_profile_video_title">
                    {val?.name}
                  </div>
                  <div className="user_profile_channel_name">{val?.channel?.name}</div>
                  <div className="user_profile_addtional_info" onClick={() => {navigate(`/playlist/${val._id}`)}}>
                    View full playlist
                  </div>
                </div>
                <div className="user_profile_extra_option">
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default Playlists;