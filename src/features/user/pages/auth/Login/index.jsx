import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { Form, Formik, FastField } from "formik";
import { toast } from "react-toastify";

import { login } from "../../../auth/authSlice";
import { useNavigate } from "react-router-dom";
import StyledLoadingButton from "../../../../../shared/components/StyledLoadingButton";
import InputField from "../../../../../shared/components/InputField";
import "../style.scss";
import axios from "../../../../../api/axios";

const LoginPage = () => {
  const [formData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (formData) => {
    try {
      setIsLoading(true);
      const response = await axios.post("users/login", formData, {
        withCredentials: true,
      });
      const responseData = response?.data;
      if (responseData.userId) {
        const action = login(responseData);
        dispatch(action);
        setIsLoading(false);
        navigate("/");
      }
      if (responseData.message) {
      }
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
    email: Yup.string().required("Email is required"),
    password: Yup.string().required("Password must not be empty"),
  });

  return (
    <div className="auth-form_container">
      <div className="auth-form">
        <h1>Login</h1>
        <Formik
          initialValues={formData}
          validationSchema={validate}
          onSubmit={submitHandler}
        >
          {() => {
            return (
              <Form style={{ width: "100%" }}>
                <FastField
                  component={InputField}
                  placeholder="Enter your email"
                  label="Email"
                  type="text"
                  name="email"
                />
                <FastField
                  component={InputField}
                  placeholder="Enter your password"
                  label="Password"
                  type="password"
                  name="password"
                />
                {isLoading ? (
                  <StyledLoadingButton
                    loading={isLoading}
                  ></StyledLoadingButton>
                ) : (
                  <button type="submit" className="btn form-btn">
                    <span>Sign In</span>
                  </button>
                )}
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
