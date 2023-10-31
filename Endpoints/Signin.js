const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../MysqlCon'); 

const Signin = (app) => {
  app.post('/signin', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    pool.query('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
      if (error) {
        console.error("Signin Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (results.length > 0) {
        try {
          const isValid = await bcrypt.compare(password, results[0].password);

          if (isValid) {
            const user = { id: results[0].id, username: results[0].username };
            const token = jwt.sign(user, process.env.JWT_SECRET || "defaultSecretKey", { expiresIn: '1h' });
            return res.json({ user, token });
          } else {
            return res.status(401).json({ message: "Invalid Credentials" });
          }
        } catch (error) {
          console.error("Password Comparison Error:", error);
          return res.status(500).json({ message: "Internal Server Error" });
        }
      } else {
        return res.status(401).json({ message: "Invalid Credentials" });
      }
    });
  });
}

module.exports = Signin;
