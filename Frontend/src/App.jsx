import { useEffect, useContext } from "react";
import "./App.css";
import Home from "./Components/Home/Home";
import HomeScreenContainer from "./Components/HomeScrContent/HomeScreenContainer";
import Login from "./Components/Login/Login";
import SignUp from "./Components/SignUp/SignUp";
import UserProfile from "./Components/UserProfile/UserProfile";
import VideoScreen from "./Components/VideoScreen/VideoScreen";
import ChannelScreen from "./Components/ChannelScreen/ChannelScreen";
import { Routes, Route } from "react-router-dom";
import VideoListScreen from "./Components/VideoListScreen/VideoListScreen";
import History from "./Components/History/History";
import Search from "./Components/Search/Search";
import Shorts from "./Components/Shorts/Shorts";
import Playlists from './Components/Playlists/Playlists'
import axios from "axios";
import StateContext from "./Context/StateContext";

function App() {
  const { setcurrentLoggedUser, currentLoggedUser, refetchUser } = useContext(StateContext);

  useEffect(() => {
    const fetchCurrentUser = async () => {

      const BASE_URL = "https://youtube-clone-6wbs.onrender.com/api";

      try {
        const response = await axios.get(`${BASE_URL}/v1/auth/currentUser`, { withCredentials: true });
        setcurrentLoggedUser(response.data.loggedUser);
      } catch (error) {
        console.log(error);
      }

    };

    fetchCurrentUser();
  }, [refetchUser]);

  console.log(currentLoggedUser);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path={"/"} element={<HomeScreenContainer />} />
          <Route path={"/user_profile"} element={<UserProfile />} />
          <Route path={"/channel/:id"} element={<ChannelScreen />}>
            <Route path={"/channel/:id/:page"} element={<ChannelScreen />} />
          </Route>
          <Route path={"/:Page"} element={<VideoListScreen />} />
          <Route path={"/playlist/:id"} element={<VideoListScreen />} />
          <Route path={"/history"} element={<History />} />
          <Route path={"/playlists"} element={<Playlists />} />
          <Route path={"/search"} element={<Search />} />
          <Route path={"/shorts"} element={<Shorts />} />
        </Route>
        <Route path={`/video/:id`} element={<VideoScreen />} />
        <Route path={"login"} element={<Login />} />
        <Route path={"/signup"} element={<SignUp />} />
      </Routes>
    </>
  );
}

export default App;
