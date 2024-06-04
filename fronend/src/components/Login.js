import React, { useState } from "react";

const Login = () => {
  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
  });

  const handleUserInput = (event) => {
    const { name, value } = event.target;
    setUserInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(userInput);
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
              />
            </div>
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
