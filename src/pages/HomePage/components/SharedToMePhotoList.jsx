import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ImageList, ImageListItem } from "@mui/material";

import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";
import "./SharedToMeAlbumList.scss";

const SharedToMePhotoList = () => {
  const user = useSelector((state) => state.auth.user);
  const axiosPrivate = useAxiosPrivate();
  const [photos, setPhotos] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getAlbums = async () => {
      if (user) {
        const res = await axiosPrivate.get(`/photos/shared/${user?.userId}`);
        setPhotos(res.data.photos);
      }
    };
    getAlbums();
  }, [axiosPrivate, user]);

  const photoClickHandler = (photoId) => {
    navigate(`/photos/${photoId}`);
  };

  return (
    <div>
      <div className="page-title has-bg">Photos shared to you:</div>
      <ImageList variant="masonry" cols={3}>
        {photos?.length > 0 &&
          photos.map((photo) => {
            return (
              <ImageListItem
                key={photo._id}
                className="album_photo-item"
                onClick={() => photoClickHandler(photo._id)}
              >
                <img
                  src={`http://localhost:5000/api/photos/${photo._id}`}
                  alt=""
                />
              </ImageListItem>
            );
          })}
      </ImageList>
    </div>
  );
};

export default SharedToMePhotoList;
