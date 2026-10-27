import React, { useContext, useEffect, useState } from "react";
import "./UserProfile.css";
import StateContext from "../../Context/StateContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../Utils/api.js";
import CreatePlaylist from "../CreatePlaylist/CreatePlaylist.jsx";

function ProfileSection({ title, actionLabel, onAction, children }) {
  return (
    <section className="user_profile_section">
      <div className="user_profile_section_heading">
        <h2 className="user_profile_section_heading_name">{title}</h2>
        {onAction && (
          <button
            type="button"
            className="user_profile_section_action"
            onClick={onAction}
          >
            {actionLabel}
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function ProfileVideoCard({ video, onClick, meta }) {
  return (
    <button
      type="button"
      className="user_profile_video"
      onClick={onClick}
      aria-label={`Open ${video?.title || "video"}`}
    >
      <div className="user_profile_thumbnail">
        <img src={video?.thumbnailUrl} alt="" loading="lazy" />
      </div>
      <div className="user_profile_video_details">
        <div className="user_profile_channel_logo_container">
          {video?.channel?.channelLogo && (
            <img src={video.channel.channelLogo} alt="" loading="lazy" />
          )}
        </div>
        <div className="user_profile_video_info">
          <div className="user_profile_video_title">{video?.title}</div>
          <div className="user_profile_channel_name">
            {video?.channel?.name}
          </div>
          <div className="user_profile_additional_info">{meta}</div>
        </div>
      </div>
    </button>
  );
}

function PlaylistCard({ playlist, onClick }) {
  const firstVideo = playlist?.videos?.[0];

  return (
    <button
      type="button"
      className="user_profile_video user_profile_playlist_card"
      onClick={onClick}
      aria-label={`Open playlist ${playlist?.name || ""}`}
    >
      <div className="user_profile_thumbnail_playlist">
        <img src={firstVideo?.thumbnailUrl || "/image.png"} alt="" loading="lazy" />
        <span>{playlist?.videos?.length || 0} videos</span>
      </div>
      <div className="user_profile_video_details">
        <div className="user_profile_video_info">
          <div className="user_profile_video_title">{playlist?.name}</div>
          <div className="user_profile_channel_name">
            {playlist?.privacy || "Private"}
          </div>
          <div className="user_profile_additional_info">View full playlist</div>
        </div>
      </div>
    </button>
  );
}

function EmptySection({ children }) {
  return <p className="user_profile_empty_section">{children}</p>;
}

function UserProfile() {
  const navigate = useNavigate();
  const {
    sidebar,
    currentLoggedUser,
    currentUserLoading,
    isCreatePlaylistVisible,
    setisCreatePlaylistVisible,
    playlist,
    setplaylist,
  } = useContext(StateContext);

  const [history, sethistory] = useState([]);
  const [likedVideos, setlikedVideos] = useState([]);
  const [savedVideos, setsavedVideos] = useState([]);
  const [profileStatus, setprofileStatus] = useState("loading");
  const [retryProfileLoad, setretryProfileLoad] = useState(0);

  useEffect(() => {
    let isActive = true;

    const getUserProfile = async () => {
      if (currentUserLoading) {
        setprofileStatus("loading");
        return;
      }

      if (!currentLoggedUser) {
        setprofileStatus("unauthenticated");
        return;
      }

      setprofileStatus("loading");

      try {
        const response = await axios.get(
          `${API_BASE_URL}/v1/user/userprofile`,
          { withCredentials: true },
        );
        const user = response.data.user;

        if (isActive) {
          setlikedVideos(user?.likedVideos || []);
          sethistory(user?.watchHistory || []);
          setsavedVideos(user?.savedVideos || []);
          setplaylist(user?.playlists || []);
          setprofileStatus("success");
        }
      } catch {
        if (isActive) {
          setprofileStatus("error");
        }
      }
    };

    getUserProfile();

    return () => {
      isActive = false;
    };
  }, [currentLoggedUser, currentUserLoading, retryProfileLoad, setplaylist]);

  const openVideo = (videoId) => {
    if (videoId) {
      navigate(`/video/${videoId}`);
    }
  };

  if (currentUserLoading || profileStatus === "loading") {
    return (
      <main
        id="content_container_profile"
        className="user_profile_content"
        style={{ width: sidebar ? "87.7%" : "96.6%" }}
      >
        <p className="user_profile_feedback" role="status">
          Loading your profile...
        </p>
      </main>
    );
  }

  if (!currentLoggedUser) {
    return (
      <main
        id="content_container_profile"
        className="user_profile_content"
        style={{ width: sidebar ? "87.7%" : "96.6%" }}
      >
        <div className="user_profile_feedback">
          <h1>Your profile</h1>
          <p>Sign in to see your history, playlists, and saved videos.</p>
          <button type="button" onClick={() => navigate("/login")}>
            Sign in
          </button>
        </div>
      </main>
    );
  }

  if (profileStatus === "error") {
    return (
      <main
        id="content_container_profile"
        className="user_profile_content"
        style={{ width: sidebar ? "87.7%" : "96.6%" }}
      >
        <div className="user_profile_feedback" role="alert">
          <h1>Your profile</h1>
          <p>Your profile data couldn&apos;t be loaded. Please try again.</p>
          <button
            type="button"
            onClick={() => setretryProfileLoad((value) => value + 1)}
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      id="content_container_profile"
      className="user_profile_content"
      style={{ width: sidebar ? "87.7%" : "96.6%" }}
    >
      {isCreatePlaylistVisible && (
        <div
          className="user_profile_modal_backdrop"
          onClick={() => setisCreatePlaylistVisible(false)}
        >
          <div onClick={(event) => event.stopPropagation()}>
            <CreatePlaylist />
          </div>
        </div>
      )}
      <header className="user_profile_header">
        <div className="user_profile_avatar">
          {currentLoggedUser.profileImage ? (
            <img src={currentLoggedUser.profileImage} alt="" />
          ) : (
            <span>
              {currentLoggedUser.firstname?.[0]?.toUpperCase() || "U"}
            </span>
          )}
        </div>
        <div className="user_profile_identity">
          <h1>
            {currentLoggedUser.firstname} {currentLoggedUser.lastname}
          </h1>
          <p>
            {currentLoggedUser.channel?.channelHandle ||
              currentLoggedUser.email}
          </p>
          <div className="user_profile_header_actions">
            <button
              type="button"
              onClick={() => setisCreatePlaylistVisible(true)}
            >
              Create playlist
            </button>
            {currentLoggedUser.channel?._id && (
              <button
                type="button"
                onClick={() =>
                  navigate(`/channel/${currentLoggedUser.channel._id}`)
                }
              >
                View your channel
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="user_profile_sections">
        <ProfileSection
          title="History"
          actionLabel="View all"
          onAction={() => navigate("/history")}
        >
          <div className="user_profile_section_content">
            {history.length ? (
              history
                .filter((entry) => entry?.video)
                .slice(0, 6)
                .map((entry) => (
                  <ProfileVideoCard
                    key={entry.video._id}
                    video={entry.video}
                    onClick={() => openVideo(entry.video._id)}
                    meta={`Watched ${
                      entry.watchedAt
                        ? new Date(entry.watchedAt).toLocaleDateString()
                        : ""
                    }`}
                  />
                ))
            ) : (
              <EmptySection>Your watch history will appear here.</EmptySection>
            )}
          </div>
        </ProfileSection>

        <ProfileSection
          title="Playlists"
          actionLabel="View all"
          onAction={() => navigate("/playlists")}
        >
          <div className="user_profile_section_content">
            {playlist?.length ? (
              playlist.slice(0, 6).map((item) => (
                <PlaylistCard
                  key={item._id}
                  playlist={item}
                  onClick={() => navigate(`/playlist/${item._id}`)}
                />
              ))
            ) : (
              <EmptySection>Create a playlist to find it here.</EmptySection>
            )}
          </div>
        </ProfileSection>

        <ProfileSection
          title="Watch Later"
          actionLabel="View all"
          onAction={() => navigate("/watchLater")}
        >
          <div className="user_profile_section_content">
            {savedVideos.length ? (
              savedVideos.slice(0, 6).map((video) => (
                <ProfileVideoCard
                  key={video._id}
                  video={video}
                  onClick={() => openVideo(video._id)}
                  meta={`${(video.views || 0).toLocaleString()} views`}
                />
              ))
            ) : (
              <EmptySection>Videos you save for later will appear here.</EmptySection>
            )}
          </div>
        </ProfileSection>

        <ProfileSection
          title="Liked videos"
          actionLabel="View all"
          onAction={() => navigate("/likedVideos")}
        >
          <div className="user_profile_section_content">
            {likedVideos.length ? (
              likedVideos.slice(0, 6).map((video) => (
                <ProfileVideoCard
                  key={video._id}
                  video={video}
                  onClick={() => openVideo(video._id)}
                  meta={`${(video.views || 0).toLocaleString()} views`}
                />
              ))
            ) : (
              <EmptySection>Videos you like will appear here.</EmptySection>
            )}
          </div>
        </ProfileSection>
      </div>
    </main>
  );
}

export default UserProfile;
