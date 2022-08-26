import React from "react";
import { useState } from "react";
import { Form, Formik, FastField } from "formik";
import * as Yup from "yup";
import StyledLoadingButton from "../../../../../shared/components/StyledLoadingButton";
import InputField from "../../../../../shared/components/InputField";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [formData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const submitHandler = async (inputs) => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const responseData = await response.json();
      if (responseData.message) {
        setIsLoading(false);
        toast.error(responseData.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      if (responseData.user) {
        setIsLoading(false);
        toast.success("Congratulations! You have successfully registered", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        //wait 2 seconds and redirect to login page
        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const validate = Yup.object({
    email: Yup.string().required("Email is required"),
    name: Yup.string().max(10, "Please enter less than 10 characters"),
    password: Yup.string().required("Password must not be empty"),
    confirmPassword: Yup.string().required(
      "Confirm Password must not be empty"
    ),
  });

  return (
    <div className="auth-form_container">
      <div className="auth-form">
        <h1>Register</h1>
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
                  placeholder="Enter your name"
                  label="Name"
                  type="text"
                  name="name"
                />
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
                <FastField
                  component={InputField}
                  placeholder="Confirm your password"
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                />
                {isLoading ? (
                  <StyledLoadingButton
                    loading={isLoading}
                  ></StyledLoadingButton>
                ) : (
                  <button type="submit" className="btn form-btn">
                    <span>Signup</span>
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

export default RegisterPage;
