import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FastField, Form, Formik } from "formik";
import * as Yup from "yup";
import { CircularProgress, List, ListItem } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import FolderIcon from "@mui/icons-material/Folder";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

import InputField from "../../../shared/components/InputField";
import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";
import axios from "../../../api/axios";
import "./UploadPage.scss";

const UploadPage = () => {
  const { albumId } = useParams();
  const user = useSelector((state) => state.auth.user);

  const axiosPrivate = useAxiosPrivate();
  const filePickerRef = useRef();
  const imgRef = useRef();

  const [data, setData] = useState({
    file: null,
    name: "",
    album: albumId,
    albumName: "",
    size: "",
  });
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [currentAlbums, setCurrentAlbums] = useState([]);
  const [previewUrl, setPreviewUrl] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [searchedAlbums, setSearchedAlbums] = useState([]);

  useEffect(() => {
    const getAlbum = async () => {
      const res = await axiosPrivate.get(`/albums/${albumId}`);
      setCurrentAlbum(res.data.album);
    };
    if (albumId) {
      getAlbum();
    }
    if (!data.file) {
      setPreviewUrl(null);
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(data.file);
  }, [albumId, axiosPrivate, data.file]);

  const submitHandler = async (submitedData) => {
    setIsLoading(true);
    const { name, file, album, albumName } = submitedData;
    const formData = new FormData();

    formData.append("photo", file);
    formData.append("authorId", user.userId);
    formData.append("authorName", user.name);
    formData.append("name", name);
    if (album) {
      formData.append("ofAlbum", album);
    }
    if (currentAlbums) {
      formData.append("ofAlbums", currentAlbums);
    }
    formData.append(
      "resolution",
      `${imgRef.current.naturalWidth}x${imgRef.current.naturalHeight}`
    );

    try {
      await axiosPrivate.post(
        `http://localhost:5000/api/photos/upload`,
        formData
      );

      toast.success("Uploaded successfully!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setData({
        file: null,
        name: "",
      });
    } catch (error) {
      toast.error("Something went wrong, please try again", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    setIsLoading(false);
  };

  const pickedHandler = (e) => {
    if (e?.target?.files?.length === 1) {
      const pickedFile = e.target.files[0];
      setData({
        ...data,
        file: pickedFile,
      });
    } else {
      console.log("No file picked");
    }
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const addAlbumHandler = (albumId) => {
    if (currentAlbums.includes(albumId)) {
      setCurrentAlbums((preAlbums) => {
        return preAlbums.filter((id) => id !== albumId);
      });
    } else {
      setCurrentAlbums([...currentAlbums, albumId]);
    }
  };

  const validate = Yup.object({
    name: Yup.string().required("Name is required"),
  });

  return (
    <div className="wrapper">
      {albumId && <h1 className="page-title">Album: {currentAlbum?.name}</h1>}
      <div className="img-upload_container">
        <div className="img-upload_form">
          <Formik
            onSubmit={submitHandler}
            initialValues={data}
            validationSchema={validate}
          >
            {({ setFieldValue }) => {
              return (
                <Form style={{ width: "60%" }}>
                  {previewUrl ? (
                    <img ref={imgRef} src={previewUrl} alt="preview" />
                  ) : (
                    <p>Please pick an image</p>
                  )}

                  <input
                    ref={filePickerRef}
                    type="file"
                    accept=".jpg,.png,.jpeg"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      setFieldValue("file", e.target.files[0]);
                      pickedHandler(e);
                    }}
                    name="file"
                    id="file"
                  />

                  <button
                    type="button"
                    className="btn btn-cta"
                    onClick={pickImageHandler}
                  >
                    Choose an image
                  </button>

                  <FastField
                    component={InputField}
                    placeholder="Enter your photo name"
                    label="Photo name"
                    type="text"
                    name="name"
                  />

                  {!albumId && (
                    <FastField
                      component={InputField}
                      onChange={async (e) => {
                        setFieldValue("albumName", e.target.value);
                        if (e.target.value) {
                          const res = await axios.get(
                            `/albums/search/${e.target.value}`
                          );
                          setSearchedAlbums(res.data.albums);
                        }
                      }}
                      placeholder="Enter your album name"
                      label="Album"
                      type="text"
                      name="albumName"
                    />
                  )}

                  {searchedAlbums.length > 0 && (
                    <List>
                      {searchedAlbums.map((album) => (
                        <ListItem
                          className="uploadPage_folder"
                          key={album._id}
                          onClick={() => addAlbumHandler(album._id)}
                        >
                          <FolderIcon
                            sx={{ color: "#FFB200", fontSize: "3rem" }}
                          />
                          <span>{album.name}</span>
                          {currentAlbums.includes(album._id) && (
                            <span className="folder_added d-flex align-center">
                              <CheckIcon />
                              <span>Added</span>
                            </span>
                          )}
                        </ListItem>
                      ))}
                    </List>
                  )}

                  {data.file !== null && (
                    <>
                      <button
                        type="submit"
                        className="btn btn-cta yellow"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <CircularProgress sx={{ color: "white" }} alt="" />
                        ) : (
                          "Upload now"
                        )}
                      </button>
                    </>
                  )}
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
