import React, { useContext, useEffect, useState } from "react";
import "./VideoListScreen.css";
import { useParams } from "react-router-dom";
import StateContext from "../../Context/StateContext";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import UploadVideo from '../UploadVideo/UploadVideo'

function VideoListScreen() {
  const { Page, id } = useParams();
  const { sidebar, currentLoggedUser, setuploadContainerVisible, uploadContainerVisible, playlistData, setplaylistData } = useContext(StateContext);
  const navigate = useNavigate();

  const [isPlaylistSaved, setisPlaylistSaved] = useState('');
  const [playlistOption, setplaylistOption] = useState(false);
  const [playlistOwner, setplaylistOwner] = useState('');
  const [videoSelected, setvideoSelected] = useState('');
  const [isVideoOptionsAvailable, setisVideoOptionsAvailable] = useState(false)

  // For formated Timestamp in the form of (hh:mm:ss)
  const formatDuration = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0'); // Get hours
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0'); // Get minutes
    const secs = String(Math.floor(seconds % 60)).padStart(2, '0'); // Get seconds
    return `${hrs}:${mins}:${secs}`;
  };

  const GetLists = async() => {
    
    const BASE_URL = "http://localhost:3000/api";
    try {
      const response = await axios.get(`${BASE_URL}/v1/user/${Page}`, { withCredentials: true });
      console.log(response);

      Page === "likedVideos" && setdata(response.data.user.likedVideos);
      Page === "watchLater" && setdata(response.data.user.savedVideos);

      console.log(Page);
      

    } catch (error) {
      console.log(error);
    }
  }

  const loadVideoInPlaylist = async(playlistId) => {

    const BASE_URL = "http://localhost:3000/api";
    try {
      const response = await axios.get(`${BASE_URL}/v1/playlist/${playlistId}`, {withCredentials: true});
      console.log(response);
      setplaylistData(response?.data?.playlist?.videos)
      setisPlaylistSaved(response?.data?.isSaved)
      setplaylistOwner(response?.data?.playlist?.channel);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (Page !== "playlist") {
      loadVideoInPlaylist(id);
    } else {
      GetLists();
    }
  }, [Page, id, currentLoggedUser]);

  const savePlaylist = async() => {

    const BASE_URL = "http://localhost:3000/api";
    try{
      const response = await axios.post(`${BASE_URL}/v1/playlist/${id}`, {}, {withCredentials: true})
      console.log(response);
      return response;
    }catch(error){
      console.log(error);
    }
  }

  const deletePlaylist = async() => {

    const BASE_URL = "http://localhost:3000/api";
    try{
      const response = await axios.delete(`${BASE_URL}/v1/playlist/${id}`, {withCredentials: true})
      console.log(response);
      navigate("/user_profile");
    }catch(error){
      console.log(error);
    }
  }

  const deleteVideoFromPlaylist = async(videoId) => {
    
    const BASE_URL = "http://localhost:3000/api";
    try{
      const response = await axios.delete(`${BASE_URL}/v1/playlist/${id}/${videoId}`, {withCredentials: true})
      console.log(response);
      setplaylistData(response?.data?.updatedPlaylist?.videos);
    }catch(error){
      console.log(error);
    }
  }
  
  
  return (
    <div
      id="content_container_videolist"
      style={{ width: sidebar ? "87.7%" : "96.6%" }}
    >
      {uploadContainerVisible && <UploadVideo page={"Playlist"} id={id} />}
      <div id="videolist_left_container">
        <div id="videolist_left_container_img_box">
          <img src={playlistData[0]?.thumbnailUrl} alt="" />
        </div>
        <div id="videolist_name">
          {Page === "watchLater"
            ? "Watch Later"
            : Page === "likedVideos"
              ? "Liked Videos"
              : "A Complete NODE JS Course Step by Step"}
        </div>
        {(Page === "watchLater" || Page === "likedVideos") && (
          <div id="videolist_username">{currentLoggedUser?.firstname} {currentLoggedUser?.lastname}</div>
        )}
        {(Page !== "watchLater" &&  Page !== "likedVideos") && (
          <div id="videolist_left_container_channel_container">
            <div id="videolist_left_container_channel_logo"></div>
            <div id="videolist_left_container_channel_name">Channel Name</div>
          </div>
        )}
        <div id="videolist_information_container">{`${playlistData.length} videos`}</div>
        {(Page === "watchLater" || Page === "likedVideos") && (
          <div id="videolist_left_container_options">
            <div className="videolist_left_container_option">
              <i class="fa-solid fa-download"></i>
            </div>
            {Page === "watchLater" && (
              <div className="videolist_left_container_option">
                <i class="fa-solid fa-ellipsis-vertical"></i>
              </div>
            )}
          </div>
        )}
        <div id="videolist_left_container_video_options">
          <div className="videolist_left_container_video_option">
            <i class="fsetplaylistOwnera-solid fa-play"></i>
            <div className="videolist_left_container_video_option_name">
              Play all
            </div>
          </div>
          {(Page === "watchLater" || Page === "likedVideos") && (
            <div className="videolist_left_container_video_option">
              <i class="fa-solid fa-shuffle"></i>
              <div className="videolist_left_container_video_option_name">
                Shuffle
              </div>
            </div>
          )}
          {(Page !== "watchLater" &&  Page !== "likedVideos") && (
            <>
              <div className="playlist_left_container_video_option" onClick={() => {setuploadContainerVisible(true)}}>
                <i class="fa-solid fa-plus"></i>
              </div>
              <div className="playlist_left_container_video_option" onClick={() => {savePlaylist().then((res) => (setisPlaylistSaved(res.data.isSaved)))}}>
                {!isPlaylistSaved?<i class="fa-regular fa-bookmark"></i>:<i class="fa-solid fa-bookmark"></i>}
              </div>
              <div className="playlist_left_container_video_option">
                <i class="fa-solid fa-share"></i>
              </div>
              <div className="playlist_left_container_video_option" onClick={() => {setplaylistOption(prev => !prev)}}>
                <i class="fa-solid fa-ellipsis-vertical"></i>
                {playlistOption&&<>
                  {String(currentLoggedUser?.channel?._id) === String(playlistOwner)?<div id="comments_three_dots_container_self_playlist" style={{display:playlistOption?"flex":"none"}}>
                                            <div className="comments_three_dots_container_self_option_playlist">
                                                <i class="fa-solid fa-shuffle"></i>
                                                <div id="comments_three_dots_container_self_option_text">Shuffle</div>
                                            </div>
                                            <div className="comments_three_dots_container_self_option_playlist">
                                                <i class="fa-solid fa-download"></i>
                                                <div id="comments_three_dots_container_self_option_text">Download</div>
                                            </div>
                                            <div className="comments_three_dots_container_self_option_playlist">
                                                <i class="fa-regular fa-bookmark"></i>
                                                <div id="comments_three_dots_container_self_option_text">Add all to...</div>
                                            </div>
                                            <div className="comments_three_dots_container_self_option_playlist" >
                                                <i class="fa-solid fa-gear"></i>
                                                <div id="comments_three_dots_container_self_option_text">Playlist Settings</div>
                                            </div>
                                            <div className="comments_three_dots_container_self_option_playlist" onClick={() => {deletePlaylist()}}>
                                                <i class="fa-solid fa-trash"></i>
                                                <div id="comments_three_dots_container_self_option_text">Delete Playlists</div>
                                            </div>
                                        </div>:
                                        <div id="comments_three_dots_container_playlist" style={{display:playlistOption?"flex":"none"}}>
                                            <div className="comments_three_dots_container_self_option_playlist">
                                                <i class="fa-solid fa-flag"></i>
                                                <div id="comments_three_dots_container_self_option_text">Report</div>
                                            </div>
                                        </div>}</>}                     
              </div>
            </>
          )}
        </div>
      </div>
      <div id="videolist_right_container">
        {(Page === "watchLater" ||  Page === "likedVideos") && (
          <div id="videolist_right_option_container">
            {Page === "watchLater" && (
              <div id="videolist_sort_container">
                <i class="fa-solid fa-bars-staggered"></i>
                <div id="videolist_sort_name">Sort</div>
              </div>
            )}
            {Page === "likedVideos" && (
              <>
                <div className="videolist_right_option">All</div>
                <div className="videolist_right_option">Videos</div>
                <div className="videolist_right_option">Shorts</div>
              </>
            )}
          </div>
        )}
        {playlistData?.map((val, key) => (
          <div id="videolist_video_container" onClick={(e) => {e.stopPropagation(); e.preventDefault(); navigate(`/video/${val._id}`);}}>
            <div id="videolist_video_index">{key + 1}</div>
            <div id="videolist_video_content">
              <div id="videolist_video_thumbnail">
                <img src={val.thumbnailUrl} alt="" />
                <div id="videolist_video_duration">{formatDuration(val.duration)}</div>
              </div>
              <div id="videolist_video_info_container">
                <div id="videolist_video_name">
                  {val.title}
                </div>
                <div id="videolist_video_info">
                  <div className="videolist_video_info_option">{val?.channel?.name}</div>
                  <div className="videolist_video_info_option">55k views</div>
                  <div className="videolist_video_info_option">2 years ago</div>
                </div>
              </div>
            </div>
            <div id="videolist_video_option" onClick={(e) => {e.stopPropagation(); setisVideoOptionsAvailable((prev) => !prev); setvideoSelected(val._id)}}>
              <i class="fa-solid fa-ellipsis-vertical"></i>
              {((videoSelected == val._id) && isVideoOptionsAvailable) && <>
                  {(JSON.stringify(currentLoggedUser?.channel?._id) === JSON.stringify(playlistOwner))?<div id="playlist_three_dots_container_self_playlist" style={{display:isVideoOptionsAvailable?"flex":"none"}}>
                                            <div className="playlist_three_dots_container_self_option_playlist">
                                                <i class="fa-brands fa-stack-overflow"></i>
                                                <div classname="playlist_three_dots_container_self_option_text">Add to queue</div>
                                            </div>
                                            <div className="playlist_three_dots_container_self_option_playlist">
                                                <i class="fa-solid fa-clock"></i>
                                                <div classname="playlist_three_dots_container_self_option_text">Save to Watch later</div>
                                            </div>
                                            <div className="playlist_three_dots_container_self_option_playlist">
                                                <i class="fa-regular fa-bookmark"></i>
                                                <div classname="playlist_three_dots_container_self_option_text">Save to playlist</div>
                                            </div>
                                            <div className="playlist_three_dots_container_self_option_playlist" onClick={() => {deleteVideoFromPlaylist(val._id)}}>
                                                <i class="fa-solid fa-trash"></i>
                                                <div classname="playlist_three_dots_container_self_option_text">Remove from current Playlist</div>
                                            </div>
                                            <div className="playlist_three_dots_container_self_option_playlist">
                                                <i class="fa-solid fa-download"></i>
                                                <div classname="playlist_three_dots_container_self_option_text">Download</div>
                                            </div>
                                            <div className="playlist_three_dots_container_self_option_playlist">
                                                <i class="fa-solid fa-share"></i>
                                                <div classname="playlist_three_dots_container_self_option_text">Share</div>
                                            </div>
                                            <div className="playlist_three_dots_container_self_option_playlist">
                                                <i class="fa-solid fa-arrow-up"></i>
                                                <div classname="playlist_three_dots_container_self_option_text">Move to top</div>
                                            </div>
                                            <div className="playlist_three_dots_container_self_option_playlist">
                                                <i class="fa-solid fa-arrow-down"></i>
                                                <div classname="playlist_three_dots_container_self_option_text">Move to bottom</div>
                                            </div>
                                        </div>:
                                        <div id="playlist_three_dots_container_playlist" style={{display:isVideoOptionsAvailable?"flex":"none"}}>
                                            <div className="playlist_three_dots_container_self_option_playlist">
                                                <i class="fa-brands fa-stack-overflow"></i>
                                                <div classname="playlist_three_dots_container_self_option_text">Add to queue</div>
                                            </div>
                                            <div className="playlist_three_dots_container_self_option_playlist">
                                                <i class="fa-solid fa-clock"></i>
                                                <div classname="playlist_three_dots_container_self_option_text">Save to Watch later</div>
                                            </div>
                                            <div className="playlist_three_dots_container_self_option_playlist">
                                                <i class="fa-regular fa-bookmark"></i>
                                                <div classname="playlist_three_dots_container_self_option_text">Save to playlist</div>
                                            </div>
                                            <div className="playlist_three_dots_container_self_option_playlist">
                                                <i class="fa-solid fa-download"></i>
                                                <div classname="playlist_three_dots_container_self_option_text">Download</div>
                                            </div>
                                            <div className="playlist_three_dots_container_self_option_playlist">
                                                <i class="fa-solid fa-share"></i>
                                                <div classname="playlist_three_dots_container_self_option_text">Share</div>
                                            </div>
                                        </div>}</>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VideoListScreen;