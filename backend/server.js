const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
app.use(cors());
app.use(express.json());

const mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "crud",
});

mysqlConnection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database" + err.stack);
    return;
  }
  console.log(
    "Successfully connected to MySQL database as ID:" + mysqlConnection.threadId
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM employee WHERE email = ? AND password = ?";
  mysqlConnection.query(sql, [email, password], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal server error" });
    } else if (results.length === 0) {
      res.status(401).json({ error: "Invalid email or password" });
    } else {
      res.status(200).json({ message: "Login successful" });
    }
  });
});

app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  const sql = "INSERT INTO employee (name, email, password) VALUES (?, ?, ?)";
  mysqlConnection.query(sql, [name, email, password], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({ message: "Signup successful" });
    }
  });
});

app.listen("8000", () => {
  console.log("server is running");
});
