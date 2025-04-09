const { v4: uuidv4 } = require('uuid');
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Use connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME, 
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  }
});

// ✅ Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL");
    connection.release();
  }
});

// 📌 GET all tasks
app.get("/", (req, res) => {
  const sql = "SELECT * FROM tasks";
  pool.query(sql, (err, results) => {
    if (err) {
      console.error("Database Query Error:", err); 
      return res.status(500).json({ error: "Database error", details: err.message });
    }
    res.json(results);
  });
});

// 📌 POST create task
app.post("/api/tasks", (req, res) => {
  const task = {
    id: uuidv4(),
    name: req.body.name,
    description: req.body.description,
    status: req.body.status || "todo"
  };
  const sql = "INSERT INTO tasks SET ?";
  pool.query(sql, task, (err, result) => { 
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json(task);
  });
});

// 📌 PUT update task
app.put("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const sql = "UPDATE tasks SET status = ? WHERE id = ?";
  pool.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json({ id, status });
    }
  });
});

// 📌 DELETE task
app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM tasks WHERE id = ?";
  pool.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json({ message: "Task deleted successfully" });
    }
  });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
