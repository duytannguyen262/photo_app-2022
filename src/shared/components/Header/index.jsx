import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";

import { logout } from "../../../features/user/auth/authSlice";
import taptapLogo from "../../../assets/images/taptap-logo.jpg";
import HeaderDrawer from "../HeaderDrawer";
import "./style.scss";

const Header = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logoutHandler = (e) => {
    const action = logout();
    dispatch(action);
  };

  return (
    <>
      <HeaderDrawer open={open} setOpen={setOpen} user={user} />
      <div style={{ boxShadow: "0 2px 5px #a5a5a5" }} className="bgc-primary">
        <div className="wrapper">
          <div className="container header-container">
            <div className="header-logo_container">
              <Link to="/">
                <img src={taptapLogo} alt="" />
              </Link>
            </div>
            <nav className="header-nav_container">
              <ul className="header-nav_list">
                {user !== null ? (
                  <>
                    <li className="header-nav_item">
                      Hi, <strong>{user.name}</strong>
                    </li>
                    <li className="header-nav_item">
                      <button className="btn btn-text" onClick={logoutHandler}>
                        <span>Log out</span>
                      </button>
                    </li>

                    <li className="header-nav_item">
                      <button
                        className="btn btn-outline d-flex align-center gap-1"
                        onClick={() => navigate("/library")}
                      >
                        <PhotoLibraryIcon
                          sx={{
                            color: "white",
                            fontSize: "1.8rem",
                          }}
                        />
                        <span>Library</span>
                      </button>
                    </li>
                    <li className="header-nav_item">
                      <button
                        className="btn btn-cta d-flex align-center gap-1"
                        onClick={() => navigate("/uploadMultiple")}
                      >
                        <UploadIcon
                          sx={{ color: "#fff", fontSize: "1.8rem" }}
                        />
                        <span>Upload</span>
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="header-nav_item">
                      <Link to="signin">
                        <button className="btn btn-text">
                          <span>Sign in</span>
                        </button>
                      </Link>
                    </li>
                    <li className="header-nav_item">
                      <Link to="signup">
                        <button className="btn btn-cta">Sign up</button>
                      </Link>
                    </li>
                  </>
                )}
              </ul>
              <IconButton
                className="header-nav_menu-btn"
                onClick={() => setOpen(true)}
              >
                <MenuIcon className="header-nav_menu-icon" />
              </IconButton>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
