const { pool } = require('../MysqlCon');

const createUsersTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      wallet_address VARCHAR(255)
    )
  `;

  pool.query(sql, (error, results, fields) => {
    if (error) throw error;
    console.log("Users table created or already exists");
  });
};

const addUser = (user, callback) => {
  const sql = 'INSERT INTO users SET ?';
  pool.query(sql, user, (error, results) => {
    if (error) return callback(error);
    return callback(null, results.insertId);
  });
};

const getUserById = (user_id, callback) => {
  const sql = 'SELECT * FROM users WHERE user_id = ?';
  pool.query(sql, [user_id], (error, results) => {
    if (error) return callback(error);
    return callback(null, results[0]);
  });
};

const getUserByEmail = (email, callback) => {
  const sql = 'SELECT * FROM users WHERE email = ?';
  pool.query(sql, [email], (error, results) => {
    if (error) return callback(error);
    return callback(null, results[0]);
  });
};

const updateUser = (user_id, user, callback) => {
  const sql = 'UPDATE users SET ? WHERE user_id = ?';
  pool.query(sql, [user, user_id], (error, results) => {
    if (error) return callback(error);
    return callback(null, results);
  });
};

const deleteUser = (user_id, callback) => {
  const sql = 'DELETE FROM users WHERE user_id = ?';
  pool.query(sql, [user_id], (error, results) => {
    if (error) return callback(error);
    return callback(null, results);
  });
};

module.exports = {
  createUsersTable,
  addUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
};
