import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jwt from "jwt-decode";
import SinglePhotoPage from "./SinglePhotoPage";

const TempPhotoPage = () => {
  const { token } = useParams();
  const [expired, setExpired] = useState(false);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const getDecoded = async () => {
      const result = await jwt(token);
      console.log(result);
      setExpired(Date.now() >= result.exp * 1000);
      setPhoto(result.photo);
    };
    getDecoded();
  }, [token]);

  return (
    <>
      {expired || !photo ? (
        <div className="wrapper">
          <div className="page-title">Timed out</div>
        </div>
      ) : (
        <SinglePhotoPage photo={photo} tempAuthed={!expired} />
      )}
    </>
  );
};

export default TempPhotoPage;
