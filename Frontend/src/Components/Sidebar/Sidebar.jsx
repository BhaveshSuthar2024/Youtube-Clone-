import React, { useState } from "react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const [hoverOnSidebar, sethoverOnSidebar] = useState(false);

  return (
    <>
      <div
        id="sidebar_container"
        onMouseEnter={() => {
          sethoverOnSidebar(true);
        }}
        onMouseLeave={() => {
          sethoverOnSidebar(false);
        }}
        style={{
          scrollbarWidth: hoverOnSidebar ? "thin" : "none",
          width: hoverOnSidebar ? "12.3%" : "11.78%",
        }}
      >
        {/* Basic */}
        <div id="basic_sidebar_option_cont">
          <div
            className="basic_sidebar_options home"
            onClick={() => {
              navigate("/");
            }}
          >
            <div className="basic_sidebar_option_icon">
              <i className="fa-solid fa-house"></i>
            </div>
            <div className="basic_sidebar_option_name">Home</div>
          </div>
          <div
            className="basic_sidebar_options"
            onClick={() => {
              navigate("/shorts");
            }}
          >
            <div className="basic_sidebar_option_icon">
              <i className="fa-solid fa-heart"></i>
            </div>
            <div className="basic_sidebar_option_name">Shorts</div>
          </div>
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon">
              <i className="fa-solid fa-photo-film"></i>
            </div>
            <div className="basic_sidebar_option_name">Subscriptions</div>
          </div>
        </div>

        {/* Extra Options */}
        <div id="extra_sidebar_option_cont">
          <div
            className="basic_sidebar_text basic_sidebar_options"
            onClick={() => {
              navigate("/user_profile");
            }}
          >
            You
          </div>
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon">
              <i className="fa-solid fa-clock-rotate-left"></i>
            </div>
            <div className="basic_sidebar_option_name">History</div>
          </div>
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon">
              <i className="fa-solid fa-list-ul"></i>
            </div>
            <div className="basic_sidebar_option_name">Playlist</div>
          </div>
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon">
              <i className="fa-solid fa-video"></i>
            </div>
            <div className="basic_sidebar_option_name">Your Videos</div>
          </div>
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon">
              <i className="fa-solid fa-book"></i>
            </div>
            <div className="basic_sidebar_option_name">Your Courses</div>
          </div>
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon">
              <i className="fa-regular fa-clock"></i>
            </div>
            <div className="basic_sidebar_option_name">Watch Later</div>
          </div>
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon">
              <i className="fa-regular fa-thumbs-up"></i>
            </div>
            <div className="basic_sidebar_option_name">Liked Videos</div>
          </div>
        </div>

        {/* Subscriptions */}
        <div id="subs_sidebar_option_cont">
          <div className="subs_sidebar_text basic_sidebar_options">
            Subscriptions
          </div>
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon sidebar_channel_img">
              <img src="images.jpg" alt="" />
            </div>
            <div className="basic_sidebar_option_name sidebar_channel_text">
              Channel Name
            </div>
          </div>
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon sidebar_channel_img">
              <img src="profile.jpg" alt="" />
            </div>
            <div className="basic_sidebar_option_name sidebar_channel_text">
              Channel Name
            </div>
          </div>
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon sidebar_channel_img">
              <img src="d.webp" alt="" />
            </div>
            <div className="basic_sidebar_option_name sidebar_channel_text">
              Channel Name
            </div>
          </div>
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon sidebar_channel_img">
              <img src="e.webp" alt="" />
            </div>
            <div className="basic_sidebar_option_name sidebar_channel_text">
              Channel Name
            </div>
          </div>
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon sidebar_channel_img">
              <img src="ajpg.jpg" alt="" />
            </div>
            <div className="basic_sidebar_option_name sidebar_channel_text">
              Channel Name
            </div>
          </div>
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon sidebar_channel_img">
              <i className="fa-solid fa-bars-staggered"></i>
            </div>
            <div className="basic_sidebar_option_name sidebar_channel_text">
              All Subscriptions
            </div>
          </div>
        </div>

        {/* Advanced Option */}
        <div id="advanced_sidebar_option_cont">
          <div className="subs_sidebar_text basic_sidebar_options">Explore</div>
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon">
              <i className="fa-solid fa-fire-flame-curved"></i>
            </div>
            <div className="basic_sidebar_option_name">Treanding</div>
          </div>
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon">
              <i className="fa-solid fa-cart-shopping"></i>
            </div>
            <div className="basic_sidebar_option_name">Shopping</div>
          </div>
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon">
              <i className="fa-solid fa-music"></i>
            </div>
            <div className="basic_sidebar_option_name">Music</div>
          </div>
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon">
              <i className="fa-solid fa-ticket"></i>
            </div>
            <div className="basic_sidebar_option_name">Movie</div>
          </div>
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon">
              <i className="fa-solid fa-dna"></i>
            </div>
            <div className="basic_sidebar_option_name">Live</div>
          </div>
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon">
              <i className="fa-solid fa-gamepad"></i>
            </div>
            <div className="basic_sidebar_option_name">Gaming</div>
          </div>
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon">
              <i className="fa-solid fa-newspaper"></i>
            </div>
            <div className="basic_sidebar_option_name">News</div>
          </div>
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon">
              <i className="fa-solid fa-baseball-bat-ball"></i>
            </div>
            <div className="basic_sidebar_option_name">Sports</div>
          </div>
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon">
              <i className="fa-solid fa-book-open-reader"></i>
            </div>
            <div className="basic_sidebar_option_name">Courses</div>
          </div>
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon">
              <i className="fa-solid fa-shirt"></i>
            </div>
            <div className="basic_sidebar_option_name">Fashion & Beauty</div>
          </div>
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon">
              <i className="fa-solid fa-microphone-lines"></i>
            </div>
            <div className="basic_sidebar_option_name">Prodcast</div>
          </div>
        </div>

        {/* More Option */}
        <div id="more_sidebar_option_cont">
          <div className="more_sidebar_text basic_sidebar_options">
            More from YouTube
          </div>
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon">
              <i className="fa-solid fa-clock-rotate-left"></i>
            </div>
            <div className="basic_sidebar_option_name">YouTube Premium</div>
          </div>
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon">
              <i className="fa-solid fa-list-ul"></i>
            </div>
            <div className="basic_sidebar_option_name">YouTube Studio</div>
          </div>
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon">
              <i className="fa-solid fa-video"></i>
            </div>
            <div className="basic_sidebar_option_name">YouTube Music</div>
          </div>
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon">
              <i className="fa-solid fa-book"></i>
            </div>
            <div className="basic_sidebar_option_name">YouTube Kids</div>
          </div>
        </div>

        {/* Other Option */}
        <div id="other_sidebar_option_cont">
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon">
              <i className="fa-solid fa-clock-rotate-left"></i>
            </div>
            <div className="basic_sidebar_option_name">YouTube Premium</div>
          </div>
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon">
              <i className="fa-solid fa-list-ul"></i>
            </div>
            <div className="basic_sidebar_option_name">YouTube Studio</div>
          </div>
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon">
              <i className="fa-solid fa-video"></i>
            </div>
            <div className="basic_sidebar_option_name">YouTube Music</div>
          </div>
          <div className="basic_sidebar_options">
            <div className="basic_sidebar_option_icon">
              <i className="fa-solid fa-book"></i>
            </div>
            <div className="basic_sidebar_option_name">YouTube Kids</div>
          </div>
        </div>

        {/* Last Options */}
        <div id="last_sidebar_option_cont">
          <div id="last_sidebar_option1">
            <span>About</span>
            <span>Press</span>
            <span>Copyright</span>
            <br />
            <span>Contact us</span>
            <span>Creators</span>
            <span>Advertise</span>
            <br />
            <span>Developers</span>
          </div>
          <div id="last_sidebar_option2">
            <span>Terms</span>
            <span>Privacy</span>
            <span>Security</span>
            <br />
            <span>How YouTube Works</span>
            <br />
            <span>Test new features</span>
          </div>

          <div id="copyright_msg">{"\u00A9"} Google LLC</div>
        </div>
      </div>
    </>
  );
}

function SidebarSmall() {
  const navigate = useNavigate();

  return (
    <>
      <div id="sidebarsmall_container">
        <div
          id="smallsidebar_option"
          onClick={() => {
            navigate("/");
          }}
        >
          <div id="smallsidebar_icon">
            <i className="fa-solid fa-house"></i>
          </div>
          <div id="smallsidebar_name">Home</div>
        </div>
        <div
          id="smallsidebar_option"
          onClick={() => {
            navigate("/shorts");
          }}
        >
          <div id="smallsidebar_icon">
            <i className="fa-solid fa-heart"></i>
          </div>
          <div id="smallsidebar_name">Shorts</div>
        </div>
        <div id="smallsidebar_option">
          <div id="smallsidebar_icon">
            <i className="fa-solid fa-thumbs-up"></i>
          </div>
          <div id="smallsidebar_name">Subscription</div>
        </div>
        <div
          id="smallsidebar_option"
          onClick={() => {
            navigate("/user_profile");
          }}
        >
          <div id="smallsidebar_icon">
            <i className="fa-solid fa-circle-user"></i>
          </div>
          <div id="smallsidebar_name">You</div>
        </div>
      </div>
    </>
  );
}

export { Sidebar, SidebarSmall };
