import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form, FastField } from "formik";
import EditIcon from "@mui/icons-material/Edit";

import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";
import InputField from "../../../shared/components/InputField";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

import "./EditPhotoPage.scss";

const EditPhotoPage = () => {
  const { photoId } = useParams();
  const filePickerRef = useRef();
  const imgRef = useRef();

  const user = useSelector((state) => state.auth.user);
  const axiosPrivate = useAxiosPrivate();
  const [photoInfo, setPhotoInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);
  const [data, setData] = useState({
    file: null,
  });

  useEffect(() => {
    const getPhoto = async () => {
      const res = await axiosPrivate.get(`photos/${photoId}/info`);
      setPhotoInfo(res?.data?.data);
    };
    getPhoto();

    if (!data.file) {
      setPreviewImg(null);
      return;
    }
    const fileReader = new FileReader();
    try {
      fileReader.onload = () => {
        setPreviewImg(fileReader.result);
      };
      fileReader.readAsDataURL(data.file);
    } catch (error) {
      console.log(error);
    }
  }, [axiosPrivate, data.file, photoId, previewImg]);

  const validate = Yup.object({
    name: Yup.string().required("Name is required"),
  });

  const submitHandler = async (submitedData) => {
    setIsLoading(true);
    const { name, file } = submitedData;

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("file", file);
      formData.append(
        "resolution",
        `${imgRef.current.naturalWidth}x${imgRef.current.naturalHeight}`
      );
      await axiosPrivate.put(
        `http://localhost:5000/api/photos/${photoInfo._id}`,
        formData
      );

      toast.success("Updated successfully!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
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
  };

  return (
    <div>
      {user?.userId !== photoInfo?.author?.id ? (
        <h1 className="page-title">
          You are not authorized to edit this photo
        </h1>
      ) : (
        <div className="wrapper d-flex f-column align-center">
          <h1 className="page-title">Edit Photo</h1>
          <Formik
            onSubmit={submitHandler}
            validationSchema={validate}
            initialValues={{ name: photoInfo.name }}
          >
            {({ setFieldValue }) => (
              <Form style={{ width: "80%", maxWidth: "50rem" }}>
                <div
                  className="img-wrapper mb-2"
                  onClick={() => {
                    filePickerRef.current.click();
                  }}
                >
                  <img
                    ref={imgRef}
                    src={
                      previewImg
                        ? previewImg
                        : `http://localhost:5000/api/photos/${photoInfo._id}`
                    }
                    alt=""
                  />
                  <input
                    ref={filePickerRef}
                    type="file"
                    accept=".jpg,.png,.jpeg"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      setFieldValue("file", e.target.files[0]);
                      if (e?.target?.files?.length === 1) {
                        const pickedFile = e.target.files[0];
                        setData({
                          ...data,
                          file: pickedFile,
                        });
                      } else {
                        console.log("No file picked");
                      }
                    }}
                    name="file"
                    id="file"
                  />
                  <div className="img-content">
                    <EditIcon sx={{ color: "white", fontSize: "3.6rem" }} />
                  </div>
                </div>
                <FastField
                  component={InputField}
                  placeholder="Enter your photo name"
                  label="Photo name"
                  type="text"
                  name="name"
                />
                <button
                  disabled={isLoading}
                  type="submit"
                  className="btn btn-cta"
                >
                  {isLoading ? (
                    <CircularProgress sx={{ color: "white" }} />
                  ) : (
                    "Save"
                  )}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
};

export default EditPhotoPage;
