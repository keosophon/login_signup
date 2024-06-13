require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const { body, validationResult } = require("express-validator");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const https = require("https");
const jwt = require("jsonwebtoken");

const app = express();
// Use Helmet to secure the app
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    referrerPolicy: { policy: "no-referrer" },
  })
);
app.use(
  cors({
    origin: ["https://localhost:3000"], // Restrict to only trusted origins
  })
);

app.use(express.json());

const mysqlConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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

// Rate limiting middleware
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 login requests per windowMs
  message:
    "Too many login attempts from this IP, please try again after 15 minutes",
});

const passwordMessage =
  "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one symbol, and one digit.";

// login validation middleware
const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Your email is invalid. Please input again!"),
  body("password")
    .isLength({ min: 8 })
    .withMessage(passwordMessage)
    .matches(/[A-Z]/)
    .withMessage(passwordMessage)
    .matches(/[a-z]/)
    .withMessage(passwordMessage)
    .matches(/[0-9]/)
    .withMessage(passwordMessage)
    .matches(/[^A-Za-z0-9]/)
    .withMessage(passwordMessage),
];

app.post("/login", loginLimiter, loginValidator, (req, res) => {
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
      res.status(401).json({ error: "Your email or password is incorrect!" });
    } else {
      const user = results[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          res.status(500).json({ error: "Internal server error" });
        } else if (!isMatch) {
          res
            .status(401)
            .json({ error: "Your email or password is incorrect!" });
        } else {
          const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );
          res.status(200).json({ isLogin: true, token, user });
        }
      });
    }
  });
});

// singUp validation middleware
const signupValidator = [
  body("name").not().isEmpty().trim().escape().withMessage("Name is required"),
  ...loginValidator,
];

app.post("/signup", loginLimiter, signupValidator, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;
  const saltRounds = 10;

  // Hash the password
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err);
      res.status(500).json({ error: "Sign up failed. Internal server error" });
    } else {
      // Prevent SQL injection using parameterized queries
      const sql =
        "INSERT INTO employee (name, email, password) VALUES (?, ?, ?)";
      mysqlConnection.query(sql, [name, email, hash], (error, results) => {
        if (error) {
          console.error("Error executing query:", error);
          res
            .status(500)
            .json({ error: "Sign up failed. Internal server error" });
        } else {
          res.status(200).json({ message: "Signup successful" });
        }
      });
    }
  });
});

app.get("/checkAuth", (req, res) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    res.status(200).json({ decoded });
  });
});

// options for https server
const options = {
  key: fs.readFileSync(process.env.PATH_TO_KEY),
  cert: fs.readFileSync(process.env.PATH_TO_CERT),
};

/*
app.listen("8000", () => {
  console.log("server is running");
});
*/
https.createServer(options, app).listen(8000, () => {
  console.log("Server is running on port 8000");
});
