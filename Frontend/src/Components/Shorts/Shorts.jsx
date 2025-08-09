import React, { useContext, useState } from "react";
import "./Shorts.css";
import StateContext from "../../Context/StateContext";

function Shorts() {
  const { sidebar } = useContext(StateContext);
  const [isFocus, setisFocus] = useState(false);
  const [isSideScreenVisible, setisSideScreenVisible] = useState(false);

  return (
    <>
      <div
        id="content_container_shorts"
        style={{ width: sidebar ? "87.7%" : "96.6%" }}
      >
        <div
          id="shorts_container"
          style={{
            transform: isSideScreenVisible
              ? "translateX(-54%)"
              : "translateX(0%)",
          }}
        >
          <div id="shorts_screen">
            <div id="shorts_screen_controls">
              <div className="shorts_screen_control">
                <i class="fa-solid fa-play"></i>
              </div>
              <div className="shorts_screen_control">
                <i class="fa-solid fa-volume-high"></i>
              </div>
              <div className="shorts_screen_control short_fullscreen_button">
                <i class="fa-solid fa-expand"></i>
              </div>
            </div>
            <div id="shorts_screen_info">
              <div id="shorts_screen_channel_info">
                <div id="shorts_screen_channel_logo"></div>
                <div id="shorts_screen_channel_name">Channel Name</div>
                <div id="shorts_screen_channel_sub_button">Subscribe</div>
              </div>
              <div id="shorts_screen_title">
                When every rep brought you closer to your gold medal. 🥇
                #Olympics #Tokyo2020 #Sports #JavelinThrow
              </div>
            </div>
          </div>
          <div id="shorts_side_container">
            <div className="shorts_side_container_options">
              <div className="shorts_side_container_options_icon">
                <i class="fa-regular fa-thumbs-up"></i>
              </div>
              <div className="shorts_side_container_options_count">2345</div>
            </div>
            <div className="shorts_side_container_options">
              <div className="shorts_side_container_options_icon">
                <i class="fa-regular fa-thumbs-down"></i>
              </div>
              <div className="shorts_side_container_options_count">Dislike</div>
            </div>
            <div className="shorts_side_container_options">
              <div
                className="shorts_side_container_options_icon"
                onClick={() => {
                  setisSideScreenVisible((prev) => !prev);
                }}
                style={{
                  backgroundColor: isSideScreenVisible
                    ? "white"
                    : "rgba(255, 255, 255, 0.1)",
                }}
              >
                <i
                  class="fa-regular fa-comment"
                  style={{ color: isSideScreenVisible ? "black" : "white" }}
                ></i>
              </div>
              <div className="shorts_side_container_options_count">765</div>
            </div>
            <div className="shorts_side_container_options">
              <div className="shorts_side_container_options_icon">
                <i class="fa-regular fa-share-from-square"></i>
              </div>
              <div className="shorts_side_container_options_count">Share</div>
            </div>
            <div className="shorts_side_options">
              <i class="fa-solid fa-ellipsis-vertical"></i>
            </div>
            <div className="shorts_side_options"></div>
          </div>
        </div>

        <div
          id="shorts_sliding_container"
          style={{ right: isSideScreenVisible ? "5.4%" : "-26%" }}
        >
          <div id="shorts_sliding_container_header">
            <div id="shorts_sliding_container_heading">Comments</div>
            <div id="shorts_comments_count">1.1K</div>
            <div className="shorts_sliding_container_header_icon shorts_comment_sort">
              <i class="fa-solid fa-arrow-up-wide-short"></i>
            </div>
            <div
              className="shorts_sliding_container_header_icon"
              onClick={() => {
                setisSideScreenVisible(false);
              }}
            >
              <i class="fa-solid fa-xmark"></i>
            </div>
          </div>
          <div id="shorts_sliding_container_main">
            <div id="comments_collection_container">
              {["H", "E", "L", "L", "O", " ", "W", "O", "R", "L", "D"].map(
                (val, key) => (
                  <>
                    <div id="comment_container_shorts">
                      <div id="comment_box_shorts">
                        <div id="channel_logo_at_comment_shorts">
                          <img src="" alt="" />
                        </div>
                        <div id="comment_info_container_shorts">
                          <div id="comment_info_shorts">
                            <div id="comment_channel_name">Bhavesh Suthar</div>
                            <div id="comment_time">2 years ago</div>
                          </div>
                          <div id="users_comment_shorts">
                            A paragraph is defined as “a group of sentences or a
                            single sentence that forms a unit” Lunsford and
                            Connors
                          </div>
                          <div id="comment_like_dislike_container_shorts">
                            <div id="comment_like_container_shorts">
                              <div id="comment_like_icon_container">
                                <i class="fa-regular fa-thumbs-up"></i>
                              </div>
                              <div id="comment_like_count">123</div>
                            </div>
                            <div id="comment_dislike_container_shorts">
                              <div id="comment_dislike_icon_container">
                                <i class="fa-regular fa-thumbs-down"></i>
                              </div>
                              <div id="comment_dislike_count">31</div>
                            </div>
                            <div id="comment_reply_option">Reply</div>
                          </div>
                        </div>
                        <div id="comments_three_dots">
                          <i class="fa-solid fa-ellipsis-vertical"></i>
                        </div>
                      </div>
                      <div id="reply_container">
                        <div id="reply_button_shorts">
                          <div id="reply_button_icon">
                            <i class="fa-solid fa-angle-down"></i>
                          </div>
                          <div id="reply_button_text">81 replies</div>
                        </div>
                      </div>
                    </div>
                  </>
                ),
              )}
            </div>
          </div>
          <div id="shorts_sliding_container_footer">
            <div id="shorts_create_a_comment">
              <div id="user_img_container">
                <img src="" alt="" />
              </div>
              <div id="shorts_comment_input_container">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  onFocus={() => {
                    setisFocus(true);
                  }}
                  onBlur={() => {
                    setisFocus(false);
                  }}
                />
                {isFocus && (
                  <div id="input_extra_options">
                    <div id="emoji_button">
                      <i class="fa-regular fa-face-smile"></i>
                    </div>
                    <div id="input_container_button">
                      <div id="cancel">Cancel</div>
                      <div id="comment">Comment</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Shorts;
