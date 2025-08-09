import React, { useContext, useEffect, useState } from "react";
import "./UserProfile.css";
import StateContext from "../../Context/StateContext";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { privacy } from '../../Utils/data.js';
import CreatePlaylist from '../CreatePlaylist/CreatePlaylist.jsx'

function UserProfile() {
  const navigate = useNavigate();

  const { sidebar, currentLoggedUser, isCreatePlaylistVisible, setisCreatePlaylistVisible, playlist, setplaylist} = useContext(StateContext);

  const [history, sethistory] = useState([]);
  const [likedVideos, setlikedVideos] = useState([]);
  const [savedVideos, setsavedVideos] = useState([]);
  

  const GetUserProfile = async() => {
    
    const BASE_URL = "https://youtube-clone-6wbs.onrender.com/api";

    try {
      const response = await axios.get(`${BASE_URL}/v1/user/userprofile`, { withCredentials: true });
      console.log(response);
      setlikedVideos(response.data.user.likedVideos);
      sethistory(response.data.user.watchHistory);
      setsavedVideos(response.data.user.savedVideos);
      setplaylist(response.data.user.playlists)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    GetUserProfile()
  }, [currentLoggedUser]);
  

  

  return (
    <div
      id="content_container_profile"
      style={{ width: sidebar ? "87.7%" : "96.6%" }}
    >
      {isCreatePlaylistVisible && <CreatePlaylist/>}
      <div id="user_info_container">
        <div id="user_profile_user_img_container">
          {currentLoggedUser?.profileImage ? (
            <img src={currentLoggedUser?.profileImage} alt="" />
          ) : (
            <p>{currentLoggedUser?.firstname[0].toUpperCase()}</p>
          )}
        </div>
        <div id="user_profile_user_info_container">
          <div id="user_profile_user_name">
            {currentLoggedUser?.firstname} {currentLoggedUser?.lastname}
          </div>
          <div id="youtube_channel_handle">
            {currentLoggedUser?.channel?.channelHandle}
          </div>
          <div id="user_profile_user_extra_options">
            <div id="switch_account">
              <div id="switch_account_icon">
                <i class="fa-solid fa-users-line"></i>
              </div>
              <div id="switch_account_name">Switch Account</div>
            </div>
            <div id="google_account">
              <div id="google_account_icon">
                <i class="fa-brands fa-google"></i>
              </div>
              <div id="google_account_name">Google Account</div>
            </div>
          </div>
        </div>
      </div>
      <div id="user_profile_section_container">
        <div id="user_profile_section_heading">
          <div id="user_profile_section_heading_name">History</div>
          <div id="user_profile_section_heading_options">
            <div
              id="user_profile_section_heading_viewall"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/history");
              }}
              style={{ cursor: "pointer" }}
            >
              View all
            </div>
            <div className="user_profile_section_heading_arrow">
              <i class="fa-solid fa-angle-left"></i>
            </div>
            <div className="user_profile_section_heading_arrow">
              <i class="fa-solid fa-angle-right"></i>
            </div>
          </div>
        </div>
        <div id="user_profile_section_content_container">
          {history.map((val, key) => (
            <div className="user_profile_video" onClick={(e) => {e.stopPropagation(); e.preventDefault(); navigate(`/video/${val.video._id}`);}}>
              <div className="user_profile_thumbnail">                
                <img src={val?.video?.thumbnailUrl} alt="" />
              </div>
              <div className="user_profile_video_details">
                <div className="user_profile_channel_logo_container">
                  <img src={val?.video?.channel?.channelLogo} alt="" />
                </div>
                <div className="user_profile_video_info">
                  <div className="user_profile_video_title">
                    {val?.video?.title}
                  </div>
                  <div className="user_profile_channel_name">{val?.video?.channel?.name}</div>
                  <div className="user_profile_addtional_info">
                    <span>120K Views</span>
                    <span>7 months ago</span>
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
      <div id="user_profile_section_container">
        <div id="user_profile_section_heading">
          <div id="user_profile_section_heading_name">Playlists</div>
          <div id="user_profile_section_heading_options_playlist">
            <div className="user_profile_section_heading_arrow" onClick={() => {setisCreatePlaylistVisible(true)}}>
              <i class="fa-solid fa-plus"></i>
            </div>
            <div
              id="user_profile_section_heading_viewall"
              onClick={() => {
                navigate("/playlists");
              }}
            >
              View all
            </div>
            <div className="user_profile_section_heading_arrow">
              <i class="fa-solid fa-angle-left"></i>
            </div>
            <div className="user_profile_section_heading_arrow">
              <i class="fa-solid fa-angle-right"></i>
            </div>
          </div>
        </div>
        <div id="user_profile_section_content_container">
          {playlist?.map((val, key) => (
            <div className="user_profile_video">
              <div className="user_profile_thumbnail_playlist">
                <div className="user_profile_thumbnail_container">
                  <img src={val?.videos[0]?.thumbnailUrl ||"/image.png"} alt="" />
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
      <div id="user_profile_section_container">
        <div id="user_profile_section_heading">
          <div id="user_profile_section_heading_name">Watch Later</div>
          <div id="user_profile_section_heading_options">
            <div
              id="user_profile_section_heading_viewall"
              onClick={() => {
                navigate("/watchLater");
              }}
            >
              View all
            </div>
            <div className="user_profile_section_heading_arrow">
              <i class="fa-solid fa-angle-left"></i>
            </div>
            <div className="user_profile_section_heading_arrow">
              <i class="fa-solid fa-angle-right"></i>
            </div>
          </div>
        </div>
        <div id="user_profile_section_content_container">
          {savedVideos.map((val, key) => (
            <div className="user_profile_video" onClick={(e) => {e.stopPropagation(); e.preventDefault(); navigate(`/video/${val._id}`)}}>
              <div className="user_profile_thumbnail">
                <img src={val?.thumbnailUrl} alt="" />
              </div>
              <div className="user_profile_video_details">
                <div className="user_profile_channel_logo_container">
                  <img src={val?.channel?.channelLogo} alt="" />
                </div>
                <div className="user_profile_video_info">
                  <div className="user_profile_video_title">
                    {val?.title}
                  </div>
                  <div className="user_profile_channel_name">{val?.channel?.name}</div>
                  <div className="user_profile_addtional_info">
                    <span>120K Views</span>
                    <span>7 months ago</span>
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
      <div id="user_profile_section_container">
        <div id="user_profile_section_heading">
          <div id="user_profile_section_heading_name">Liked Videos</div>
          <div id="user_profile_section_heading_options">
            <div
              id="user_profile_section_heading_viewall"
              onClick={() => {
                navigate("/likedVideos");
              }}
            >
              View all
            </div>
            <div className="user_profile_section_heading_arrow">
              <i class="fa-solid fa-angle-left"></i>
            </div>
            <div className="user_profile_section_heading_arrow">
              <i class="fa-solid fa-angle-right"></i>
            </div>
          </div>
        </div>
        <div id="user_profile_section_content_container">
          {likedVideos.map((val, key) => (
            <div className="user_profile_video" onClick={(e) => {e.stopPropagation(); e.preventDefault(); navigate(`/video/${val._id}`);}}>
              <div className="user_profile_thumbnail">
                <img src={val.thumbnailUrl} alt="" />
              </div>
              <div className="user_profile_video_details">
                <div className="user_profile_channel_logo_container">
                  <img src={val.channel.channelLogo} alt="" />
                </div>
                <div className="user_profile_video_info">
                  <div className="user_profile_video_title">
                    {val.title}
                  </div>
                  <div className="user_profile_channel_name">{val.channel.name}</div>
                  <div className="user_profile_addtional_info">
                    <span>120K Views</span>
                    <span>7 months ago</span>
                  </div>
                </div>
                <div className="user_profile_extra_option">
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div id="user_profile_bottom_div"></div>
      </div>
    </div>
  );
}

export default UserProfile;
