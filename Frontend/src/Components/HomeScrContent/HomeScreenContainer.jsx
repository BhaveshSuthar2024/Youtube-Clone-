import React, { useEffect, useRef, useState, useContext } from "react";
import fetchData from "../../Utils/FetchData.js";
import { useNavigate } from "react-router-dom";
import StateContext from "../../Context/StateContext";
import "./HomeScreenContainer.css";
import axios from "axios";
import UploadVideo from '../UploadVideo/UploadVideo.jsx'

function HomeScreenContainer() {
  const progressBarRef = useRef(null);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const subContainerRef = useRef(null);

  const { sidebar, data, setdata, uploadContainerVisible } = useContext(StateContext);
  const [HoverKey, setHoverKey] = useState(null);
  const [volume, setvolume] = useState(false);
  const [mouseHoveredFor, setmouseHoveredFor] = useState(false);
  const [videoProgress, setvideoProgress] = useState("");
  const [isDragging, setisDragging] = useState(false);
  const [suggetionBarPosition, setsuggetionBarPosition] = useState(0);
  const [maxLeftScroll, setmaxLeftScroll] = useState(0);

  useEffect(() => {
    const fetchDataAsync = async () => {
      const response = await fetchData("getAllVideos");
      setdata(response.data.videos);
    };
    fetchDataAsync();
  }, []);

  const formatDuration = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0"); // Get hours
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0"); // Get minutes
    const secs = String(Math.floor(seconds % 60)).padStart(2, "0"); // Get seconds
    return `${hrs}:${mins}:${secs}`;
  };

  const navigate = useNavigate();

  let mouseOver = useRef(null);

  const HandleMouseEnter = () => {
    mouseOver.current = setTimeout(() => {
      setmouseHoveredFor(true);
    }, 1200);
  };

  const HandleMouseLeave = () => {
    setmouseHoveredFor(false);
    clearTimeout(mouseOver);
  };

  const progressBarHandler = (e) => {
    const Video = videoRef.current;

    const bar = progressBarRef.current;
    const dimension = bar.getBoundingClientRect();
    const offsetX = e.clientX - dimension.left;
    const percent = Math.max(0, Math.min(1, offsetX / dimension.width));
    const newTime = percent * Video.duration;

    Video.currentTime = newTime;
    setvideoProgress(percent * 100);
  };

  useEffect(() => {
    const Video = videoRef.current;
    if (!Video) {
      return;
    }

    const VideoProgressBar = () => {
      let Duration = Video?.duration;
      let TimePassed = Video?.currentTime;

      let PercentCovered = (TimePassed / Duration) * 100;
      setvideoProgress(`${PercentCovered}%`);
    };

    Video.addEventListener("timeupdate", VideoProgressBar);

    return () => {
      Video.removeEventListener("timeupdate", VideoProgressBar);
    };
  }, []);

  useEffect(() => {
    const Container = containerRef.current;
    const SubContainer = subContainerRef.current;

    const overflowLength = SubContainer.scrollWidth - Container.clientWidth;
    const overflowPercentage =
      -(overflowLength / SubContainer.scrollWidth) * 100;

    setmaxLeftScroll(overflowPercentage);
  }, []);

  const deleteVideo = async (id) => {
    const BASE_URL = "https://youtube-clone-6wbs.onrender.com/api";

    try {
      const response = await axios.delete(`${BASE_URL}/v1/videos/${id}`, {
        withCredentials: true,
      });
     
      const newData = data.filter(
        (val) => val._id !== response.data.deletedVideo._id,
      );
      setdata(newData);
    } catch (error) {
      console.log(error);
    }
  };

  

  return (
    <div id="content_container" style={{ width: sidebar ? "87.7%" : "96.6%" }}>
      {uploadContainerVisible && <UploadVideo />}
      <div id="suggestion_container" ref={containerRef}>
        {suggetionBarPosition < 0 && <div id="suggestion_left_shadow"></div>}
        {suggetionBarPosition > maxLeftScroll && (
          <div id="suggestion_right_shadow"></div>
        )}
        {suggetionBarPosition < 0 && (
          <div
            id="suggestion_left_arrow"
            onClick={() => {
              setsuggetionBarPosition((prev) => {
                const newPosition = parseInt(prev);
                return newPosition < 0 ? newPosition + 10 : newPosition;
              });
            }}
          >
            <i class="fa-solid fa-angle-left"></i>
          </div>
        )}
        {suggetionBarPosition > maxLeftScroll && (
          <div
            id="suggestion_right_arrow"
            onClick={() => {
              setsuggetionBarPosition((prev) => {
                const newPosition = parseInt(prev);
                return newPosition > maxLeftScroll
                  ? newPosition - 10
                  : newPosition;
              });
            }}
          >
            <i class="fa-solid fa-angle-right"></i>
          </div>
        )}
        <div
          id="suggestion_subcontainer"
          style={{ transform: `translate(${suggetionBarPosition}%)` }}
          ref={subContainerRef}
        >
          <div id="suggestions">All</div>
          <div id="suggestions">Figma</div>
          <div id="suggestions">JavaScript</div>
          <div id="suggestions">Java Full Course</div>
          <div id="suggestions">Web Development</div>
          <div id="suggestions">Machine Learning</div>
          <div id="suggestions">Python Basics</div>
          <div id="suggestions">Tom and Jerry</div>
          <div id="suggestions">DSA C++</div>
          <div id="suggestions">Game Engine</div>
          <div id="suggestions">Pokemon</div>
          <div id="suggestions">IPL</div>
          <div id="suggestions">Cricket</div>
          <div id="suggestions">GTA VII</div>
          <div id="suggestions">Breaking News</div>
          <div id="suggestions">Gaming</div>
          <div id="suggestions">Xiaomi 5A</div>
          <div id="suggestions">Latest Viral</div>
          <div id="suggestions">Avengers Endgame</div>
          <div id="suggestions">Movies</div>
          <div id="suggestions">Newly Launched</div>
          <div id="suggestions">Black Holes</div>
          <div id="suggestions">Adult</div>
          <div id="suggestions">Rajasthan</div>
          <div id="suggestions">Maksad</div>
          <div id="suggestions">Rice</div>
        </div>
      </div>
      <div className="video_container">
        {data?.length > 0 ? (
          data.map((val, key) => {
            return (
              <>
                <div
                  className="video"
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
                    <div id="video">
                      <div id="mouseover_option_container">
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
                      <div
                        id="progress_bar_container_home"
                        ref={progressBarRef}
                        onClick={(e) => {
                          e.stopPropagation();
                          progressBarHandler(e);
                        }}
                        onMouseUp={(e) => {
                          e.stopPropagation();
                          if (isDragging) {
                            setisDragging(false);
                          }
                        }}
                        onMouseMove={(e) => {
                          e.stopPropagation();
                          if (isDragging) {
                            progressBarHandler(e);
                          }
                        }}
                      >
                        <div
                          id="progress_bar_home"
                          style={{ width: videoProgress }}
                        ></div>
                        <div
                          id="progress_circle_home"
                          style={{ left: `calc(${videoProgress} - 0.4425%)` }}
                          onMouseDown={(e) => {
                            e.stopPropagation;
                            setisDragging(true);
                            progressBarHandler(e);
                          }}
                          onMouseUp={(e) => {
                            e.stopPropagation;
                            if (isDragging) {
                              setisDragging(false);
                            }
                          }}
                        ></div>
                      </div>
                      <video
                        src={val.videoUrl}
                        autoPlay={true}
                        loop={true}
                        muted={!volume}
                      ></video>
                    </div>
                  ) : (
                    <div className="thumbnail">
                      <div className="duration">
                        {formatDuration(val.duration)}
                      </div>
                      <img src={val.thumbnailUrl} alt="" />
                    </div>
                  )}
                  <div className="video_details">
                    <div
                      className="channel_logo_container"
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`${`/channel/${val.channel._id}`}`);
                      }}
                    >
                      <img src={val.channel?.channelLogo} alt="" />
                    </div>
                    <div className="video_info">
                      <div className="video_title">{val.title}</div>
                      <div
                        className="channel_name"
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`${`/channel/${val.channel._id}`}`);
                        }}
                      >
                        {val.channel?.name}
                      </div>
                      <div className="addtional_info">
                        <span>120K Views</span>
                        <span>7 months ago</span>
                      </div>
                    </div>
                    <div className="extra_option">
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
    </div>
  );
}

export default HomeScreenContainer;
