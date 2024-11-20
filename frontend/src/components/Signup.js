import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";

export default function Signup() {
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validate = (values) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const errors = {};
    if (!values.name) {
      errors.name = "Name is required!";
    }
    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!regex.test(values.email)) {
      errors.email = "This is not a valid email!";
    }
    if (!values.password) {
      errors.password = "Password is required!";
    } else if (values.password.length < 4) {
      errors.password = "Password should be more than 4 characters!";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/v1/auth/register",
          formValues
        );
        console.log(response.data);
        if (response.data) {
          localStorage.setItem("token", response.data.token);
          navigate("/products"); // Redirect to login page
        } else {
          console.log("Signup failed:", response.data.message);
        }
      } catch (error) {
        console.error("Error during signup:", error);
      }
    }
  };

  return (
    <div className="wrapper signUp">
      <div className="form">
        <div className="heading">CREATE AN ACCOUNT</div>
        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formValues.name}
              onChange={handleChange}
            />
          </div>
          <p style={{ color: "red" }}>{formErrors.name}</p>
          <div>
            <label htmlFor="email">E-Mail</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formValues.email}
              onChange={handleChange}
            />
          </div>
          <p style={{ color: "red" }}>{formErrors.email}</p>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formValues.password}
              onChange={handleChange}
            />
          </div>
          <p style={{ color: "red" }}>{formErrors.password}</p>
          <button type="submit">Submit</button>
          <h2 align="center" className="or">
            OR
          </h2>
        </form>
        <p>
          Have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}
