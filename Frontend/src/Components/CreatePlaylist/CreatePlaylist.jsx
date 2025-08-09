import React, { useContext, useState } from "react";
import StateContext from "../../Context/StateContext";
import axios from 'axios';
import { privacy } from '../../Utils/data.js';
import './CreatePlaylist.css';

function CreatePlaylist({id, page}) {

    
    const [playlistName, setplaylistName] = useState('');
    const [playlistPrivacy, setplaylistPrivacy] = useState("private");

    const {setisCreatePlaylistVisible, setplaylist, setisNewPlaylistVisible} = useContext(StateContext);


    // Create Playlist
    const CreateAPlaylist = async() => {
        const BASE_URL = "https://youtube-clone-6wbs.onrender.com/api";
        try {
        const response = await axios.post(`${BASE_URL}/v1/playlist`, {
            name: playlistName,
            privacy: playlistPrivacy
            },
            {withCredentials: true}
        );
       
        setplaylistName("");
        setisCreatePlaylistVisible(false)
        setplaylist(prev => [ response.data.playlist, ...prev ])
        } catch (error) {
        console.log(error);
        }
    }

    const AddVideoToNewPlaylist = async() => {

        const BASE_URL = "https://youtube-clone-6wbs.onrender.com/api";
        try {
        const response = await axios.post(`${BASE_URL}/v1/playlist/addVideo/${id}`, {
            name: playlistName,
            privacy: playlistPrivacy
            },
            {withCredentials: true}
        );
       
        setplaylistName("");
        setisCreatePlaylistVisible(false);
        setisNewPlaylistVisible(false);
        setplaylist(prev => [ response.data.playlist, ...prev ])
        } catch (error) {
        console.log(error);
        }
    }

  return (
    <>
      <div id="create_a_playlist_container">
        <div id="create_a_playlist_container_heading">New Playlist</div>
            <input type="text" id="create_a_playlist_name" placeholder="Playlist Name" value={playlistName} onChange={(e) => {setplaylistName(e.target.value)}}/>
                <div className="name_container_element_playlist">
                    <div id="name_container_icon_playlist">
                        <i class="fa-solid fa-pencil"></i>
                    </div>
                    <label htmlFor="firstname">Privacy</label>
                    <select
                        id="country"
                        value={playlistPrivacy}
                        onChange={(e) => {
                            setplaylistPrivacy(e.target.value);
                        }}
                    >
                    {privacy.map((val, key) => (
                        <>
                            <option value={val}>{val}</option>
                        </>
                    ))}
                </select>
            </div>
        <div id="name_container_element_collabration"></div>
        <div id="create_a_playlist_container_button">
            <div className="create_a_playlist_container_button" onClick={() => {setisCreatePlaylistVisible(false); setisNewPlaylistVisible(false)}}>Cancel</div>
            <div className="create_a_playlist_container_button" onClick={() => {page==="videoScreen"?AddVideoToNewPlaylist():CreateAPlaylist()}}>Create</div>
        </div>
    </div>
    </>
  )
}


export default CreatePlaylist
