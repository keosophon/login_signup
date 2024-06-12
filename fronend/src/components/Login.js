import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
//import validatePassword from "./PasswordValidator";

const Login = () => {
  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  //const [passwordError, setPasswordError] = useState(null);

  const navigator = useNavigate();
  const inputEmailRef = useRef(null);

  useEffect(() => {
    // Focus the input element when the component mounts
    inputEmailRef.current.focus();
  }, []);

  const handleUserInput = (event) => {
    const { name, value } = event.target;
    setUserInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    //setPasswordError(validatePassword(userInput.password));
    axios
      .post("http://localhost:8000/login", userInput)
      .then((results) => {
        localStorage.setItem("token", results.data.token);
        navigator("/home");
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          setError(err.response.data.errors[0].msg);
        } else if (err.response && err.response.status === 429) {
          setError(err.response.data);
        } else {
          setError(err.response.data.error);
        }
      });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 w-100">
      <div className="card shadow-sm w-30">
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Login</h3>
          <form onSubmit={handleSubmit}>
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
                ref={inputEmailRef}
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
            {/*{passwordError ? (
              <div className="alert alert-danger">{passwordError}</div>
            ) : (
              error && <div className="alert alert-danger">{error}</div>
            )}*/}
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
              Don't have an account? <a href="/signup">Signup</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
