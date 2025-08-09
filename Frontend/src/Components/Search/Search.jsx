import React, { useContext, useRef, useState, useEffect } from "react";
import "./Search.css";
import StateContext from "../../Context/StateContext";

function Search() {
  const { sidebar } = useContext(StateContext);
  const containerRef = useRef(null);
  const subContainerRef = useRef(null);

  const [suggetionBarPosition, setsuggetionBarPosition] = useState(0);
  const [maxLeftScroll, setmaxLeftScroll] = useState(0);

  useEffect(() => {
    const Container = containerRef.current;
    const SubContainer = subContainerRef.current;

    const overflowLength = SubContainer.scrollWidth - Container.clientWidth;
    const overflowPercentage =
      -(overflowLength / SubContainer.scrollWidth) * 100;

    setmaxLeftScroll(overflowPercentage);
  }, []);

  return (
    <>
      <div
        id="content_container_search"
        style={{ width: sidebar ? "87.7%" : "96.6%" }}
      >
        <div id="search_container">
          <div id="search_container_header">
            <div id="suggestion_container_search" ref={containerRef}>
              {suggetionBarPosition < 0 && (
                <div id="suggestion_left_shadow_search"></div>
              )}
              {suggetionBarPosition > maxLeftScroll && (
                <div id="suggestion_right_shadow_search"></div>
              )}
              {suggetionBarPosition < 0 && (
                <div
                  id="suggestion_left_arrow_search"
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
                  id="suggestion_right_arrow_search"
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
            <div id="filter_search_container">
              <div id="filter_search">Filters</div>
              <i class="fa-solid fa-filter"></i>
            </div>
          </div>
          <div id="search_video_collection">
            {["a", "b", "c", "d", "e", "f"].map((val, key) => (
              <div id="search_video_container">
                <div id="search_video_thumbnail"></div>
                <div id="search_video_info">
                  <div className="search_video_button">
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                  </div>
                  <div id="history_video_name">
                    Mindset is Everything 😎 #motivationMindset is Everything 😎
                    #motivation #mindset #motivationalquotes #inspiration
                  </div>
                  <div id="search_video_extra_info">
                    489M views ~ 3 years ago
                  </div>
                  <div id="search_video_channel_info">
                    <div id="search_video_channel_logo"></div>
                    <div id="search_video_channel_name">Channel Name</div>
                  </div>
                  <div id="history_video_discription">
                    Videos by zjhao8 TT Copyright notice: We strive to respect
                    the intellectual property rights of others and expect our
                    content to be used with the same consideration. If you own
                    the rights...
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Search;
