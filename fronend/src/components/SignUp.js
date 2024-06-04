import React from "react";

const SignUp = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 w-100">
      <div className="card shadow-sm w-30">
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Sign Up</h3>
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
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
                aria-describedby="emailHelp"
              />
              <div id="emailHelp" className="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input type="password" className="form-control" id="password" />
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
              Already have an account? <a href="/">Log In</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
