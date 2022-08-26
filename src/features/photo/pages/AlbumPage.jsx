import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ImageList, ImageListItem } from "@mui/material";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";

import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";
// import { logout } from "../../user/auth/authSlice";

import "./AlbumPage.scss";
import DeleteBtn from "../components/DeleteBtn";
import ShareBtn from "../components/ShareBtn";

const AlbumPage = (props) => {
  const params = useParams();
  const albumId = props?.album?._id || params.albumId;

  const user = useSelector((state) => state.auth.user);

  const axiosPrivate = useAxiosPrivate();

  const [photos, setPhotos] = useState([]);
  const [album, setAlbum] = useState(props?.album);
  const [authed, setAuthed] = useState(props?.tempAuthed || false);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const getPhotosOfAlbum = async () => {
      try {
        setIsLoading(true);

        if (albumId) {
          const res = await axiosPrivate.get(`albums/${albumId}/photos`);
          setPhotos(res.data.photos);
        }

        if (!album) {
          const res = await axiosPrivate.get(`albums/${albumId}`);
          setAlbum(res.data.album);
        }

        //authenticate user
        if (album?.author?.id === user?.userId) setAuthed(true);
        const result = await album?.sharedTo?.filter(
          (sharedUserId) => sharedUserId === user?.userId
        );
        result?.length > 0 && setAuthed(true);

        setIsLoading(false);
      } catch (error) {
        setErr(error);
        // const action = logout();
        // dispatch(action);
        // navigate("/signin");
      }
    };
    getPhotosOfAlbum();
  }, [album, albumId, axiosPrivate, dispatch, navigate, user]);

  const photoClickHandler = (photoId) => {
    navigate(`/photos/${photoId}`, {
      state: { tempAuthed: props?.tempAuthed },
    });
  };

  return (
    <div className="wrapper">
      {!isLoading && authed ? (
        <div>
          <div className="d-flex align-center gap-1">
            <h1 className="page-title mr-1">Album: {album?.name}</h1>

            {user?.userId === album?.author?.id && (
              <>
                <ShareBtn album={album} />

                <button
                  className="btn btn-cta my-2 d-flex align-center gap-1"
                  onClick={() => navigate(`/albums/${albumId}/uploadMultiple`)}
                >
                  <LibraryAddIcon sx={{ color: "#fff", fontSize: "1.8rem" }} />
                </button>

                <DeleteBtn route={`albums/${albumId}`} />
              </>
            )}
          </div>
          {isLoading ? <div>Loading...</div> : null}

          {err ? <div>{err}</div> : null}
          {photos?.length > 0 ? (
            <ImageList style={{ margin: "3rem 0" }} variant="masonry" cols={3}>
              {photos.map((photo) => {
                const valids = photo.sharedTo.filter(
                  (sharedId) => sharedId === user?.userId
                );
                if (
                  props.tempAuthed ||
                  valids.length > 0 ||
                  photo.author.id === user?.userId
                ) {
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
                }

                return null;
              })}
            </ImageList>
          ) : (
            <div>No photos in this album</div>
          )}
        </div>
      ) : (
        <h1 className="page-title">
          You don't have permission to view this page
        </h1>
      )}
    </div>
  );
};

export default AlbumPage;
