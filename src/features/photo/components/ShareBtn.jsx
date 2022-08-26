import React, { useState } from "react";
import FadeModal from "../../../shared/components/FadeModal";
import ShareIcon from "@mui/icons-material/Share";
import PersonIcon from "@mui/icons-material/Person";
import { useSelector } from "react-redux";

import {
  Avatar,
  Checkbox,
  ClickAwayListener,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";

import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";
import "./ShareBtn.scss";

const ShareBtn = ({ album }) => {
  const user = useSelector((state) => state.auth.user);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tempLink, setTempLink] = useState("");

  const axiosPrivate = useAxiosPrivate();

  const openModalHandler = () => setOpenModal(true);
  const closeModalHandler = () => setOpenModal(false);

  //   const [checked, setChecked] = useState([]);
  const [inputs, setInputs] = useState({
    searchValue: "",
    checked: [...album.sharedTo],
  });
  const [users, setUsers] = useState([]);

  const handleToggle = (value) => () => {
    const { checked } = inputs;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setInputs({ ...inputs, checked: newChecked });
  };

  const searchHandler = async (e) => {
    setInputs({ ...inputs, searchValue: e.target.value });
    if (e.target.value !== "") {
      const res = await axiosPrivate.get(`/users/search/${e.target.value}`);
      //console.log(res);
      const foundUsers = res?.data?.users?.filter(
        (searchedUser) => user?.userId !== searchedUser._id
      );
      setUsers(foundUsers);
    }
  };

  const shareHandler = async () => {
    setIsLoading(true);
    try {
      await axiosPrivate.post(`/albums/${album._id}/share`, {
        userIds: inputs.checked,
      });
      //console.log(res);

      //reset form
      setInputs({
        searchValue: "",
      });
      setUsers([]);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
    closeModalHandler();
  };

  const [open, setOpen] = useState(false);
  const handleTooltipClose = () => {
    setOpen(false);
  };
  const handleTooltipOpen = () => {
    setOpen(true);
    navigator.clipboard.writeText(tempLink);
  };

  const generateLinkHandler = async () => {
    try {
      const res = await axiosPrivate.get(`/albums/${album._id}/createLink`);
      setTempLink(`http://localhost:3000/albums/temp/${res.data.token}`);
    } catch (error) {
      console.log(
        "🚀 ~ file: ShareBtn.jsx ~ line 93 ~ generateLinkHandler ~ error",
        error
      );
    }
  };

  return (
    <div>
      <button
        className="btn btn-cta yellow my-2 d-flex align-center gap-1"
        onClick={openModalHandler}
      >
        <ShareIcon sx={{ color: "#fff", fontSize: "1.8rem" }} />
      </button>
      <FadeModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        action="Share"
        actionHandler={shareHandler}
        isLoading={isLoading}
      >
        <span>Create a temporary link:</span>
        <div className="input-field group my-1">
          <ClickAwayListener onClickAway={handleTooltipClose}>
            <Tooltip
              PopperProps={{
                disablePortal: true,
              }}
              onClose={handleTooltipClose}
              open={open}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              title="Copied"
            >
              <input
                onClick={handleTooltipOpen}
                readOnly
                type="text"
                value={tempLink}
              />
            </Tooltip>
          </ClickAwayListener>
          <button onClick={generateLinkHandler} className="btn btn-cta">
            Generate
          </button>
        </div>
        <span>or Choose a person to share:</span>
        <div className="input-field my-1">
          <input
            type="text"
            placeholder="Enter email"
            onChange={searchHandler}
            value={inputs.searchValue}
          />
        </div>
        {users.length > 0 && (
          <List
            dense
            sx={{
              borderRadius: "9px",
              backgroundColor: "#f0596d",
              maxHeight: "20rem",
              overflowY: "auto",
            }}
          >
            {users?.map(({ _id, email }) => {
              const labelId = `checkbox-list-label-${email}`;
              return (
                <ListItem key={_id} sx={{ padding: "0" }}>
                  <ListItemButton
                    role={undefined}
                    onClick={handleToggle(_id)}
                    dense
                    sx={{
                      "&:hover": {
                        backgroundColor: "#c04757",
                      },
                    }}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={inputs.checked.indexOf(_id) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                        sx={{
                          "& .MuiSvgIcon-root": { fontSize: 20 },
                          color: "white",
                          "&.Mui-checked": {
                            color: "white",
                          },
                        }}
                      />
                    </ListItemIcon>
                    <ListItemAvatar className="d-flex justify-center">
                      <Avatar sx={{ width: "2rem", height: "2rem" }}>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      sx={{
                        fontSize: "1.4rem",
                        color: "white",
                        fontWeight: "600",
                      }}
                      id={labelId}
                      disableTypography
                      primary={`${email}`}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        )}
      </FadeModal>
    </div>
  );
};

export default ShareBtn;
