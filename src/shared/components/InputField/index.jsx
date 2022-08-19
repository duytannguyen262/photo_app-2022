import React from "react";

const InputField = (props) => {
  const { form, label, field } = props;
  const { name } = field;
  const { errors, touched } = form;
  const showError = errors[name] && touched[name];
  return (
    <div className="auth-form_input-field">
      <label htmlFor={name}>
        <span>{label}</span>
      </label>

      <input
        id={name}
        className={`${showError ? "is-invalid" : ""}`}
        type="text"
        {...field}
        {...props}
      />
      {showError && (
        <div style={{ color: "red", fontSize: "1.2rem", marginTop: ".5rem" }}>
          {errors[name]}
        </div>
      )}
    </div>
  );
};

export default InputField;
