import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";

function Home() {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:8000/checkAuth", {
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
              <p>Login First</p>
            </h3>
          </div>
        ) : (
          <div>
            <h3 style={{ textAlign: "center", color: "white" }}>
              Welcome {user.name}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
