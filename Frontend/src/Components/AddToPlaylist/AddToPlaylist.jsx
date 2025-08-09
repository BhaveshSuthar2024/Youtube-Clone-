import React, {useContext, useState, useEffect} from 'react';
import './AddToPlaylist.css';
import StateContext from '../../Context/StateContext'
import axios from 'axios'
import { saveVideo } from '../../Utils/SaveVideoHandler.js'

function AddToPlaylist({id}) {

  const { setisAddToPlaylistVisible, setisVideoSaved, setisNewPlaylistVisible } = useContext(StateContext);

  const [playlists, setplaylists] = useState([]);
  const [selectedPlaylist, setselectedPlaylist] = useState('');

  const LoadPlaylist = async() => {

    const BASE_URL = "http://localhost:3000/api";
    try {
      const response = await axios.get(`${BASE_URL}/v1/playlist`, {withCredentials: true});
      console.log(response);
      setplaylists(response.data.playlists)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {LoadPlaylist()}, []);


  const addVideoToPlaylist = async(playlistId) => {

    const BASE_URL = "http://localhost:3000/api";
    try {
      const response = await axios.post(`${BASE_URL}/v1/playlist/${playlistId}/${id}`, {}, {withCredentials: true});
      console.log(response);
      setisAddToPlaylistVisible(false);
    } catch (error) {
      console.log(error);
    }

  }
  

  return (
    <div id="popup_playlist_option_container">
      <div id="playlist_popup_cross_button" onClick={() => {setisAddToPlaylistVisible(false)}}>
          <i class="fa-solid fa-xmark"></i>
      </div>
      <div id="popup_playlist_option_container_heading">Save video to...</div>
      <div id="popup_playlist_options">
        
        <div id='placeToSave__options' style={{backgroundColor:"#151515"}} onClick={() => {saveVideo(id).then((res) => {setisVideoSaved(res.data.isVideoSaved); setisAddToPlaylistVisible(false)}).catch((err) => console.error("Error saving video:", err)); setisAddToPlaylistVisible(true); setselectedPlaylist("watchlater")}}>
        {selectedPlaylist === "watchlater"?<i class="fa-solid fa-square" style={{fontSize: "18px", color: "#3ea6ff"}}></i>:<i class="fa-regular fa-square" style={{fontSize: "18px"}}></i>}
        <div>Watch later</div>
          <i class="fa-solid fa-lock"></i>
        </div>

        {playlists?.map((val, key) => <div id='placeToSave__options' onClick={() => {setselectedPlaylist(val._id); setTimeout(() => {addVideoToPlaylist(val._id)}, [500])}}>
          {val._id === selectedPlaylist?<i class="fa-solid fa-square" style={{fontSize: "18px", color: "#3ea6ff"}}></i>:<i class="fa-regular fa-square" style={{fontSize: "18px"}}></i>}
          <div>{val.name}</div>
          <i class="fa-solid fa-lock"></i>
        </div>)}
        </div>
        <div id="popup_create_new_playlist_button" onClick={() => {setisNewPlaylistVisible(true); setisAddToPlaylistVisible(false)}}>
          <i class="fa-solid fa-plus"></i>
          <p>New Playlist</p>
        </div>
      
    </div>
  )
}

export default AddToPlaylist