import React, { useContext, useEffect, useState, useRef } from "react";
import "./ChannelScreen.css";
import StateContext from "../../Context/StateContext";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  subscribeHandler,
  unSubscribeHandler,
} from "../../Utils/SubscribeHandler.js";

function ChannelScreen() {
  const { sidebar, currentLoggedUser } = useContext(StateContext);
  const { id, page } = useParams();
  const navigate = useNavigate();
  let mouseOver = useRef(null);

  const [HoverKey, setHoverKey] = useState(null);
  const [data, setdata] = useState([]);
  const [channelData, setchannelData] = useState();
  const [videos, setvideos] = useState([]);
  const [playlists, setplaylists] = useState([])
  const [mouseHoveredFor, setmouseHoveredFor] = useState(false);
  const [volume, setvolume] = useState(false);
  const [sortedOption, setsortedOption] = useState("");
  const [isSubscribed, setisSubscribed] = useState(false);

  useEffect(() => {
    const BASE_URL = "http://localhost:3000/api";

    const fetchChannel = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/v1/channel/${id}/${page}`,
          { withCredentials: true },
        );
        console.log(response);
        setdata(response.data.channel);
        page === "videos" && setvideos(response.data.channel.videos);
        page === "playlists" && setplaylists(response.data.channel.playlist)
      } catch (error) {
        console.log(error);
      }
    };

    fetchChannel();
  }, [page, id]);

  const formatDuration = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0"); // Get hours
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0"); // Get minutes
    const secs = String(Math.floor(seconds % 60)).padStart(2, "0"); // Get seconds
    return `${hrs}:${mins}:${secs}`;
  };

  const sortContent = (videos, sortAccording) => {
    if (sortAccording === "Oldest") {
      return [...videos].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );
    }
    if (sortAccording === "Latest") {
      return [...videos].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    }
    if (sortAccording === "Popular") {
      return [...videos].sort((a, b) => b.views - a.views);
    }
  };

  const HandleMouseEnter = () => {
    mouseOver.current = setTimeout(() => {
      setmouseHoveredFor(true);
    }, 1200);
  };

  const HandleMouseLeave = () => {
    setmouseHoveredFor(false);
    clearTimeout(mouseOver);
  };

  useEffect(() => {
    if (!currentLoggedUser) return;
    setisSubscribed(currentLoggedUser.channelSubscribed.includes(id));
  }, [currentLoggedUser, id]);

  return (
    <div
      id="content_container_channel"
      style={{ width: sidebar ? "87.7%" : "96.6%" }}
    >
      <div id="channel_container">
        <div id="channel_upper_container">
          <div id="channel_cover_image_container">
            <img src={data.coverImage} alt="" />
          </div>
          <div id="channel_info_container">
            <div id="channel_user_img_container">
              <img src={data.channelLogo} alt="" />
            </div>
            <div id="channel_user_info_container">
              <div id="channel_user_name">{data.name}</div>
              <div id="channel_youtube_channel_handle">
                {data.channelHandle}
              </div>
              <div id="channel_discription">{data.discription}</div>
              <div id="channel_links">This Is Links</div>
              {!isSubscribed ? (
                <div
                  id="channel_subscribe_button"
                  onClick={async () => {
                    await subscribeHandler(data._id);
                    setisSubscribed(true);
                  }}
                >
                  Subscribe
                </div>
              ) : (
                <div
                  id="channel_subscribe_button"
                  onClick={async () => {
                    await unSubscribeHandler(data._id);
                    setisSubscribed(false);
                  }}
                >
                  Unsubscribe
                </div>
              )}
            </div>
          </div>
          <div id="user_channel_media_categories">
            <div
              className="user_channel_media_category"
              id={`${page === undefined && "active_channel_tab"}`}
              onClick={() => {
                navigate("");
              }}
            >
              Home
            </div>
            <div
              className="user_channel_media_category"
              id={`${page === "videos" && "active_channel_tab"}`}
              onClick={() => {
                navigate("videos");
              }}
            >
              Videos
            </div>
            <div
              className="user_channel_media_category"
              id={`${page === "shorts" && "active_channel_tab"}`}
              onClick={() => {
                navigate("shorts");
              }}
            >
              Shorts
            </div>
            <div
              className="user_channel_media_category"
              id={`${page === "live" && "active_channel_tab"}`}
              onClick={() => {
                navigate("live");
              }}
            >
              Live
            </div>
            <div
              className="user_channel_media_category"
              id={`${page === "playlists" && "active_channel_tab"}`}
              onClick={() => {
                navigate("playlists");
              }}
            >
              Playlists
            </div>
            <div
              className="user_channel_media_category"
              id={`${page === "posts" && "active_channel_tab"}`}
              onClick={() => {
                navigate("posts");
              }}
            >
              Post
            </div>
          </div>
        </div>
        <div id="channel_sort_videos_options">
          <div
            className="channel_sort_videos_option"
            onClick={() => {
              setsortedOption("Latest");
            }}
          >
            Latest
          </div>
          <div
            className="channel_sort_videos_option"
            onClick={() => {
              setsortedOption("Popular");
            }}
          >
            Popular
          </div>
          <div
            className="channel_sort_videos_option"
            onClick={() => {
              setsortedOption("Oldest");
            }}
          >
            Oldest
          </div>
        </div>
        {page === "videos" && (
          <div className="channel_video_container">
            {videos?.length > 0 ? (
              videos.map((val, key) => {
                return (
                  <>
                    <div
                      className="channel_video"
                      id={key}
                      onMouseEnter={() => {
                        HandleMouseEnter(), setHoverKey(key);
                      }}
                      onMouseLeave={() => {
                        HandleMouseLeave(), setHoverKey(null), setvolume(false);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        navigate(`/video/${val._id}`);
                      }}
                    >
                      {HoverKey === key && mouseHoveredFor ? (
                        <div id="channel_page_video">
                          <div id="channel_mouseover_option_container">
                            <div
                              id="speaker"
                              onClick={(e) => {
                                e.stopPropagation();
                                setvolume((prev) => !prev);
                              }}
                            >
                              {volume ? (
                                <i class="fa-solid fa-volume-high"></i>
                              ) : (
                                <i class="fa-solid fa-circle-xmark"></i>
                              )}
                            </div>
                            <div
                              id="subtitle"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <i class="fa-solid fa-closed-captioning"></i>
                            </div>
                          </div>
                          <video
                            src={val.videoUrl}
                            autoPlay={true}
                            loop={true}
                            muted={!volume}
                          ></video>
                        </div>
                      ) : (
                        <div className="channel_page_thumbnail">
                          <div className="duration">
                            {formatDuration(val.duration)}
                          </div>
                          <img src={val.thumbnailUrl} alt="" />
                        </div>
                      )}
                      <div className="channel_page_video_details">
                        <div className="channel_page_video_info">
                          <div className="channel_page_video_title">
                            {val.title}
                          </div>
                          <div className="channel_page_addtional_info">
                            <span>120K Views</span>
                            <span>7 months ago</span>
                          </div>
                        </div>
                        <div className="channel_page_extra_option">
                          <i className="fa-solid fa-ellipsis-vertical"></i>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })
            ) : (
              <div>Loading</div>
            )}
          </div>
        )}

        {page === "shorts" && (
          <div className="channel_shorts_container">
            {"data"?.length > 0 ? (
              [
                "a",
                "b",
                "c",
                "d",
                "a",
                "b",
                "c",
                "d",
                "a",
                "b",
                "c",
                "d",
                "a",
                "b",
                "c",
                "d",
                "a",
                "b",
                "c",
                "d",
              ].map((val, key) => {
                return (
                  <>
                    <div
                      className="channel_shorts"
                      id={key}
                      onMouseEnter={() => {
                        HandleMouseEnter(), setHoverKey(key);
                      }}
                      onMouseLeave={() => {
                        HandleMouseLeave(), setHoverKey(null), setvolume(false);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        navigate(`video/${val._id}`);
                      }}
                    >
                      {HoverKey === key && mouseHoveredFor ? (
                        <div id="channel_page_video">
                          <video
                            src={val.videoUrl}
                            autoPlay={true}
                            loop={true}
                            muted={!volume}
                          ></video>
                        </div>
                      ) : (
                        <div className="channel_page_shorts_thumbnail">
                          {/* <img src={val.thumbnailUrl} alt="" /> */}
                        </div>
                      )}
                      <div className="channel_page_shorts_details">
                        <div className="channel_page_video_info">
                          <div className="channel_page_video_title">
                            How to fuel your workout (without obsessing with
                            calories)
                          </div>
                          <div className="channel_page_addtional_info">
                            <span>120K Views</span>
                            <span>7 months ago</span>
                          </div>
                        </div>
                        <div className="channel_page_extra_option">
                          <i className="fa-solid fa-ellipsis-vertical"></i>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })
            ) : (
              <div>Loading</div>
            )}
          </div>
        )}

        {page === "playlists" && (
          <div className="channel_video_container">
            {playlists?.length > 0 ? (
              playlists.map((val, key) => {
                return (
                  <>
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
                  </>
                );
              })
            ) : (
              <div>Loading</div>
            )}
          </div>
        )}  


      </div>
    </div>
  );
}

export default ChannelScreen;
