const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../MysqlCon');

const Signup = (app) => {
  app.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      pool.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email], (error, results) => {
        if (error) {
          if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Username or email already exists" });
          }
          return res.status(500).json({ message: "Internal Server Error" });
        }

        const user = { id: results.insertId, username, email };
        const token = jwt.sign(user, process.env.JWT_SECRET || "defaultSecretKey", { expiresIn: '1h' });
        return res.status(201).json({ user, token });
      });
    } catch (error) {
      console.error("Signup Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
};

module.exports = Signup;
