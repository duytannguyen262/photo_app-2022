import React from "react";
import { useSelector } from "react-redux";
import SharedToMeAlbumList from "./components/SharedToMeAlbumList";
import SharedToMePhotoList from "./components/SharedToMePhotoList";

const HomePage = () => {
  const user = useSelector((state) => state.auth.user);
  return (
    <div className="wrapper">
      {user && (
        <>
          <SharedToMeAlbumList />
          <SharedToMePhotoList />
        </>
      )}
    </div>
  );
};

export default HomePage;
