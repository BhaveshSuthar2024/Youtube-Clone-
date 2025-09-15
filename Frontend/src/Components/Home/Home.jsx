import React, { useContext } from "react";
import "./Home.css";
import Navbar from "../Navbar/Navbar";
import { Sidebar, SidebarSmall } from "../Sidebar/Sidebar";
import StateContext from "../../Context/StateContext";
import UploadVideo from "../UploadVideo/UploadVideo.jsx";
import { Outlet } from "react-router-dom";

function Home() {
  const { sidebar } = useContext(StateContext);

  return (
    <>
      <div id="home_container">
        <Navbar />
        <div id="container">
          {sidebar ? <Sidebar /> : <SidebarSmall />}
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Home;
