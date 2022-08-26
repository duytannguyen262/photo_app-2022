import { FastField, Form, Formik } from "formik";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import InputField from "../../../shared/components/InputField";
import StyledLoadingButton from "../../../shared/components/StyledLoadingButton";

import useAxiosPrivate from "../../../shared/hooks/useAxiosPrivate";

const SearchBtn = ({ setOpen, albums, setAlbums }) => {
  const user = useSelector((state) => state.auth.user);
  const initData = {
    name: "",
    author: {
      id: user.userId,
      name: user.name,
    },
  };
  const [isLoading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const submitHandler = async (data) => {
    try {
      setIsLoading(true);
      const response = await axiosPrivate.post("albums/create", data);
      setIsLoading(false);
      setAlbums([...albums, response.data.newAlbum]);
      setOpen(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);

      const errMessage = error.response.data.message;
      toast.error(errMessage, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const validate = Yup.object({
    name: Yup.string().required(""),
  });

  return (
    <div>
      <Formik
        initialValues={initData}
        validationSchema={validate}
        onSubmit={submitHandler}
      >
        {() => {
          return (
            <Form className="d-flex align-center gap-2">
              <FastField
                component={InputField}
                placeholder="Enter album name"
                type="text"
                name="name"
              />
              {isLoading ? (
                <StyledLoadingButton loading={isLoading}></StyledLoadingButton>
              ) : (
                <button type="submit" className="btn btn-cta">
                  <span>Create</span>
                </button>
              )}
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default SearchBtn;
