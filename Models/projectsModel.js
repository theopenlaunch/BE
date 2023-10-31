const { pool } = require('../MysqlCon');

const createProjectsTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS projects (
      project_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      target_amount DECIMAL(15, 2) NOT NULL,
      raised_amount DECIMAL(15, 2) DEFAULT 0,
      start_date DATETIME NOT NULL,
      end_date DATETIME NOT NULL,
      wallet_address VARCHAR(255) NOT NULL,
      status ENUM('active', 'funded', 'failed') NOT NULL DEFAULT 'active',
      creator_id INT,
      FOREIGN KEY (creator_id) REFERENCES users(user_id)
    )
  `;

  pool.query(sql, (error, results, fields) => {
    if (error) throw error;
    console.log("Projects table created or already exists");
  });
};

const getProjectById = (project_id, callback) => {
  const sql = 'SELECT * FROM projects WHERE project_id = ?';
  pool.query(sql, [project_id], (error, results) => {
    if (error) return callback(error);
    return callback(null, results[0] || null);
  });
};

const createProject = (project, callback) => {
  const sql = 'INSERT INTO projects SET ?';
  pool.query(sql, project, (error, results) => {
    if (error) return callback(error);
    return callback(null, results.insertId);
  });
};

const getAllProjects = (callback) => {
  const sql = 'SELECT * FROM projects';
  pool.query(sql, (error, results) => {
    if (error) return callback(error);
    return callback(null, results);
  });
};

const updateProject = (project_id, project, callback) => {
  const sql = 'UPDATE projects SET ? WHERE project_id = ?';
  pool.query(sql, [project, project_id], (error, results) => {
    if (error) return callback(error);
    return callback(null, results);
  });
};

const deleteProject = (project_id, callback) => {
  const sql = 'DELETE FROM projects WHERE project_id = ?';
  pool.query(sql, [project_id], (error, results) => {
    if (error) return callback(error);
    return callback(null, results);
  });
};

const getProjectsByStatus = (status, callback) => {
  const sql = 'SELECT * FROM projects WHERE status = ?';
  pool.query(sql, [status], (error, results) => {
    if (error) return callback(error);
    return callback(null, results);
  });
};

const updateProjectFunds = (project_id, amount, callback) => {
  const sql = 'UPDATE projects SET raised_amount = raised_amount + ? WHERE project_id = ?';
  pool.query(sql, [amount, project_id], (error, results) => {
    if (error) return callback(error);
    return callback(null, results);
  });
};

module.exports = {
  createProjectsTable,
  getProjectById,
  createProject,
  getAllProjects,
  updateProject,
  deleteProject,
  getProjectsByStatus,
  updateProjectFunds
};
