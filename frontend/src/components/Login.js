import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";

export default function Login() {
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const preventRefresh = (e) => {
    e.preventDefault();
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    //console.log(formValues);
  };

  const validate = (values) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const errors = {};
    if (!values.email) {
      errors.email = "email is required !";
    } else if (!regex.test(values.email)) {
      errors.email = "this is not a valid email !";
    }
    if (!values.password) {
      errors.password = "password is required !";
    } else if (values.password.length < 4) {
      errors.password = "password should be more than 4 characters !";
    }
    //console.log(errors);
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);
    //console.log(formErrors);
    if (Object.keys(errors).length == 0) {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        formValues
      );
      //console.log(response.data);
      const userData = response.data;
      if (userData.name && userData.token) {
        localStorage.setItem("token", userData.token);
        navigate("/products");
      } else {
        console.log("user data and token not found");
      }
    }
  };
  //console.log(formErrors);

  return (
    <div className="wrapper signIn">
      <div className="form">
        <div className="heading">LOGIN</div>
        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="e-mail">E-Mail</label>
            <input
              type="email"
              id="e-mail"
              placeholder="Enter you mail"
              name="email"
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
              placeholder="Enter your password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
            />
          </div>
          <p style={{ color: "red" }}>{formErrors.password}</p>
          <button type="submit">Submit</button>
        </form>
        <p>
          {/* <Link to={"/Dashboard"}>Dashboard</Link> */}
          Don't have an account ? <Link to={"/signup"}> Sign Up </Link>
        </p>
      </div>
    </div>
  );
}
