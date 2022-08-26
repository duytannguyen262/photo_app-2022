import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import moment from "moment";

import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";
import { OpenSeaDragonViewer } from "../components/OpenSeaDragonViewer";
import { useSelector } from "react-redux";
import {
  Backdrop,
  Box,
  CircularProgress,
  Fade,
  Modal,
  Typography,
} from "@mui/material";
import axios from "../../../api/axios";
import PhotoShareBtn from "../components/PhotoShareBtn";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#f4c918",
  color: "white",
  boxShadow: 24,
  borderRadius: "10px",
  p: 3,
};

const SinglePhotoPage = (props) => {
  const { state } = useLocation();
  const tempAuthed = state?.tempAuthed || props?.tempAuthed;
  const user = useSelector((state) => state.auth.user);

  const params = useParams();
  const photoId = props?.photo?._id || params?.photoId;

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [photoInfo, setPhotoInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resolution, setResolution] = useState("");
  const [authed, setAuthed] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const openModalHandler = () => setOpenModal(true);
  const closeModalHandler = () => setOpenModal(false);

  useEffect(() => {
    const getPhoto = async () => {
      setIsLoading(true);

      const res = await axios.get(`photos/${photoId}/info`);
      //console.log(res?.data?.data);
      const { resolution, sharedTo } = res?.data?.data;

      setPhotoInfo(res?.data?.data);
      setResolution(resolution);

      const shared = sharedTo.filter((sharedId) => sharedId === user?.userId);
      shared.length > 0 && setAuthed(true);

      setIsLoading(false);
    };

    getPhoto();
  }, [photoId, user]);

  const deleteHandler = () => {
    const deletePhoto = async () => {
      await axiosPrivate.delete(`photos/${photoId}`);
    };

    try {
      setIsLoading(true);
      deletePhoto();
      navigate("/library");
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  const editPhotoHandler = () => {
    navigate(`/photos/${photoId}/edit`);
  };

  return (
    <div className="wrapper">
      {isLoading ? <div>Loading...</div> : null}
      {!isLoading &&
      (user?.userId === photoInfo?.author?.id || tempAuthed || authed) ? (
        <>
          <div>
            <h1 style={{ marginBottom: "0" }} className="page-title">
              {photoInfo?.name}
            </h1>
            <p style={{ marginBottom: "2rem" }}>
              by <strong>{photoInfo?.author.name}</strong>
            </p>
            <p>
              <strong>Resolution:</strong> {photoInfo?.resolution}
            </p>
            <p>
              <strong>Album:</strong>{" "}
              {photoInfo?.ofAlbums.map((album) => album.name).join(", ")}
            </p>
            <p className="mb-1">
              <strong>Uploaded:</strong>{" "}
              {moment(photoInfo?.createdAt).fromNow()}
            </p>
            {user && user.userId === photoInfo?.author?.id && (
              <div className="d-flex align-center gap-1">
                <PhotoShareBtn photo={photoInfo} />

                <button
                  className="btn btn-cta yellow"
                  onClick={editPhotoHandler}
                >
                  Edit
                </button>

                <button className="btn btn-cta" onClick={openModalHandler}>
                  <span>Delete</span>
                </button>
                <Modal
                  aria-labelledby="transition-modal-title"
                  aria-describedby="transition-modal-description"
                  open={openModal}
                  onClose={closeModalHandler}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                    timeout: 500,
                  }}
                >
                  <Fade in={openModal}>
                    <Box sx={modalStyle}>
                      <Typography
                        id="transition-modal-title"
                        variant="h4"
                        component="h2"
                      >
                        Alert
                      </Typography>
                      <Typography
                        id="transition-modal-description"
                        sx={{ my: 2, fontSize: "1.6rem" }}
                      >
                        Are you sure you want to delete this photo?
                      </Typography>
                      <Typography>
                        <button
                          className="btn btn-cta mr-1"
                          onClick={deleteHandler}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <CircularProgress
                              sx={{ color: "white" }}
                              size={18}
                              alt=""
                            />
                          ) : (
                            "Delete"
                          )}
                        </button>
                        <button
                          className="btn btn-outline"
                          onClick={closeModalHandler}
                        >
                          <span>Cancel</span>
                        </button>
                      </Typography>
                    </Box>
                  </Fade>
                </Modal>
              </div>
            )}
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
