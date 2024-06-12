import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import React from "react";
import axios from "axios";

function Home() {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("https://localhost:8000/checkAuth", {
        headers: { Authorization: token },
      });
      setUser(res.data.decoded);
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div>
      <div>
        {!user ? (
          <div>
            <h3 style={{ textAlign: "center", color: "white" }}>
              Access Denied!
              <p>
                Please <a href="./login">Login</a> First
              </p>
            </h3>
          </div>
        ) : (
          <div>
            <h3 style={{ textAlign: "center", color: "white" }}>
              Welcome {user.name}. Your email is {user.email}
              <p>
                <Link to="/login" onClick={() => localStorage.clear()}>
                  Logout
                </Link>
              </p>
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
