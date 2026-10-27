import StateContext from "./StateContext.js";
import { useState } from "react";

const StateContextProvider = ({ children }) => {
  const [sidebar, setSidebar] = useState(false);
  const [uploadContainerVisible, setuploadContainerVisible] = useState(false);
  const [data, setdata] = useState();
  const [currentLoggedUser, setcurrentLoggedUser] = useState();
  const [currentUserLoading, setcurrentUserLoading] = useState(true);
  const [refetchUser, setrefetchUser] = useState(false);
  const [isAddToPlaylistVisible, setisAddToPlaylistVisible] = useState(false);
  const [isVideoSaved, setisVideoSaved] = useState(false);
  const [playlistData, setplaylistData] = useState([]);
  const [isCreatePlaylistVisible, setisCreatePlaylistVisible] = useState(false);
  const [playlist, setplaylist] = useState([]);
  const [isNewPlaylistVisible, setisNewPlaylistVisible] = useState(false)
  
  

  

  return (
    <StateContext.Provider
      value={{
        setSidebar,
        sidebar,
        uploadContainerVisible,
        setuploadContainerVisible,
        data,
        setdata,
        currentLoggedUser,
        setcurrentLoggedUser,
        currentUserLoading,
        setcurrentUserLoading,
        refetchUser,
        setrefetchUser,
        isAddToPlaylistVisible,
        setisAddToPlaylistVisible,
        isVideoSaved,
        setisVideoSaved,
        playlistData,
        setplaylistData,
        isCreatePlaylistVisible, 
        setisCreatePlaylistVisible,
        playlist,
        setplaylist,
        isNewPlaylistVisible, 
        setisNewPlaylistVisible
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export default StateContextProvider;
