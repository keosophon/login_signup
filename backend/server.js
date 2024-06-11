require("dotenv").config();

const jwt = require("jsonwebtoken");
const express = require("express");
const { body, validationResult } = require("express-validator");
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
const myjwtkey = process.env.JWT_SECRET;

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

app.post(
  "/login",
  [
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
            const token = jwt.sign(
              { id: user.id, name: user.name, email: user.email },
              myjwtkey,
              { expiresIn: "1h" }
            );
            res.status(200).json({ isLogin: true, token, user });
          }
        });
      }
    });
  }
);

app.post(
  "/signup",
  [
    body("name")
      .not()
      .isEmpty()
      .trim()
      .escape()
      .withMessage("Name is required"),
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
  }
);

app.get("/checkAuth", (req, res) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  jwt.verify(token, myjwtkey, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    res.status(200).json({ decoded });
  });
});

app.listen("8000", () => {
  console.log("server is running");
});
