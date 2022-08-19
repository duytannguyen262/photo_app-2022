import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ImageList, ImageListItem } from "@mui/material";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";

import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";
import { logout } from "../../user/auth/authSlice";

import "./AlbumPage.scss";

const AlbumPage = () => {
  const currentAlbum = useSelector((state) => state.album);
  const user = useSelector((state) => state.auth.user);

  const { albumId } = useParams();
  const axiosPrivate = useAxiosPrivate();

  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const getAlbums = async () => {
      try {
        setIsLoading(true);

        const res = await axiosPrivate.get(`albums/${albumId}/photos`);

        setPhotos(res.data.photos);

        setIsLoading(false);
      } catch (error) {
        setErr(error);

        const action = logout();
        dispatch(action);
        navigate("/signin");
      }
    };
    getAlbums();
  }, [albumId, axiosPrivate, dispatch, navigate]);

  const photoClickHandler = (photoId) => {
    navigate(`/photos/${photoId}`);
  };

  return (
    <div className="wrapper">
      <div className="d-flex align-center gap-2">
        <h1 className="page-title">Album: {currentAlbum.name}</h1>
        <button
          className="btn btn-cta my-2 d-flex align-center gap-1"
          onClick={() => navigate(`/albums/${albumId}/upload`)}
        >
          <LibraryAddIcon sx={{ color: "#fff", fontSize: "1.8rem" }} />
          <span>Upload</span>
        </button>
      </div>
      {isLoading ? <div>Loading...</div> : null}

      {err ? <div>{err}</div> : null}
      {photos?.length > 0 ? (
        <ImageList style={{ margin: "3rem 0" }} variant="masonry" cols={3}>
          {photos.map((photo) => {
            return (
              <ImageListItem
                className="album_photo-item"
                key={photo._id}
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
      ) : (
        <div>No photos in this album</div>
      )}
    </div>
  );
};

export default AlbumPage;
