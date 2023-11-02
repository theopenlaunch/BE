const { pool } = require('../MysqlCon');

const createRewardsTable = () => {
    const sql = `
      CREATE TABLE IF NOT EXISTS rewards (
        reward_id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        description TEXT,
        min_contribution DECIMAL(15, 2) NOT NULL,
        availability INT NOT NULL,
        FOREIGN KEY (project_id) REFERENCES projects(project_id)
      )
    `;
  
    pool.query(sql, (error, results, fields) => {
      if (error) throw error;
      console.log("Rewards table created or already exists");
    });
};

const getRewards = (projectId, callback) => {
    const sql = 'SELECT * FROM rewards WHERE project_id = ?';
    pool.query(sql, [projectId], (error, results) => {
      if (error) {
        return callback(error);
      }
      callback(null, results);
    });
};

const addReward = (reward, callback) => {
    const { project_id, description, min_contribution, availability } = reward;
    const sql = 'INSERT INTO rewards (project_id, description, min_contribution, availability) VALUES (?, ?, ?, ?)';
    pool.query(sql, [project_id, description, min_contribution, availability], (error, results) => {
      if (error) {
        return callback(error);
      }
      callback(null, results);
    });
};

const updateReward = (reward_id, reward, callback) => {
    const { description, min_contribution, availability } = reward;
    const sql = 'UPDATE rewards SET description = ?, min_contribution = ?, availability = ? WHERE reward_id = ?';
    pool.query(sql, [description, min_contribution, availability, reward_id], (error, results) => {
      if (error) {
        return callback(error);
      }
      callback(null, results);
    });
};

const deleteReward = (reward_id, callback) => {
    const sql = 'DELETE FROM rewards WHERE reward_id = ?';
    pool.query(sql, [reward_id], (error, results) => {
      if (error) {
        return callback(error);
      }
      callback(null, results);
    });
};

const getRewardById = (reward_id, callback) => {
    const sql = 'SELECT * FROM rewards WHERE reward_id = ?';
    pool.query(sql, [reward_id], (error, results) => {
      if (error) {
        return callback(error);
      }
      callback(null, results[0] || null);
    });
};

module.exports = {
    createRewardsTable,
    getRewards,
    addReward,
    updateReward,
    deleteReward,
    getRewardById,
};
