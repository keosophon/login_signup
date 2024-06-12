import React, { useState, useRef, useEffect } from "react";
//import validatePassword from "./PasswordValidator";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigator = useNavigate();

  const inputNameRef = useRef(null);

  const [error, setError] = useState(null);
  //const [passwordError, setPasswordError] = useState(null);

  useEffect(() => {
    // Focus the input name element when the component mounts
    inputNameRef.current.focus();
  }, []);

  const handleUserInput = (event) => {
    setUserInput((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    //setPasswordError(validatePassword(userInput.password));
    axios
      .post("https://localhost:8000/signup", userInput)
      .then((results) => {
        navigator("/login");
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          setError(err.response.data.errors[0].msg);
        } else {
          setError(err.response.data.error);
        }
      });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 w-100">
      <div className="card shadow-sm w-30">
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Sign Up</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Full name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={userInput.name}
                onChange={handleUserInput}
                ref={inputNameRef}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                aria-describedby="emailHelp"
                value={userInput.email}
                onChange={handleUserInput}
                required
              />
              <div id="emailHelp" className="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={userInput.password}
                onChange={handleUserInput}
                required
              />
            </div>
            {/*
            {passwordError ? (
              <div className="alert alert-danger">{passwordError}</div>
            ) : (
              error && <div className="alert alert-danger">{error}</div>
            )}
            */}
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="d-grid">
              <button type="submit" className="btn btn-primary mb-3">
                Submit
              </button>
            </div>
            <p className="text-center mb-1">
              You agree to our <a href="/terms">terms and conditions</a>.
            </p>
            <p className="text-center">
              Already have an account? <a href="/">Log In</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
