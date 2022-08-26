import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jwt from "jwt-decode";
import AlbumPage from "./AlbumPage";

const TempAlbumPage = () => {
  const { token } = useParams();
  const [expired, setExpired] = useState(false);
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    const getDecoded = async () => {
      const result = await jwt(token);
      console.log(result);
      setExpired(Date.now() >= result.exp * 1000);
      setAlbum(result.album);
    };
    getDecoded();
  }, [token]);

  return (
    <>
      {expired || !album ? (
        <div className="wrapper">
          <div className="page-title">Timed out</div>
        </div>
      ) : (
        <AlbumPage album={album} tempAuthed={!expired} />
      )}
    </>
  );
};

export default TempAlbumPage;
