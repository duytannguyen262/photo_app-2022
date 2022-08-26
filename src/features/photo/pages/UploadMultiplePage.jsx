import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FastField, Form, Formik } from "formik";
import * as Yup from "yup";
import { CircularProgress, List, ListItem } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import FolderIcon from "@mui/icons-material/Folder";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

import InputField from "../../../shared/components/InputField";
import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";
import axios from "../../../api/axios";
import PreviewFile from "../components/PreviewFile";
import "./UploadPage.scss";

const UploadMultiplePage = () => {
  const { albumId } = useParams();
  const user = useSelector((state) => state.auth.user);

  const axiosPrivate = useAxiosPrivate();
  const filePickerRef = useRef();

  const [data, setData] = useState({
    files: null,
    filesInfos: [],
    album: albumId,
    albumName: "",
    ofAlbums: [],
  });

  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [currentAlbums, setCurrentAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedAlbums, setSearchedAlbums] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getAlbum = async () => {
      const res = await axiosPrivate.get(`/albums/${albumId}`);
      setCurrentAlbum(res.data.album);
    };
    if (albumId) {
      getAlbum();
    }
  }, [albumId, axiosPrivate]);

  const submitHandler = async (submitedData) => {
    setIsLoading(true);
    const { files, album } = submitedData;
    if (!album && currentAlbums.length === 0) {
      setIsLoading(false);
      return;
    }
    const formData = new FormData();
    [...files].forEach((file) => {
      formData.append("photos", file);
    });
    data.filesInfos.forEach((fileInfo) =>
      formData.append("photosInfos", JSON.stringify(fileInfo))
    );
    if (album) formData.append("ofAlbum", album);
    if (currentAlbums) formData.append("ofAlbums", currentAlbums);

    try {
      await axiosPrivate.post(
        `http://localhost:5000/api/photos/uploadMultiple`,
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

      navigate("/library");
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
    if (e?.target?.files?.length > 0) {
      const pickedFiles = e.target.files;
      const photoNames = [...pickedFiles].map((file) => file.name);
      setData({
        ...data,
        files: pickedFiles,
        filesInfos: photoNames.map((photoName) => {
          return {
            name: photoName,
            newName: "",
          };
        }),
      });
    } else {
      console.log("No file picked");
    }
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const addAlbumHandler = (albumId, setFieldValue) => {
    if (currentAlbums.includes(albumId)) {
      setCurrentAlbums((preAlbums) => {
        return preAlbums.filter((id) => id !== albumId);
      });
    } else {
      setCurrentAlbums([...currentAlbums, albumId]);
      setFieldValue("ofAlbums", [...currentAlbums, albumId]);
    }
  };

  const validate = Yup.object({});

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
                  <input
                    ref={filePickerRef}
                    type="file"
                    accept=".jpg,.png,.jpeg"
                    multiple
                    style={{ display: "none" }}
                    onChange={(e) => {
                      setFieldValue("files", e.target.files);
                      pickedHandler(e);
                    }}
                    name="file"
                    id="file"
                  />

                  <button
                    type="button"
                    className="btn btn-cta d-flex align-center gap-1"
                    onClick={pickImageHandler}
                  >
                    <AddAPhotoIcon sx={{ color: "#fff", fontSize: "2rem" }} />
                    <span>Add</span>
                  </button>
                  {data?.files &&
                    [...data.files].map((file, i) => {
                      return (
                        <PreviewFile
                          key={i}
                          previewFile={file}
                          setData={setData}
                          setFieldValue={setFieldValue}
                          data={data}
                        />
                      );
                    })}

                  {!albumId && (
                    <FastField
                      component={InputField}
                      onChange={async (e) => {
                        setFieldValue("albumName", e.target.value);
                        if (e.target.value) {
                          const res = await axios.get(
                            `/albums/search/${e.target.value}`
                          );
                          const ownedAlbums = res.data.albums.filter(
                            (album) => album.author.id === user.userId
                          );
                          setSearchedAlbums(ownedAlbums);
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
                          onClick={() => {
                            addAlbumHandler(album._id, setFieldValue);
                          }}
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

export default UploadMultiplePage;
