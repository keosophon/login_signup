require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

const mysqlConnection = mysql.createConnection({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
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
  const sql = "SELECT * FROM employee WHERE email = ?";
  mysqlConnection.query(sql, [email], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal server error" });
    } else if (results.length === 0) {
      res.status(401).json({ error: "Invalid email or password" });
    } else {
      const user = results[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          res.status(500).json({ error: "Internal server error" });
        } else if (!isMatch) {
          res.status(401).json({ error: "Invalid email or password" });
        } else {
          res.status(200).json({ message: "Login successful" });
        }
      });
    }
  });
});

app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  const saltRounds = 10;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      const sql =
        "INSERT INTO employee (name, email, password) VALUES (?, ?, ?)";
      mysqlConnection.query(sql, [name, email, hash], (error, results) => {
        if (error) {
          console.error("Error executing query:", error);
          res.status(500).json({ error: "Internal server error" });
        } else {
          res.status(200).json({ message: "Signup successful" });
        }
      });
    }
  });
});

app.listen("8000", () => {
  console.log("server is running");
});
