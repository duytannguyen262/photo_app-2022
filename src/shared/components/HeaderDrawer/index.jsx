import React from "react";
import Drawer from "@mui/material/Drawer";
import { Box, List, ListItem, ListItemButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import UploadIcon from "@mui/icons-material/Upload";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import ErrorIcon from "@mui/icons-material/Error";
import LoginIcon from "@mui/icons-material/Login";

import { logout } from "../../../features/user/auth/authSlice";

const HeaderDrawer = ({ open, setOpen, user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = () => {
    const action = logout();
    dispatch(action);
    setOpen(false);
    navigate("/signin");
  };
  return (
    <Drawer open={open} anchor="right" onClose={() => setOpen(false)}>
      <Box width="25rem" py={3}>
        <List>
          {user ? (
            <>
              <ListItem>
                <h1 style={{ textAlign: "center" }}>
                  Hi, <strong>{user?.name}</strong>
                </h1>
              </ListItem>

              <ListItem
                onClick={() => {
                  setOpen(false);
                  navigate("/library");
                }}
              >
                <ListItemButton sx={{ borderRadius: "8px" }}>
                  <PhotoLibraryIcon
                    className="mr-1"
                    sx={{ fontSize: "2rem" }}
                  />
                  <span>Library</span>
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton
                  onClick={() => {
                    setOpen(false);
                    navigate("/uploadMultiple");
                  }}
                  sx={{ borderRadius: "8px" }}
                >
                  <UploadIcon className="mr-1" sx={{ fontSize: "2rem" }} />
                  <span>Upload</span>
                </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton
                  onClick={logoutHandler}
                  sx={{ borderRadius: "8px" }}
                >
                  <ExitToAppIcon className="mr-1" sx={{ fontSize: "2rem" }} />
                  <span>Logout</span>
                </ListItemButton>
              </ListItem>
            </>
          ) : (
            <>
              <ListItem
                onClick={() => {
                  setOpen(false);
                  navigate("/signin");
                }}
              >
                <ListItemButton sx={{ borderRadius: "8px" }}>
                  <LoginIcon className="mr-1" sx={{ fontSize: "2rem" }} />
                  <span>Sign in</span>
                </ListItemButton>
              </ListItem>

              <ListItem
                onClick={() => {
                  setOpen(false);
                  navigate("/signup");
                }}
              >
                <ListItemButton
                  sx={{
                    color: "white",
                    backgroundColor: "#f0596d",
                    borderRadius: "8px",

                    "&:hover": {
                      backgroundColor: "#bd4655",
                    },
                  }}
                >
                  <ErrorIcon
                    className="mr-1"
                    sx={{ fontSize: "2rem", color: "white" }}
                  />
                  <span>Sign up</span>
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default HeaderDrawer;
