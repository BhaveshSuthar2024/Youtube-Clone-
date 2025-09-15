import React, {useEffect, useState, useRef, useContext} from 'react'
import './VideoScreen.css'
import Navbar from '../Navbar/Navbar.jsx'
import fetchData from '../../Utils/FetchData.js';
import { useNavigate, useParams } from 'react-router-dom'
import StateContext from '../../Context/StateContext.js';
import {likeHandler, dislikeHandler, commentLikeHandler, commentDislikeHandler} from '../../Utils/likesHandler.js'
import axios from 'axios';
import WatchHistoryHandler from '../../Utils/HistoryHandler.js'
import { saveVideo } from '../../Utils/SaveVideoHandler.js'
import AddToPlaylist from '../AddToPlaylist/AddToPlaylist.jsx';
import CreatePlaylist from '../CreatePlaylist/CreatePlaylist.jsx'



function VideoScreen() {

    const { id } = useParams();
    const videoRef = useRef(null);
    const videoContainerRef = useRef(null);
    const commentInputRef = useRef(null);
    const progressBarRef = useRef(null);
    const navigate = useNavigate();
    const Video = videoRef.current;
    const {currentLoggedUser, isAddToPlaylistVisible, setisAddToPlaylistVisible, isVideoSaved, isNewPlaylistVisible } = useContext(StateContext);

    const [video, setvideo] = useState("");
    const [videos, setvideos] = useState([]);
    const [isVolVisible, setisVolVisible] = useState(false);
    const [isVolVisibleOnClick, setisVolVisibleOnClick] = useState(false);
    const [isVideoPlaying, setisVideoPlaying] = useState(true);
    const [isVideoEnded, setisVideoEnded] = useState(false);
    const [isVideoMuted, setisVideoMuted] = useState(true);
    const [videoProgress, setvideoProgress] = useState('');
    const [isFullscreen, setisFullscreen] = useState(false);
    const [isDragging, setisDragging] = useState(false);
    const [isFocus, setisFocus] = useState(false);
    const [hoverId, sethoverId] = useState('');
    const [isDiscriptionFull, setisDiscriptionFull] = useState(false);
    const [isHoveringOnVideo, setisHoveringOnVideo] = useState(false);
    const [isHoveringInFullscreen, setisHoveringInFullscreen] = useState(false);
    const [isStableVolOn, setisStableVolOn] = useState(false);
    const [isAmbidientOn, setisAmbidientOn] = useState(false);
    const [isAnnotationsOn, setisAnnotationsOn] = useState(false);
    const [isSettingContOpen, setisSettingContOpen] = useState(false);
    const [settingTab, setsettingTab] = useState('home');
    const [settingContHeight, setsettingContHeight] = useState('');
    const [playbackSpeed, setplaybackSpeed] = useState('Normal');
    const [isVideoLiked, setisVideoLiked] = useState(false);
    const [isVideoDisliked, setisVideoDisliked] = useState(false);
    const [wasLiked, setwasLiked] = useState(false);
    const [wasDisliked, setwasDisliked] = useState(false);
    const [likeCount, setlikeCount] = useState(0);
    const [dislikeCount, setdislikeCount] = useState(0);
    const [comment, setcomment] = useState('');
    const [comments, setcomments] = useState([]);
    const [totalComments, settotalComments] = useState();
    const [commentUserOptionId, setcommentUserOptionId] = useState('');
    const [commentUserOptionVisible, setcommentUserOptionVisible] = useState(false);
    const [isEditingComment, setisEditingComment] = useState(false);
    const [commentToBeEdited, setcommentToBeEdited] = useState('');
    const [isReplyActivated, setisReplyActivated] = useState(false);
    const [replyOn, setreplyOn] = useState('');
    const [subcomments, setsubcomments] = useState([]);
    const [newRepliedComment, setnewRepliedComment] = useState({});


    //Fetches Data from Backend
    useEffect(() => {
        const fetchDataAsync = async() => {
            const response = await fetchData(id);
            const allVideosResponse = await fetchData("getAllVideos");
            const fetchedVideo = response.data.video
            const fetchedVideos = allVideosResponse.data.videos
            setisVideoLiked(response.data.isVideoLiked);
            setisVideoDisliked(response.data.isVideoDisliked);
        
            const reccomendationVideo = fetchedVideos.filter((val) => val._id !== fetchedVideo._id);
            setvideo(fetchedVideo);
            setvideos(reccomendationVideo);
            setdislikeCount(response.data.video.dislikeCount);
            setlikeCount(response.data.video.likeCount);
            setisVideoSaved(response.data.isVideoSaved)
        }
        fetchDataAsync();


        setisVolVisible(false);
        setisVolVisibleOnClick(false);
        setisVideoPlaying(true);
        setisVideoMuted(true);
        setisVideoEnded(false);

    }, [id]);


    // Check whether the video is Playing, Paused or Ended
    useEffect(() => {
        const Video = videoRef.current

        Video.play()

        Video.addEventListener('play', () => {
            setisVideoPlaying(true);
        });

        Video.addEventListener('pause', () => {
            setisVideoPlaying(false);
        });

        Video.addEventListener('ended', () => {
            setisVideoEnded(true);
        });

    }, []);


    // For formated Timestamp in the form of (hh:mm:ss)
    const formatDuration = (seconds) => {
        const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0'); // Get hours
        const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0'); // Get minutes
        const secs = String(Math.floor(seconds % 60)).padStart(2, '0'); // Get seconds
        return `${hrs}:${mins}:${secs}`;
    }; 
    

    // Handles Replay of Video when it is Ended
    const HandleReplay = () => {

        const Video = videoRef.current
        Video.currentTime = 0;
        Video.play();
        setisVideoEnded(false);
        setisVideoPlaying(true);
    }


    // Handle Playing and Pausing of the Video
    const HandlePlayPause = () => {

        const Video = videoRef.current;
        setisVideoPlaying((prev) => {
            const shouldPlay = !prev;
            if (shouldPlay) {
                Video.play();
            } else {
                Video.pause();
            }
            return shouldPlay;
        });
    }


    // Handle Playing, Pausing and Replay of the Video
    const HandleReplayPlayPause = () => {

        if(isVideoEnded){
            HandleReplay();
        }else{
            HandlePlayPause();
        }
    }


    // Handle Muting of the Video
    const HandleMute = () => {
        const Video = videoRef.current;

        setisVideoMuted((prev) => !prev);
        isVideoMuted?Video.muted = false: Video.muted = true;
    }

    
    // Handles Progress Bar Updates
    useEffect(() => {

        const Video = videoRef.current;
        if(!Video){ return; }

        const VideoProgressBar = () => {
    
            let Duration = Video?.duration;
            let TimePassed = Video?.currentTime;
    
            let PercentCovered = (TimePassed/Duration)*100;
            setvideoProgress(`${PercentCovered}%`);
        }

        Video.addEventListener('timeupdate', VideoProgressBar);

        return () => {
            Video.removeEventListener('timeupdate', VideoProgressBar)
        }

    }, []);


    // Handles Fullscreen Functioning of Video
    const HandleFullscreen = async() => {
        const VideoContainer = videoContainerRef.current;

        if(!document.fullscreenElement){
            try {
                await VideoContainer.requestFullscreen()
            } catch (error) {
                console.log(error);
            }
        }else{
            await document.exitFullscreen()
        }
    }


    // Event Listener checks whether the video is Fullscreen or not
    useEffect(() => {
        const handleIsFullscreen = () => {
            setisFullscreen(!!document.fullscreenElement)
        }

        document.addEventListener('fullscreenchange', handleIsFullscreen);

        return () => {
            document.removeEventListener('fullscreenchange', handleIsFullscreen);
        }
    }, []);


    // Handles Video time update through Progress Bar
    const progressBarHandler = (e) => {
        const bar = progressBarRef.current;
        const dimension = bar.getBoundingClientRect();
        const offsetX = e.clientX - dimension.left;
        const percent = Math.max(0, Math.min(1, offsetX / dimension.width));
        const newTime = percent * Video.duration;

        Video.currentTime = newTime;
        setvideoProgress(percent*100)
    }
    

    // Event Listener that checks is the Mouse Idle
    useEffect(() => {
        let timerId;

        const handleMouseMove = () => {
            if(!isHoveringInFullscreen){
                setisHoveringInFullscreen(true)
            }

            clearTimeout(timerId);

            timerId = setTimeout(() => {
                setisHoveringInFullscreen(false);
            }, 1000);
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            clearTimeout(timerId);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isHoveringInFullscreen])


    // Event Listener hearing for Custom Shortcuts
    useEffect(() => {
        const CustomShortcuts = (e) => {
            if(e.key === 'f'){
                e.preventDefault();
                HandleFullscreen();
            }
            if(e.key === 'm'){
                e.preventDefault();
                HandleMute();
            }
        }

        window.addEventListener('keydown', CustomShortcuts);

        return () => {
            window.removeEventListener('keydown', CustomShortcuts);
        }
        
    }, []);

    
    // Changes Setting Container Height according to conditions
    const SettingContHeight = () => {
        if(isFullscreen && settingTab === 'home') return "26%";
        if(!isFullscreen && settingTab === 'home') return "30.1%";
        if(isFullscreen && settingTab === 'speed') return "40%";
        if(!isFullscreen && settingTab === 'speed') return "55%";
    }
    

    // Handles playback speed of the video
    const HandleSpeed = (e) => {
        const Video = videoRef.current;
        Video.playbackRate = parseFloat(e.target.dataset.speed);
        if(e.target.dataset.speed == "1"){
            setplaybackSpeed('Normal');
        }else{
            setplaybackSpeed(`${e.target.dataset.speed}`);
        }
    }


    // Function for Creating a Comment
    const CreateComment = async(videoId) => {

        const BASE_URL = "https://youtube-clone-6wbs.onrender.com/api";

        try {
            const response = await axios.post(`${BASE_URL}/v1/comment/${videoId}`, {text: comment}, { withCredentials: true });
            
            await LoadComments(video._id);
            setcomment('')
        } catch (error) {
            console.log(error);
        }
    }


    // Load Comments Function 
    const LoadComments = async(videoId) => {

        const BASE_URL = "https://youtube-clone-6wbs.onrender.com/api";

        try {
            if(video?._id){
                const response = await axios.get(`${BASE_URL}/v1/comment/${videoId}`, { withCredentials: true });
              
                settotalComments(response.data.totalComments);
                setcomments(response.data.formattedComments || []);
            }
        } catch (error) {
            console.log(error);
            if(error.response.status === 404){
                setcomments([]);
            }
        }
    }


    // Load Comments
    useEffect(() => {
        if (video && video._id) {
            LoadComments(id);
        }
    }, [video, id]);


    // Handle Like Button
    const handleLikeClick = async () => {
        try {
            const res = await likeHandler(video._id);
            const { isVideoLiked, isVideoDisliked, wasDisliked } = res.data;
    
            setisVideoLiked(isVideoLiked);
            setisVideoDisliked(isVideoDisliked);
            setwasDisliked(wasDisliked);
    
            if (!isVideoLiked && !isVideoDisliked) {
                setlikeCount(prev => prev - 1);
            } else if (isVideoLiked && wasDisliked) {
                setlikeCount(prev => prev + 1);
                setdislikeCount(prev => prev - 1);
            } else if (isVideoLiked) {
                setlikeCount(prev => prev + 1);
            }
        } catch (err) {
            console.error(err);
        }
    };
    
    // Handle Dislike Button
    const handleDislikeClick = async () => {
        try {
            const res = await dislikeHandler(video._id);
            const { isVideoDisliked, isVideoLiked, wasLiked } = res.data;
    
            setisVideoDisliked(isVideoDisliked);
            setisVideoLiked(isVideoLiked);
            setwasLiked(wasLiked);
    
            if (!isVideoLiked && !isVideoDisliked) {
                setdislikeCount(prev => prev - 1);
            } else if (isVideoDisliked && wasLiked) {
                setlikeCount(prev => prev - 1);
                setdislikeCount(prev => prev + 1);
            } else if (isVideoDisliked) {
                setdislikeCount(prev => prev + 1);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Delete Comment Handler
    const deleteComment = async(commentId) => {

        const BASE_URL = "https://youtube-clone-6wbs.onrender.com/api";
        
        try {
            const response = await axios.delete(`${BASE_URL}/v1/comment/${commentId}`, { withCredentials: true });
           
            LoadComments(video._id);
        } catch (error) {
            console.log(error);
        }
    }

    // Edit Comment Handler
    const EditTheComment = async(comment) => {

        setisEditingComment(true);
        setcomment(comment.text);
        setcommentToBeEdited(comment._id);
        setcommentUserOptionVisible(false);
    }

    // Handle the edited Comment
    const EditComment = async(commentId) => {

        const BASE_URL = "https://youtube-clone-6wbs.onrender.com/api";

        
        try {
            const response = await axios.put(`${BASE_URL}/v1/comment/${commentId}`, {text: comment}, {withCredentials: true});
           
            setcomment('');
            LoadComments(video._id);
        } catch (error) {
            console.log(error);
        }
    }
    
    // Handle History
    useEffect(() => {
        const videoEl = videoRef.current;
        let hasReported = false;
    
        const handleTimeUpdate = () => {
            if (!hasReported && videoEl.currentTime >= videoEl.duration * 0.25) {
                hasReported = true; // prevent multiple calls
                WatchHistoryHandler(video._id, true);
            }
        };
    
        if (videoEl) {
            videoEl.addEventListener("timeupdate", handleTimeUpdate);
        }
    
        return () => {
            if (videoEl) {
                videoEl.removeEventListener("timeupdate", handleTimeUpdate);
            }
        };
    }, [video._id]);


    // Handles Like on Comment
    const handleCommentLikeClick = async (commentId) => {
        try {
          const res = await commentLikeHandler(commentId);
          const { isCommentLiked, isCommentDisliked, wasDisliked } = res.data;
          
      
          setcomments(prevComments =>
            prevComments.map(comment => {

              if (comment._id !== commentId) return comment;
      
              
              let newLikeCount = comment.likeCount;
              let newDislikeCount = comment.dislikeCount;
      
              if (isCommentLiked && wasDisliked) {
                newLikeCount += 1;
                newDislikeCount -= 1;
              } else if (isCommentLiked && !comment.isLiked) {
                newLikeCount += 1;
              } else if (!isCommentLiked && comment.isLiked) {
                newLikeCount -= 1;
              }
      
              return {
                ...comment,
                isLiked: isCommentLiked,
                isDisliked: isCommentDisliked,
                likeCount: newLikeCount,
                dislikeCount: newDislikeCount,
              };
            })
          );
        } catch (err) {
          console.error(err);
        }
      };

    // Handles Dislike on Comment
    const handleCommentDislikeClick = async (commentId) => {
        try {
          const res = await commentDislikeHandler(commentId);
          const { isCommentDisliked, isCommentLiked, wasLiked } = res.data;
      
          setcomments(prevComments =>
            prevComments.map(comment => {
              if (comment._id !== commentId) return comment;
      
              let newLikeCount = comment.likeCount;
              let newDislikeCount = comment.dislikeCount;
      
              if (isCommentDisliked && wasLiked) {
                newLikeCount -= 1;
                newDislikeCount += 1;
              } else if (isCommentDisliked && !comment.isDisliked) {
                newDislikeCount += 1;
              } else if (!isCommentDisliked && comment.isDisliked) {
                newDislikeCount -= 1;
              }
      
              return {
                ...comment,
                isLiked: isCommentLiked,
                isDisliked: isCommentDisliked,
                likeCount: newLikeCount,
                dislikeCount: newDislikeCount,
              };
            })
          );
        } catch (err) {
          console.error(err);
        }
    };


    // Activate Reply Handler
    const ActivateReply = (commentId) => {
        setisFocus(true);
        setisReplyActivated(true);
        setreplyOn(commentId)
    }


    // Handles Reply on Comment
    const replyHandler = async(commentId) => {

        const BASE_URL = "https://youtube-clone-6wbs.onrender.com/api";

        try {
            const response = await axios.post(`${BASE_URL}/v1/comment/reply/${commentId}`, {text: comment}, {withCredentials: true});
            
            setnewRepliedComment(response.data.repliedComment)
            setisFocus(false);
            setisReplyActivated(false);
            loadRepliedComments(replyOn);
            setreplyOn('')
            setcomment('')
        } catch (error) {
            console.log(error);
        }
    }


    // Handles Textarea on Activation of Reply Handler
    useEffect(() => {
        if (isReplyActivated && commentInputRef.current) {
          commentInputRef.current.focus();
        }
    }, [isReplyActivated]);


    // Load Replied Comments
    const loadRepliedComments = async(commentId) => {

        const BASE_URL = "https://youtube-clone-6wbs.onrender.com/api";

        try {
            const response = await axios.get(`${BASE_URL}/v1/comment/reply/${commentId}`, {withCredentials: true});
     
            setsubcomments(response.data.formattedComments);
        } catch (error) {
            console.log(error);
        }
    }


  return (
    <>
        <Navbar/>
        <div id="video_screen_container">
            {isAddToPlaylistVisible && <AddToPlaylist id={video._id}/>}
            {isNewPlaylistVisible && <CreatePlaylist id={video._id} page="videoScreen"/>}
            <div id="left_container">
                <div id='video_player' ref={videoContainerRef} onMouseOver={() => {setisHoveringOnVideo(true)}} onMouseLeave={() => {setisHoveringOnVideo(false)}} onMouseMove={() => {setisHoveringInFullscreen(true)}} >
                    {((!isFullscreen && ((isVideoPlaying && isHoveringOnVideo) || !isVideoPlaying)) || isFullscreen && ((isVideoPlaying && isHoveringInFullscreen) || !isVideoPlaying))&&<div id="control_container" onClick={() => {!isVideoEnded && HandlePlayPause(); setisSettingContOpen(false)}} onDoubleClick={() => {HandleFullscreen()}} style={{backgroundColor:isVideoEnded?"rgb(0, 0, 0, 0.6)":"transparent"}}>
                        {isFullscreen&&<div id="top_container">
                            <div id="top_name_container">{video.title}</div>
                            <div id="top_features_container">
                                <div className="top_features_container"><i class="fa-solid fa-circle-info"></i></div>
                                <div className="top_features_container"><i class="fa-solid fa-clock"></i></div>
                                <div className="top_features_container"><i class="fa-solid fa-share"></i></div>
                            </div>
                        </div>}
                        <div id="middle_container">

                        </div>
                        <div id="bottom_container">
                            <div id="progress_bar_container" ref={progressBarRef} onClick={(e) => {e.stopPropagation; progressBarHandler(e)}} onMouseUp={(e) => {e.stopPropagation; if(isDragging){setisDragging(false)}}} onMouseMove={(e) => {e.stopPropagation; if(isDragging){progressBarHandler(e)}}}>
                                <div id="progress_bar" style={{width:videoProgress}}></div>
                                <div id="progress_circle" style={{left:`calc(${videoProgress} - 0.4425%)`}} onMouseDown={(e) => {e.stopPropagation; setisDragging(true); progressBarHandler(e)}} onMouseUp={(e) => {e.stopPropagation; if(isDragging){setisDragging(false)}}}></div>
                            </div>
                            <div id="video_control_container">
                                <div id="right_video_control_container">
                                    <div className="right_video_control" onClick={(e) => {e.stopPropagation(); HandleReplayPlayPause()}}>{isVideoEnded?<i class="fa-solid fa-rotate-right"></i>:isVideoPlaying?<i className="fa-solid fa-pause"></i>:<i className="fa-solid fa-play"></i>}</div>
                                    <div className="right_video_control"><i className="fa-solid fa-forward-step"></i></div>
                                    <div className="right_video_control" id='volume_container_wrapper' style={{width:(isVolVisible || isVolVisibleOnClick)?"9.6%":"3.84%"}}>
                                        {isVideoMuted?<i className="fa-solid fa-volume-xmark"  onMouseEnter={() => {setisVolVisible(true)}} onMouseLeave={() => {setisVolVisible(false)}} onClick={(e) => {e.stopPropagation(); HandleMute()}}></i>:<i className="fa-solid fa-volume-low"  onMouseEnter={() => {setisVolVisible(true)}} onMouseLeave={() => {setisVolVisible(false)}} onClick={(e) => {e.stopPropagation(); HandleMute()}}></i>}
                                        <div id="video_volume_container" style={{display:(isVolVisible || isVolVisibleOnClick)?"flex":"none"}} onClick={() => {setisVolVisibleOnClick(true) }} onMouseEnter={() => {setisVolVisible(true)}} onMouseLeave={() => {setisVolVisible(false)}}>
                                            <div id="video_volume_progress_container"></div>
                                        </div>
                                    </div>
                                    <div id="time_container">{Video?.currentTime} / {Video?.duration}</div>
                                    
                                </div>
                                <div id="left_video_control_container" style={{width:isFullscreen?"11%":"22%"}}>
                                    <div className="left_video_control"><i className="fa-solid fa-circle-notch"></i></div>
                                    <div className="left_video_control"><i className="fa-solid fa-closed-captioning"style={{color:"#a19491", fontSize:"24px"}} ></i></div>
                                    <div className="left_video_control" id='setting_icon' onClick={(e) => {e.stopPropagation(); setisSettingContOpen((prev) => !prev)}}>
                                        <i className="fa-solid fa-gear"></i>
                                        {isSettingContOpen&&<div id="setting_container" style={{height:SettingContHeight()}}>
                                            {settingTab==='home'&&<>
                                            <div className="settings_container_options">
                                                <div className="setting_option_icon"><i class="fa-solid fa-music"></i></div>
                                                <div className="setting_option_name">Stable Volume</div>
                                                <div className="setting_option_control" onClick={(e) => {e.stopPropagation(); setisStableVolOn((prev) => !prev)}}>
                                                    <div className="toggle_button_container" style={{backgroundColor:isStableVolOn?"#e8042c":"#807c7c"}}>
                                                        <div className="toggle_circle" style={{left:isStableVolOn?"50%":"0%", backgroundColor:isStableVolOn?"white":"#b8c0b4"}}></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="settings_container_options">
                                                <div className="setting_option_icon"><i class="fa-brands fa-squarespace"></i></div>
                                                <div className="setting_option_name">Ambient mode</div>
                                                <div className="setting_option_control" onClick={(e) => {e.stopPropagation(); setisAmbidientOn((prev) => !prev)}}>
                                                    <div className="toggle_button_container" style={{backgroundColor:isAmbidientOn?"#e8042c":"#807c7c"}}>
                                                        <div className="toggle_circle" style={{left:isAmbidientOn?"50%":"0%", backgroundColor:isAmbidientOn?"white":"#b8c0b4"}}></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="settings_container_options">
                                                <div className="setting_option_icon"><i class="fa-solid fa-headphones"></i></div>
                                                <div className="setting_option_name">Annotations</div>
                                                <div className="setting_option_control" onClick={(e) => {e.stopPropagation(); setisAnnotationsOn((prev) => !prev)}}>
                                                    <div className="toggle_button_container" style={{backgroundColor:isAnnotationsOn?"#e8042c":"#807c7c"}}>
                                                        <div className="toggle_circle" style={{left:isAnnotationsOn?"50%":"0%", backgroundColor:isAnnotationsOn?"white":"#b8c0b4"}}></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="settings_container_options">
                                                <div className="setting_option_icon"><i class="fa-regular fa-moon"></i></div>
                                                <div className="setting_option_name">Sleep timer</div>
                                                <div className="setting_option_control">
                                                    <div className="setting_option_control_val">Off</div>
                                                    <div className="setting_option_control_icon"><i class="fa-solid fa-angle-right"></i></div>
                                                </div>
                                            </div>
                                            <div className="settings_container_options" onClick={(e) => {e.stopPropagation(); setsettingTab('speed')}}>
                                                <div className="setting_option_icon"><i class="fa-solid fa-gauge-high"></i></div>
                                                <div className="setting_option_name">Playback Speed</div>
                                                <div className="setting_option_control">
                                                    <div className="setting_option_control_val">{playbackSpeed}</div>
                                                    <div className="setting_option_control_icon"><i class="fa-solid fa-angle-right"></i></div>
                                                </div>
                                            </div>
                                            <div className="settings_container_options">
                                                <div className="setting_option_icon"><i class="fa-solid fa-sliders"></i></div>
                                                <div className="setting_option_name">Quality</div>
                                                <div className="setting_option_control">
                                                    <div className="setting_option_control_val">720p</div>
                                                    <div className="setting_option_control_icon"><i class="fa-solid fa-angle-right"></i></div>
                                                </div>
                                            </div>
                                            </>}
                                                
                                            {settingTab === 'speed'&&<div id="playback_container" style={{right:settingTab==='speed'?"0%":"-100%"}}>
                                                <div className="playback_options playback_heading" >
                                                    <div id="playback_option_icon" onClick={(e) => {e.stopPropagation(); setsettingTab('home')}}><i class="fa-solid fa-angle-left"></i></div>
                                                    <div id="playback_option_name">Playback Speed</div>
                                                </div>
                                                <div className="playback_options" data-speed="0.25" onClick={(e) => {e.stopPropagation(); HandleSpeed(e); setsettingTab('home')}}>0.25</div>
                                                <div className="playback_options" data-speed="0.5" onClick={(e) => {e.stopPropagation(); HandleSpeed(e); setsettingTab('home')}}>0.5</div>
                                                <div className="playback_options" data-speed="0.75" onClick={(e) => {e.stopPropagation(); HandleSpeed(e); setsettingTab('home')}}>0.75</div>
                                                <div className="playback_options" data-speed="1" onClick={(e) => {e.stopPropagation(); HandleSpeed(e); setsettingTab('home')}}>Normal</div>
                                                <div className="playback_options" data-speed="1.25" onClick={(e) => {e.stopPropagation(); HandleSpeed(e); setsettingTab('home')}}>1.25</div>
                                                <div className="playback_options" data-speed="1.5" onClick={(e) => {e.stopPropagation(); HandleSpeed(e); setsettingTab('home')}}>1.5</div>
                                                <div className="playback_options" data-speed="1.75" onClick={(e) => {e.stopPropagation(); HandleSpeed(e); setsettingTab('home')}}>1.75</div>
                                                <div className="playback_options" data-speed="2" onClick={(e) => {e.stopPropagation(); HandleSpeed(e); setsettingTab('home')}}>2.0</div>
                                            </div>}


                                        </div>}
                                    </div>
                                    {!isFullscreen&&<div className="left_video_control"><i className="fa-regular fa-square-minus"></i></div>}
                                    {!isFullscreen&&<div className="left_video_control"><i className="fa-regular fa-square"></i></div>}
                                    <div className="left_video_control" onClick={(e) => {e.stopPropagation(); HandleFullscreen()}}>{isFullscreen?<i class="fa-solid fa-compress"></i>:<i className="fa-solid fa-expand"></i>}</div>
                                </div>
                            </div>
                        </div>
                    </div>}
                    <video src={video.videoUrl} autoPlay={isVideoPlaying} ref={videoRef} muted={isVideoMuted}></video>
                </div>
                <div id="video_title">{video.title}</div>
                <div id="video_options">
                    <div id="right_video_options">
                        <div id="channel_logo" style={{cursor:"pointer"}} onClick={() => {navigate(`${`/channel/${video.channel._id}`}`)}}>
                            <img src={video.channel?.channelLogo} alt="" />
                        </div>
                        <div id="video_screen_channel_info_cont">
                            <div id="video_screen_channel_name" style={{cursor:"pointer"}} onClick={() => {navigate(`${`/channel/${video.channel._id}`}`)}}>{video.channel?.name}</div>
                            <div id="video_screen_subscribers">{`${video.channel?.subscriberCount} subscribers`}</div>
                        </div>
                        <div id="subscribe_button">Subscribe</div>
                    </div>
                    <div id="left_video_options" >

                        <div id="like_unlike_buttons" className='left_video_option'>
                            <div id="like_container" className='like_unlike_button' onClick={() => {handleLikeClick()}}>
                                <div className="like_unlike_button_icon_cont">{!isVideoLiked?<i class="fa-regular fa-thumbs-up"></i>:<i class="fa-solid fa-thumbs-up"></i>}</div>
                                <div className="like_unlike_button_name">{likeCount}</div>
                            </div>
                            <div id="dislike_container" className='like_unlike_button' onClick={() => {handleDislikeClick()}}>
                                <div className="like_unlike_button_icon_cont">{!isVideoDisliked?<i class="fa-regular fa-thumbs-down"></i>:<i class="fa-solid fa-thumbs-down"></i>}</div>
                                <div className="like_unlike_button_name">{dislikeCount}</div>
                            </div>
                        </div>

                        <div id="share_button" className='left_video_option'>
                            <div className="left_video_option_icon_cont">
                                <i class="fa-solid fa-share"></i>
                            </div>
                            <div className="left_video_option_name">Share</div>
                        </div>
                        <div id="download_button" className='left_video_option'>
                            <div className="left_video_option_icon_cont">
                                <i class="fa-solid fa-download"></i>
                            </div>
                            <div className="left_video_option_name">Download</div>
                        </div>
                        <div id="clip_button" className='left_video_option'>
                            <div className="left_video_option_icon_cont" style={{marginLeft:'10%'}}>
                                <i class="fa-solid fa-scissors"></i>
                            </div>
                            <div className="left_video_option_name">Clip</div>
                        </div>
                        <div id="save_button" className='left_video_option' onClick={() => {setisAddToPlaylistVisible(true)}}>
                            <div className="left_video_option_icon_cont">
                                {isVideoSaved?<i class="fa-solid fa-bookmark"></i>:<i class="fa-regular fa-bookmark"></i>}
                            </div>
                            <div className="left_video_option_name">{isVideoSaved?"Saved":"Save"}</div>
                        </div>
                        <div id="horizontal_three_dots" className='left_video_option'><i class="fa-solid fa-ellipsis-vertical"></i></div>
                    </div>
                </div>

                {/* Discription */}

                <div id="discription_container" style={{height:isDiscriptionFull?"auto":"10.2%"}}>
                    <div id="video_view_time">
                        <div id="video_views">10M views</div>
                        <div id="video_time">2 years ago</div>
                    </div>
                    {!isDiscriptionFull&&<div id="more_in_discription" onClick={() => {setisDiscriptionFull(true)}}>more</div>}
                    {isDiscriptionFull&&<div id="less_in_discription" onClick={() => {setisDiscriptionFull(false)}}>show less</div>}
                    <div id="discription">

                    </div>
                </div>

                <div id="comment_outer_container"></div>


                {/* Comment Section */}

                <div id="create_a_comment_container">
                    <div id="create_a_comment_heading">
                        <div id="totalCommentNumber">{`${totalComments || "No"} Comments`}</div>
                        <div id="sortBy_Comment" >
                            <div className="sortBy_Comment_icon_cont">
                                <i class="fa-solid fa-bars-staggered"></i>
                            </div>
                            <div className="sortBy_Comment_name">Sort By</div>
                        </div>
                    </div>
                    <div id="create_a_comment">
                            <div id="user_img_container"><img src={currentLoggedUser?.profileImage} alt="" /></div>
                            <div id="comment_input_container">
                                <textarea type="text" onFocus={() => {setisFocus(true)}}  value={comment} onChange={(e) => {setcomment(e.target.value)}} ref={commentInputRef}/>
                                {isFocus&&<div id="input_extra_options">
                                    <div id="emoji_button"><i class="fa-regular fa-face-smile"></i></div>
                                    <div id="input_container_button">
                                        <div id="cancel" onClick={() => {setisReplyActivated(false); setcomment(''); setisFocus(false)}}>Cancel</div>
                                        <div id="comment" onClick={() => {isEditingComment?EditComment(commentToBeEdited):isReplyActivated?replyHandler(replyOn):CreateComment(video._id)}}>{isReplyActivated?"Reply":"Comment"}</div>
                                    </div>
                                </div>}
                            </div>
                    </div>
                </div>

                <div id="comments_collection_container">
                    {comments?.map((val, key) => (
                        <>
                            <div id="comment_container" key={key}>
                                <div id="comment_box">
                                    <div id="channel_logo_at_comment">
                                        <img src={val?.owner?.profileImage} alt="" />
                                    </div>
                                    <div id="comment_info_container">
                                        <div id="comment_info">
                                            <div id="comment_channel_name">{`${val?.owner?.firstname} ${val?.owner?.lastname}`}</div>
                                            <div id="comment_time"></div>
                                        </div>
                                        <div id="users_comment">{val?.text}</div>
                                        <div id="comment_like_dislike_container">
                                            <div id="comment_like_container" onClick={() => {handleCommentLikeClick(val._id)}}>
                                                <div id="comment_like_icon_container">{val?.isLiked?<i class="fa-solid fa-thumbs-up"></i>:<i class="fa-regular fa-thumbs-up"></i>}</div>
                                                <div id="comment_like_count">{val.likeCount}</div>
                                            </div>
                                            <div id="comment_dislike_container" onClick={() => {handleCommentDislikeClick(val._id)}}>
                                                <div id="comment_dislike_icon_container">{val?.isDisliked?<i class="fa-solid fa-thumbs-down"></i>:<i class="fa-regular fa-thumbs-down"></i>}</div>
                                                <div id="comment_dislike_count">{val.dislikeCount}</div>
                                            </div>
                                            <div id="comment_reply_option" onClick={() => {ActivateReply(val._id)}}>Reply</div>
                                        </div>
                                    </div>
                                    <div id="comments_three_dots">
                                        <i class="fa-solid fa-ellipsis-vertical"  onClick={() => {setcommentUserOptionId(val._id); setcommentUserOptionVisible(prev => !prev)}}></i>

                                        {(commentUserOptionId === val._id)&&<>
                                        {(currentLoggedUser._id === val.owner._id)?<div id="comments_three_dots_container_self" style={{display:commentUserOptionVisible?"flex":"none"}}>
                                            <div className="comments_three_dots_container_self_option" onClick={(e) => {EditTheComment(val); e.stopPropagation(); isEditingComment(true)}}>
                                                <i class="fa-solid fa-pencil"></i>
                                                <div id="comments_three_dots_container_self_option_text">Edit</div>
                                            </div>
                                            <div className="comments_three_dots_container_self_option" onClick={(e) => {e.stopPropagation(); deleteComment(val._id)}}>
                                                <i class="fa-solid fa-trash"></i>
                                                <div id="comments_three_dots_container_self_option_text">Delete</div>
                                            </div>
                                        </div>:
                                        <div id="comments_three_dots_container" style={{display:commentUserOptionVisible?"flex":"none"}}>
                                            <div className="comments_three_dots_container_self_option">
                                                <i class="fa-solid fa-flag"></i>
                                                <div id="comments_three_dots_container_self_option_text">Report</div>
                                            </div>
                                        </div>}</>}
                                    </div>

                                </div>
                                <div id="replied_comments_container">
                                    {subcomments?.map((val, key) => (
                                    <div id="subcomment_container" key={key}>
                                        <div id="comment_box">
                                            <div id="channel_logo_at_comment">
                                                <img src={val?.owner?.profileImage} alt="" />
                                            </div>
                                            <div id="comment_info_container">
                                                <div id="comment_info">
                                                    <div id="comment_channel_name">{`${val?.owner?.firstname} ${val?.owner?.lastname}`}</div>
                                                    <div id="comment_time"></div>
                                                </div>
                                                <div id="users_comment">{val?.text}</div>
                                                <div id="comment_like_dislike_container">
                                                    <div id="comment_like_container" onClick={() => {handleCommentLikeClick(val._id)}}>
                                                        <div id="comment_like_icon_container">{val?.isLiked?<i class="fa-solid fa-thumbs-up"></i>:<i class="fa-regular fa-thumbs-up"></i>}</div>
                                                        <div id="comment_like_count">{val.likeCount}</div>
                                                    </div>
                                                    <div id="comment_dislike_container" onClick={() => {handleCommentDislikeClick(val._id)}}>
                                                        <div id="comment_dislike_icon_container">{val?.isDisliked?<i class="fa-solid fa-thumbs-down"></i>:<i class="fa-regular fa-thumbs-down"></i>}</div>
                                                        <div id="comment_dislike_count">{val.dislikeCount}</div>
                                                    </div>
                                                    <div id="comment_reply_option" onClick={() => {ActivateReply(val._id)}}>Reply</div>
                                                </div>
                                            </div>
                                            <div id="comments_three_dots">
                                                <i class="fa-solid fa-ellipsis-vertical"  onClick={() => {setcommentUserOptionId(val._id); setcommentUserOptionVisible(prev => !prev)}}></i>

                                                {(commentUserOptionId === val._id)&&<>
                                                {(currentLoggedUser._id === val.owner._id)?<div id="comments_three_dots_container_self" style={{display:commentUserOptionVisible?"flex":"none"}}>
                                                    <div className="comments_three_dots_container_self_option" onClick={(e) => {EditTheComment(val); e.stopPropagation(); isEditingComment(true)}}>
                                                        <i class="fa-solid fa-pencil"></i>
                                                        <div id="comments_three_dots_container_self_option_text">Edit</div>
                                                    </div>
                                                    <div className="comments_three_dots_container_self_option" onClick={(e) => {e.stopPropagation(); deleteComment(val._id)}}>
                                                        <i class="fa-solid fa-trash"></i>
                                                        <div id="comments_three_dots_container_self_option_text">Delete</div>
                                                    </div>
                                                </div>:
                                                <div id="comments_three_dots_container" style={{display:commentUserOptionVisible?"flex":"none"}}>
                                                    <div className="comments_three_dots_container_self_option">
                                                        <i class="fa-solid fa-flag"></i>
                                                        <div id="comments_three_dots_container_self_option_text">Report</div>
                                                    </div>
                                                </div>}</>}
                                            </div>

                                        </div>
                                    </div>
                                    ))}
                                </div>
                                <div id="reply_container">
                                    <div id="reply_button">
                                        <div id="reply_button_icon">
                                            <i class="fa-solid fa-angle-down"></i>
                                        </div>
                                        <div id="reply_button_text" onClick={() => {loadRepliedComments(val._id)}}>{`${val.repliedCommentCount} replies`}</div>
                                    </div>
                                </div>

                            </div>
                        </>
                    )
                    )}
                </div>
                

            </div>
            <div id="right_container">
                {videos.map((val) => 
                    (
                        <>
                            <div id="recomendation_video_container" key={val._id} onClick={() => { navigate(`/video/${val._id}`)}} onMouseEnter={() => {sethoverId(val._id)}} onMouseLeave={() => {sethoverId('')}}>
                                <div id="recomendation_video_thumbnail_container">
                                    <div id="mouseover_option_container">
                                        <div id="clock" ><i class="fa-regular fa-clock"></i></div> 
                                        <div id="queue"><i class="fa-solid fa-bars-staggered"></i></div>
                                    </div>
                                    {!(hoverId==val._id)&&<div className="duration">{formatDuration(val.duration)}</div>}
                                    {hoverId==val._id?<video src={val.videoUrl} autoPlay muted/>:<img src={val.thumbnailUrl} alt="" />}
                                </div>
                                <div id="recomendation_video_info">
                                    <div id="recomendation_video_name">{val.title}</div>
                                    <div id="recomendation_video_channel_name">Bhavesh</div>
                                    <div id="recomendation_video_extra_info">
                                        <div id="recomendation_video_views">13.4M views</div>
                                        <div id="recomendation_video_time">1 year ago</div>
                                    </div>
                                    <div id="new_logo"></div>
                                </div>
                                <div id="recomendation_video_threedots_container"><i class="fa-solid fa-ellipsis-vertical"></i></div>
                            </div>
                        </>
                    )
                )}
            </div>
        </div>
    </>
  );
}


export default VideoScreen

