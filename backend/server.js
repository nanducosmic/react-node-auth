// 1️⃣ Import required modules
const express = require("express");
const cors = require("cors");
const pool = require("./db"); // PostgreSQL pool connection
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 2️⃣ Initialize express app
const app = express();

// 3️⃣ Middleware
app.use(cors());
app.use(express.json()); // for parsing JSON body

// 4️⃣ JWT secret
const JWT_SECRET = "your_jwt_secret"; // keep this secret in env variable in real apps

// ------------------ Routes ------------------

// 5️⃣ Test server route
app.get("/", (req, res) => {
  res.send("Backend server is running");
});

// 6️⃣ Register user
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Please fill all fields" });
  }

  try {
    // Check if user already exists
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );

    res.json({ message: "User registered successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 7️⃣ Login user
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please fill all fields" });
  }

  try {
    // Check if user exists
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: "User does not exist" });
    }

    const user = userResult.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Create JWT token
    const token = jwt.sign({id :user.id, email: user.email ,role:user.role || "user"}, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, role: user.role, email: user.email });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 8️⃣ Protected dashboard route
app.get("/api/dashboard", async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userEmail = decoded.email;

    // Fetch user name
    const result = await pool.query("SELECT name FROM users WHERE email = $1", [userEmail]);
    const user = result.rows[0];

    res.json({ message: `Welcome! ${user.name} ` });

  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Unauthorized" });
  }
});

// 9️⃣ Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
