const express = require("express");
const router = express.Router();  // Use express.Router() for defining routes
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {db}=require("../db")
router.post('/register', async (req, res) => {
    const { username, password, name } = req.body;
  
    try {
      // Validate if username, password, and name are provided
      if (!username || !password || !name) {
        return res.status(400).json({ message: 'Username, password, and name are required' });
      }
  
      // Check if the username already exists
      const query = `SELECT * FROM USER WHERE username = ?`;
      db.get(query, [username], async (err, row) => {
        if (err) {
          return res.status(500).json({ message: 'Error checking username', error: err.message });
        }
  
        if (row) {
          return res.status(400).json({ message: 'Username already exists' });
        }
  
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
  
        // Insert the new user into the database
        const insertQuery = `INSERT INTO USER (username, password, name) VALUES (?, ?, ?)`;
        db.run(insertQuery, [username, hashedPassword, name], function (err) {
          if (err) {
            return res.status(500).json({ message: 'Error creating user', error: err.message });
          }
          res.status(201).json({ message: 'User registered successfully' });
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const query = `SELECT * FROM USER WHERE username = ?`;
      db.get(query, [username], async (err, row) => {
        if (err) {
          return res.status(500).json({ message: 'Error fetching user', error: err.message });
        }
  
        if (!row) {
          return res.status(404).json({ message: 'User not found' });
        }
  
        // Compare the entered password with the stored hash
        const validPassword = await bcrypt.compare(password, row.password);
        if (!validPassword) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
  
        // Generate JWT token - include user_id in the token payload
        const token = jwt.sign({ user_id: row.id }, process.env.JWT_SECRET, { expiresIn: '8h' });

  
        res.json({ token });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
router.post('/tasks', async (req, res) => {
  const { title, description, effort_days, due_date } = req.body;

  try {
    // Extract userId from JWT (assumes middleware populates req.user)
    const { userId } = req.user;

    // Insert task into the database
    const query = `INSERT INTO tasks (title, description, effort_days, due_date, user_id) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [title, description, effort_days, due_date, userId], function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error creating task', error: err.message });
      }
      res.status(201).json({ message: 'Task created successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/users', async (req, res) => {
  try {
    // Query to fetch all users
    const query = `SELECT id, username, name FROM USER`; // Excluding password for security
    db.all(query, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching users', error: err.message });
      }
      res.status(200).json({ users: rows });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
