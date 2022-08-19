import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
// import { FormControlLabel, styled, Switch } from "@mui/material";

import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";
import { OpenSeaDragonViewer } from "../components/OpenSeaDragonViewer";
import { useSelector } from "react-redux";

// const PublicSwitch = styled(Switch)(({ theme }) => ({
//   padding: 8,
//   "& .MuiSwitch-track": {
//     borderRadius: 22 / 2,
//     "&:before, &:after": {
//       content: '""',
//       position: "absolute",
//       top: "50%",
//       transform: "translateY(-50%)",
//       width: 16,
//       height: 16,
//     },
//     "&:before": {
//       backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
//         theme.palette.getContrastText(theme.palette.primary.main)
//       )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
//       left: 12,
//     },
//     "&:after": {
//       backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
//         theme.palette.getContrastText(theme.palette.primary.main)
//       )}" d="M19,13H5V11H19V13Z" /></svg>')`,
//       right: 12,
//     },
//   },
//   "& .MuiSwitch-thumb": {
//     boxShadow: "none",
//     width: 16,
//     height: 16,
//     margin: 2,
//   },
// }));

const SinglePhotoPage = () => {
  const user = useSelector((state) => state.auth.user);
  const { photoId } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const [photoInfo, setPhotoInfo] = useState(null);
  const [resolution, setResolution] = useState("");

  useEffect(() => {
    const getPhoto = async () => {
      const res = await axiosPrivate.get(`photos/${photoId}/info`);
      const { resolution } = res.data.data;
      setPhotoInfo(res.data.data);
      setResolution(resolution);
    };
    getPhoto();
  }, [axiosPrivate, photoId]);

  return (
    <div className="wrapper">
      {user.userId === photoInfo?.author?.id ? (
        <>
          <div>
            <h1 style={{ marginBottom: "0" }} className="page-title">
              {photoInfo.name}
            </h1>
            <p style={{ marginBottom: "2rem" }}>
              by <strong>{photoInfo.author.name}</strong>
            </p>
            <p>
              <strong>Resolution:</strong> {photoInfo.resolution}
            </p>
            <p>
              <strong>Album:</strong>{" "}
              {photoInfo.ofAlbums.map((album) => album.name).join(", ")}
            </p>
            <p>
              <strong>Uploaded:</strong> {moment(photoInfo.createdAt).fromNow()}
            </p>
          </div>
          {resolution && (
            <OpenSeaDragonViewer
              photoResolution={resolution}
              photoId={photoId}
            />
          )}
        </>
      ) : (
        <h1 className="page-title">
          You don't have permission to view this photo
        </h1>
      )}
    </div>
  );
};

export default SinglePhotoPage;
