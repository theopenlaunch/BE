const { pool } = require('../MysqlCon');

const createContributionsTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS contributions (
      contribution_id INT AUTO_INCREMENT PRIMARY KEY,
      project_id INT NOT NULL,
      user_id INT NOT NULL,
      amount DECIMAL(15, 2) NOT NULL,
      transaction_hash VARCHAR(255) NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(project_id),
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    )
  `;

  pool.query(sql, (error, results, fields) => {
    if (error) throw error;
    console.log("Contributions table created or already exists");
  });
};

const addContribution = (contribution, callback) => {
  const sql = 'INSERT INTO contributions SET ?';
  pool.query(sql, contribution, (error, results) => {
    if (error) return callback(error);
    return callback(null, results.insertId);
  });
};

const getContributionsByProject = (project_id, callback) => {
  const sql = 'SELECT * FROM contributions WHERE project_id = ?';
  pool.query(sql, [project_id], (error, results) => {
    if (error) return callback(error);
    return callback(null, results);
  });
};

const getContributionsByUser = (user_id, callback) => {
  const sql = 'SELECT * FROM contributions WHERE user_id = ?';
  pool.query(sql, [user_id], (error, results) => {
    if (error) return callback(error);
    return callback(null, results);
  });
};

const updateContribution = (contribution_id, contribution, callback) => {
  const sql = 'UPDATE contributions SET ? WHERE contribution_id = ?';
  pool.query(sql, [contribution, contribution_id], (error, results) => {
    if (error) return callback(error);
    return callback(null, results);
  });
};

const deleteContribution = (contribution_id, callback) => {
  const sql = 'DELETE FROM contributions WHERE contribution_id = ?';
  pool.query(sql, [contribution_id], (error, results) => {
    if (error) return callback(error);
    return callback(null, results);
  });
};

module.exports = {
  createContributionsTable,
  addContribution,
  getContributionsByProject,
  getContributionsByUser,
  updateContribution,
  deleteContribution,
};
