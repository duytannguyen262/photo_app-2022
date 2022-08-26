import React, { useState } from "react";
import {
  Backdrop,
  Box,
  CircularProgress,
  Fade,
  Modal,
  Typography,
} from "@mui/material";

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

const FadeModal = ({
  openModal,
  setOpenModal,
  action,
  actionHandler,
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const closeModalHandler = () => setOpenModal(false);
  return (
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
          <Typography id="transition-modal-title" variant="h4" component="h2">
            Alert
          </Typography>
          <div className="my-2">{children}</div>
          <Typography>
            <button
              className="btn btn-cta mr-1"
              onClick={() => {
                setIsLoading(true);
                actionHandler();
                setIsLoading(false);
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress sx={{ color: "white" }} size={18} alt="" />
              ) : (
                `${action}`
              )}
            </button>
            <button className="btn btn-outline" onClick={closeModalHandler}>
              <span>Cancel</span>
            </button>
          </Typography>
        </Box>
      </Fade>
    </Modal>
  );
};

export default FadeModal;
