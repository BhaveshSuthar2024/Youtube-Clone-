import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { useContext } from "react";
import StateContext from "../../Context/StateContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {
  const { setSidebar, setuploadContainerVisible, info, currentLoggedUser } =
    useContext(StateContext);
  const navigate = useNavigate();
  const accountLogoRef = useRef(null);
  const accountContainerRef = useRef(null);

  const [settingsContainerVisible, setsettingsContainerVisible] =
    useState(false);

  const LogOutHandler = async () => {
    const BASE_URL = "https://youtube-clone-6wbs.onrender.com/api";
    try {
      await axios.post(
        `${BASE_URL}/v1/auth/logout`,
        {},
        { withCredentials: true },
      );
     
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSettingContainer = (e) => {

    if (
      accountContainerRef.current &&
      !accountContainerRef.current.contains(e.target) &&
      !accountLogoRef.current.contains(e.target)
    ) {
      setsettingsContainerVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleSettingContainer);

    return () => {
      document.removeEventListener("mousedown", handleSettingContainer);
    };
  }, []);

  return (
    <>
      <div id="navbar">
        <div id="left">
          <div
            id="threebars"
            onClick={() => {
              setSidebar((prev) => !prev);
            }}
          >
            <ul>
              <li className="bars"></li>
              <li className="bars"></li>
              <li className="bars"></li>
            </ul>
          </div>
          <div
            id="logo"
            onClick={() => {
              navigate("/");
            }}
          >
            <div id="country_code">IN</div>
          </div>
        </div>

        <div id="middle">
          <div id="search_section">
            <div id="search">
              <div id="search_icon"></div>
              <input type="text" placeholder="Search" />
            </div>
            <div id="search_button">
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
          </div>
          <div id="microphone">
            <i className="fa-solid fa-microphone"></i>
          </div>
        </div>

        <div id="right">
          {currentLoggedUser ? (
            <>
              <div
                id="create"
                onClick={() => {
                  setuploadContainerVisible(true);
                }}
              >
                <div id="create_icon">
                  <i className="fa-solid fa-plus"></i>
                </div>
                <div id="create_text">Create</div>
              </div>
              <div id="notification">
                <i className="fa-regular fa-bell"></i>
              </div>
              <div id="login_button_navbar"></div>
              <div
                id="account"
                ref={accountLogoRef}
                onClick={() => {
                  setsettingsContainerVisible((prev) => !prev);
                }}
              >
                {currentLoggedUser.profileImage ? (
                  <img src={currentLoggedUser.profileImage} alt="" />
                ) : (
                  <p>{currentLoggedUser.firstname[0].toUpperCase()}</p>
                )}
                {settingsContainerVisible && (
                  <div
                    id="youtube_settings_container"
                    ref={accountContainerRef}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <div id="youtube_settings_account">
                      <div id="account_logo_cont">
                        <div id="account_logo">
                          {currentLoggedUser.profileImage ? (
                            <img src={currentLoggedUser.profileImage} alt="" />
                          ) : (
                            <p>
                              {currentLoggedUser.firstname[0].toUpperCase()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div id="account_info">
                        <div id="account_name">
                          {currentLoggedUser?.firstname}{" "}
                          {currentLoggedUser?.lastname}
                        </div>
                        <div id="account_handle">
                          {currentLoggedUser?.channel?.channelHandle}
                        </div>
                        <div
                          id="account_more_info"
                          onClick={() => {
                            navigate(
                              `/channel/${currentLoggedUser?.channel?._id}`,
                            );
                          }}
                        >
                          View your channel
                        </div>
                      </div>
                    </div>
                    <div id="youtube_account_settings">
                      <div className="youtube_account_settings_option">
                        <i class="fa-brands fa-google"></i>
                        <div className="youtube_account_settings_option_name">
                          Google Account
                        </div>
                      </div>
                      <div className="youtube_account_settings_option">
                        <i class="fa-solid fa-users-viewfinder"></i>
                        <div className="youtube_account_settings_option_name">
                          Switch Account
                        </div>
                        <i class="fa-solid fa-angle-right" id="more"></i>
                      </div>
                      <div
                        className="youtube_account_settings_option"
                        onClick={() => {
                          LogOutHandler();
                        }}
                      >
                        <i class="fa-solid fa-right-from-bracket"></i>
                        <div className="youtube_account_settings_option_name">
                          Sign Out
                        </div>
                      </div>
                    </div>
                    <div id="youtube_premium_settings">
                      <div className="youtube_premium_settings_option">
                        <i class="fa-brands fa-youtube"></i>
                        <div className="youtube_premium_settings_option_name">
                          Youtube Studio
                        </div>
                      </div>
                      <div className="youtube_premium_settings_option">
                        <i class="fa-solid fa-dollar-sign"></i>
                        <div className="youtube_premium_settings_option_name">
                          Purchases and memberships
                        </div>
                      </div>
                    </div>
                    <div id="youtube_general_settings">
                      <div className="youtube_general_settings_option">
                        <i class="fa-solid fa-user-secret"></i>
                        <div className="youtube_general_settings_option_name">
                          Your data in Youtube
                        </div>
                      </div>
                      <div className="youtube_general_settings_option">
                        <i class="fa-solid fa-moon"></i>
                        <div className="youtube_general_settings_option_name">
                          Appearance: Device Theme
                        </div>
                        <i class="fa-solid fa-angle-right" id="more"></i>
                      </div>
                      <div className="youtube_general_settings_option">
                        <i class="fa-solid fa-a"></i>
                        <div className="youtube_general_settings_option_name">
                          Language: English
                        </div>
                      </div>
                      <div className="youtube_general_settings_option">
                        <i class="fa-solid fa-ban"></i>
                        <div className="youtube_general_settings_option_name">
                          Restricted mode: Off
                        </div>
                        <i class="fa-solid fa-angle-right" id="more"></i>
                      </div>
                      <div className="youtube_general_settings_option">
                        <i class="fa-solid fa-location-dot"></i>
                        <div className="youtube_general_settings_option_name">
                          Location: India
                        </div>
                        <i class="fa-solid fa-angle-right" id="more"></i>
                      </div>
                      <div className="youtube_general_settings_option">
                        <i class="fa-solid fa-keyboard"></i>
                        <div className="youtube_general_settings_option_name">
                          Keyboard Shortcuts
                        </div>
                      </div>
                    </div>
                    <div id="youtube_settings">
                      <div className="youtube_settings_option">
                        <i class="fa-solid fa-gear"></i>
                        <div className="youtube_settings_option_name">
                          Settings
                        </div>
                      </div>
                    </div>
                    <div id="youtube_extra_settings">
                      <div className="youtube_extra_settings_option">
                        <i class="fa-solid fa-question"></i>
                        <div className="youtube_extra_settings_option_name">
                          Help
                        </div>
                      </div>
                      <div className="youtube_extra_settings_option">
                        <i class="fa-solid fa-comment"></i>
                        <div className="youtube_extra_settings_option_name">
                          Send Feedback
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div
              id="authenticate_container"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/login");
              }}
            >
              Get Started
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
