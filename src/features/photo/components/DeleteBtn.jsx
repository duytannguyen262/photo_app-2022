import { IconButton } from "@mui/material";
import React, { useState } from "react";
import FadeModal from "../../../shared/components/FadeModal";
import DeleteIcon from "@mui/icons-material/Delete";
import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import { logout } from "../../user/auth/authSlice";
import { useDispatch } from "react-redux";

const DeleteBtn = ({ route }) => {
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const openDeleteModalHandler = () => {
    setOpenModal(true);
  };

  const deleteAlbumHandler = () => {
    const deleteAlbum = async () => {
      try {
        setIsLoading(true);

        await axiosPrivate.delete(route);

        navigate("/library");
      } catch (error) {
        console.log(error);
        const action = logout();
        dispatch(action);
        navigate("/signin");
      }
      setIsLoading(false);
    };

    deleteAlbum();
  };
  return (
    <div>
      <IconButton onClick={openDeleteModalHandler}>
        <DeleteIcon sx={{ fontSize: "2.4rem" }} />
      </IconButton>
      <FadeModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        action="Delete"
        actionHandler={deleteAlbumHandler}
        isLoading={isLoading}
      >
        <span>Are you sure you want to delete this album?</span>
      </FadeModal>
    </div>
  );
};

export default DeleteBtn;
