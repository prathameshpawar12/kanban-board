const { v4: uuidv4 } = require('uuid');
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME, 
  port: process.env.DB_PORT || 3306,

});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL");
  }
});


// API to fetch tasks 
app.get("/", (req, res) => {
  const sql = "SELECT * FROM tasks";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database Query Error:", err); 
      return res.status(500).json({ error: "Database error", details: err.message });
    }
    res.json(results);
  });
});
  
  
  // Create task (POST)
  app.post("/api/tasks", (req, res) => {
    const task = {
      id:uuidv4(), // Generate UUID here
      name: req.body.name,
      description: req.body.description,
      status: req.body.status || "todo"
    };
  
    const sql = "INSERT INTO tasks SET ?";
    db.query(sql, task, (err, result) => { 
      if (err) {
        console.error("SQL Error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(201).json(task);
    });
  });
  
  // Update task (PUT)
  app.put("/api/tasks/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const sql = "UPDATE tasks SET status = ? WHERE id = ?";
    db.query(sql, [status, id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
      } else {
        res.json({ id, status });
      }
    });
  });
  
  // Delete task (DELETE)
  app.delete("/api/tasks/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM tasks WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
      } else {
        res.json({ message: "Task deleted successfully" });
      }
    });
  });
  
  // ======== END OF NEW ENDPOINTS ======== //
  
  // Start server (existing code)
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
