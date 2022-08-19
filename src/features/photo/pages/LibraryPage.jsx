import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import FolderIcon from "@mui/icons-material/Folder";

import { logout } from "../../../features/user/auth/authSlice";
import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";
import NewAlbumForm from "../components/NewAlbumForm";
import { addCurrentAlbum } from "../albumSlice";
import "./LibraryPage.scss";

const LibraryPage = () => {
  const user = useSelector((state) => state.auth.user);

  const axiosPrivate = useAxiosPrivate();
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const getAlbums = async () => {
      try {
        setIsLoading(true);
        const res = await axiosPrivate.get(`albums/all/${user.userId}`);
        setAlbums(res.data.data);

        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setErr(error);

        const action = logout();
        dispatch(action);
        navigate("/signin");
      }
    };
    getAlbums();
  }, [axiosPrivate, navigate, dispatch, user]);

  return (
    <div className="wrapper">
      <div className="d-flex align-center gap-2 mb-1">
        <h1 className="page-title">Your Library</h1>
        <button
          className="btn btn-cta d-flex align-center gap-1"
          onClick={() => setOpen(true)}
          style={open ? { display: "none" } : {}}
        >
          <CreateNewFolderIcon sx={{ color: "#fff", fontSize: "1.8rem" }} />
          <span>New</span>
        </button>
        {open && (
          <NewAlbumForm
            setOpen={setOpen}
            albums={albums}
            setAlbums={setAlbums}
          />
        )}
      </div>
      {isLoading ? <div>Loading...</div> : null}
      {!isLoading && !albums?.length && (
        <p>You haven't uploaded any photo yet</p>
      )}
      {err ? <div>{err}</div> : null}
      <div className="d-flex gap-2 flex-wrap">
        {albums?.length > 0 &&
          albums.map((album) => {
            if (album.author.id !== user.userId) {
              console.log("not your album");
            }
            return (
              <div
                className="library_folder"
                key={album._id}
                onClick={() => {
                  const action = addCurrentAlbum(album);
                  dispatch(action);
                  navigate(`/albums/${album._id}/photos`);
                }}
              >
                <FolderIcon sx={{ color: "#FFB200", fontSize: "3rem" }} />
                <span>{album.name}</span>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default LibraryPage;
