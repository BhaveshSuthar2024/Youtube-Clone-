import React, { useState, useContext, useEffect } from "react";
import "./UploadVideo.css";
import StateContext from "../../Context/StateContext";
import axios from "axios";
import Lottie from "lottie-react";
import AnimationData from "../../../public/Animation.json";

function UploadVideo({ page, id }) {
  const BASE_URL = "http://localhost:3000/api";

  const { setuploadContainerVisible, uploadContainerVisible, data, setdata, setplaylistData } = useContext(StateContext);

  const [videoLocalPath, setVideoLocalPath] = useState("");
  const [thumbnailLocalPath, setThumbnailLocalPath] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [isAdult, setIsAdult] = useState(false);
  const [isSensitive, setIsSensitive] = useState(false);
  const [isPermissionGiven, setIsPermissionGiven] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [loading, setloading] = useState(false);

  const DataHandler = async () => {
    setloading(true);

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoUrl", videoLocalPath);
    formData.append("thumbnailUrl", thumbnailLocalPath);
    formData.append("privacy", privacy);
    formData.append("isAdult", isAdult);
    formData.append("isSensitive", isSensitive);

    try {
      const response = await axios.post(
        `${BASE_URL}/v1/videos/uploadVideo`,
        formData,
        { withCredentials: true },
      );
      const newData = response.data.video;
      setdata(data.concat(newData));

      setuploadContainerVisible(false);
      setVideoLocalPath("");
      setThumbnailLocalPath("");
      setTitle("");
      setDescription("");
      setVideoPreview(null);
      setThumbnailPreview(null);
      setloading(false);
    } catch (error) {
      setloading(false);
      console.log(error);
    }
  };

  const VideoFileHandler = (e) => {
    const file = e.target.files[0];
    setVideoLocalPath(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const ThumbnailFileHandler = (e) => {
    const file = e.target.files[0];
    setThumbnailLocalPath(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const PrivacyHandler = (e) => {
    setPrivacy(e.target.value);
  };

  const isAdultHandler = (e) => {
    setIsAdult(e.target.value);
  };

  const isSensitiveHandler = (e) => {
    setIsSensitive(e.target.value);
  };

  const PermissionHandler = () => {
    setIsPermissionGiven((prev) => !prev);
  };

  const UploadVideoToPlaylist = async(playlistId) => {
    setloading(true);
    const BASE_URL = "http://localhost:3000/api";

    const formData = new FormData();
    console.log(id);
    

    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoUrl", videoLocalPath);
    formData.append("thumbnailUrl", thumbnailLocalPath);
    formData.append("privacy", privacy);
    formData.append("isAdult", isAdult);
    formData.append("isSensitive", isSensitive);

    try{
      const response = await axios.post(`${BASE_URL}/v1/playlist/upload/${playlistId}`, formData, {withCredentials: true});
      console.log(response);

      setuploadContainerVisible(false);
      setVideoLocalPath("");
      setThumbnailLocalPath("");
      setTitle("");
      setDescription("");
      setVideoPreview(null);
      setThumbnailPreview(null);
      setloading(false);
      setplaylistData(prev => [...prev, response?.data?.video]);
    }catch(error){
      console.log(error);
    }
  }

  return (
    <div
      id="upload_video_container"
    >
      <div
        id="upload_video_cross_button"
        onClick={() => {
          setuploadContainerVisible(false);
          console.log("Hello");
          console.log(uploadContainerVisible);
          
        }}
      >
        <i className="fa-solid fa-xmark"></i>
      </div>
      {loading ? (
        <div id="loading_div">
          <Lottie animationData={AnimationData} loop={true} />
        </div>
      ) : (
        <div id="upload_video_option">
          <div id="file_upload">
            <div id="video_upload">
              {!videoPreview ? (
                <>
                  <label htmlFor="video">
                    <div>
                      <i className="fa-solid fa-cloud-arrow-up"></i>
                    </div>
                    <p>Select Video from your Local Machine</p>
                  </label>
                  <input
                    type="file"
                    name="video"
                    id="video"
                    onChange={VideoFileHandler}
                  />
                </>
              ) : (
                <video
                  src={videoPreview}
                  autoPlay
                  loop
                  className="video_preview"
                />
              )}
            </div>

            <div id="thumbnail_upload">
              {!thumbnailPreview ? (
                <>
                  <label htmlFor="thumbnail">
                    <div>
                      <i className="fa-solid fa-cloud-arrow-up"></i>
                    </div>
                    <p>Select Thumbnail from your Local Machine</p>
                  </label>
                  <input
                    type="file"
                    name="thumbnail"
                    id="thumbnail"
                    onChange={ThumbnailFileHandler}
                  />
                </>
              ) : (
                <img
                  src={thumbnailPreview}
                  alt=""
                  className="thumbnail_preview"
                />
              )}
            </div>
          </div>

          <input
            type="text"
            id="title_upload"
            placeholder="Enter Your Video Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <textarea
            name="description"
            id="description_upload"
            placeholder="Enter Discription for your Video"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          ></textarea>

          <div id="privacy_select_container">
            <div id="privacy_select_heading">
              Select privacy for your video{" "}
            </div>
            <input
              type="radio"
              name="privacy"
              id="public"
              value="public"
              onChange={PrivacyHandler}
              defaultChecked
            />
            <label htmlFor="public">Public</label>
            <input
              type="radio"
              name="privacy"
              id="private"
              value="private"
              onChange={PrivacyHandler}
            />
            <label htmlFor="private">Private</label>
            <input
              type="radio"
              name="privacy"
              id="unlisted"
              value="unlisted"
              onChange={PrivacyHandler}
            />
            <label htmlFor="unlisted">Unlisted</label>
          </div>

          <div id="adult_select_container">
            <div id="adult_select_heading">
              Do your Video contains any Adult or Nudity related Content
            </div>
            <input
              type="radio"
              name="adult"
              id="yes_adult"
              value={true}
              onChange={isAdultHandler}
              defaultChecked
            />
            <label htmlFor="yes_adult">Yes</label>
            <input
              type="radio"
              name="adult"
              id="no_adult"
              value={false}
              onChange={isAdultHandler}
            />
            <label htmlFor="no_adult">No</label>
          </div>

          <div id="sensitive_select_container">
            <div id="sensitive_select_heading">
              Do your Video contains any Sensitive Content
            </div>
            <input
              type="radio"
              name="sens"
              id="yes_sens"
              value={true}
              onChange={isSensitiveHandler}
              defaultChecked
            />
            <label htmlFor="yes_sens">Yes</label>
            <input
              type="radio"
              name="sens"
              id="no_sens"
              onChange={isSensitiveHandler}
              value={false}
            />
            <label htmlFor="no_sens">No</label>
          </div>

          <div id="some_more_option">
            <div id="schedule_upload_container">
              <div id="schedule_upload_heading">Schedule</div>
              <div id="schedule_upload_subheading">
                Select a date to make your video public. Video will be private
                before publishing
              </div>
              <div id="schedule_form">
                <input type="date" name="" id="date" />
                <input type="time" name="" id="time" />
              </div>
            </div>

            <div id="other_option">
              <div id="subtitle_upload">
                <input type="file" name="" id="subtitle" />
                <label htmlFor="subtitle" id="subtitle_label">
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                  <p>Upload Subtitle</p>
                </label>
              </div>
            </div>
          </div>

          <div id="permission_select_container">
            <input
              type="checkbox"
              name="permission"
              id="permission"
              checked={isPermissionGiven}
              onChange={PermissionHandler}
            />
            <label htmlFor="permission">
              I Accept all the platform guidelines. I will not perform anything
              that is against platform regulation.
            </label>
          </div>

          <button id="upload_button" onClick={() => {page==="Playlist"?UploadVideoToPlaylist(id):DataHandler()}}>
            Upload
          </button>
        </div>
      )}
    </div>
  );
}

export default UploadVideo;
