import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FolderIcon from "@mui/icons-material/Folder";

import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";
import "./SharedToMeAlbumList.scss";

const SharedToMeAlbumList = () => {
  const user = useSelector((state) => state.auth.user);
  const axiosPrivate = useAxiosPrivate();
  const [albums, setAlbums] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    const getAlbums = async () => {
      if (user) {
        const res = await axiosPrivate.get(`/albums/shared/${user?.userId}`);
        setAlbums(res.data.albums);
      }
    };
    getAlbums();
  }, [axiosPrivate, user]);

  return (
    <div>
      <div className="page-title has-bg">Albums shared to you:</div>
      <div className="d-flex gap-2 flex-wrap">
        {albums?.length > 0 &&
          albums.map((album) => {
            // if (album.author.id !== user.userId) {
            //   return null;
            // }
            return (
              <div
                className="folder"
                key={album._id}
                onClick={() => {
                  navigate(`/albums/${album._id}/photos`);
                }}
              >
                <FolderIcon sx={{ color: "#FFB200", fontSize: "3rem" }} />
                <div>
                  <p>{album.name}</p>
                  <p className="folder-author">
                    by <strong>{album.author.name}</strong>
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default SharedToMeAlbumList;
